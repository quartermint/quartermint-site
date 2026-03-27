import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { join } from 'path'

const globals = readFileSync(join(__dirname, '../app/globals.css'), 'utf-8')
const layout = readFileSync(join(__dirname, '../app/layout.tsx'), 'utf-8')

describe('Accessibility Baseline', () => {
  describe('Focus ring (globals.css)', () => {
    it('has focus-visible rule with 2px solid accent', () => {
      expect(globals).toContain('outline: 2px solid var(--color-accent)')
    })
    it('has 2px outline offset', () => {
      expect(globals).toContain('outline-offset: 2px')
    })
  })

  describe('Reduced motion (globals.css)', () => {
    it('has prefers-reduced-motion media query', () => {
      expect(globals).toContain('prefers-reduced-motion: reduce')
    })
    it('sets animation-duration to near-zero', () => {
      expect(globals).toContain('animation-duration: 0.01ms')
    })
    it('sets transition-duration to near-zero', () => {
      expect(globals).toContain('transition-duration: 0.01ms')
    })
    it('disables scroll-behavior', () => {
      expect(globals).toContain('scroll-behavior: auto')
    })
  })

  describe('ARIA landmarks (layout.tsx)', () => {
    it('has skip-nav link with correct text', () => {
      expect(layout).toContain('Skip to main content')
    })
    it('has main element with id="main-content"', () => {
      expect(layout).toContain('id="main-content"')
    })
    it('has header with role="banner"', () => {
      expect(layout).toContain('role="banner"')
    })
    it('has main with role="main"', () => {
      expect(layout).toContain('role="main"')
    })
    it('has footer with role="contentinfo"', () => {
      expect(layout).toContain('role="contentinfo"')
    })
    it('has lang="en" on html element', () => {
      expect(layout).toContain('lang="en"')
    })
  })
})
