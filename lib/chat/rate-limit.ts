import { Ratelimit } from '@upstash/ratelimit'
import { redis } from './redis'
import type { RateLimitResult } from './types'

// Layer 2: IP-based hard cap. 60 requests per hour, sliding window.
const ipLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(60, '1 h'),
  prefix: 'rate',
  analytics: true,
})

/**
 * Three-tier rate limiting for the chat API.
 *
 * Layer 1 (UX): Cookie-based session counter, 20 messages per 24h session.
 * Layer 2 (Abuse): IP-based hard cap, 60/hr via Upstash sliding window.
 * Layer 3 (Budget): $50/mo Anthropic dashboard alert (not code; config only).
 *
 * Fail-closed per D-09: if Redis is unreachable, chat is unavailable.
 */
export async function checkAllRateLimits(
  ip: string,
  cookieStore: Awaited<ReturnType<typeof import('next/headers').cookies>>
): Promise<RateLimitResult> {
  // Layer 1: Cookie-based session limit (20 messages)
  const countStr = cookieStore.get('qm_chat_count')?.value
  const currentCount = countStr ? parseInt(countStr, 10) : 0

  if (currentCount >= 20) {
    return {
      allowed: false,
      message: 'Great questions. For a deeper conversation:',
      statusCode: 429,
      newCount: currentCount,
      type: 'rate_limit',
    }
  }

  // Layer 2: IP-based hard cap via Upstash (fail-closed on error)
  try {
    const { success } = await ipLimiter.limit(ip)
    if (!success) {
      return {
        allowed: false,
        message: "You've been busy. Let's continue over a call:",
        statusCode: 429,
        newCount: currentCount,
        type: 'rate_limit',
      }
    }
  } catch (error) {
    // D-09: Fail closed. Redis unreachable = chat unavailable.
    console.error('Rate limit Redis error:', error)
    return {
      allowed: false,
      message:
        'Chat is temporarily unavailable. Reach out to ryan@quartermint.com.',
      statusCode: 503,
      newCount: currentCount,
      type: 'unavailable',
    }
  }

  return {
    allowed: true,
    message: '',
    statusCode: 200,
    newCount: currentCount + 1,
    type: 'error', // not used when allowed=true; placeholder for type field
  }
}
