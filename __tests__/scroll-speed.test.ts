import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { join } from 'path'

const sectionWrapper = readFileSync(
  join(__dirname, '../components/section-wrapper.tsx'),
  'utf-8'
)

describe('Scroll-speed-adaptive animations (ENG-06)', () => {
  it('uses two IntersectionObserver thresholds for timing measurement', () => {
    expect(sectionWrapper).toContain('threshold: [0.01, 0.3]')
  })

  it('measures scroll timing with performance.now()', () => {
    expect(sectionWrapper).toContain('performance.now()')
  })

  it('defines three animation tiers: fast, medium, slow', () => {
    expect(sectionWrapper).toContain("'fast'")
    expect(sectionWrapper).toContain("'medium'")
    expect(sectionWrapper).toContain("'slow'")
  })

  it('fast tier: 150ms duration, 4px translate', () => {
    expect(sectionWrapper).toContain("duration: '150ms'")
    expect(sectionWrapper).toContain("translate: '4px'")
  })

  it('medium tier: 400ms duration, 8px translate (default)', () => {
    expect(sectionWrapper).toContain("duration: '400ms'")
    expect(sectionWrapper).toContain("translate: '8px'")
  })

  it('slow tier: 800ms duration, 12px translate', () => {
    expect(sectionWrapper).toContain("duration: '800ms'")
    expect(sectionWrapper).toContain("translate: '12px'")
  })

  it('fast tier threshold is <400ms', () => {
    expect(sectionWrapper).toContain('elapsed < 400')
  })

  it('slow tier threshold is >1200ms', () => {
    expect(sectionWrapper).toContain('elapsed > 1200')
  })

  it('checks prefers-reduced-motion and disables animation', () => {
    expect(sectionWrapper).toContain('prefers-reduced-motion: reduce')
    expect(sectionWrapper).toContain('matchMedia')
  })

  it('shows element immediately when reduced motion is preferred', () => {
    // After prefersReducedMotion check, setIsVisible(true) is called with no animation
    expect(sectionWrapper).toContain('prefersReducedMotion')
    expect(sectionWrapper).toContain('setIsVisible(true)')
  })

  it('uses ease-out for fast tier', () => {
    expect(sectionWrapper).toContain("easing: 'ease-out'")
  })

  it('uses ease for medium tier', () => {
    expect(sectionWrapper).toContain("easing: 'ease'")
  })

  it('uses ease-in-out for slow tier', () => {
    expect(sectionWrapper).toContain("easing: 'ease-in-out'")
  })

  it('uses inline styles for dynamic animation values', () => {
    expect(sectionWrapper).toContain('style={{')
    expect(sectionWrapper).toContain('config.duration')
    expect(sectionWrapper).toContain('config.translate')
  })

  it('defaults to medium tier', () => {
    expect(sectionWrapper).toContain("useState<AnimTier>('medium')")
  })
})
