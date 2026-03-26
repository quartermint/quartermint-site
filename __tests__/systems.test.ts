import { describe, it, expect } from 'vitest'
import { systems, featuredSystems, shelfSystems, type System } from '../lib/systems'

const ALLOWED_BADGES = ['Go', 'Swift', 'TypeScript', 'Python', 'Raspberry Pi', 'Go + Swift'] as const
const FEATURED_NAMES = ['LifeVault', 'Relay', 'OpenEFB', 'v2cf']

describe('lib/systems.ts', () => {
  it('exports exactly 15 systems', () => {
    expect(systems).toHaveLength(15)
  })

  it('every system has all required fields', () => {
    const requiredFields: (keyof System)[] = [
      'name', 'slug', 'oneLiner', 'problem', 'solution',
      'techBadge', 'isPublic', 'githubUrl', 'status', 'featured',
    ]
    for (const system of systems) {
      for (const field of requiredFields) {
        expect(system).toHaveProperty(field)
      }
    }
  })

  it('has exactly 4 featured systems', () => {
    const featured = systems.filter((s) => s.featured)
    expect(featured).toHaveLength(4)
  })

  it('has exactly 11 shelf systems', () => {
    const shelf = systems.filter((s) => !s.featured)
    expect(shelf).toHaveLength(11)
  })

  it('featured systems are LifeVault, Relay, OpenEFB, v2cf', () => {
    const featuredNames = systems.filter((s) => s.featured).map((s) => s.name)
    expect(featuredNames.sort()).toEqual(FEATURED_NAMES.sort())
  })

  it('all techBadge values are from allowed set', () => {
    for (const system of systems) {
      expect(ALLOWED_BADGES).toContain(system.techBadge)
    }
  })

  it('all slugs are unique', () => {
    const slugs = systems.map((s) => s.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('all slugs are URL-safe (lowercase alphanumeric + hyphens)', () => {
    for (const system of systems) {
      expect(system.slug).toMatch(/^[a-z0-9-]+$/)
    }
  })

  it('featured systems have substantive problem and solution text', () => {
    const featured = systems.filter((s) => s.featured)
    for (const system of featured) {
      expect(system.problem.length).toBeGreaterThan(10)
      expect(system.solution.length).toBeGreaterThan(10)
    }
  })

  it('every system has a non-empty oneLiner', () => {
    for (const system of systems) {
      expect(system.oneLiner.length).toBeGreaterThan(0)
    }
  })

  it('public systems have githubUrl, private systems have null', () => {
    for (const system of systems) {
      if (system.isPublic) {
        expect(system.githubUrl).not.toBeNull()
        expect(system.githubUrl).toMatch(/^https:\/\/github\.com\//)
      } else {
        expect(system.githubUrl).toBeNull()
      }
    }
  })

  it('status is either active or paused', () => {
    for (const system of systems) {
      expect(['active', 'paused']).toContain(system.status)
    }
  })

  it('featuredSystems export returns exactly 4 featured items', () => {
    expect(featuredSystems).toHaveLength(4)
    for (const system of featuredSystems) {
      expect(system.featured).toBe(true)
    }
  })

  it('shelfSystems export returns exactly 11 non-featured items', () => {
    expect(shelfSystems).toHaveLength(11)
    for (const system of shelfSystems) {
      expect(system.featured).toBe(false)
    }
  })
})
