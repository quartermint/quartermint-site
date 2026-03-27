import { describe, it, expect, vi, beforeEach } from 'vitest'

const { mockLimit } = vi.hoisted(() => ({
  mockLimit: vi.fn(),
}))

// Mock @upstash/redis before any imports that use it
vi.mock('@upstash/redis', () => ({
  Redis: {
    fromEnv: () => ({}),
  },
}))

// Mock @upstash/ratelimit with controllable limit behavior
vi.mock('@upstash/ratelimit', () => ({
  Ratelimit: Object.assign(
    class {
      limit = mockLimit
    },
    {
      slidingWindow: () => ({}),
    }
  ),
}))

import { checkAllRateLimits } from '@/lib/chat/rate-limit'

/** Create a mock cookie store with configurable qm_chat_count value */
function mockCookieStore(countValue?: string) {
  return {
    get: vi.fn((name: string) => {
      if (name === 'qm_chat_count' && countValue !== undefined) {
        return { value: countValue }
      }
      return undefined
    }),
    set: vi.fn(),
    getAll: vi.fn(() => []),
    has: vi.fn(),
    delete: vi.fn(),
  } as unknown as Awaited<ReturnType<typeof import('next/headers').cookies>>
}

describe('Rate Limiting - checkAllRateLimits', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('allows request when cookie count is 0 and IP limit succeeds', async () => {
    mockLimit.mockResolvedValue({ success: true, remaining: 59 })
    const store = mockCookieStore()

    const result = await checkAllRateLimits('1.2.3.4', store)

    expect(result.allowed).toBe(true)
    expect(result.newCount).toBe(1)
    expect(result.statusCode).toBe(200)
    expect(mockLimit).toHaveBeenCalledWith('1.2.3.4')
  })

  it('denies request when cookie count >= 20 (Layer 1)', async () => {
    const store = mockCookieStore('20')

    const result = await checkAllRateLimits('1.2.3.4', store)

    expect(result.allowed).toBe(false)
    expect(result.statusCode).toBe(429)
    expect(result.type).toBe('rate_limit')
    // IP limiter should NOT be called when cookie check short-circuits
    expect(mockLimit).not.toHaveBeenCalled()
  })

  it('denies request when IP limit exceeded (Layer 2)', async () => {
    mockLimit.mockResolvedValue({ success: false, remaining: 0 })
    const store = mockCookieStore('5')

    const result = await checkAllRateLimits('1.2.3.4', store)

    expect(result.allowed).toBe(false)
    expect(result.statusCode).toBe(429)
    expect(result.type).toBe('rate_limit')
    expect(mockLimit).toHaveBeenCalledWith('1.2.3.4')
  })

  it('fails closed when Redis is unreachable (D-09)', async () => {
    mockLimit.mockRejectedValue(new Error('ECONNREFUSED'))
    const store = mockCookieStore('5')

    const result = await checkAllRateLimits('1.2.3.4', store)

    expect(result.allowed).toBe(false)
    expect(result.statusCode).toBe(503)
    expect(result.type).toBe('unavailable')
    expect(result.message).toContain('ryan@quartermint.com')
  })

  it('increments count on success', async () => {
    mockLimit.mockResolvedValue({ success: true, remaining: 50 })
    const store = mockCookieStore('10')

    const result = await checkAllRateLimits('1.2.3.4', store)

    expect(result.allowed).toBe(true)
    expect(result.newCount).toBe(11)
  })

  it('all results include type field matching ChatErrorType', async () => {
    const validTypes = ['rate_limit', 'error', 'unavailable']

    // Allowed case
    mockLimit.mockResolvedValue({ success: true, remaining: 59 })
    const allowedResult = await checkAllRateLimits('1.2.3.4', mockCookieStore())
    expect(validTypes).toContain(allowedResult.type)

    // Cookie denied case
    const cookieDenied = await checkAllRateLimits('1.2.3.4', mockCookieStore('20'))
    expect(validTypes).toContain(cookieDenied.type)

    // IP denied case
    mockLimit.mockResolvedValue({ success: false, remaining: 0 })
    const ipDenied = await checkAllRateLimits('1.2.3.4', mockCookieStore('5'))
    expect(validTypes).toContain(ipDenied.type)

    // Redis error case
    mockLimit.mockRejectedValue(new Error('ECONNREFUSED'))
    const redisError = await checkAllRateLimits('1.2.3.4', mockCookieStore('5'))
    expect(validTypes).toContain(redisError.type)
  })
})
