import { describe, it, expect } from 'vitest'
import {
  SECTION_CONTEXT_MAP,
  SECTION_IDS,
  STATIC_DEFAULT_CHIPS,
  getScrollChips,
  getSectionPromptContext,
} from '@/lib/chat/scroll-context'
import { readFileSync } from 'fs'
import { resolve } from 'path'

describe('scroll-context mappings', () => {
  const expectedSectionIds = [
    'hero-section',
    'featured-systems',
    'chat-section',
    'origin-story',
    'systems-shelf',
    'contact-section',
  ]

  it('SECTION_IDS contains all 6 section IDs', () => {
    expect(SECTION_IDS).toHaveLength(6)
    for (const id of expectedSectionIds) {
      expect(SECTION_IDS).toContain(id)
    }
  })

  it('SECTION_CONTEXT_MAP has entries for all 6 section IDs', () => {
    for (const id of expectedSectionIds) {
      expect(SECTION_CONTEXT_MAP).toHaveProperty(id)
    }
  })

  it('each SECTION_CONTEXT_MAP entry has a label string and chips array of 2 strings', () => {
    for (const id of expectedSectionIds) {
      const entry = SECTION_CONTEXT_MAP[id]
      expect(typeof entry.label).toBe('string')
      expect(Array.isArray(entry.chips)).toBe(true)
      expect(entry.chips).toHaveLength(2)
      expect(typeof entry.chips[0]).toBe('string')
      expect(typeof entry.chips[1]).toBe('string')
    }
  })

  it('STATIC_DEFAULT_CHIPS has 3 items', () => {
    expect(STATIC_DEFAULT_CHIPS).toHaveLength(3)
  })

  describe('getScrollChips', () => {
    it('returns 3 chips when section has context (2 context + 1 default)', () => {
      const chips = getScrollChips('featured-systems')
      expect(chips).toHaveLength(3)
      // First 2 should be from the section context
      expect(chips[0]).toBe(SECTION_CONTEXT_MAP['featured-systems'].chips[0])
      expect(chips[1]).toBe(SECTION_CONTEXT_MAP['featured-systems'].chips[1])
      // 3rd should be first static default
      expect(chips[2]).toBe(STATIC_DEFAULT_CHIPS[0])
    })

    it('returns static defaults when section is null', () => {
      const chips = getScrollChips(null)
      expect(chips).toEqual(STATIC_DEFAULT_CHIPS)
    })

    it('returns static defaults when section is chat-section', () => {
      const chips = getScrollChips('chat-section')
      expect(chips).toEqual(STATIC_DEFAULT_CHIPS)
    })

    it('returns static defaults when section is unknown', () => {
      const chips = getScrollChips('unknown-section')
      expect(chips).toEqual(STATIC_DEFAULT_CHIPS)
    })
  })

  describe('getSectionPromptContext', () => {
    it('returns prompt injection string for known sections', () => {
      const context = getSectionPromptContext('featured-systems')
      expect(context).toContain('[CURRENT SECTION]')
      expect(context).toContain(
        'the featured systems: LifeVault, Relay, OpenEFB, and v2cf'
      )
      expect(context).toContain('[/CURRENT SECTION]')
    })

    it('returns empty string for chat-section', () => {
      expect(getSectionPromptContext('chat-section')).toBe('')
    })

    it('returns empty string for null', () => {
      expect(getSectionPromptContext(null)).toBe('')
    })

    it('returns empty string for unknown section', () => {
      expect(getSectionPromptContext('unknown-section')).toBe('')
    })

    it('returns context for each non-empty-label section', () => {
      const sectionsWithContext = [
        'hero-section',
        'featured-systems',
        'origin-story',
        'systems-shelf',
        'contact-section',
      ]
      for (const id of sectionsWithContext) {
        const context = getSectionPromptContext(id)
        expect(context).toContain('[CURRENT SECTION]')
        expect(context).toContain(SECTION_CONTEXT_MAP[id].label)
      }
    })
  })

  describe('ScrollContextProvider exports', () => {
    it('scroll-context-provider.tsx exports useScrollContext and ScrollContextProvider', () => {
      const filePath = resolve(
        __dirname,
        '../../components/scroll-context-provider.tsx'
      )
      const content = readFileSync(filePath, 'utf-8')
      expect(content).toContain('useScrollContext')
      expect(content).toContain('ScrollContextProvider')
      expect(content).toContain('IntersectionObserver')
    })
  })
})
