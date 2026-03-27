import { Resend } from 'resend'
import { Ratelimit } from '@upstash/ratelimit'
import { redis } from '@/lib/chat/redis'
import { ConversationExportEmail } from '@/lib/email/conversation-export-template'
import { getISOWeekKey } from '@/lib/digest/week-key'

// Rate limit: 3 exports per hour per IP (per RESEARCH recommendation)
const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, '1 h'),
  prefix: 'export',
})

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  // Read IP from headers (same pattern as chat route)
  const forwarded = req.headers.get('x-forwarded-for')
  const ip = forwarded?.split(',')[0]?.trim() ?? '127.0.0.1'

  // Rate limit check
  const { success } = await ratelimit.limit(ip)
  if (!success) {
    return Response.json(
      { error: 'Export limit reached. Try again later.' },
      { status: 429 }
    )
  }

  // Parse and validate body
  const body = await req.json()
  const { email, messages, sessionId } = body as {
    email?: string
    messages?: { role: 'user' | 'assistant'; content: string }[]
    sessionId?: string
  }

  // Validate email
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return Response.json(
      { error: 'Valid email address required.' },
      { status: 400 }
    )
  }

  // Validate messages
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return Response.json(
      { error: 'Messages array required.' },
      { status: 400 }
    )
  }

  // Send email via Resend
  const { error } = await resend.emails.send({
    from: 'Ryan Stern <chat@quartermint.com>',
    to: [email],
    bcc: ['ryan@quartermint.com'],
    subject: 'Your conversation with Ryan Stern',
    react: ConversationExportEmail({ messages }),
  })

  if (error) {
    console.error('Resend export email error:', error)
    return Response.json({ error: 'Failed to send email' }, { status: 500 })
  }

  // Track export count for weekly digest (OPS-01)
  const weekKey = getISOWeekKey()
  await redis.incr(`stats:export_requests:${weekKey}`).catch(() => {})

  return Response.json({ success: true })
}
