import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Quartermint — FI Epic Sprint',
  robots: { index: false, follow: false },
}

// Public (no password). Deck served from public/fi-epic/deck.html. noindex.
export default function FiEpicPage() {
  return (
    <iframe
      src="/fi-epic/deck.html"
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
