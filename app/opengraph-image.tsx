import { ImageResponse } from 'next/og'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'Ryan Stern -- Builder. Operator.'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          backgroundColor: '#FFFFFF',
          padding: '80px',
        }}
      >
        <div
          style={{
            fontSize: '64px',
            fontWeight: 400,
            color: '#333A45',
            fontFamily: 'serif',
          }}
        >
          Ryan Stern
        </div>
        <div
          style={{
            fontSize: '32px',
            color: '#555555',
            marginTop: '16px',
            fontStyle: 'italic',
          }}
        >
          Builder. Operator.
        </div>
        <div
          style={{
            fontSize: '20px',
            color: '#888888',
            marginTop: '40px',
            textAlign: 'center',
            maxWidth: '800px',
            lineHeight: '1.5',
          }}
        >
          Nine services, forty repositories, and a thesis: information routed to
          the right person, in the right form, at the right time.
        </div>
        <div style={{ fontSize: '16px', color: '#A8E6CF', marginTop: '40px' }}>
          quartermint.com
        </div>
      </div>
    )
  )
}
