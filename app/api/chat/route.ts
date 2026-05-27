import { streamText, UIMessage, convertToModelMessages } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import { cookies, headers } from 'next/headers'
import { buildSystemPrompt } from '@/lib/chat/system-prompt'
import { checkAllRateLimits } from '@/lib/chat/rate-limit'
import { logConversation } from '@/lib/chat/conversation-log'
import { RYAN_EMAIL } from '@/lib/chat/types'
import type { ChatErrorResponse } from '@/lib/chat/types'

export const maxDuration = 60

/**
 * POST /api/chat -- Quartermint assistant streaming endpoint.
 *
 * The assistant answers questions about the product, the entity-geometry
 * system, FEC compliance posture, the pitch, and how Quartermint fits into a
 * political-ops treasury stack. Rate-limit and abuse controls carried over
 * from the v1 site (cookie session + Upstash IP cap).
 */
export async function POST(req: Request) {
  try {
    const cookieStore = await cookies()
    const headersList = await headers()
    const ip = headersList.get('x-forwarded-for')?.split(',')[0] || 'unknown'

    const rateCheck = await checkAllRateLimits(ip, cookieStore)
    if (!rateCheck.allowed) {
      const body: ChatErrorResponse = {
        error: rateCheck.message,
        type: rateCheck.type,
      }
      return new Response(JSON.stringify(body), {
        status: rateCheck.statusCode,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const {
      messages: rawMessages,
      sessionId,
      scrollContext,
    }: {
      messages: Array<
        | UIMessage
        | {
            role: string
            content: string
            id: string
            parts?: UIMessage['parts']
          }
      >
      sessionId: string
      scrollContext?: string
    } = await req.json()

    if (!Array.isArray(rawMessages) || rawMessages.length === 0) {
      const body: ChatErrorResponse = {
        error: 'Messages are required.',
        type: 'error',
      }
      return new Response(JSON.stringify(body), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Normalize UIMessage shape for AI SDK v6.
    const messages: UIMessage[] = rawMessages.map((m) => ({
      ...m,
      role: m.role as UIMessage['role'],
      parts:
        m.parts ??
        [
          {
            type: 'text' as const,
            text:
              'content' in m && typeof m.content === 'string'
                ? m.content
                : '',
          },
        ],
    })) as UIMessage[]

    if (!sessionId || typeof sessionId !== 'string') {
      const body: ChatErrorResponse = {
        error: 'Session ID is required.',
        type: 'error',
      }
      return new Response(JSON.stringify(body), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const result = streamText({
      model: anthropic('claude-sonnet-4-6'),
      system: buildSystemPrompt(scrollContext),
      messages: await convertToModelMessages(messages),
      maxOutputTokens: 500,
      onFinish: async ({ text }) => {
        await logConversation(sessionId, messages, text, ip)
      },
    })

    cookieStore.set('qm_chat_count', String(rateCheck.newCount), {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 86400,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
    })

    return result.toUIMessageStreamResponse()
  } catch (error) {
    console.error('Chat API error:', error)
    const body: ChatErrorResponse = {
      error: `The assistant is temporarily offline. Reach the team at ${RYAN_EMAIL}.`,
      type: 'error',
    }
    return new Response(JSON.stringify(body), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
