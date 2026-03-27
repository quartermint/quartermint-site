import { cookies } from 'next/headers'
import { getVisitorState, getVisitorTier } from '@/lib/chat/visitor'

/**
 * GET /api/visitor
 *
 * Returns the current visitor's tier and topics based on the rv cookie.
 * Used by ReturningVisitorGreeting to personalize the chat interface.
 *
 * Returns { tier: 'new', topics: [], lastVisit: null } when no rv cookie is present.
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
    // On any error, treat as new visitor (D-06)
    return Response.json({ tier: 'new', topics: [], lastVisit: null })
  }
}
