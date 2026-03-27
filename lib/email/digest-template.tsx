import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Hr,
} from '@react-email/components'

interface WeeklyDigestEmailProps {
  totalSessions: number
  totalMessages: number
  topQuestions: string[]
  exportRequests: number
  investViews: number
  weekOf: string
}

export function WeeklyDigestEmail({
  totalSessions,
  totalMessages,
  topQuestions,
  exportRequests,
  investViews,
  weekOf,
}: WeeklyDigestEmailProps) {
  return (
    <Html>
      <Head />
      <Body
        style={{
          fontFamily: 'system-ui, sans-serif',
          backgroundColor: '#ffffff',
        }}
      >
        <Container
          style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}
        >
          <Text style={{ fontSize: '16px', fontWeight: 600 }}>
            quartermint.com -- Week of {weekOf}
          </Text>
          <Hr />
          <Text
            style={{
              fontSize: '14px',
              color: '#333A45',
              lineHeight: '1.6',
              whiteSpace: 'pre-line',
            }}
          >
            {`Chat sessions: ${totalSessions}\nMessages: ${totalMessages}\n\nTop questions:\n${
              topQuestions.length > 0
                ? topQuestions.map((q, i) => `  ${i + 1}. ${q}`).join('\n')
                : '  (none this week)'
            }\n\nExport requests: ${exportRequests}\n/invest views: ${investViews}`}
          </Text>
          <Hr />
          <Text style={{ fontSize: '12px', color: '#888888' }}>
            Sent automatically. Reply to stop.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
