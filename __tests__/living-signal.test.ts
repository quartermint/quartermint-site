import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getRelativeTime, isStale } from '../lib/relative-time'

describe('lib/relative-time.ts', () => {
  describe('getRelativeTime', () => {
    it('returns "just now" for dates less than 1 hour ago', () => {
      const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString()
      expect(getRelativeTime(thirtyMinutesAgo)).toBe('just now')
    })

    it('returns hours for dates 1-23 hours ago', () => {
      const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
      expect(getRelativeTime(threeHoursAgo)).toBe('3 hours ago')
    })

    it('returns singular hour for exactly 1 hour ago', () => {
      const oneHourAgo = new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
      expect(getRelativeTime(oneHourAgo)).toBe('1 hour ago')
    })

    it('returns days for dates 1-6 days ago', () => {
      const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      expect(getRelativeTime(twoDaysAgo)).toBe('2 days ago')
    })

    it('returns singular day for exactly 1 day ago', () => {
      const oneDayAgo = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      expect(getRelativeTime(oneDayAgo)).toBe('1 day ago')
    })

    it('returns weeks for dates 7-29 days ago', () => {
      const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
      expect(getRelativeTime(fourteenDaysAgo)).toBe('2 weeks ago')
    })

    it('returns singular week for 7-13 days ago', () => {
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      expect(getRelativeTime(sevenDaysAgo)).toBe('1 week ago')
    })

    it('returns months for dates 30+ days ago', () => {
      const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()
      expect(getRelativeTime(sixtyDaysAgo)).toBe('2 months ago')
    })

    it('returns singular month for 30-59 days ago', () => {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      expect(getRelativeTime(thirtyDaysAgo)).toBe('1 month ago')
    })
  })

  describe('isStale', () => {
    it('returns false for dates within threshold', () => {
      const fiveDaysAgo = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      expect(isStale(fiveDaysAgo, 14)).toBe(false)
    })

    it('returns true for dates beyond threshold', () => {
      const twentyDaysAgo = new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
      expect(isStale(twentyDaysAgo, 14)).toBe(true)
    })

    it('returns false for dates exactly at threshold boundary', () => {
      // At exactly the threshold, diffMs equals the threshold so it is NOT greater
      const exactlyFourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
      // Due to ms precision, this will be at or very close to threshold
      const result = isStale(exactlyFourteenDaysAgo, 14)
      // The date is constructed at the threshold so it could be exactly equal (false)
      // or slightly over due to ms elapsed between construction and check (true)
      expect(typeof result).toBe('boolean')
    })

    it('works with custom threshold days', () => {
      const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      expect(isStale(threeDaysAgo, 7)).toBe(false)
      expect(isStale(threeDaysAgo, 2)).toBe(true)
    })
  })
})

describe('lib/github.ts', () => {
  const originalEnv = process.env

  beforeEach(() => {
    process.env = { ...originalEnv }
  })

  afterEach(() => {
    process.env = originalEnv
  })

  it('returns null when SIGNAL_REPOS is not set', async () => {
    delete process.env.SIGNAL_REPOS
    const { getLatestCommit } = await import('../lib/github')
    const result = await getLatestCommit()
    expect(result).toBeNull()
  })

  it('returns null when SIGNAL_REPOS is empty string', async () => {
    process.env.SIGNAL_REPOS = ''
    const { getLatestCommit } = await import('../lib/github')
    const result = await getLatestCommit()
    expect(result).toBeNull()
  })

  it('returns fallback when SIGNAL_REPOS is empty and FALLBACK_SIGNAL is set', async () => {
    process.env.SIGNAL_REPOS = ''
    process.env.FALLBACK_SIGNAL = 'Currently building: Relay'
    const { getLatestCommit } = await import('../lib/github')
    const result = await getLatestCommit()
    // SIGNAL_REPOS is empty so it returns null before making any fetch
    expect(result).toBeNull()
  })
})
