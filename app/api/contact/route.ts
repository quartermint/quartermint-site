import { NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json()

    if (!email || !message) {
      return NextResponse.json(
        { error: 'Email and message are required' },
        { status: 400 }
      )
    }

    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({
      from: 'quartermint.com <contact@quartermint.com>',
      to: 'ryan@quartermint.com',
      replyTo: email,
      subject: `Message from ${name || email} via quartermint.com`,
      text: `From: ${name || 'Not provided'}\nEmail: ${email}\n\n${message}`,
    })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}
