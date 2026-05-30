import { cookies } from 'next/headers'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Quartermint — Strategist Preview',
  robots: { index: false, follow: false },
}

const COOKIE = 'lm_access'
const TOKEN = 'granted'

export default async function LmPage({
  searchParams,
}: {
  searchParams: Promise<{ e?: string }>
}) {
  const sp = await searchParams
  const jar = await cookies()
  const authed = jar.get(COOKIE)?.value === TOKEN

  if (authed) {
    return (
      <iframe
        src="/lm/demo.html"
        title="Multi-Candidate Strategist — Preview"
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

  const wrong = sp?.e === '1'

  return (
    <main
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#fbf8f2',
        color: '#1a1714',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-body), system-ui, sans-serif',
        padding: '24px',
      }}
    >
      <form
        method="POST"
        action="/api/lm"
        style={{
          width: '100%',
          maxWidth: 360,
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
        }}
      >
        <p
          style={{
            fontSize: 12,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: '#5b5249',
            margin: 0,
          }}
        >
          Quartermint · Multi-Candidate Strategist
        </p>
        <h1
          style={{
            fontFamily: 'var(--font-display), Georgia, serif',
            fontWeight: 600,
            fontSize: 30,
            lineHeight: 1.1,
            margin: '2px 0 4px',
            letterSpacing: '-0.01em',
          }}
        >
          A private preview.
        </h1>
        <p style={{ fontSize: 14, color: '#5b5249', margin: '0 0 6px', lineHeight: 1.5 }}>
          Enter the password to view.
        </p>
        <input
          type="password"
          name="pw"
          autoFocus
          required
          placeholder="Password"
          aria-label="Password"
          style={{
            padding: '12px 14px',
            fontSize: 15,
            border: `1px solid ${wrong ? '#7a1f1a' : '#e4ddd2'}`,
            borderRadius: 10,
            background: '#fff',
            outline: 'none',
          }}
        />
        {wrong && (
          <p style={{ fontSize: 13, color: '#7a1f1a', margin: 0 }}>
            Incorrect password — try again.
          </p>
        )}
        <button
          type="submit"
          style={{
            padding: '12px 14px',
            fontSize: 15,
            fontWeight: 600,
            color: '#fbf8f2',
            background: '#1a1714',
            border: 'none',
            borderRadius: 10,
            cursor: 'pointer',
          }}
        >
          View preview
        </button>
      </form>
    </main>
  )
}
