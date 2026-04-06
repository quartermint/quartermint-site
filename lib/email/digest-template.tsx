import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Hr,
  Section,
} from '@react-email/components'
import type {
  PageViews,
  GeoEntry,
  ConversationPreview,
} from '@/lib/digest/aggregate'

interface WeeklyDigestEmailProps {
  totalSessions: number
  totalMessages: number
  topQuestions: string[]
  exportRequests: number
  pageViews: PageViews
  geoBreakdown: GeoEntry[]
  newVisitors: number
  returningVisitors: number
  conversationPreviews: ConversationPreview[]
  topReferrers: { source: string; count: number }[]
  weekOf: string
}

const heading = {
  fontSize: '13px',
  fontWeight: 700 as const,
  color: '#1a1a1a',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.05em',
  marginBottom: '4px',
}

const body = {
  fontSize: '14px',
  color: '#333A45',
  lineHeight: '1.6',
  whiteSpace: 'pre-line' as const,
}

const dim = {
  fontSize: '13px',
  color: '#888888',
  lineHeight: '1.5',
  whiteSpace: 'pre-line' as const,
}

export function WeeklyDigestEmail({
  totalSessions,
  totalMessages,
  topQuestions,
  exportRequests,
  pageViews,
  geoBreakdown,
  newVisitors,
  returningVisitors,
  conversationPreviews,
  topReferrers,
  weekOf,
}: WeeklyDigestEmailProps) {
  const systemEntries = Object.entries(pageViews.systemBreakdown)
    .sort(([, a], [, b]) => b - a)

  return (
    <Html>
      <Head />
      <Body
        style={{
          fontFamily: 'system-ui, -apple-system, sans-serif',
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

          {/* Chat Overview */}
          <Section>
            <Text style={heading}>Chat</Text>
            <Text style={body}>
              {`Sessions: ${totalSessions}  |  Messages: ${totalMessages}  |  Exports: ${exportRequests}`}
            </Text>
          </Section>

          {/* Top Questions */}
          <Section>
            <Text style={heading}>Top Questions</Text>
            <Text style={body}>
              {topQuestions.length > 0
                ? topQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n')
                : '(none this week)'}
            </Text>
          </Section>

          <Hr />

          {/* Page Views */}
          <Section>
            <Text style={heading}>Page Views</Text>
            <Text style={body}>
              {[
                `Home: ${pageViews.home}`,
                `Work With Me: ${pageViews.workWithMe}`,
                `Systems (total): ${pageViews.systemsTotal}`,
                ...systemEntries.map(
                  ([slug, count]) => `  /systems/${slug}: ${count}`
                ),
              ].join('\n')}
            </Text>
          </Section>

          <Hr />

          {/* Visitors */}
          <Section>
            <Text style={heading}>Visitors</Text>
            <Text style={body}>
              {`New: ${newVisitors}  |  Returning: ${returningVisitors}`}
            </Text>
          </Section>

          {/* Geography */}
          {geoBreakdown.length > 0 && (
            <Section>
              <Text style={heading}>Where They Are</Text>
              <Text style={body}>
                {geoBreakdown
                  .map((g) => `${g.location}: ${g.count}`)
                  .join('\n')}
              </Text>
            </Section>
          )}

          {/* Referrers */}
          {topReferrers.length > 0 && (
            <Section>
              <Text style={heading}>Traffic Sources</Text>
              <Text style={body}>
                {topReferrers
                  .map((r) => `${r.source}: ${r.count}`)
                  .join('\n')}
              </Text>
            </Section>
          )}

          <Hr />

          {/* Conversation Previews */}
          {conversationPreviews.length > 0 && (
            <Section>
              <Text style={heading}>Conversations</Text>
              {conversationPreviews.map((c, i) => (
                <Text key={i} style={dim}>
                  {`${c.time} (${c.messageCount} msgs)\n"${c.firstQuestion}"`}
                </Text>
              ))}
            </Section>
          )}

          <Hr />
          <Text style={{ fontSize: '12px', color: '#888888' }}>
            Sent automatically. Reply to stop.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
