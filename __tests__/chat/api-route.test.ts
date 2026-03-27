import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'

describe('Chat API Route', () => {
  it('exports POST function', async () => {
    const routeModule = await import('@/app/api/chat/route')
    expect(typeof routeModule.POST).toBe('function')
  })

  it('exports maxDuration of 60', async () => {
    const routeModule = await import('@/app/api/chat/route')
    expect(routeModule.maxDuration).toBe(60)
  })

  it('route file contains required AI SDK v6 patterns', () => {
    const routePath = path.resolve(__dirname, '../../app/api/chat/route.ts')
    const source = fs.readFileSync(routePath, 'utf8')

    // Must use v6 stream response (NOT v4 toDataStreamResponse)
    expect(source).toContain('toUIMessageStreamResponse')
    expect(source).not.toContain('toDataStreamResponse')

    // Must use convertToModelMessages (v6 message conversion)
    expect(source).toContain('convertToModelMessages')

    // Must use correct model per D-01
    expect(source).toContain('claude-sonnet-4-6')

    // Must set max output tokens per D-05
    expect(source).toContain('maxOutputTokens')

    // Must await cookies() and headers() per Next.js 16 async APIs
    expect(source).toContain('await cookies()')
    expect(source).toContain('await headers()')

    // Must import and use rate limiting
    expect(source).toContain('checkAllRateLimits')

    // Must import and use conversation logging
    expect(source).toContain('logConversation')

    // Must import and use system prompt
    expect(source).toContain('buildSystemPrompt')

    // Error responses must include type field
    expect(source).toContain('type:')
  })
})
