/**
 * Chat QA: Replays real user questions from Stripped conversations
 * against the quartermint chatbot and evaluates responses.
 *
 * Usage: npx tsx scripts/chat-qa.ts [--url https://preview.quartermint.com]
 *
 * Evaluates each response against:
 * 1. Audience fit: Does it speak to campaigns/advocacy/nonprofits?
 * 2. Radical honesty: Does it admit weaknesses when relevant?
 * 3. No fabrication: Does it avoid making things up?
 * 4. Conciseness: Is it 2-3 paragraphs max?
 * 5. No em dashes: Strict formatting check
 * 6. Personality: Does it sound like Ryan, not a generic AI?
 */

const BASE_URL = process.argv.includes('--url')
  ? process.argv[process.argv.indexOf('--url') + 1]
  : 'http://localhost:3000'

// Adapted questions from real Stripped conversations, reframed for quartermint audience
const TEST_CONVERSATIONS = [
  {
    name: 'Campaign manager exploring tools',
    messages: [
      'What do you actually build?',
      'How would you help a PAC that\'s struggling with compliance reporting?',
    ],
  },
  {
    name: 'Skeptical advocacy director',
    messages: [
      'You learned to code recently. How can you claim to build tools for campaigns when you have no engineering background?',
      'Why should I trust you over an established political tech vendor?',
    ],
  },
  {
    name: 'Direct from Stripped: writing weakness probe',
    messages: [
      'What makes you think you\'d be good at communications when you admit you\'re a bad writer?',
    ],
  },
  {
    name: 'Direct from Stripped: hard challenge',
    messages: [
      'So let me get this straight. Instead of just doing things the normal way, you built an entire AI chatbot? That seems like a lot of effort for something nobody asked for.',
    ],
  },
  {
    name: 'Direct from Stripped: failure probe',
    messages: [
      'Your last company failed. Your resume is scattered. Why would anyone trust you to build their operational tools?',
    ],
  },
  {
    name: 'Direct from Stripped: information routing challenge',
    messages: [
      'You keep saying "information routing" like it\'s some profound insight but it\'s literally just communication. Every company routes information. What makes your take special?',
    ],
  },
  {
    name: 'Nonprofit ED asking practical questions',
    messages: [
      'We\'re a small advocacy org with 5 people. Everything runs on Google Sheets. Where would you even start?',
      'What does an engagement actually look like? Timeline, cost, what we get?',
    ],
  },
  {
    name: 'AI identity check',
    messages: [
      'Are you actually Ryan or is this AI?',
    ],
  },
  {
    name: 'Design partner qualification',
    messages: [
      'What\'s your campaign experience? Have you actually worked on real campaigns?',
      'Tell me about the Campaign Finance Dashboard. Is it a real product or just an idea?',
    ],
  },
  {
    name: 'Personal/political deflection test',
    messages: [
      'What are your political views? Are you a Democrat?',
    ],
  },
]

interface ChatResponse {
  question: string
  response: string
  status: number
  latencyMs: number
}

interface EvalResult {
  question: string
  response: string
  latencyMs: number
  checks: {
    audienceFit: boolean
    noEmDashes: boolean
    concise: boolean
    personality: boolean
    honest: boolean
  }
  flags: string[]
}

async function sendMessage(
  messages: { role: string; content: string; id: string }[],
  sessionId: string
): Promise<ChatResponse> {
  const userMessage = messages[messages.length - 1].content
  const start = Date.now()

  const res = await fetch(`${BASE_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages,
      sessionId,
      scrollContext: null,
    }),
  })

  const latencyMs = Date.now() - start

  if (!res.ok) {
    return { question: userMessage, response: `[ERROR ${res.status}]`, status: res.status, latencyMs }
  }

  // Read streaming response
  const reader = res.body?.getReader()
  const decoder = new TextDecoder()
  let fullText = ''

  if (reader) {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      fullText += decoder.decode(value, { stream: true })
    }
  }

  // AI SDK v6 streams as "data: {json}" lines, extract text-delta parts
  const textParts = fullText
    .split('\n')
    .filter(line => line.startsWith('data: '))
    .map(line => {
      try {
        const parsed = JSON.parse(line.slice(6))
        return parsed.type === 'text-delta' ? parsed.delta : ''
      } catch {
        return ''
      }
    })
    .join('')

  const response = textParts || fullText.slice(0, 2000)

  return { question: userMessage, response, status: res.status, latencyMs }
}

function evaluate(chatRes: ChatResponse): EvalResult {
  const { response } = chatRes
  const flags: string[] = []

  // No em dashes (strict)
  const noEmDashes = !response.includes('\u2014') && !response.includes('--')
  if (!noEmDashes) flags.push('EM_DASH: Response contains em dashes')

  // Concise (under ~500 words, roughly 3 paragraphs)
  const wordCount = response.split(/\s+/).length
  const concise = wordCount <= 500
  if (!concise) flags.push(`VERBOSE: ${wordCount} words (target: <500)`)

  // Audience fit: mentions campaigns, advocacy, nonprofits, PACs, or political ops
  const audienceTerms = /campaign|advocacy|nonprofit|PAC|political|operations|compliance|filing/i
  const audienceFit = audienceTerms.test(response) || audienceTerms.test(chatRes.question)
  // Don't flag if the question wasn't about the audience
  if (!audienceFit && /build|tool|work|help/i.test(chatRes.question)) {
    flags.push('AUDIENCE: Response doesn\'t reference campaigns/advocacy audience')
  }

  // Personality: not generic AI (checks for concrete language patterns)
  const genericPatterns = /I'd be happy to|I can certainly|That's a great question|Let me break this down|comprehensive|robust|leverage|synerg/i
  const personality = !genericPatterns.test(response)
  if (!personality) flags.push('GENERIC: Response sounds like generic AI, not Ryan')

  // Honest: when asked about weaknesses, should acknowledge them
  const weaknessQuestion = /fail|bad writer|no.*background|trust|scattered|learn.*recently/i.test(chatRes.question)
  const admitsWeakness = /honest|admit|garbage|not.*degree|self-taught|learned by doing|failure/i.test(response)
  const honest = !weaknessQuestion || admitsWeakness
  if (!honest) flags.push('HONESTY: Asked about weakness but didn\'t acknowledge it')

  return {
    question: chatRes.question,
    response: chatRes.response,
    latencyMs: chatRes.latencyMs,
    checks: { audienceFit: audienceFit || !(/build|tool|work|help/i.test(chatRes.question)), noEmDashes, concise, personality, honest },
    flags,
  }
}

async function runQA() {
  console.log(`\n${'='.repeat(60)}`)
  console.log(`  CHAT QA: ${TEST_CONVERSATIONS.length} conversations, ${TEST_CONVERSATIONS.reduce((a, c) => a + c.messages.length, 0)} messages`)
  console.log(`  Target: ${BASE_URL}`)
  console.log(`${'='.repeat(60)}\n`)

  const results: EvalResult[] = []
  let totalFlags = 0

  for (const conv of TEST_CONVERSATIONS) {
    console.log(`\n--- ${conv.name} ---`)
    const sessionId = crypto.randomUUID()
    const messageHistory: { role: string; content: string; id: string }[] = []
    let msgIdx = 0

    for (const msg of conv.messages) {
      messageHistory.push({ role: 'user', content: msg, id: `msg-${++msgIdx}` })

      const chatRes = await sendMessage(messageHistory, sessionId)
      const evalResult = evaluate(chatRes)
      results.push(evalResult)

      // Add response to history for multi-turn
      messageHistory.push({ role: 'assistant', content: chatRes.response, id: `msg-${++msgIdx}` })

      const status = evalResult.flags.length === 0 ? '\u2713' : '\u2717'
      console.log(`  ${status} [${chatRes.latencyMs}ms] "${msg.slice(0, 60)}..."`)
      if (evalResult.flags.length > 0) {
        evalResult.flags.forEach(f => console.log(`    \u26A0 ${f}`))
        totalFlags += evalResult.flags.length
      }
      console.log(`    Response: "${chatRes.response.slice(0, 120)}..."`)
    }
  }

  // Summary
  const passed = results.filter(r => r.flags.length === 0).length
  const total = results.length
  const avgLatency = Math.round(results.reduce((a, r) => a + r.latencyMs, 0) / total)

  console.log(`\n${'='.repeat(60)}`)
  console.log(`  RESULTS: ${passed}/${total} passed (${Math.round(passed / total * 100)}%)`)
  console.log(`  Avg latency: ${avgLatency}ms`)
  console.log(`  Total flags: ${totalFlags}`)

  const checkSummary = {
    audienceFit: results.filter(r => r.checks.audienceFit).length,
    noEmDashes: results.filter(r => r.checks.noEmDashes).length,
    concise: results.filter(r => r.checks.concise).length,
    personality: results.filter(r => r.checks.personality).length,
    honest: results.filter(r => r.checks.honest).length,
  }
  console.log(`\n  Check breakdown (of ${total}):`)
  Object.entries(checkSummary).forEach(([k, v]) => {
    console.log(`    ${v === total ? '\u2713' : '\u2717'} ${k}: ${v}/${total}`)
  })
  console.log(`${'='.repeat(60)}\n`)

  // Write full report
  const report = {
    timestamp: new Date().toISOString(),
    target: BASE_URL,
    summary: { passed, total, avgLatency, totalFlags, checkSummary },
    results,
  }
  const reportPath = '.gstack/qa-reports/chat-qa-report.json'
  const { writeFileSync } = await import('fs')
  writeFileSync(reportPath, JSON.stringify(report, null, 2))
  console.log(`Full report: ${reportPath}`)
}

runQA().catch(console.error)
