---
phase: 03-chat-system
plan: 02
subsystem: chat
tags: [ai-sdk-v6, streaming-chat, api-route, rate-limiting-tests, system-prompt-tests, vitest]

# Dependency graph
requires:
  - phase: 03-chat-system
    plan: 01
    provides: "Chat backend libraries (types, redis, rate-limit, conversation-log, system-prompt)"
provides:
  - "Streaming chat POST endpoint at /api/chat with AI SDK v6 patterns"
  - "19 unit/structural tests across rate limiting, system prompt, and API route"
  - "Fail-closed rate limiting test coverage (D-09)"
  - "System prompt content verification (all 13 systems, word budget, deflection rules)"
affects: [03-03-chat-ui, 03-04-integration, 04-interactions]

# Tech tracking
tech-stack:
  added: []
  patterns: ["AI SDK v6 streamText + toUIMessageStreamResponse() route handler", "convertToModelMessages() async conversion", "Structured ChatErrorResponse with type field for client-side state distinction", "vi.hoisted() pattern for mocking module-level Ratelimit constructor"]

key-files:
  created: [app/api/chat/route.ts, __tests__/chat/rate-limit.test.ts, __tests__/chat/system-prompt.test.ts, __tests__/chat/api-route.test.ts]
  modified: []

key-decisions:
  - "Single route handler (no middleware composition) for chat endpoint; rate limiting inline before streamText call"
  - "Structural/pattern tests for API route (file content verification) rather than full integration tests with mocked Anthropic; runtime verification deferred to Plan 03-04 checkpoint"
  - "vi.hoisted() for mockLimit to solve vitest factory hoisting with module-level Ratelimit constructor"

patterns-established:
  - "AI SDK v6 route handler: streamText -> toUIMessageStreamResponse() (NOT toDataStreamResponse)"
  - "Next.js 16 async APIs: await cookies(), await headers() in route handlers"
  - "vi.hoisted() for mocking module-level singletons in vitest"

requirements-completed: [CHAT-01, CHAT-03, ENG-01]

# Metrics
duration: 4min
completed: 2026-03-27
---

# Phase 03 Plan 02: Chat API Route and Backend Tests Summary

**Streaming chat API route using AI SDK v6 with 19 tests covering three-tier rate limiting (including fail-closed D-09), system prompt content validation, and v6 pattern verification**

## Performance

- **Duration:** 4 min
- **Started:** 2026-03-27T18:33:12Z
- **Completed:** 2026-03-27T18:37:14Z
- **Tasks:** 2
- **Files created:** 4

## Accomplishments

- Created streaming chat POST endpoint at `/api/chat` using AI SDK v6 `streamText` with `toUIMessageStreamResponse()`
- Wires rate limiting, system prompt, conversation logging, and error handling into single route handler
- 6 rate limiting tests: cookie limit (Layer 1), IP limit (Layer 2), fail-closed on Redis error (D-09), count increment, type field validation
- 10 system prompt tests: word count under 1800, AI disclosure language, em dash prohibition, all 13 system names, deflection rules, 500-token cap, response length, honesty rules, contact email
- 3 API route structural tests: POST export, maxDuration=60, v6 pattern verification (toUIMessageStreamResponse, convertToModelMessages, claude-sonnet-4-6, async cookies/headers)
- All 19 tests pass with zero TypeScript errors

## Task Commits

Each task was committed atomically:

1. **Task 1: Create streaming chat API route handler** - `c7e936a` (feat)
2. **Task 2: Create tests for rate limiting, system prompt, and API route** - `2c1ef16` (test)

## Files Created/Modified

- `app/api/chat/route.ts` - Streaming chat POST endpoint with rate limiting, AI SDK v6, conversation logging
- `__tests__/chat/rate-limit.test.ts` - 6 tests for three-tier rate limiting including fail-closed
- `__tests__/chat/system-prompt.test.ts` - 10 tests for prompt content, budget, and completeness
- `__tests__/chat/api-route.test.ts` - 3 structural tests for route exports and v6 patterns

## Decisions Made

- Used single route handler pattern (not middleware composition) for simplicity. Rate limiting check happens inline before the streamText call, which is the recommended pattern for route-specific checks.
- API route tests use file content verification (fs.readFileSync + string assertions) rather than full integration tests with mocked Anthropic API. This verifies correct SDK usage patterns without the complexity of mocking streaming responses. Runtime verification happens in Plan 03-04 checkpoint.
- Used `vi.hoisted()` to solve the vitest factory hoisting problem when mocking `@upstash/ratelimit`. The Ratelimit class is constructed at module level in `rate-limit.ts`, so the mock factory must have access to `mockLimit` before any imports execute.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Fixed vi.mock hoisting issue with mockLimit**
- **Found during:** Task 2
- **Issue:** `vi.mock()` factory for `@upstash/ratelimit` referenced `mockLimit` which was declared after the mock call, causing `ReferenceError: Cannot access 'mockLimit' before initialization`
- **Fix:** Used `vi.hoisted()` to declare `mockLimit` in the hoisted scope so it's available when the mock factory executes
- **Files modified:** `__tests__/chat/rate-limit.test.ts`
- **Commit:** `2c1ef16`

## Known Stubs

None. The API route is fully implemented with real logic. Tests mock external dependencies (Redis, Ratelimit) as expected for unit tests.

## Issues Encountered

None beyond the vi.hoisted() fix documented above.

## Next Plan Readiness

- API route at `/api/chat` is ready for consumption by Plan 03 (chat UI components using `useChat` with `api: '/api/chat'`)
- All backend modules are tested: rate limiting, system prompt, and API route
- Runtime integration testing (actual streaming, Anthropic API) deferred to Plan 04 checkpoint

## Self-Check: PASSED

All 4 created files verified on disk. Both task commits (c7e936a, 2c1ef16) found in git history. Summary file exists.

---
*Phase: 03-chat-system*
*Completed: 2026-03-27*
