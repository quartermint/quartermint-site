import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Password gate for the /lm strategist preview (shared with Bella for copy review).
// No username — a single shared password validated by /api/lm, which sets this cookie.
const COOKIE = 'lm_access'
const TOKEN = 'granted'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // The gate page itself is always reachable (it renders the password form).
  if (pathname === '/lm') return NextResponse.next()

  // Protected assets under /lm/* (the demo HTML) require the cookie.
  if (req.cookies.get(COOKIE)?.value === TOKEN) return NextResponse.next()

  const url = req.nextUrl.clone()
  url.pathname = '/lm'
  url.search = ''
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/lm/:path*'],
}
