import type { Metadata } from 'next'
import { Instrument_Serif } from 'next/font/google'
import { DM_Sans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AttributionCapture } from '@/components/attribution-capture'
import { StickyNav } from '@/components/sticky-nav'
import { FooterStats } from '@/components/footer-stats'
import './globals.css'

// Instrument Serif is NOT a variable font -- must specify weight + style (Pitfall 3)
const instrumentSerif = Instrument_Serif({
  weight: '400',
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-instrument-serif',
  display: 'swap',
})

// DM Sans IS a variable font -- no weight needed
const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://quartermint.com'),
  title: 'Ryan Stern -- Forward-deployed engineer for campaigns, advocacy, and nonprofits',
  description:
    'Operational infrastructure for campaigns, PACs, and advocacy organizations. Built by someone who has been in your war room.',
  openGraph: {
    title: 'Ryan Stern -- Forward-deployed engineer for campaigns, advocacy, and nonprofits',
    description:
      'Operational infrastructure for campaigns, PACs, and advocacy organizations. Built by someone who has been in your war room.',
    url: 'https://quartermint.com',
    siteName: 'Ryan Stern',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ryan Stern -- Forward-deployed engineer for campaigns, advocacy, and nonprofits',
    description:
      'Operational infrastructure for campaigns, PACs, and advocacy organizations. Built by someone who has been in your war room.',
  },
  alternates: {
    canonical: 'https://quartermint.com',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${instrumentSerif.variable} ${dmSans.variable}`}
    >
      <body className="min-h-dvh flex flex-col antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50
                     focus:px-4 focus:py-2 focus:bg-bg focus:text-text focus:rounded"
        >
          Skip to main content
        </a>
        <header role="banner">
          <StickyNav />
        </header>
        <main id="main-content" role="main" className="flex-1">
          {children}
        </main>
        <footer role="contentinfo" className="bg-bg">
          <div className="max-w-[var(--spacing-content-max)] mx-auto px-4 sm:px-6 lg:px-8">
            <FooterStats />
          </div>
        </footer>
        <Analytics />
        <AttributionCapture />
      </body>
    </html>
  )
}
