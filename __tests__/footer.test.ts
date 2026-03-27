import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { join } from 'path'

const src = readFileSync(
  join(process.cwd(), 'components/footer-stats.tsx'),
  'utf-8'
)

describe('FooterStats component', () => {
  it('contains "40+ repositories"', () => {
    expect(src).toContain('40+ repositories')
  })

  it('contains "894K files indexed"', () => {
    expect(src).toContain('894K files indexed')
  })

  it('contains "9 production services"', () => {
    expect(src).toContain('9 production services')
  })

  it('contains the full stats line with separators', () => {
    expect(src).toContain(
      '40+ repositories / 894K files indexed / 9 production services'
    )
  })

  it('uses correct font size (13px per D-12)', () => {
    expect(src).toContain('text-[13px]')
  })

  it('uses text-text-faint color', () => {
    expect(src).toContain('text-text-faint')
  })

  it('is centered', () => {
    expect(src).toContain('text-center')
  })

  it('is a Server Component (no "use client")', () => {
    expect(src).not.toContain("'use client'")
    expect(src).not.toContain('"use client"')
  })
})
