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
  'https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ2NVNKH4FMghHHM7F5dLn_4OOPj8Yf4LkS55X7KRLB0b8Vw2aCL9cK5Ey9a76O8z5l0E8lS3BX'

/** Contact email for error state mailto CTAs */
export const RYAN_EMAIL = 'ryan@quartermint.com'

/** Visitor state stored in Upstash Redis under visitor:{id} key */
export interface VisitorState {
  lastVisit: string // ISO 8601
  topics: string[] // LLM-extracted, max 5, FIFO
  sectionsViewed: string[] // Section names from scroll tracking
  messageCount: number // Total messages across all sessions
}

/** Visitor recency tier for greeting personalization */
export type VisitorTier = 'recent' | 'moderate' | 'stale' | 'new'
