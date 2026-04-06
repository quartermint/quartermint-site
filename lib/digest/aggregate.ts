import { redis } from '@/lib/chat/redis'
import type { ChatLog, VisitorState } from '@/lib/chat/types'
import { systems } from '@/lib/systems'
import { getISOWeekKey } from './week-key'

/** Per-page view counts */
export interface PageViews {
  home: number
  workWithMe: number
  systemsTotal: number
  systemBreakdown: Record<string, number> // slug → count
}

/** Geographic breakdown entry */
export interface GeoEntry {
  location: string // "City, Region, Country"
  count: number
}

/** Conversation preview for the digest */
export interface ConversationPreview {
  firstQuestion: string
  messageCount: number
  location: string
  time: string // e.g. "Mon 2:30 PM"
}

/** Weekly digest data aggregated from Redis */
export interface WeeklyDigestData {
  totalSessions: number
  totalMessages: number
  topQuestions: string[] // max 5
  exportRequests: number
  pageViews: PageViews
  geoBreakdown: GeoEntry[]
  newVisitors: number
  returningVisitors: number
  conversationPreviews: ConversationPreview[] // up to 10
  topReferrers: { source: string; count: number }[]
  weekOf: string // e.g. "March 27, 2026"
}

/**
 * Aggregate weekly stats from Redis for the digest email.
 *
 * Scans chat:index (capped at 500), filters to past 7 days,
 * counts sessions/messages, builds top-5 question frequency,
 * reads page view counters, and cross-references visitor geo data.
 */
export async function aggregateWeeklyStats(): Promise<WeeklyDigestData> {
  const oneWeekAgo = new Date(Date.now() - 7 * 86400000).toISOString()

  // Fetch session IDs (cap at 500 to avoid Vercel function timeout)
  const sessionIds = await redis.lrange('chat:index', 0, 500)

  let totalSessions = 0
  let totalMessages = 0
  const questionCounts: Record<string, number> = {}
  const sessionIps = new Set<string>()
  const conversationPreviews: ConversationPreview[] = []

  for (const id of sessionIds) {
    const log = await redis.get<ChatLog>(`chat:${id}`)
    if (!log || log.startedAt < oneWeekAgo) continue

    totalSessions++
    totalMessages += log.messages.length
    sessionIps.add(log.ip)

    // Count user questions for "top 5" (first 80 chars for dedup)
    const userMessages = log.messages.filter((m) => m.role === 'user')
    for (const msg of userMessages) {
      const q = msg.content.slice(0, 80)
      questionCounts[q] = (questionCounts[q] || 0) + 1
    }

    // Build conversation preview (first 10 sessions)
    if (conversationPreviews.length < 10 && userMessages.length > 0) {
      conversationPreviews.push({
        firstQuestion: userMessages[0].content.slice(0, 120),
        messageCount: log.messages.length,
        location: '', // filled in from visitor data below
        time: new Date(log.startedAt).toLocaleDateString('en-US', {
          weekday: 'short',
          hour: 'numeric',
          minute: '2-digit',
          timeZone: 'America/Los_Angeles',
        }),
      })
    }
  }

  const topQuestions = Object.entries(questionCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([q]) => q)

  // Read weekly counters
  const weekKey = getISOWeekKey()
  const exportRequests =
    (await redis.get<number>(`stats:export_requests:${weekKey}`)) ?? 0

  // Page views
  const homeViews =
    (await redis.get<number>(`stats:page_views:home:${weekKey}`)) ?? 0
  const workWithMeViews =
    (await redis.get<number>(`stats:page_views:work-with-me:${weekKey}`)) ?? 0
  const systemsTotalViews =
    (await redis.get<number>(`stats:page_views:systems_total:${weekKey}`)) ?? 0

  // System-level breakdown: look up known system slugs directly
  const systemBreakdown: Record<string, number> = {}
  for (const system of systems) {
    const count =
      (await redis.get<number>(`stats:page_views:system:${system.slug}:${weekKey}`)) ?? 0
    if (count > 0) systemBreakdown[system.slug] = count
  }

  const pageViews: PageViews = {
    home: homeViews,
    workWithMe: workWithMeViews,
    systemsTotal: systemsTotalViews,
    systemBreakdown,
  }

  // Visitor data: geo breakdown, new vs returning, referrers
  // Use SCAN instead of KEYS (KEYS is blocked on Upstash free tier)
  const visitorKeys: string[] = []
  let scanCursor = '0'
  do {
    const result = await redis.scan(scanCursor, {
      match: 'visitor:*',
      count: 100,
    })
    scanCursor = String(result[0])
    visitorKeys.push(...result[1])
  } while (scanCursor !== '0' && visitorKeys.length < 500)

  const locationCounts = new Map<string, number>()
  const referrerCounts = new Map<string, number>()
  let newVisitors = 0
  let returningVisitors = 0

  if (visitorKeys.length > 0) {
    const pipeline = redis.pipeline()
    for (const key of visitorKeys) {
      pipeline.get(key)
    }
    const visitors = await pipeline.exec<(VisitorState | null)[]>()

    for (const v of visitors) {
      if (!v || v.lastVisit < oneWeekAgo) continue

      // Geo
      const loc =
        [v.city, v.region, v.country].filter(Boolean).join(', ') || 'Unknown'
      locationCounts.set(loc, (locationCounts.get(loc) || 0) + 1)

      // New vs returning
      if (v.visits <= 1) {
        newVisitors++
      } else {
        returningVisitors++
      }

      // Referrers
      const ref = v.referrer || '(direct)'
      referrerCounts.set(ref, (referrerCounts.get(ref) || 0) + 1)
    }
  }

  const geoBreakdown = [...locationCounts.entries()]
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([location, count]) => ({ location, count }))

  const topReferrers = [...referrerCounts.entries()]
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([source, count]) => ({ source, count }))

  // Backfill geo into conversation previews (best-effort by timing)
  // Since we can't directly map session→visitor, leave location from visitor data
  for (const preview of conversationPreviews) {
    if (geoBreakdown.length > 0) {
      preview.location = geoBreakdown[0].location // top location as fallback
    }
  }

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
    pageViews,
    geoBreakdown,
    newVisitors,
    returningVisitors,
    conversationPreviews,
    topReferrers,
    weekOf,
  }
}
