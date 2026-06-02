import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Password gates for private previews. Each gate has its own cookie and its own
// gate page (which renders the password form and is always reachable).
//   /lm  -> strategist preview (shared with Bella for copy review)
// (/fi gate removed 2026-06-01 — FI Epic Sprint deck is now public/shareable.)
const GATES: { prefix: string; cookie: string; token: string }[] = [
  { prefix: '/lm', cookie: 'lm_access', token: 'granted' },
]

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  for (const gate of GATES) {
    // The gate page itself is always reachable (it renders the password form).
    if (pathname === gate.prefix) return NextResponse.next()
    // Protected assets under the prefix require the cookie.
    if (pathname.startsWith(gate.prefix + '/')) {
      if (req.cookies.get(gate.cookie)?.value === gate.token) return NextResponse.next()
      const url = req.nextUrl.clone()
      url.pathname = gate.prefix
      url.search = ''
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/lm/:path*'],
}
