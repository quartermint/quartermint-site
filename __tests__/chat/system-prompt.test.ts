import { describe, it, expect } from 'vitest'
import { buildSystemPrompt, SYSTEM_PROMPT } from '@/lib/chat/system-prompt'
import { systems } from '@/lib/systems'

describe('System Prompt', () => {
  it('buildSystemPrompt returns same string as SYSTEM_PROMPT', () => {
    expect(buildSystemPrompt()).toBe(SYSTEM_PROMPT)
  })

  it('system prompt word count is under 1800 words', () => {
    const wordCount = SYSTEM_PROMPT.split(/\s+/).filter(Boolean).length
    expect(wordCount).toBeLessThan(1800)
    // Also verify it's substantial (not empty or trivially short)
    expect(wordCount).toBeGreaterThan(200)
  })

  it('contains AI disclosure language', () => {
    expect(SYSTEM_PROMPT).toContain("Ryan Stern's digital proxy")
  })

  it('contains em dash prohibition', () => {
    // The prompt should instruct against em dash usage
    expect(SYSTEM_PROMPT.toLowerCase()).toContain('em dash')
  })

  it('contains all system names from lib/systems.ts', () => {
    // All 13 systems must appear in the prompt
    expect(systems).toHaveLength(13)
    for (const system of systems) {
      expect(
        SYSTEM_PROMPT,
        `System prompt is missing system: ${system.name}`
      ).toContain(system.name)
    }
  })

  it('contains deflection rules', () => {
    expect(SYSTEM_PROMPT.toLowerCase()).toContain('political opinions')
    expect(SYSTEM_PROMPT.toLowerCase()).toContain('jailbreak')
  })

  it('contains 500 token cap instruction', () => {
    expect(SYSTEM_PROMPT).toMatch(/500.token/i)
  })

  it('contains response length constraint', () => {
    expect(SYSTEM_PROMPT).toContain('2-3 paragraphs max')
  })

  it('contains honesty and anti-fabrication rules', () => {
    expect(SYSTEM_PROMPT).toContain('NEVER fabricate')
    expect(SYSTEM_PROMPT).toContain('honest')
  })

  it('contains contact email for fallback', () => {
    expect(SYSTEM_PROMPT).toContain('ryan@quartermint.com')
  })
})
