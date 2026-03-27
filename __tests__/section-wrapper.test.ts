import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { join } from 'path'

const sectionWrapper = readFileSync(
  join(__dirname, '../components/section-wrapper.tsx'),
  'utf-8'
)

describe('components/section-wrapper.tsx', () => {
  it('is a client component', () => {
    expect(sectionWrapper).toContain("'use client'")
  })

  it('uses IntersectionObserver for entrance animation', () => {
    expect(sectionWrapper).toContain('IntersectionObserver')
  })

  it('configures threshold for IntersectionObserver', () => {
    expect(sectionWrapper).toContain('threshold')
  })

  it('has aria-label on section element', () => {
    expect(sectionWrapper).toContain('aria-label')
  })

  it('supports bg-bg and bg-surface class names', () => {
    expect(sectionWrapper).toContain('bg-bg')
    expect(sectionWrapper).toContain('bg-surface')
  })

  it('supports noAnimation prop for above-the-fold sections', () => {
    expect(sectionWrapper).toContain('noAnimation')
  })

  it('uses translate-y for entrance animation', () => {
    expect(sectionWrapper).toContain('translate-y')
  })

  it('uses content max-width wrapper', () => {
    expect(sectionWrapper).toContain('--spacing-content-max')
  })

  it('unobserves element after first intersection', () => {
    expect(sectionWrapper).toContain('unobserve')
  })
})
