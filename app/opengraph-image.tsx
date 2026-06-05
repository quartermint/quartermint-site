import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Quartermint — Multi-Entity Treasury for Political Organizations'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

/**
 * OG image: entity-geometry strip + Quartermint wordmark + tagline.
 * Editorial Treasury palette: Parchment background, Ledger Green marks,
 * Ink text.
 */
export default function OpenGraphImage() {
  // Editorial Treasury tokens (kept inline -- ImageResponse cannot read CSS vars)
  const BG = '#FAF7EF'
  const PRIMARY = '#0F3D2E'
  const TEXT = '#1C2620'
  const MUTED = '#5E6862'
  const RULE = '#B5AE99'

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: BG,
          padding: '72px 80px',
          fontFamily: 'serif',
        }}
      >
        {/* Top: entity-geometry strip + brand mark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {/* ● Campaign */}
            <svg width="28" height="28" viewBox="0 0 16 16">
              <circle cx="8" cy="8" r="5.5" fill={PRIMARY} />
            </svg>
            {/* ◆ Coalition PAC */}
            <svg width="28" height="28" viewBox="0 0 16 16">
              <polygon points="8,1.75 14.25,8 8,14.25 1.75,8" fill={PRIMARY} />
            </svg>
            {/* ▲ JFC */}
            <svg width="28" height="28" viewBox="0 0 16 16">
              <polygon points="8,1.75 14.25,13 1.75,13" fill={PRIMARY} />
            </svg>
            {/* ■ 501(c) */}
            <svg width="28" height="28" viewBox="0 0 16 16">
              <rect x="2" y="2" width="12" height="12" fill={PRIMARY} />
            </svg>
          </div>
          <div
            style={{
              fontSize: 20,
              letterSpacing: 3,
              textTransform: 'uppercase',
              color: MUTED,
              fontFamily: 'sans-serif',
            }}
          >
            Quartermint
          </div>
        </div>

        {/* Wordmark + tagline */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              fontSize: 128,
              lineHeight: 1.0,
              color: TEXT,
              letterSpacing: '-0.02em',
              fontFamily: 'serif',
              fontWeight: 500,
            }}
          >
            Quartermint
          </div>
          <div
            style={{
              marginTop: 28,
              fontSize: 30,
              lineHeight: 1.3,
              color: MUTED,
              fontFamily: 'sans-serif',
              maxWidth: 920,
            }}
          >
            Multi-entity financial infrastructure for political organizations.
          </div>
        </div>

        {/* Hairline footer with entity labels */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: `1px solid ${RULE}`,
            paddingTop: 18,
            fontSize: 18,
            color: MUTED,
            fontFamily: 'sans-serif',
          }}
        >
          <div>Campaign · Coalition PAC · JFC · 501(c)</div>
          <div style={{ color: TEXT }}>quartermint.com</div>
        </div>
      </div>
    ),
    { ...size }
  )
}
