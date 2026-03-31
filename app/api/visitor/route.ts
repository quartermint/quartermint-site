import { cookies, headers } from 'next/headers'
import { getVisitorState, getVisitorTier, upsertVisitorState } from '@/lib/chat/visitor'

/**
 * GET /api/visitor
 *
 * Returns the current visitor's tier and topics based on the rv cookie.
 * Used by ReturningVisitorGreeting to personalize the chat interface.
 */
export async function GET() {
  try {
    const cookieStore = await cookies()
    const visitorId = cookieStore.get('rv')?.value

    if (!visitorId) {
      return Response.json({ tier: 'new', topics: [], lastVisit: null })
    }

    const state = await getVisitorState(visitorId)
    const tier = getVisitorTier(state)

    return Response.json({
      tier,
      topics: state?.topics ?? [],
      lastVisit: state?.lastVisit ?? null,
    })
  } catch {
    return Response.json({ tier: 'new', topics: [], lastVisit: null })
  }
}

/**
 * POST /api/visitor
 *
 * Captures first-touch attribution (referrer, UTM, geo) and logs events.
 * Called from the client-side tracking hook on page load and interactions.
 *
 * Body: { referrer?, utmSource?, utmMedium?, utmCampaign?, event?: { action, label } }
 */
export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const visitorId = cookieStore.get('rv')?.value
    if (!visitorId) {
      return Response.json({ ok: true })
    }

    const body = await request.json()
    const headerStore = await headers()

    // Vercel populates these geo headers automatically
    const city = headerStore.get('x-vercel-ip-city') || null
    const region = headerStore.get('x-vercel-ip-country-region') || null
    const country = headerStore.get('x-vercel-ip-country') || null

    const updates: Record<string, unknown> = {
      lastVisit: new Date().toISOString(),
      city,
      region,
      country,
    }

    // First-touch attribution
    if (body.referrer) updates.referrer = body.referrer
    if (body.utmSource) updates.utmSource = body.utmSource
    if (body.utmMedium) updates.utmMedium = body.utmMedium
    if (body.utmCampaign) updates.utmCampaign = body.utmCampaign

    // Increment visit count on pageload (not on events)
    if (!body.event) updates.visits = 1

    // Log interaction event
    if (body.event?.action) {
      updates.events = [{ action: body.event.action, label: body.event.label || '', ts: new Date().toISOString() }]
    }

    await upsertVisitorState(visitorId, updates)
    return Response.json({ ok: true })
  } catch {
    return Response.json({ ok: true })
  }
}
