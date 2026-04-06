import type { NextRequest } from 'next/server'
import { Resend } from 'resend'
import { aggregateWeeklyStats } from '@/lib/digest/aggregate'
import { WeeklyDigestEmail } from '@/lib/email/digest-template'

function getResend() {
  return new Resend(process.env.RESEND_API_KEY)
}

/**
 * Weekly digest cron endpoint.
 *
 * Vercel invokes this every Monday ~9 AM UTC (vercel.json cron config).
 * Authenticates via CRON_SECRET Bearer token, aggregates weekly Redis data,
 * and sends a digest email via Resend.
 *
 * No retries on failure (Vercel cron limitation) -- errors are logged.
 */
export async function GET(request: NextRequest) {
  // Auth check: Vercel sends CRON_SECRET as Bearer token
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  try {
    const stats = await aggregateWeeklyStats()

    await getResend().emails.send({
      from: 'quartermint.com <chat@quartermint.com>',
      to: ['ryan@quartermint.com'],
      subject: `quartermint.com -- Week of ${stats.weekOf}`,
      react: WeeklyDigestEmail({
        ...stats,
      }),
    })

    return Response.json({ success: true, sessions: stats.totalSessions })
  } catch (error) {
    console.error('Digest cron error:', error)
    return Response.json({ error: 'Digest failed' }, { status: 500 })
  }
}
