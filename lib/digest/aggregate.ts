import { redis } from '@/lib/chat/redis'
import type { ChatLog } from '@/lib/chat/types'
import { getISOWeekKey } from './week-key'

/** Weekly digest data aggregated from Redis */
export interface WeeklyDigestData {
  totalSessions: number
  totalMessages: number
  topQuestions: string[] // max 3
  exportRequests: number
  investViews: number
  weekOf: string // e.g. "March 27, 2026"
}

/**
 * Aggregate weekly stats from Redis for the digest email.
 *
 * Scans chat:index (capped at 500 per Pitfall 5), filters to past 7 days,
 * counts sessions/messages, builds top-3 question frequency, and reads
 * weekly counters for /invest views and export requests.
 */
export async function aggregateWeeklyStats(): Promise<WeeklyDigestData> {
  const oneWeekAgo = new Date(Date.now() - 7 * 86400000).toISOString()

  // Fetch session IDs (cap at 500 to avoid Vercel function timeout)
  const sessionIds = await redis.lrange('chat:index', 0, 500)

  let totalSessions = 0
  let totalMessages = 0
  const questionCounts: Record<string, number> = {}

  for (const id of sessionIds) {
    const log = await redis.get<ChatLog>(`chat:${id}`)
    if (!log || log.startedAt < oneWeekAgo) continue

    totalSessions++
    totalMessages += log.messages.length

    // Count user questions for "top 3" (first 80 chars for dedup)
    for (const msg of log.messages) {
      if (msg.role === 'user') {
        const q = msg.content.slice(0, 80)
        questionCounts[q] = (questionCounts[q] || 0) + 1
      }
    }
  }

  const topQuestions = Object.entries(questionCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([q]) => q)

  // Read weekly counters
  const weekKey = getISOWeekKey()
  const investViews =
    (await redis.get<number>(`stats:invest_views:${weekKey}`)) ?? 0
  const exportRequests =
    (await redis.get<number>(`stats:export_requests:${weekKey}`)) ?? 0

  // Format date for subject line
  const weekOf = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return {
    totalSessions,
    totalMessages,
    topQuestions,
    exportRequests,
    investViews,
    weekOf,
  }
}
