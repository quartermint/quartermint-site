import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { join } from 'path'

describe('/invest page', () => {
  const investSrc = readFileSync(
    join(process.cwd(), 'app/invest/page.tsx'),
    'utf-8'
  )

  it('contains thesis pull quote', () => {
    expect(investSrc).toContain(
      "Information doesn"
    )
    expect(investSrc).toContain(
      "fail because it doesn"
    )
  })

  it('contains all 6 stats', () => {
    expect(investSrc).toContain('40+')
    expect(investSrc).toContain('894K')
    expect(investSrc).toContain('452K')
    expect(investSrc).toContain('395')
    expect(investSrc).toContain("'9'")
    expect(investSrc).toContain("'6'")
  })

  it('uses invest max-width', () => {
    expect(investSrc).toContain('max-w-[var(--spacing-invest-max)]')
  })

  it('contains canonical URL', () => {
    expect(investSrc).toContain('https://quartermint.com/invest')
  })

  it('uses 3x2 grid for stats', () => {
    expect(investSrc).toContain('grid-cols-3')
  })

  it('has 3px accent left border on pull quote', () => {
    expect(investSrc).toContain('border-l-[3px]')
    expect(investSrc).toContain('border-accent')
  })

  // Compliance checks (INV-03, D-10)
  describe('compliance - no securities language', () => {
    it('does not contain "invest in" (case-insensitive)', () => {
      expect(investSrc.toLowerCase()).not.toContain('invest in')
    })

    it('does not contain "investment opportunity"', () => {
      expect(investSrc.toLowerCase()).not.toContain('investment opportunity')
    })

    it('does not contain financial return terms', () => {
      expect(investSrc).not.toMatch(/\breturn on\b/i)
      expect(investSrc).not.toMatch(/\bROI\b/)
      expect(investSrc).not.toMatch(/\bequity\b/i)
      expect(investSrc).not.toMatch(/\bshares\b/i)
      expect(investSrc).not.toMatch(/\bvaluation\b/i)
    })

    it('does not contain forward-looking financial claims', () => {
      expect(investSrc.toLowerCase()).not.toContain('projected revenue')
      expect(investSrc.toLowerCase()).not.toContain('expected growth')
    })
  })
})
