import { redis } from './redis'
import type { VisitorState, VisitorTier } from './types'

/** 90 days in seconds -- matches rv cookie maxAge */
export const VISITOR_TTL = 90 * 24 * 60 * 60

/**
 * Read visitor state from Upstash Redis.
 *
 * Returns null on KV failure (D-06: treat as new visitor silently).
 */
export async function getVisitorState(
  visitorId: string
): Promise<VisitorState | null> {
  try {
    return await redis.get<VisitorState>(`visitor:${visitorId}`)
  } catch {
    // KV failure = treat as new visitor silently (D-06)
    return null
  }
}

/**
 * Create or update visitor state in Upstash Redis.
 *
 * Merges updates into existing state (or creates defaults).
 * Deduplicates sectionsViewed. Always sets 90-day TTL.
 * Silent failure on error -- visitor features degrade gracefully.
 */
export async function upsertVisitorState(
  visitorId: string,
  updates: Partial<VisitorState>
): Promise<void> {
  try {
    const key = `visitor:${visitorId}`
    const existing = await redis.get<VisitorState>(key)
    const state: VisitorState = existing ?? {
      lastVisit: new Date().toISOString(),
      topics: [],
      sectionsViewed: [],
      messageCount: 0,
    }

    if (updates.lastVisit) state.lastVisit = updates.lastVisit
    if (updates.topics) state.topics = updates.topics
    if (updates.sectionsViewed) {
      state.sectionsViewed = [
        ...new Set([...state.sectionsViewed, ...updates.sectionsViewed]),
      ]
    }
    if (updates.messageCount !== undefined)
      state.messageCount = updates.messageCount

    await redis.set(key, state, { ex: VISITOR_TTL })
  } catch (error) {
    // Silent failure -- visitor features degrade gracefully
    console.error('Visitor state update failed:', error)
  }
}

/**
 * Determine visitor greeting tier based on recency of last visit.
 *
 * - null -> 'new' (no visitor record)
 * - < 7 days -> 'recent' (personalized greeting with topic)
 * - 7-30 days -> 'moderate' (generic welcome-back)
 * - > 30 days -> 'stale' (treat as new silently)
 */
export function getVisitorTier(state: VisitorState | null): VisitorTier {
  if (!state) return 'new'

  const elapsed = Date.now() - new Date(state.lastVisit).getTime()
  const SEVEN_DAYS = 7 * 86400000
  const THIRTY_DAYS = 30 * 86400000

  if (elapsed < SEVEN_DAYS) return 'recent'
  if (elapsed < THIRTY_DAYS) return 'moderate'
  return 'stale'
}
