import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { join } from 'path'

const heroSource = readFileSync(
  join(process.cwd(), 'components/hero-section.tsx'),
  'utf-8'
)

describe('HeroSection component source', () => {
  it('contains locked H1 text "Ryan Stern"', () => {
    expect(heroSource).toContain('Ryan Stern')
  })

  it('contains locked subtitle "Builder. Operator."', () => {
    expect(heroSource).toContain('Builder. Operator.')
  })

  it('contains locked paragraph 1 opening', () => {
    expect(heroSource).toContain('Twenty years in political operations')
  })

  it('contains locked paragraph 2 opening', () => {
    expect(heroSource).toContain('So the tools got built')
  })

  it('contains CTA text "Explore the systems"', () => {
    expect(heroSource).toContain('Explore the systems')
  })

  it('contains CTA text "Ask me anything"', () => {
    expect(heroSource).toContain('Ask me anything')
  })

  it('contains #featured-systems href', () => {
    expect(heroSource).toContain('#featured-systems')
  })

  it('contains #chat-section href', () => {
    expect(heroSource).toContain('#chat-section')
  })

  it('contains headshot path /images/headshot.jpg', () => {
    expect(heroSource).toContain('/images/headshot.jpg')
  })

  it('contains alt="Ryan Stern" for headshot', () => {
    expect(heroSource).toContain('alt="Ryan Stern"')
  })

  it('contains responsive headshot sizes w-20 and lg:w-[160px]', () => {
    expect(heroSource).toContain('w-20')
    expect(heroSource).toContain('lg:w-[160px]')
  })

  it('does NOT contain "use client" (server component)', () => {
    expect(heroSource).not.toContain("'use client'")
    expect(heroSource).not.toContain('"use client"')
  })
})
