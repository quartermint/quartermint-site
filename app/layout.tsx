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
  title: 'Quartermint — Multi-Entity Treasury for Political Organizations',
  description:
    'Brex for Public Affairs. Unified treasury operations across campaigns, PACs, JFCs, and 501(c)s — with FEC compliance built in.',
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
