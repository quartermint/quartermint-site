import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { join } from 'path'

describe('ReturningVisitorGreeting component (file-read pattern)', () => {
  const filePath = join(
    process.cwd(),
    'components/chat/returning-visitor-greeting.tsx'
  )
  const content = readFileSync(filePath, 'utf8')

  it('exports ReturningVisitorGreeting', () => {
    expect(content).toContain('export function ReturningVisitorGreeting')
  })

  it('contains /api/visitor fetch', () => {
    expect(content).toContain('/api/visitor')
  })

  it('contains "Welcome back" greeting for recent visitors', () => {
    expect(content).toContain('Welcome back')
  })

  it('contains "Good to see you again" greeting for moderate visitors', () => {
    expect(content).toContain('Good to see you again')
  })

  it('contains topic reference pattern for recent visitors', () => {
    expect(content).toContain('topics[0]')
  })

  it('has role="status" for screen reader announcement', () => {
    expect(content).toContain('role="status"')
  })

  it('has aria-live="polite" for screen reader announcement', () => {
    expect(content).toContain('aria-live="polite"')
  })

  it('passes returning visitor chips via onChipsReady callback', () => {
    expect(content).toContain('onChipsReady')
    expect(content).toContain('Continue where I left off')
    expect(content).toContain("What's new since I was here?")
  })

  it('has fade-in animation with reduced motion support', () => {
    expect(content).toContain('motion-safe:')
    expect(content).toContain('motion-reduce:')
  })
})

describe('ChatInterface integration (file-read pattern)', () => {
  const filePath = join(
    process.cwd(),
    'components/chat/chat-interface.tsx'
  )
  const content = readFileSync(filePath, 'utf8')

  it('imports ReturningVisitorGreeting', () => {
    expect(content).toContain('ReturningVisitorGreeting')
    expect(content).toContain('./returning-visitor-greeting')
  })

  it('passes onChipsReady callback', () => {
    expect(content).toContain('onChipsReady')
    expect(content).toContain('setReturningVisitorChips')
  })

  it('has returningVisitorChips state', () => {
    expect(content).toContain('returningVisitorChips')
  })

  it('passes chips prop to StarterChips', () => {
    expect(content).toContain('chips={')
  })
})

describe('Chat API route visitor integration (file-read pattern)', () => {
  const filePath = join(process.cwd(), 'app/api/chat/route.ts')
  const content = readFileSync(filePath, 'utf8')

  it('references upsertVisitorState', () => {
    expect(content).toContain('upsertVisitorState')
  })

  it('references extractAndStoreTopic', () => {
    expect(content).toContain('extractAndStoreTopic')
  })

  it('reads rv cookie', () => {
    expect(content).toContain("'rv'")
    expect(content).toContain('visitorId')
  })

  it('parses scrollContext from request body', () => {
    expect(content).toContain('scrollContext')
  })

  it('passes scrollContext to buildSystemPrompt', () => {
    expect(content).toContain('buildSystemPrompt(scrollContext)')
  })

  it('triggers topic extraction for conversations with >= 2 user messages', () => {
    expect(content).toContain('userMessageCount >= 2')
  })
})

describe('StarterChips accepts chips prop (file-read pattern)', () => {
  const filePath = join(
    process.cwd(),
    'components/chat/starter-chips.tsx'
  )
  const content = readFileSync(filePath, 'utf8')

  it('accepts optional chips prop', () => {
    expect(content).toContain('chips?:')
  })

  it('falls back to STARTER_QUESTIONS when no chips provided', () => {
    expect(content).toContain('chips ?? STARTER_QUESTIONS')
  })
})

describe('System prompt accepts scrollContext (file-read pattern)', () => {
  const filePath = join(process.cwd(), 'lib/chat/system-prompt.ts')
  const content = readFileSync(filePath, 'utf8')

  it('accepts optional scrollContext parameter', () => {
    expect(content).toContain('scrollContext?: string')
  })

  it('delegates scroll context injection to getSectionPromptContext', () => {
    expect(content).toContain('getSectionPromptContext')
  })
})
