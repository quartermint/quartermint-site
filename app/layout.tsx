import type { Metadata } from 'next'
import { Fraunces, Geist, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const fraunces = Fraunces({
  variable: '--font-display',
  subsets: ['latin'],
  axes: ['opsz'],
  display: 'swap',
})

const geist = Geist({
  variable: '--font-body',
  subsets: ['latin'],
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  display: 'swap',
})

const SITE_DESCRIPTION =
  'Treasury and reconciliation software for campaigns, advocacy organizations, and the money that moves around them.'

export const metadata: Metadata = {
  metadataBase: new URL('https://quartermint.com'),
  title: 'Quartermint',
  description: SITE_DESCRIPTION,
  openGraph: {
    title: 'Quartermint',
    description: SITE_DESCRIPTION,
    url: 'https://quartermint.com',
    siteName: 'Quartermint',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Quartermint',
    description: SITE_DESCRIPTION,
  },
  alternates: { canonical: 'https://quartermint.com' },
  robots: { index: false, follow: false },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${fraunces.variable} ${geist.variable} ${jetbrainsMono.variable}`}
      >
        {children}
      </body>
    </html>
  )
}
