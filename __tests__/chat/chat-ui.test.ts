import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync, readdirSync } from 'fs'
import { join } from 'path'

/**
 * UI integration tests for chat wiring (Plan 03-04).
 * Uses file-read pattern (established in Phase 2): read source files
 * with fs.readFileSync and assert content structure.
 */

const root = process.cwd()

function readComponent(relativePath: string): string {
  return readFileSync(join(root, relativePath), 'utf-8')
}

describe('Page wiring', () => {
  it('page.tsx imports ChatSection, not ChatPlaceholder', () => {
    const pageSrc = readComponent('app/page.tsx')
    expect(pageSrc).toContain('ChatSection')
    expect(pageSrc).toContain('chat/chat-section')
    expect(pageSrc).not.toContain('ChatPlaceholder')
    expect(pageSrc).not.toContain('chat-placeholder')
  })

  it('chat-placeholder.tsx does not exist', () => {
    expect(existsSync(join(root, 'components/chat-placeholder.tsx'))).toBe(
      false
    )
  })
})

describe('Hero CTA', () => {
  it('hero-section.tsx imports ChatCTA', () => {
    const heroSrc = readComponent('components/hero-section.tsx')
    expect(heroSrc).toContain('ChatCTA')
    expect(heroSrc).toContain('chat/chat-cta')
  })
})

describe('Chat section', () => {
  it('chat-section.tsx has desktop/mobile split', () => {
    const sectionSrc = readComponent('components/chat/chat-section.tsx')
    expect(sectionSrc).toContain('hidden sm:block')
    expect(sectionSrc).toContain('block sm:hidden')
  })
})

describe('Component structure', () => {
  it('chat-interface.tsx uses useChat from @ai-sdk/react', () => {
    const src = readComponent('components/chat/chat-interface.tsx')
    expect(src).toContain('useChat')
    expect(src).toContain('@ai-sdk/react')
  })

  it('chat-interface.tsx uses sendMessage (v6), not append (v3)', () => {
    const src = readComponent('components/chat/chat-interface.tsx')
    expect(src).toContain('sendMessage')
    expect(src).not.toMatch(/\bappend\s*\(/)
  })

  it('chat-interface.tsx has privacy notice linking to /privacy', () => {
    const src = readComponent('components/chat/chat-interface.tsx')
    expect(src).toContain('/privacy')
    expect(src).toContain('Privacy policy')
  })

  it('starter-chips.tsx has exactly 3 chips', () => {
    const src = readComponent('components/chat/starter-chips.tsx')
    // All 3 chip texts must be present
    expect(src).toContain('What are you building?')
    expect(src).toContain('How does LifeVault work?')
    expect(src).toContain('information routing thesis')
    // The STARTER_QUESTIONS array should have exactly 3 entries
    // Count comma-separated string entries in the array
    const arrayMatch = src.match(/\[[\s\S]*?\]\s*as\s+const/)
    expect(arrayMatch).toBeDefined()
    const commaCount = (arrayMatch![0].match(/,/g) || []).length
    // 3 entries = 2 commas (trailing comma makes 3 but last entry may not have one)
    expect(commaCount).toBeGreaterThanOrEqual(2)
    expect(commaCount).toBeLessThanOrEqual(3)
  })

  it('typing-indicator.tsx has role=status', () => {
    const src = readComponent('components/chat/typing-indicator.tsx')
    expect(src).toContain('role="status"')
  })

  it('chat-error-state.tsx has role=alert and mailto', () => {
    const src = readComponent('components/chat/chat-error-state.tsx')
    expect(src).toContain('role="alert"')
    expect(src).toContain('mailto:')
  })

  it('chat-rate-limit-state.tsx has booking link', () => {
    const src = readComponent('components/chat/chat-rate-limit-state.tsx')
    expect(src).toContain('CALENDAR_BOOKING_URL')
  })

  it('chat-mobile-overlay.tsx has role=dialog and z-[60]', () => {
    const src = readComponent('components/chat/chat-mobile-overlay.tsx')
    expect(src).toContain('role="dialog"')
    expect(src).toContain('z-[60]')
  })

  it("all chat components are 'use client'", () => {
    const chatDir = join(root, 'components/chat')
    const chatFiles = readdirSync(chatDir).filter((f) => f.endsWith('.tsx'))

    expect(chatFiles.length).toBeGreaterThan(0)

    for (const file of chatFiles) {
      const src = readFileSync(join(chatDir, file), 'utf-8')
      const firstMeaningfulLine = src
        .split('\n')
        .find((line) => line.trim().length > 0)
      expect(firstMeaningfulLine).toContain("'use client'")
    }
  })
})
