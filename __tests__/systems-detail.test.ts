import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { join } from 'path'

const systemPage = readFileSync(
  join(__dirname, '../app/systems/[slug]/page.tsx'),
  'utf-8'
)
const sitemap = readFileSync(
  join(__dirname, '../app/sitemap.ts'),
  'utf-8'
)
const systemsData = readFileSync(
  join(__dirname, '../lib/systems.ts'),
  'utf-8'
)

describe('app/systems/[slug]/page.tsx', () => {
  it('is a Server Component (no use client)', () => {
    expect(systemPage).not.toContain("'use client'")
  })

  it('exports generateStaticParams', () => {
    expect(systemPage).toContain('generateStaticParams')
  })

  it('exports generateMetadata', () => {
    expect(systemPage).toContain('generateMetadata')
  })

  it('awaits params (Next.js 16 async params)', () => {
    expect(systemPage).toContain('await params')
  })

  it('uses notFound for unknown slugs', () => {
    expect(systemPage).toContain('notFound()')
  })

  it('imports systems from lib/systems', () => {
    expect(systemPage).toContain("from '@/lib/systems'")
  })

  it('uses invest max-width layout (per D-04)', () => {
    expect(systemPage).toContain('--spacing-invest-max')
  })

  it('renders system name, one-liner, and tech badge', () => {
    expect(systemPage).toContain('system.name')
    expect(systemPage).toContain('system.oneLiner')
    expect(systemPage).toContain('system.techBadge')
  })

  it('conditionally renders problem and solution', () => {
    expect(systemPage).toContain('system.problem')
    expect(systemPage).toContain('system.solution')
  })

  it('conditionally renders GitHub link', () => {
    expect(systemPage).toContain('system.githubUrl')
  })

  it('sets canonical URL with system slug', () => {
    expect(systemPage).toContain('quartermint.com/systems/')
  })

  it('has accessible touch targets (44px)', () => {
    expect(systemPage).toContain('min-h-[44px]')
  })
})

describe('app/sitemap.ts', () => {
  it('imports systems from lib/systems', () => {
    expect(sitemap).toContain("from '@/lib/systems'")
  })

  it('includes system detail page URLs', () => {
    expect(sitemap).toContain('/systems/')
  })

  it('includes all three base routes', () => {
    expect(sitemap).toContain('quartermint.com')
    expect(sitemap).toContain('quartermint.com/invest')
    expect(sitemap).toContain('quartermint.com/privacy')
  })
})

describe('lib/systems.ts data source', () => {
  it('has 13 systems total', () => {
    const matches = systemsData.match(/slug: '/g)
    expect(matches).toHaveLength(13)
  })

  it('has 4 featured systems', () => {
    const matches = systemsData.match(/featured: true/g)
    expect(matches).toHaveLength(4)
  })
})
