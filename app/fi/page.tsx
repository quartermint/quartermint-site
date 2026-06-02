import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Quartermint — FI Epic Sprint',
  robots: { index: false, follow: false },
}

// Password protection removed 2026-06-01 (shareable for FI). Still noindex.
export default function FiPage() {
  return (
    <iframe
      src="/fi/deck.html"
      title="Quartermint — FI Epic Sprint Deck"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        border: 'none',
        zIndex: 9999,
      }}
    />
  )
}
