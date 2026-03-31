/** Error classification for chat API responses */
export type ChatErrorType = 'rate_limit' | 'error' | 'unavailable'

/** JSON body returned on non-200 chat API responses */
export interface ChatErrorResponse {
  error: string
  type: ChatErrorType
}

/** Result from checkAllRateLimits() */
export interface RateLimitResult {
  allowed: boolean
  message: string
  statusCode: number
  newCount: number
  type: ChatErrorType
}

/** Individual message within a ChatLog */
export interface ChatLogMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

/** Conversation log stored in Upstash Redis under chat:{sessionId} */
export interface ChatLog {
  sessionId: string
  ip: string
  startedAt: string
  messages: ChatLogMessage[]
}

/** Google Calendar booking link, single source of truth for rate limit CTAs */
export const CALENDAR_BOOKING_URL =
  'https://calendar.app.google/kQD52ja6x24rATbM8'

/** Contact email for error state mailto CTAs */
export const RYAN_EMAIL = 'ryan@quartermint.com'

/** Visitor state stored in Upstash Redis under visitor:{id} key */
export interface VisitorState {
  lastVisit: string // ISO 8601
  topics: string[] // LLM-extracted, max 5, FIFO
  sectionsViewed: string[] // Section names from scroll tracking
  messageCount: number // Total messages across all sessions
  referrer: string | null // First-touch referrer (document.referrer)
  utmSource: string | null // utm_source param
  utmMedium: string | null // utm_medium param
  utmCampaign: string | null // utm_campaign param
  events: VisitorEvent[] // Interaction log, max 50 FIFO
  city: string | null // From Vercel geo headers
  region: string | null // From Vercel geo headers
  country: string | null // From Vercel geo headers
  visits: number // Total visit count
}

/** Lightweight interaction event */
export interface VisitorEvent {
  action: string // e.g. 'system_click', 'chat_open', 'book_click'
  label: string // e.g. 'relay', 'campaign-finance-dashboard'
  ts: string // ISO 8601
}

/** Visitor recency tier for greeting personalization */
export type VisitorTier = 'recent' | 'moderate' | 'stale' | 'new'
