import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { join } from 'path'

const src = readFileSync(
  join(process.cwd(), 'components/origin-story.tsx'),
  'utf-8'
)

describe('OriginStory component', () => {
  it('is a Server Component (no "use client")', () => {
    expect(src).not.toContain("'use client'")
    expect(src).not.toContain('"use client"')
  })

  it('contains the required closing sentence', () => {
    expect(src).toContain(
      "I started building because the tools didn't exist."
    )
  })

  it('contains at least 2 campaign names from the allowed list', () => {
    const allowedNames = [
      'Obama',
      'Biden',
      'Harris',
      'Clinton',
      'Sanders',
      'Warren',
      'Booker',
      'Nixon',
    ]
    const found = allowedNames.filter((name) => src.includes(name))
    expect(found.length).toBeGreaterThanOrEqual(2)
  })

  it('has 3 paragraphs', () => {
    const paragraphMatches = src.match(/<p\s/g)
    expect(paragraphMatches).not.toBeNull()
    expect(paragraphMatches!.length).toBe(3)
  })

  it('uses the correct body text styling', () => {
    expect(src).toContain('font-body')
    expect(src).toContain('text-[16px]')
    expect(src).toContain('leading-[1.7]')
    expect(src).toContain('text-text-muted')
  })

  it('has origin story prose between 120 and 180 words', () => {
    // Extract text content from JSX string literals
    const textContent = src
      .replace(/<[^>]+>/g, ' ')           // remove JSX tags
      .replace(/\{[^}]*\}/g, ' ')          // remove expressions
      .replace(/import[^;]+;/g, '')         // remove imports
      .replace(/export\s+function[^{]+\{/g, '') // remove function declaration
      .replace(/return\s*\(/g, '')          // remove return statement
      .replace(/[(){}]/g, ' ')             // remove remaining brackets
      .replace(/className="[^"]*"/g, ' ')  // remove classNames
      .replace(/\s+/g, ' ')                // normalize whitespace
      .trim()

    // Extract only the prose text between <p> tags
    const proseMatches = src.match(/>([^<]+)</g)
    if (!proseMatches) throw new Error('No prose text found')

    const allProse = proseMatches
      .map((m) => m.replace(/^>/, '').replace(/<$/, '').trim())
      .filter((t) => t.length > 0)
      .join(' ')

    const words = allProse.split(/\s+/).filter((w) => w.length > 0)
    expect(words.length).toBeGreaterThanOrEqual(120)
    expect(words.length).toBeLessThanOrEqual(180)
  })
})
