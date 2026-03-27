import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { join } from 'path'
import { featuredSystems } from '@/lib/systems'

const featuredSource = readFileSync(
  join(process.cwd(), 'components/featured-systems.tsx'),
  'utf-8'
)

describe('FeaturedSystems component source', () => {
  it('imports featuredSystems from lib/systems', () => {
    expect(featuredSource).toContain('featuredSystems')
    expect(featuredSource).toMatch(/import.*featuredSystems.*from.*lib\/systems/)
  })

  it('imports TechBadge component', () => {
    expect(featuredSource).toContain('TechBadge')
    expect(featuredSource).toMatch(/import.*TechBadge.*from/)
  })

  it('does NOT contain "use client" (server component)', () => {
    expect(featuredSource).not.toContain("'use client'")
    expect(featuredSource).not.toContain('"use client"')
  })
})

describe('featuredSystems data integrity', () => {
  it('has exactly 4 featured systems', () => {
    expect(featuredSystems).toHaveLength(4)
  })

  it('all have non-empty problem fields', () => {
    for (const system of featuredSystems) {
      expect(system.problem).toBeTruthy()
      expect(system.problem.length).toBeGreaterThan(0)
    }
  })

  it('all have non-empty solution fields', () => {
    for (const system of featuredSystems) {
      expect(system.solution).toBeTruthy()
      expect(system.solution.length).toBeGreaterThan(0)
    }
  })
})
