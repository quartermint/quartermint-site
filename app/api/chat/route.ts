import { streamText, UIMessage, convertToModelMessages } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import { cookies, headers } from 'next/headers'
import { buildSystemPrompt } from '@/lib/chat/system-prompt'
import { checkAllRateLimits } from '@/lib/chat/rate-limit'
import { logConversation } from '@/lib/chat/conversation-log'
import { upsertVisitorState } from '@/lib/chat/visitor'
import { extractAndStoreTopic } from '@/lib/chat/topic-extract'
import { RYAN_EMAIL } from '@/lib/chat/types'
import type { ChatErrorResponse } from '@/lib/chat/types'

export const maxDuration = 60

export async function POST(req: Request) {
  try {
    // Next.js 16: cookies() and headers() are async
    const cookieStore = await cookies()
    const headersList = await headers()

    const ip = headersList.get('x-forwarded-for')?.split(',')[0] || 'unknown'

    // Three-tier rate limit check (cookie + IP + fail-closed)
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

    // Parse and validate request body
    const {
      messages,
      sessionId,
      scrollContext,
    }: {
      messages: UIMessage[]
      sessionId: string
      scrollContext?: string
    } = await req.json()

    // Read rv cookie for visitor state tracking
    const visitorId = cookieStore.get('rv')?.value

    if (!Array.isArray(messages) || messages.length === 0) {
      const body: ChatErrorResponse = {
        error: 'Messages are required.',
        type: 'error',
      }
      return new Response(JSON.stringify(body), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

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

    // Stream response from Claude
    const result = streamText({
      model: anthropic('claude-sonnet-4-6'),
      system: buildSystemPrompt(scrollContext),
      messages: await convertToModelMessages(messages),
      maxOutputTokens: 500,
      onFinish: async ({ text }) => {
        await logConversation(sessionId, messages, text, ip)

        // Update visitor state and trigger topic extraction (fire-and-forget)
        if (visitorId) {
          // Update visitor lastVisit and sections viewed
          const updates: { lastVisit: string; sectionsViewed?: string[] } = {
            lastVisit: new Date().toISOString(),
          }
          if (scrollContext) {
            updates.sectionsViewed = [scrollContext]
          }
          upsertVisitorState(visitorId, updates).catch(() => {})

          // Extract topic when conversation has sufficient messages (>= 2 user messages)
          const userMessageCount = messages.filter(
            (m) => m.role === 'user'
          ).length
          if (userMessageCount >= 2) {
            const conversationText = messages
              .map(
                (m) =>
                  `${m.role === 'user' ? 'User' : 'Assistant'}: ${
                    'content' in m && typeof m.content === 'string'
                      ? m.content
                      : ''
                  }`
              )
              .join('\n')
            extractAndStoreTopic(visitorId, conversationText).catch(() => {})
          }
        }
      },
    })

    // Update cookie-based session counter
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
      error: `I'm temporarily offline. You can reach Ryan directly at ${RYAN_EMAIL}.`,
      type: 'error',
    }
    return new Response(JSON.stringify(body), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
