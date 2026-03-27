---
phase: 03-chat-system
plan: 01
subsystem: chat
tags: [ai-sdk-v6, anthropic, upstash-redis, rate-limiting, system-prompt, streaming-chat]

# Dependency graph
requires:
  - phase: 01-scaffold
    provides: "Next.js 16 project scaffold, lib/systems.ts data source"
provides:
  - "Chat TypeScript interfaces (ChatLog, RateLimitResult, ChatErrorType)"
  - "Shared Upstash Redis client (Redis.fromEnv())"
  - "Three-tier rate limiting (cookie 20/session + IP 60/hr + fail-closed)"
  - "Conversation logging to Upstash Redis (chat:{sessionId} key prefix)"
  - "Curated 884-word persona system prompt with all 13 systems"
  - "AI SDK v6, @ai-sdk/anthropic, @ai-sdk/react, react-markdown, remark-gfm packages"
affects: [03-02-api-route, 03-03-chat-ui, 04-interactions, 05-email-digest]

# Tech tracking
tech-stack:
  added: [ai@^6.0.141, "@ai-sdk/anthropic@^3.0.64", "@ai-sdk/react@^3.0.143", "@upstash/redis@^1.37.0", "@upstash/ratelimit@^2.0.8", "react-markdown@^10.1.0", "remark-gfm@^4.0.1"]
  patterns: ["Upstash Redis shared client via fromEnv()", "Three-tier rate limiting (cookie + IP + fail-closed)", "Deploy-time system prompt from curated identityvault data", "AI SDK v6 UIMessage parts array pattern"]

key-files:
  created: [lib/chat/types.ts, lib/chat/redis.ts, lib/chat/rate-limit.ts, lib/chat/conversation-log.ts, lib/chat/system-prompt.ts]
  modified: [package.json, package-lock.json]

key-decisions:
  - "Hardcoded curated system prompt string (884 words) rather than build-time file reading from identityvault"
  - "All 13 systems included in prompt (not just featured 4) for comprehensive coverage"
  - "Rate limit type field set to 'error' placeholder when allowed=true (not used in allowed path)"

patterns-established:
  - "lib/chat/ module pattern: types -> redis client -> consumers (rate-limit, conversation-log, system-prompt)"
  - "Fail-closed rate limiting: Redis errors return 503 with mailto CTA"
  - "Cookie-based UX rate limit (qm_chat_count, 20 messages, 24h expiry)"
  - "Conversation log key prefix: chat:{sessionId} with chat:index for digest"

requirements-completed: [CHAT-02, CHAT-03]

# Metrics
duration: 3min
completed: 2026-03-27
---

# Phase 03 Plan 01: Chat Backend Libraries Summary

**AI SDK v6 + Upstash Redis packages installed with typed chat interfaces, three-tier rate limiting (cookie/IP/fail-closed), conversation logging, and 884-word curated persona system prompt**

## Performance

- **Duration:** 3 min
- **Started:** 2026-03-27T18:26:42Z
- **Completed:** 2026-03-27T18:30:18Z
- **Tasks:** 2
- **Files modified:** 7

## Accomplishments
- Installed all 7 Phase 3 npm dependencies (ai, @ai-sdk/anthropic, @ai-sdk/react, @upstash/redis, @upstash/ratelimit, react-markdown, remark-gfm)
- Created 5 lib/chat/ modules with full TypeScript types, zero compilation errors
- Built three-tier rate limiting: cookie (20/session), IP (60/hr sliding window), fail-closed (503 on Redis error)
- Curated 884-word persona system prompt from identityvault data with all 13 systems, FAQ pairs, deflection rules, and AI disclosure

## Task Commits

Each task was committed atomically:

1. **Task 1: Install dependencies and create chat types + Redis client** - `119bf6d` (feat)
2. **Task 2: Build rate limiting, conversation logging, and system prompt modules** - `c6fe8ad` (feat)

## Files Created/Modified
- `package.json` - Added 7 Phase 3 dependencies
- `package-lock.json` - Lock file updated (509 packages added)
- `lib/chat/types.ts` - ChatErrorType, ChatErrorResponse, RateLimitResult, ChatLog, ChatLogMessage, CALENDAR_BOOKING_URL, RYAN_EMAIL
- `lib/chat/redis.ts` - Shared Upstash Redis client (Redis.fromEnv())
- `lib/chat/rate-limit.ts` - checkAllRateLimits() with cookie + IP + fail-closed layers
- `lib/chat/conversation-log.ts` - logConversation() with chat:{sessionId} Redis storage
- `lib/chat/system-prompt.ts` - buildSystemPrompt() and SYSTEM_PROMPT constant

## Decisions Made
- Hardcoded curated prompt string (884 words) rather than build-time identityvault file reading. Simpler, faster to iterate, no build dependency on sibling directory. The identityvault is the SOURCE; the prompt is CURATED OUTPUT.
- Included all 13 systems in the prompt (not just the 4 featured ones). Comprehensive coverage costs ~100 words but lets the AI proxy answer questions about any system.
- Used `type: 'error'` as placeholder in the allowed=true return path. This field is only consumed when allowed=false, so the value is irrelevant in success cases.

## Deviations from Plan

None. Plan executed exactly as written.

## Known Stubs

None. All modules are fully implemented with real logic.

## User Setup Required

**External services require manual configuration before chat functions at runtime.**

- **Upstash Redis:** Add via Vercel Marketplace (Vercel Dashboard -> Storage -> Add -> Upstash Redis). Auto-populates UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN.
- **Anthropic API Key:** Add ANTHROPIC_API_KEY as Vercel environment variable (reuse existing key from Stripped deployment).
- **Budget Alert:** Configure $50/month billing alert on Anthropic Console (Settings -> Billing -> Usage Limits).

## Issues Encountered

None.

## Next Phase Readiness
- All lib/chat/ modules ready for consumption by Plan 02 (API route handler) and Plan 03 (chat UI components)
- Rate limiting, conversation logging, and system prompt are importable with concrete types
- Upstash Redis provisioning and ANTHROPIC_API_KEY must be configured before runtime testing

## Self-Check: PASSED

All 5 created files verified on disk. Both task commits (119bf6d, c6fe8ad) found in git history. Summary file exists.

---
*Phase: 03-chat-system*
*Completed: 2026-03-27*
