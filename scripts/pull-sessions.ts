/**
 * Pull chat sessions from Redis for a given week.
 *
 * Usage: npx tsx scripts/pull-sessions.ts [--days N]
 *
 * Requires UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN env vars.
 * Reads from .env.local if present.
 */

import { readFileSync } from 'fs'
import { resolve } from 'path'
import { Redis } from '@upstash/redis'

// Load .env.local manually (no dotenv dependency needed)
try {
  const envPath = resolve(process.cwd(), '.env.local')
  const envContent = readFileSync(envPath, 'utf-8')
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eqIdx = trimmed.indexOf('=')
    if (eqIdx === -1) continue
    const key = trimmed.slice(0, eqIdx).trim()
    const value = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '')
    if (!process.env[key]) process.env[key] = value
  }
} catch {
  // .env.local not found, rely on existing env vars
}

interface ChatLogMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

interface ChatLog {
  sessionId: string
  ip: string
  startedAt: string
  messages: ChatLogMessage[]
}

interface VisitorState {
  lastVisit: string
  topics: string[]
  sectionsViewed: string[]
  messageCount: number
  referrer: string | null
  utmSource: string | null
  utmMedium: string | null
  utmCampaign: string | null
  events: { action: string; label: string; ts: string }[]
  city: string | null
  region: string | null
  country: string | null
  visits: number
}

const redis = Redis.fromEnv()

async function main() {
  const daysArg = process.argv.includes('--days')
    ? parseInt(process.argv[process.argv.indexOf('--days') + 1], 10)
    : 7
  const cutoff = new Date(Date.now() - daysArg * 86400000).toISOString()

  console.log(`\n📊 Pulling chat sessions from the past ${daysArg} days (since ${cutoff.split('T')[0]})\n`)

  // Fetch all session IDs
  const sessionIds = await redis.lrange('chat:index', 0, 500)
  console.log(`Total sessions in index: ${sessionIds.length}`)

  // Fetch all sessions in parallel
  const pipeline = redis.pipeline()
  for (const id of sessionIds) {
    pipeline.get(`chat:${id}`)
  }
  const results = await pipeline.exec<(ChatLog | null)[]>()

  // Filter to date range
  const sessions = results
    .filter((log): log is ChatLog => log !== null && log.startedAt >= cutoff)
    .sort((a, b) => a.startedAt.localeCompare(b.startedAt))

  console.log(`Sessions in date range: ${sessions.length}\n`)

  // Print each session
  let totalMessages = 0
  const allUserQuestions: string[] = []

  for (let i = 0; i < sessions.length; i++) {
    const session = sessions[i]
    const date = new Date(session.startedAt)
    const dateStr = date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZone: 'America/Los_Angeles',
    })
    const userMsgs = session.messages.filter((m) => m.role === 'user')
    const assistantMsgs = session.messages.filter((m) => m.role === 'assistant')
    totalMessages += session.messages.length

    console.log(`${'─'.repeat(80)}`)
    console.log(`Session ${i + 1}/${sessions.length}`)
    console.log(`  Date:     ${dateStr}`)
    console.log(`  IP:       ${session.ip}`)
    console.log(`  Messages: ${userMsgs.length} user, ${assistantMsgs.length} assistant`)
    console.log(`  Duration: ${getDuration(session)}`)
    console.log()

    for (const msg of session.messages) {
      const role = msg.role === 'user' ? '👤 Visitor' : '🤖 Ryan AI'
      const time = new Date(msg.timestamp).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        timeZone: 'America/Los_Angeles',
      })
      // Truncate long messages for readability
      const content =
        msg.content.length > 500
          ? msg.content.slice(0, 500) + '...'
          : msg.content
      console.log(`  [${time}] ${role}:`)
      console.log(`    ${content.replace(/\n/g, '\n    ')}`)
      console.log()

      if (msg.role === 'user') {
        allUserQuestions.push(msg.content)
      }
    }
  }

  // Summary
  console.log(`${'═'.repeat(80)}`)
  console.log(`\n📈 SUMMARY`)
  console.log(`  Sessions:        ${sessions.length}`)
  console.log(`  Total messages:  ${totalMessages}`)
  console.log(`  Avg msgs/session: ${(totalMessages / sessions.length).toFixed(1)}`)

  // IP analysis
  const ipCounts = new Map<string, number>()
  for (const s of sessions) {
    ipCounts.set(s.ip, (ipCounts.get(s.ip) || 0) + 1)
  }
  console.log(`  Unique IPs:     ${ipCounts.size}`)

  const repeatIps = [...ipCounts.entries()].filter(([, c]) => c > 1)
  if (repeatIps.length > 0) {
    console.log(`\n  Repeat visitors (by IP):`)
    for (const [ip, count] of repeatIps.sort((a, b) => b[1] - a[1])) {
      console.log(`    ${ip}: ${count} sessions`)
    }
  }

  // Top questions
  const questionCounts: Record<string, number> = {}
  for (const q of allUserQuestions) {
    const key = q.slice(0, 100).toLowerCase().trim()
    questionCounts[key] = (questionCounts[key] || 0) + 1
  }
  const topQuestions = Object.entries(questionCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)

  console.log(`\n  Top 10 questions:`)
  for (const [q, count] of topQuestions) {
    console.log(`    (${count}x) ${q}`)
  }

  // Time distribution
  const hourCounts = new Array(24).fill(0)
  for (const s of sessions) {
    const hour = new Date(s.startedAt).getUTCHours()
    hourCounts[hour]++
  }
  console.log(`\n  Activity by hour (UTC):`)
  const maxHour = Math.max(...hourCounts)
  for (let h = 0; h < 24; h++) {
    if (hourCounts[h] > 0) {
      const bar = '█'.repeat(Math.ceil((hourCounts[h] / maxHour) * 20))
      console.log(`    ${String(h).padStart(2, '0')}:00  ${bar} ${hourCounts[h]}`)
    }
  }

  console.log()
}

function getDuration(session: ChatLog): string {
  if (session.messages.length < 2) return 'single message'
  const first = new Date(session.messages[0].timestamp).getTime()
  const last = new Date(session.messages[session.messages.length - 1].timestamp).getTime()
  const mins = Math.round((last - first) / 60000)
  if (mins < 1) return '< 1 min'
  return `${mins} min`
}

main().catch(console.error)
