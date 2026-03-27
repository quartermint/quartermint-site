import { redis } from './redis'
import type { ChatLog } from './types'

/**
 * Extract user-visible text from a UIMessage (AI SDK v6 format).
 *
 * v6 messages use a `parts` array with typed entries.
 * Falls back to `content` string for older/simpler formats.
 */
function extractTextFromUIMessage(msg: unknown): string {
  if (msg && typeof msg === 'object' && 'parts' in msg) {
    const parts = (msg as { parts: { type: string; text?: string }[] }).parts
    return parts
      .filter((p) => p.type === 'text')
      .map((p) => p.text || '')
      .join('')
  }
  if (msg && typeof msg === 'object' && 'content' in msg) {
    return String((msg as { content: string }).content)
  }
  return ''
}

/**
 * Log a conversation exchange to Upstash Redis.
 *
 * Key: chat:{sessionId} per D-07.
 * New conversations are also indexed via chat:index for Phase 5 digest.
 * No TTL per D-11; conversations are kept indefinitely.
 *
 * Logging failure must NOT break chat per D-11. All errors are caught
 * and logged to console silently.
 */
export async function logConversation(
  sessionId: string,
  messages: unknown[],
  assistantResponse: string,
  ip: string
): Promise<void> {
  try {
    const key = `chat:${sessionId}`
    const existing = await redis.get<ChatLog>(key)

    const lastUserMessage = messages[messages.length - 1]
    const userText = extractTextFromUIMessage(lastUserMessage)
    const now = new Date().toISOString()

    if (existing) {
      existing.messages.push(
        { role: 'user', content: userText, timestamp: now },
        { role: 'assistant', content: assistantResponse, timestamp: now }
      )
      await redis.set(key, existing)
    } else {
      const log: ChatLog = {
        sessionId,
        ip,
        startedAt: now,
        messages: [
          { role: 'user', content: userText, timestamp: now },
          { role: 'assistant', content: assistantResponse, timestamp: now },
        ],
      }
      await redis.set(key, log)
      // Index for Phase 5 weekly digest
      await redis.lpush('chat:index', sessionId)
    }
  } catch (error) {
    // Logging failure must not break chat (D-11)
    console.error('Conversation log error:', error)
  }
}
