import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Single shared password for the /lm strategist preview. No username.
const PASSWORD = 'bfpsuccess'
const COOKIE = 'lm_access'
const TOKEN = 'granted'

export async function POST(req: NextRequest) {
  const form = await req.formData()
  const pw = String(form.get('pw') ?? '')
  const origin = req.nextUrl.origin

  if (pw !== PASSWORD) {
    // Post/Redirect/Get back to the form with an error flag.
    return NextResponse.redirect(`${origin}/lm?e=1`, { status: 303 })
  }

  const res = NextResponse.redirect(`${origin}/lm`, { status: 303 })
  res.cookies.set(COOKIE, TOKEN, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  })
  return res
}
