import { redis } from './redis'
import type { VisitorState, VisitorEvent, VisitorTier } from './types'

/** 90 days in seconds -- matches rv cookie maxAge */
export const VISITOR_TTL = 90 * 24 * 60 * 60

/** Max events stored per visitor (FIFO) */
const MAX_EVENTS = 50

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
    return null
  }
}

/**
 * Create or update visitor state in Upstash Redis.
 *
 * Merges updates into existing state (or creates defaults).
 * Deduplicates sectionsViewed. Caps events at MAX_EVENTS FIFO.
 * Always sets 90-day TTL.
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
      referrer: null,
      utmSource: null,
      utmMedium: null,
      utmCampaign: null,
      events: [],
      city: null,
      region: null,
      country: null,
      visits: 0,
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

    // Only set attribution on first touch (don't overwrite)
    if (updates.referrer && !state.referrer) state.referrer = updates.referrer
    if (updates.utmSource && !state.utmSource) state.utmSource = updates.utmSource
    if (updates.utmMedium && !state.utmMedium) state.utmMedium = updates.utmMedium
    if (updates.utmCampaign && !state.utmCampaign) state.utmCampaign = updates.utmCampaign

    // Geo: always update to latest
    if (updates.city) state.city = updates.city
    if (updates.region) state.region = updates.region
    if (updates.country) state.country = updates.country

    // Visits: increment
    if (updates.visits) state.visits = (state.visits || 0) + 1

    // Events: append, cap at MAX_EVENTS
    if (updates.events) {
      state.events = [...(state.events || []), ...updates.events].slice(-MAX_EVENTS)
    }

    await redis.set(key, state, { ex: VISITOR_TTL })
  } catch (error) {
    console.error('Visitor state update failed:', error)
  }
}

/**
 * Log a visitor interaction event.
 */
export async function logVisitorEvent(
  visitorId: string,
  action: string,
  label: string
): Promise<void> {
  const event: VisitorEvent = {
    action,
    label,
    ts: new Date().toISOString(),
  }
  await upsertVisitorState(visitorId, { events: [event] })
}

/**
 * Determine visitor greeting tier based on recency of last visit.
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
