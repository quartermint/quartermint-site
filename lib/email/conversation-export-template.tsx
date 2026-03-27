import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Hr,
} from '@react-email/components'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface ConversationExportEmailProps {
  messages: Message[]
}

export function ConversationExportEmail({
  messages,
}: ConversationExportEmailProps) {
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
          <Text style={{ fontSize: '20px', fontWeight: 600 }}>
            Your conversation with Ryan Stern
          </Text>
          <Text style={{ fontSize: '14px', color: '#888888' }}>
            via quartermint.com
          </Text>
          <Hr />
          {messages.map((msg, i) => (
            <Section key={i} style={{ marginBottom: '16px' }}>
              <Text
                style={{
                  fontSize: '12px',
                  color: '#888888',
                  marginBottom: '4px',
                }}
              >
                {msg.role === 'user' ? 'You' : 'Ryan'}
              </Text>
              <Text
                style={{
                  fontSize: '14px',
                  color: '#333A45',
                  lineHeight: '1.6',
                }}
              >
                {msg.content}
              </Text>
            </Section>
          ))}
          <Hr />
          <Text style={{ fontSize: '12px', color: '#888888' }}>
            quartermint.com -- Ryan Stern, Builder. Operator.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
