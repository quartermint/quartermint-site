import { describe, it, expect } from 'vitest'
import {
  SECTION_IDS,
  STATIC_DEFAULT_CHIPS,
  getScrollChips,
} from '@/lib/chat/scroll-context'

describe('smart starter chips', () => {
  it('returns exactly 3 chips for each section', () => {
    for (const id of SECTION_IDS) {
      const chips = getScrollChips(id)
      expect(chips).toHaveLength(3)
    }
  })

  it('returns STATIC_DEFAULT_CHIPS when section is null', () => {
    const chips = getScrollChips(null)
    expect(chips).toEqual(STATIC_DEFAULT_CHIPS)
    expect(chips).toHaveLength(3)
  })

  it('returns STATIC_DEFAULT_CHIPS when section is chat-section', () => {
    const chips = getScrollChips('chat-section')
    expect(chips).toEqual(STATIC_DEFAULT_CHIPS)
    expect(chips).toHaveLength(3)
  })

  it('returns context-specific chips for non-default sections', () => {
    const chips = getScrollChips('origin-story')
    expect(chips[0]).toBe('What made you start building?')
    expect(chips[1]).toBe('Tell me about your background')
    // Third chip is a static default
    expect(STATIC_DEFAULT_CHIPS).toContain(chips[2])
  })

  it('hero-section returns static defaults (entry point)', () => {
    // hero-section has context, so it should return 2 context + 1 default
    const chips = getScrollChips('hero-section')
    expect(chips).toHaveLength(3)
    expect(chips[0]).toBe('What are you building?')
    expect(chips[1]).toBe('How does LifeVault work?')
  })
})
