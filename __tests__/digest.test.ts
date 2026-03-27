import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { join } from 'path'
import { getISOWeekKeyForDate } from '../lib/digest/week-key'

describe('Weekly digest system (OPS-01)', () => {
  // Week key utility tests
  describe('week-key utility', () => {
    it('returns format matching YYYY-WNN', () => {
      const result = getISOWeekKeyForDate(new Date('2026-01-05'))
      expect(result).toMatch(/^\d{4}-W\d{2}$/)
    })

    it('returns correct ISO week for 2026-01-05 (Monday of week 1)', () => {
      // Jan 1 2026 is Thursday, so Jan 5 (Monday) is still ISO week 1
      const result = getISOWeekKeyForDate(new Date('2026-01-05'))
      expect(result).toBe('2026-W01')
    })

    it('returns correct ISO week for 2026-03-27 (week 13)', () => {
      const result = getISOWeekKeyForDate(new Date('2026-03-27'))
      expect(result).toBe('2026-W13')
    })

    it('handles year boundary (2025-12-31 is in week 1 of 2026)', () => {
      const result = getISOWeekKeyForDate(new Date('2025-12-31'))
      expect(result).toBe('2026-W01')
    })
  })

  // Digest cron route file checks
  describe('cron route (app/api/cron/digest/route.ts)', () => {
    const routeSrc = readFileSync(
      join(process.cwd(), 'app/api/cron/digest/route.ts'),
      'utf-8'
    )

    it('contains CRON_SECRET Bearer auth check', () => {
      expect(routeSrc).toContain('Bearer ${process.env.CRON_SECRET}')
    })

    it('returns 401 for unauthorized requests', () => {
      expect(routeSrc).toContain('status: 401')
    })

    it('imports aggregateWeeklyStats', () => {
      expect(routeSrc).toContain('aggregateWeeklyStats')
    })

    it('imports WeeklyDigestEmail', () => {
      expect(routeSrc).toContain('WeeklyDigestEmail')
    })

    it('sends from chat@quartermint.com', () => {
      expect(routeSrc).toContain('chat@quartermint.com')
    })

    it('sends to ryan@quartermint.com', () => {
      expect(routeSrc).toContain('ryan@quartermint.com')
    })

    it('exports async GET function', () => {
      expect(routeSrc).toContain('export async function GET(')
    })
  })

  // Digest email template checks
  describe('digest email template (lib/email/digest-template.tsx)', () => {
    const templateSrc = readFileSync(
      join(process.cwd(), 'lib/email/digest-template.tsx'),
      'utf-8'
    )

    it('contains "Sent automatically. Reply to stop." footer (D-01)', () => {
      expect(templateSrc).toContain('Sent automatically. Reply to stop.')
    })

    it('uses system-ui, sans-serif font (D-01)', () => {
      expect(templateSrc).toContain('system-ui, sans-serif')
    })

    it('contains "Top questions" label', () => {
      expect(templateSrc).toContain('Top questions')
    })

    it('exports WeeklyDigestEmail function', () => {
      expect(templateSrc).toContain('export function WeeklyDigestEmail(')
    })
  })

  // Aggregation file checks
  describe('aggregation (lib/digest/aggregate.ts)', () => {
    const aggregateSrc = readFileSync(
      join(process.cwd(), 'lib/digest/aggregate.ts'),
      'utf-8'
    )

    it('uses chat:index (not KEYS scan)', () => {
      expect(aggregateSrc).toContain("'chat:index'")
    })

    it('reads stats:invest_views counter', () => {
      expect(aggregateSrc).toContain('stats:invest_views')
    })

    it('reads stats:export_requests counter', () => {
      expect(aggregateSrc).toContain('stats:export_requests')
    })

    it('exports WeeklyDigestData interface', () => {
      expect(aggregateSrc).toContain('export interface WeeklyDigestData')
    })

    it('exports aggregateWeeklyStats function', () => {
      expect(aggregateSrc).toContain(
        'export async function aggregateWeeklyStats()'
      )
    })

    it('imports from @/lib/chat/redis', () => {
      expect(aggregateSrc).toContain("'@/lib/chat/redis'")
    })

    it('imports from @/lib/chat/types', () => {
      expect(aggregateSrc).toContain("'@/lib/chat/types'")
    })
  })

  // vercel.json cron config
  describe('vercel.json cron configuration', () => {
    const vercelJson = JSON.parse(
      readFileSync(join(process.cwd(), 'vercel.json'), 'utf-8')
    )

    it('is valid JSON with crons array', () => {
      expect(vercelJson.crons).toBeDefined()
      expect(Array.isArray(vercelJson.crons)).toBe(true)
    })

    it('has digest cron at /api/cron/digest', () => {
      const digestCron = vercelJson.crons.find(
        (c: { path: string }) => c.path === '/api/cron/digest'
      )
      expect(digestCron).toBeDefined()
    })

    it('has Monday 9 AM UTC schedule (0 9 * * 1)', () => {
      const digestCron = vercelJson.crons.find(
        (c: { path: string }) => c.path === '/api/cron/digest'
      )
      expect(digestCron.schedule).toBe('0 9 * * 1')
    })
  })

  // Proxy tracking counter check
  describe('proxy.ts /invest tracking', () => {
    const proxySrc = readFileSync(
      join(process.cwd(), 'proxy.ts'),
      'utf-8'
    )

    it('contains stats:invest_views counter', () => {
      expect(proxySrc).toContain('stats:invest_views')
    })

    it('checks for /invest path', () => {
      expect(proxySrc).toContain("request.nextUrl.pathname === '/invest'")
    })

    it('uses fire-and-forget pattern (.catch)', () => {
      expect(proxySrc).toContain('.catch(() => {})')
    })
  })

  // Export route tracking counter check
  describe('export route tracking', () => {
    const exportSrc = readFileSync(
      join(process.cwd(), 'app/api/export/route.ts'),
      'utf-8'
    )

    it('contains stats:export_requests counter', () => {
      expect(exportSrc).toContain('stats:export_requests')
    })

    it('imports getISOWeekKey', () => {
      expect(exportSrc).toContain('getISOWeekKey')
    })
  })
})
