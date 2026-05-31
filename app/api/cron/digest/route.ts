import { createElement } from 'react'
import { Resend } from 'resend'
import { aggregateWeeklyStats } from '@/lib/digest/aggregate'
import { WeeklyDigestEmail } from '@/lib/email/digest-template'
import { RYAN_EMAIL } from '@/lib/chat/types'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

/**
 * GET /api/cron/digest -- weekly analytics digest email.
 *
 * Triggered by the Vercel cron declared in vercel.json (Mondays 09:00 UTC).
 * Vercel attaches `Authorization: Bearer ${CRON_SECRET}` to cron invocations
 * when CRON_SECRET is set, so anything that doesn't match is rejected.
 */
export async function GET(req: Request) {
  const auth = req.headers.get('authorization')
  if (!process.env.CRON_SECRET || auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    return Response.json({ ok: false, error: 'RESEND_API_KEY not set' }, { status: 500 })
  }

  const msg = (err: unknown) => (err instanceof Error ? err.message : String(err))

  let data
  try {
    data = await aggregateWeeklyStats()
  } catch (err) {
    return Response.json({ ok: false, stage: 'aggregate', error: msg(err) }, { status: 500 })
  }

  try {
    const resend = new Resend(apiKey)
    const { data: sent, error } = await resend.emails.send({
      from: 'Quartermint <chat@quartermint.com>',
      to: RYAN_EMAIL,
      subject: `Quartermint weekly digest — ${data.weekOf}`,
      react: createElement(WeeklyDigestEmail, data),
    })

    if (error) {
      return Response.json({ ok: false, stage: 'send', error: error.message }, { status: 502 })
    }
    return Response.json({ ok: true, id: sent?.id, weekOf: data.weekOf, sessions: data.totalSessions })
  } catch (err) {
    return Response.json({ ok: false, stage: 'send', error: msg(err) }, { status: 500 })
  }
}
