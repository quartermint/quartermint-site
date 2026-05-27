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

export const metadata: Metadata = {
  metadataBase: new URL('https://quartermint.com'),
  title: 'Quartermint — Multi-Entity Treasury for Public Affairs',
  description:
    'Cashflow infrastructure for the applications political pros actually run. One ledger across campaigns, coalition PACs, joint fundraising committees, and 501(c)s, with donor enrichment and filings built in.',
  openGraph: {
    title: 'Quartermint — Multi-Entity Treasury for Public Affairs',
    description:
      'Cashflow infrastructure for the applications political pros actually run. One ledger across campaigns, coalition PACs, JFCs, and 501(c)s.',
    url: 'https://quartermint.com',
    siteName: 'Quartermint',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Quartermint — Multi-Entity Treasury for Public Affairs',
    description:
      'Cashflow infrastructure for the applications political pros actually run.',
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
