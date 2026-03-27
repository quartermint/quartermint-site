import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { join } from 'path'

/**
 * This test validates the alternating background pattern on the home page.
 * It reads app/page.tsx and verifies SectionWrapper usage with both bg values.
 * NOTE: This test will fully validate once Plan 02-04 wires all sections into page.tsx.
 * For now, it checks that the page file exists and can be read.
 */

describe('Section alternating backgrounds', () => {
  it('page.tsx exists and can be read', () => {
    const pageSrc = readFileSync(
      join(process.cwd(), 'app/page.tsx'),
      'utf-8'
    )
    expect(pageSrc).toBeTruthy()
  })

  it('systems-shelf component imports shelfSystems', () => {
    const shelfSrc = readFileSync(
      join(process.cwd(), 'components/systems-shelf.tsx'),
      'utf-8'
    )
    expect(shelfSrc).toContain('shelfSystems')
    expect(shelfSrc).toContain("from '@/lib/systems'")
  })

  it('systems-shelf has GitHub icon SVG', () => {
    const shelfSrc = readFileSync(
      join(process.cwd(), 'components/systems-shelf.tsx'),
      'utf-8'
    )
    expect(shelfSrc).toContain('viewBox="0 0 16 16"')
    expect(shelfSrc).toContain('aria-label')
    expect(shelfSrc).toContain('on GitHub')
  })

  it('systems-shelf uses TechBadge', () => {
    const shelfSrc = readFileSync(
      join(process.cwd(), 'components/systems-shelf.tsx'),
      'utf-8'
    )
    expect(shelfSrc).toContain('TechBadge')
  })

  it('origin-story is a Server Component', () => {
    const originSrc = readFileSync(
      join(process.cwd(), 'components/origin-story.tsx'),
      'utf-8'
    )
    expect(originSrc).not.toContain("'use client'")
  })

  it('contact-investor is a Server Component', () => {
    const contactSrc = readFileSync(
      join(process.cwd(), 'components/contact-investor.tsx'),
      'utf-8'
    )
    expect(contactSrc).not.toContain("'use client'")
  })

  it('footer-stats is a Server Component', () => {
    const footerSrc = readFileSync(
      join(process.cwd(), 'components/footer-stats.tsx'),
      'utf-8'
    )
    expect(footerSrc).not.toContain("'use client'")
  })
})
