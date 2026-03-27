import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { join } from 'path'

describe('SEO Metadata', () => {
  describe('robots.ts', () => {
    const robotsSrc = readFileSync(
      join(process.cwd(), 'app/robots.ts'),
      'utf-8'
    )

    it('allows all crawlers', () => {
      expect(robotsSrc).toContain("allow: '/'")
    })

    it('references sitemap URL', () => {
      expect(robotsSrc).toContain(
        "sitemap: 'https://quartermint.com/sitemap.xml'"
      )
    })
  })

  describe('sitemap.ts', () => {
    const sitemapSrc = readFileSync(
      join(process.cwd(), 'app/sitemap.ts'),
      'utf-8'
    )

    it('lists home page', () => {
      expect(sitemapSrc).toContain("url: 'https://quartermint.com'")
    })

    it('lists invest page', () => {
      expect(sitemapSrc).toContain(
        "url: 'https://quartermint.com/invest'"
      )
    })

    it('lists privacy page', () => {
      expect(sitemapSrc).toContain(
        "url: 'https://quartermint.com/privacy'"
      )
    })
  })

  describe('opengraph-image.tsx', () => {
    const ogSrc = readFileSync(
      join(process.cwd(), 'app/opengraph-image.tsx'),
      'utf-8'
    )

    it('uses ImageResponse', () => {
      expect(ogSrc).toContain('ImageResponse')
    })

    it('includes Ryan Stern name', () => {
      expect(ogSrc).toContain('Ryan Stern')
    })

    it('has correct width (1200)', () => {
      expect(ogSrc).toContain('1200')
    })

    it('has correct height (630)', () => {
      expect(ogSrc).toContain('630')
    })
  })

  describe('layout.tsx metadata', () => {
    const layoutSrc = readFileSync(
      join(process.cwd(), 'app/layout.tsx'),
      'utf-8'
    )

    it('defines metadataBase', () => {
      expect(layoutSrc).toContain('metadataBase')
    })

    it('points to quartermint.com', () => {
      expect(layoutSrc).toContain('https://quartermint.com')
    })

    it('has correct title', () => {
      expect(layoutSrc).toContain(
        "title: 'Ryan Stern -- Builder. Operator.'"
      )
    })

    it('configures Twitter summary_large_image card', () => {
      expect(layoutSrc).toContain("card: 'summary_large_image'")
    })

    it('includes canonical URL', () => {
      expect(layoutSrc).toContain("canonical: 'https://quartermint.com'")
    })
  })

  describe('invest page metadata', () => {
    const investSrc = readFileSync(
      join(process.cwd(), 'app/invest/page.tsx'),
      'utf-8'
    )

    it('has canonical URL', () => {
      expect(investSrc).toContain('canonical')
      expect(investSrc).toContain('https://quartermint.com/invest')
    })

    it('configures Twitter card', () => {
      expect(investSrc).toContain("card: 'summary_large_image'")
    })
  })

  describe('privacy page metadata', () => {
    const privacySrc = readFileSync(
      join(process.cwd(), 'app/privacy/page.tsx'),
      'utf-8'
    )

    it('has canonical URL', () => {
      expect(privacySrc).toContain('canonical')
      expect(privacySrc).toContain('https://quartermint.com/privacy')
    })

    it('configures Twitter card', () => {
      expect(privacySrc).toContain("card: 'summary_large_image'")
    })
  })
})
