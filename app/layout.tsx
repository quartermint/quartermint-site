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
  title: 'Quartermint — Multi-Entity Treasury for Political Organizations',
  description:
    'Multi-entity financial infrastructure for political organizations. One ledger across campaigns, coalition PACs, JFCs, and 501(c)s, with FEC compliance built in.',
  openGraph: {
    title: 'Quartermint',
    description:
      'Multi-entity financial infrastructure for political organizations. One ledger across campaigns, coalition PACs, JFCs, and 501(c)s.',
    url: 'https://quartermint.com',
    siteName: 'Quartermint',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Quartermint',
    description:
      'Multi-entity financial infrastructure for political organizations.',
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
