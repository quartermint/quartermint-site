import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Quartermint — FI Mentor Idea Review',
  robots: { index: false, follow: false },
}

// Public (no password). Answers served from public/fi-mir/answers.html. noindex.
export default function FiMirPage() {
  return (
    <iframe
      src="/fi-mir/answers.html"
      title="Quartermint — FI Mentor Idea Review"
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
