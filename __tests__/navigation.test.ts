import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { join } from 'path'

const stickyNav = readFileSync(
  join(__dirname, '../components/sticky-nav.tsx'),
  'utf-8'
)

describe('components/sticky-nav.tsx', () => {
  it('is a client component', () => {
    expect(stickyNav).toContain("'use client'")
  })

  it('has aria-label for navigation', () => {
    expect(stickyNav).toContain('aria-label')
  })

  it('contains "Ryan Stern" text', () => {
    expect(stickyNav).toContain('Ryan Stern')
  })

  it('contains "Invest" text', () => {
    expect(stickyNav).toContain('Invest')
  })

  it('links to /invest', () => {
    expect(stickyNav).toContain('/invest')
  })

  it('has 44px minimum touch targets', () => {
    expect(stickyNav).toContain('min-h-[44px]')
  })

  it('has scroll event listener with passive option', () => {
    expect(stickyNav).toContain('scroll')
    expect(stickyNav).toContain('passive: true')
  })

  it('uses sticky positioning with z-50', () => {
    expect(stickyNav).toContain('sticky')
    expect(stickyNav).toContain('z-50')
  })

  it('has scroll delta threshold to prevent iOS thrashing', () => {
    expect(stickyNav).toContain('SCROLL_DELTA')
  })
})
