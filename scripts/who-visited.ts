import { redis } from '../lib/chat/redis'
import type { ChatLog, VisitorState } from '../lib/chat/types'

const oneWeekAgo = new Date(Date.now() - 7 * 86400000).toISOString()

async function main() {
  console.log(`\n=== Visitors & conversations since ${oneWeekAgo} ===\n`)

  // Visitors
  const visitorKeys: string[] = []
  let cursor = '0'
  do {
    const [next, keys] = await redis.scan(cursor, { match: 'visitor:*', count: 100 })
    cursor = String(next)
    visitorKeys.push(...keys)
  } while (cursor !== '0' && visitorKeys.length < 500)

  const visitors: Array<{ key: string; v: VisitorState }> = []
  if (visitorKeys.length) {
    const pipe = redis.pipeline()
    visitorKeys.forEach((k) => pipe.get(k))
    const results = await pipe.exec<(VisitorState | null)[]>()
    results.forEach((v, i) => {
      if (v && v.lastVisit >= oneWeekAgo) visitors.push({ key: visitorKeys[i], v })
    })
  }

  visitors.sort((a, b) => b.v.lastVisit.localeCompare(a.v.lastVisit))

  console.log(`VISITORS (${visitors.length}):\n`)
  for (const { key, v } of visitors) {
    const loc = [v.city, v.region, v.country].filter(Boolean).join(', ') || 'Unknown'
    const when = new Date(v.lastVisit).toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })
    const ref = v.referrer || '(direct)'
    const utm = [v.utmSource, v.utmMedium, v.utmCampaign].filter(Boolean).join('/') || '-'
    console.log(`  ${when} PT  |  ${loc}`)
    console.log(`    visits=${v.visits} msgs=${v.messageCount}  ref=${ref}  utm=${utm}`)
    if (v.sectionsViewed?.length) console.log(`    sections: ${v.sectionsViewed.join(', ')}`)
    if (v.topics?.length) console.log(`    topics: ${v.topics.join(', ')}`)
    if (v.events?.length) {
      const recent = v.events.slice(-8).map((e) => `${e.action}:${e.label}`).join(' → ')
      console.log(`    events: ${recent}`)
    }
    console.log()
  }

  // Chat logs
  const sessionIds = await redis.lrange('chat:index', 0, 500)
  const logs: ChatLog[] = []
  for (const id of sessionIds) {
    const log = await redis.get<ChatLog>(`chat:${id}`)
    if (log && log.startedAt >= oneWeekAgo) logs.push(log)
  }
  logs.sort((a, b) => b.startedAt.localeCompare(a.startedAt))

  console.log(`\nCHAT CONVERSATIONS (${logs.length}):\n`)
  for (const log of logs) {
    const when = new Date(log.startedAt).toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })
    console.log(`  ${when} PT  |  ip=${log.ip}  msgs=${log.messages.length}`)
    for (const m of log.messages) {
      const who = m.role === 'user' ? 'USER ' : 'BOT  '
      const text = m.content.replace(/\s+/g, ' ').slice(0, 200)
      console.log(`    ${who} ${text}`)
    }
    console.log()
  }
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1) })
