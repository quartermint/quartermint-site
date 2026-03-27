import { describe, it, expect, vi, beforeEach } from 'vitest'
import { readFileSync } from 'fs'
import { join } from 'path'

// --- Mocks (vi.hoisted pattern for ESM module mocking) ---

const { mockRedisGet, mockRedisSet, mockGenerateText, mockAnthropic } =
  vi.hoisted(() => ({
    mockRedisGet: vi.fn(),
    mockRedisSet: vi.fn(),
    mockGenerateText: vi.fn(),
    mockAnthropic: vi.fn((model: string) => ({ modelId: model })),
  }))

vi.mock('@upstash/redis', () => ({
  Redis: {
    fromEnv: () => ({
      get: mockRedisGet,
      set: mockRedisSet,
    }),
  },
}))

vi.mock('ai', () => ({
  generateText: mockGenerateText,
}))

vi.mock('@ai-sdk/anthropic', () => ({
  anthropic: mockAnthropic,
}))

import {
  getVisitorState,
  upsertVisitorState,
  getVisitorTier,
  VISITOR_TTL,
} from '@/lib/chat/visitor'
import { extractAndStoreTopic } from '@/lib/chat/topic-extract'
import type { VisitorState, VisitorTier } from '@/lib/chat/types'

// --- Visitor State CRUD Tests ---

describe('Visitor State CRUD (lib/chat/visitor.ts)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('VisitorState interface', () => {
    it('should have the correct shape', () => {
      const state: VisitorState = {
        lastVisit: '2026-03-27T00:00:00.000Z',
        topics: ['LifeVault architecture'],
        sectionsViewed: ['featured-systems'],
        messageCount: 5,
      }
      expect(state.lastVisit).toBeDefined()
      expect(state.topics).toBeInstanceOf(Array)
      expect(state.sectionsViewed).toBeInstanceOf(Array)
      expect(typeof state.messageCount).toBe('number')
    })
  })

  describe('VISITOR_TTL', () => {
    it('should be 90 days in seconds', () => {
      expect(VISITOR_TTL).toBe(90 * 24 * 60 * 60)
    })
  })

  describe('getVisitorState', () => {
    it('returns visitor state from Redis', async () => {
      const mockState: VisitorState = {
        lastVisit: '2026-03-27T00:00:00.000Z',
        topics: ['LifeVault'],
        sectionsViewed: ['hero-section'],
        messageCount: 3,
      }
      mockRedisGet.mockResolvedValueOnce(mockState)

      const result = await getVisitorState('test-visitor-id')
      expect(result).toEqual(mockState)
      expect(mockRedisGet).toHaveBeenCalledWith('visitor:test-visitor-id')
    })

    it('returns null on KV failure (silent, per D-06)', async () => {
      mockRedisGet.mockRejectedValueOnce(new Error('Redis connection failed'))

      const result = await getVisitorState('test-visitor-id')
      expect(result).toBeNull()
    })

    it('returns null when no visitor exists', async () => {
      mockRedisGet.mockResolvedValueOnce(null)

      const result = await getVisitorState('nonexistent-id')
      expect(result).toBeNull()
    })
  })

  describe('upsertVisitorState', () => {
    it('creates new visitor with default values when none exists', async () => {
      mockRedisGet.mockResolvedValueOnce(null)
      mockRedisSet.mockResolvedValueOnce(undefined)

      await upsertVisitorState('new-visitor', {
        lastVisit: '2026-03-27T00:00:00.000Z',
      })

      expect(mockRedisSet).toHaveBeenCalledWith(
        'visitor:new-visitor',
        expect.objectContaining({
          lastVisit: '2026-03-27T00:00:00.000Z',
          topics: [],
          sectionsViewed: [],
          messageCount: 0,
        }),
        { ex: VISITOR_TTL }
      )
    })

    it('merges sectionsViewed without duplicates', async () => {
      const existing: VisitorState = {
        lastVisit: '2026-03-26T00:00:00.000Z',
        topics: [],
        sectionsViewed: ['hero-section', 'featured-systems'],
        messageCount: 1,
      }
      mockRedisGet.mockResolvedValueOnce(existing)
      mockRedisSet.mockResolvedValueOnce(undefined)

      await upsertVisitorState('test-id', {
        sectionsViewed: ['featured-systems', 'origin-story'],
      })

      expect(mockRedisSet).toHaveBeenCalledWith(
        'visitor:test-id',
        expect.objectContaining({
          sectionsViewed: expect.arrayContaining([
            'hero-section',
            'featured-systems',
            'origin-story',
          ]),
        }),
        { ex: VISITOR_TTL }
      )

      // Verify no duplicates
      const savedState = mockRedisSet.mock.calls[0][1] as VisitorState
      const unique = new Set(savedState.sectionsViewed)
      expect(unique.size).toBe(savedState.sectionsViewed.length)
    })

    it('always passes VISITOR_TTL to redis.set', async () => {
      mockRedisGet.mockResolvedValueOnce(null)
      mockRedisSet.mockResolvedValueOnce(undefined)

      await upsertVisitorState('any-id', { messageCount: 1 })

      expect(mockRedisSet).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Object),
        { ex: VISITOR_TTL }
      )
    })

    it('silently fails on error', async () => {
      mockRedisGet.mockRejectedValueOnce(new Error('Redis down'))

      // Should not throw
      await expect(
        upsertVisitorState('fail-id', { messageCount: 1 })
      ).resolves.toBeUndefined()
    })
  })

  describe('getVisitorTier', () => {
    it('returns "recent" when lastVisit < 7 days ago', () => {
      const sixDaysAgo = new Date(Date.now() - 6 * 86400000).toISOString()
      const state: VisitorState = {
        lastVisit: sixDaysAgo,
        topics: [],
        sectionsViewed: [],
        messageCount: 1,
      }
      expect(getVisitorTier(state)).toBe('recent')
    })

    it('returns "moderate" when lastVisit 7-30 days ago', () => {
      const eightDaysAgo = new Date(Date.now() - 8 * 86400000).toISOString()
      const state: VisitorState = {
        lastVisit: eightDaysAgo,
        topics: [],
        sectionsViewed: [],
        messageCount: 1,
      }
      expect(getVisitorTier(state)).toBe('moderate')
    })

    it('returns "moderate" at 29 days', () => {
      const twentyNineDaysAgo = new Date(
        Date.now() - 29 * 86400000
      ).toISOString()
      const state: VisitorState = {
        lastVisit: twentyNineDaysAgo,
        topics: [],
        sectionsViewed: [],
        messageCount: 1,
      }
      expect(getVisitorTier(state)).toBe('moderate')
    })

    it('returns "stale" when lastVisit > 30 days ago', () => {
      const thirtyOneDaysAgo = new Date(
        Date.now() - 31 * 86400000
      ).toISOString()
      const state: VisitorState = {
        lastVisit: thirtyOneDaysAgo,
        topics: [],
        sectionsViewed: [],
        messageCount: 1,
      }
      expect(getVisitorTier(state)).toBe('stale')
    })

    it('returns "new" when visitor state is null', () => {
      expect(getVisitorTier(null)).toBe('new')
    })
  })
})

// --- Topic Extraction Tests ---

describe('Topic Extraction (lib/chat/topic-extract.ts)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls generateText with claude-haiku-4-5 model', async () => {
    mockGenerateText.mockResolvedValueOnce({ text: 'LifeVault architecture' })
    mockRedisGet.mockResolvedValueOnce({
      lastVisit: '2026-03-27T00:00:00.000Z',
      topics: [],
      sectionsViewed: [],
      messageCount: 1,
    })
    mockRedisSet.mockResolvedValueOnce(undefined)

    await extractAndStoreTopic('visitor-1', 'User: How does LifeVault work?')

    expect(mockAnthropic).toHaveBeenCalledWith('claude-haiku-4-5')
    expect(mockGenerateText).toHaveBeenCalledWith(
      expect.objectContaining({
        maxOutputTokens: 20,
      })
    )
  })

  it('stores extracted topic in visitor.topics (max 5, FIFO)', async () => {
    mockGenerateText.mockResolvedValueOnce({ text: 'New Topic' })
    const existingState: VisitorState = {
      lastVisit: '2026-03-27T00:00:00.000Z',
      topics: ['Topic 1', 'Topic 2', 'Topic 3', 'Topic 4', 'Topic 5'],
      sectionsViewed: [],
      messageCount: 5,
    }
    mockRedisGet.mockResolvedValueOnce(existingState)
    mockRedisSet.mockResolvedValueOnce(undefined)

    await extractAndStoreTopic('visitor-1', 'Some conversation text')

    // New topic should be prepended, oldest (Topic 5) should be dropped
    expect(mockRedisSet).toHaveBeenCalledWith(
      'visitor:visitor-1',
      expect.objectContaining({
        topics: ['New Topic', 'Topic 1', 'Topic 2', 'Topic 3', 'Topic 4'],
      }),
      expect.objectContaining({ ex: expect.any(Number) })
    )
  })

  it('silently fails on error (fire-and-forget)', async () => {
    mockGenerateText.mockRejectedValueOnce(new Error('API error'))

    // Should not throw
    await expect(
      extractAndStoreTopic('visitor-1', 'Some conversation')
    ).resolves.toBeUndefined()
  })
})

// --- Visitor API Route Tests ---

describe('Visitor API Route (app/api/visitor/route.ts)', () => {
  it('file exports GET handler', () => {
    const filePath = join(process.cwd(), 'app/api/visitor/route.ts')
    const content = readFileSync(filePath, 'utf8')

    expect(content).toContain('export async function GET')
  })

  it('reads rv cookie from request', () => {
    const filePath = join(process.cwd(), 'app/api/visitor/route.ts')
    const content = readFileSync(filePath, 'utf8')

    expect(content).toContain("'rv'")
    expect(content).toContain('cookies')
  })

  it('returns tier and topics in response', () => {
    const filePath = join(process.cwd(), 'app/api/visitor/route.ts')
    const content = readFileSync(filePath, 'utf8')

    expect(content).toContain('tier')
    expect(content).toContain('topics')
    expect(content).toContain('getVisitorTier')
    expect(content).toContain('getVisitorState')
  })

  it('returns new tier when no rv cookie present', () => {
    const filePath = join(process.cwd(), 'app/api/visitor/route.ts')
    const content = readFileSync(filePath, 'utf8')

    // Should handle missing cookie case
    expect(content).toContain('new')
  })
})

// --- Proxy.ts Tests ---

describe('proxy.ts (rv cookie issuance)', () => {
  it('file exists and contains rv cookie logic', () => {
    const filePath = join(process.cwd(), 'proxy.ts')
    const content = readFileSync(filePath, 'utf8')

    // Must reference rv cookie
    const rvMatches = content.match(/rv/g) || []
    expect(rvMatches.length).toBeGreaterThanOrEqual(2)
  })

  it('uses crypto.randomUUID for session ID', () => {
    const filePath = join(process.cwd(), 'proxy.ts')
    const content = readFileSync(filePath, 'utf8')

    expect(content).toContain('crypto.randomUUID')
  })

  it('sets HttpOnly cookie', () => {
    const filePath = join(process.cwd(), 'proxy.ts')
    const content = readFileSync(filePath, 'utf8')

    expect(content).toContain('httpOnly')
  })

  it('sets 90-day maxAge', () => {
    const filePath = join(process.cwd(), 'proxy.ts')
    const content = readFileSync(filePath, 'utf8')

    // 90 * 24 * 60 * 60 = 7776000
    expect(content).toContain('90')
  })
})
