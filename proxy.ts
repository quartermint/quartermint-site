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

  // Track page views for weekly digest
  const pathname = request.nextUrl.pathname
  const weekKey = getISOWeekKey()
  if (pathname === '/work-with-me') {
    redis.incr(`stats:page_views:work-with-me:${weekKey}`).catch(() => {})
  } else if (pathname.startsWith('/systems/') && pathname !== '/systems/') {
    const slug = pathname.replace('/systems/', '')
    redis.incr(`stats:page_views:system:${slug}:${weekKey}`).catch(() => {})
    redis.incr(`stats:page_views:systems_total:${weekKey}`).catch(() => {})
  } else if (pathname === '/' || pathname === '') {
    redis.incr(`stats:page_views:home:${weekKey}`).catch(() => {})
  }

  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
