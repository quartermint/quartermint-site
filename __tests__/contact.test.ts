import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { join } from 'path'

const src = readFileSync(
  join(process.cwd(), 'components/contact-investor.tsx'),
  'utf-8'
)

describe('ContactInvestor component', () => {
  it('contains "Schedule a conversation" heading', () => {
    expect(src).toContain('Schedule a conversation')
  })

  it('contains "For investors and partners" heading', () => {
    expect(src).toContain('For investors and partners')
  })

  it('links to /invest route', () => {
    expect(src).toContain('href="/invest"')
  })

  it('contains email address', () => {
    expect(src).toContain('ryan@quartermint.com')
  })

  it('has aria-label on X/Twitter link', () => {
    expect(src).toContain('aria-label="Ryan Stern on X"')
  })

  it('has aria-label on GitHub link', () => {
    expect(src).toContain('aria-label="quartermint on GitHub"')
  })

  it('uses target="_blank" for external links', () => {
    expect(src).toContain('target="_blank"')
  })

  it('uses noopener noreferrer for external links', () => {
    expect(src).toContain('rel="noopener noreferrer"')
  })

  it('enforces 44px touch targets', () => {
    expect(src).toContain('min-h-[44px]')
    expect(src).toContain('min-w-[44px]')
  })

  it('has two-column grid layout', () => {
    expect(src).toContain('grid')
    expect(src).toContain('sm:grid-cols-2')
  })

  it('is a Server Component (no "use client")', () => {
    expect(src).not.toContain("'use client'")
    expect(src).not.toContain('"use client"')
  })

  it('contains the Google Calendar booking link', () => {
    expect(src).toContain('calendar.google.com')
  })

  it('has Book a time CTA', () => {
    expect(src).toContain('Book a time')
  })

  it('contains "Or follow the work" tertiary label', () => {
    expect(src).toContain('Or follow the work')
  })

  it('links to GitHub quartermint org', () => {
    expect(src).toContain('https://github.com/quartermint')
  })

  it('links to X/Twitter profile', () => {
    expect(src).toContain('https://x.com/ryanstern')
  })
})
