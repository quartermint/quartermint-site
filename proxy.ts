import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { redis } from '@/lib/chat/redis'
import { getISOWeekKey } from '@/lib/digest/week-key'

/**
 * Next.js 16 middleware (proxy.ts replaces middleware.ts).
 *
 * Sets the `rv` (returning visitor) HttpOnly cookie on first visit (D-03).
 * Every visitor gets a session ID regardless of whether they interact with chat,
 * enabling section tracking and returning visitor detection.
 */
export function proxy(request: NextRequest) {
  const response = NextResponse.next()

  // Set rv cookie on first visit (per D-03, Pitfall 4)
  if (!request.cookies.get('rv')) {
    const visitorId = crypto.randomUUID()
    response.cookies.set('rv', visitorId, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 90 * 24 * 60 * 60, // 90 days, matches VISITOR_TTL
      path: '/',
    })
  }

  // Track /invest page views for weekly digest (OPS-01)
  if (request.nextUrl.pathname === '/invest') {
    const weekKey = getISOWeekKey()
    // Fire-and-forget: don't await, don't block response
    redis.incr(`stats:invest_views:${weekKey}`).catch(() => {})
  }

  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
