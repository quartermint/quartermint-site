import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { join } from 'path'

const globals = readFileSync(join(__dirname, '../app/globals.css'), 'utf-8')

describe('Design Token System (globals.css)', () => {
  describe('Light mode tokens', () => {
    it('defines --color-bg as #FFFFFF', () => {
      expect(globals).toContain('--color-bg: #FFFFFF')
    })
    it('defines --color-surface as #E6F4F1', () => {
      expect(globals).toContain('--color-surface: #E6F4F1')
    })
    it('defines --color-accent as #A8E6CF', () => {
      expect(globals).toContain('--color-accent: #A8E6CF')
    })
    it('defines --color-text as #333A45', () => {
      expect(globals).toContain('--color-text: #333A45')
    })
    it('defines --color-text-muted as #555555', () => {
      expect(globals).toContain('--color-text-muted: #555555')
    })
    it('defines --color-text-faint as #888888', () => {
      expect(globals).toContain('--color-text-faint: #888888')
    })
  })

  describe('Dark mode tokens', () => {
    it('defines dark --color-bg as #1A1D23', () => {
      expect(globals).toContain('--color-bg: #1A1D23')
    })
    it('defines dark --color-surface as #232830', () => {
      expect(globals).toContain('--color-surface: #232830')
    })
    it('defines dark --color-accent as #7CCFB0', () => {
      expect(globals).toContain('--color-accent: #7CCFB0')
    })
    it('defines dark --color-text as #E8ECF0', () => {
      expect(globals).toContain('--color-text: #E8ECF0')
    })
    it('defines dark --color-text-muted as #A0A8B4', () => {
      expect(globals).toContain('--color-text-muted: #A0A8B4')
    })
    it('defines dark --color-text-faint as #6B7280', () => {
      expect(globals).toContain('--color-text-faint: #6B7280')
    })
  })

  describe('Theme integration', () => {
    it('uses @theme inline directive', () => {
      expect(globals).toContain('@theme inline')
    })
    it('clears default Tailwind colors with --color-*: initial', () => {
      expect(globals).toContain('--color-*: initial')
    })
    it('references --font-display font variable', () => {
      expect(globals).toContain('--font-display: var(--font-instrument-serif)')
    })
    it('references --font-body font variable', () => {
      expect(globals).toContain('--font-body: var(--font-dm-sans)')
    })
  })
})
