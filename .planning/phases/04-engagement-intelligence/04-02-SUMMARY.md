---
phase: 04-engagement-intelligence
plan: 02
subsystem: returning-visitor-detection
tags: [visitor-state, topic-extraction, personalization, redis, proxy, cookie]
dependency_graph:
  requires: [03-chat-system]
  provides: [visitor-state-crud, topic-extraction, returning-visitor-greeting, rv-cookie-issuance]
  affects: [chat-interface, starter-chips, system-prompt, chat-api-route]
tech_stack:
  added: []
  patterns: [fire-and-forget-background-task, cookie-based-session-tracking, tiered-personalization, vi-hoisted-mock-pattern]
key_files:
  created:
    - lib/chat/visitor.ts
    - lib/chat/topic-extract.ts
    - app/api/visitor/route.ts
    - proxy.ts
    - components/chat/returning-visitor-greeting.tsx
    - __tests__/chat/visitor-state.test.ts
    - __tests__/chat/returning-visitor.test.ts
  modified:
    - lib/chat/types.ts
    - app/api/chat/route.ts
    - components/chat/chat-interface.tsx
    - components/chat/starter-chips.tsx
    - lib/chat/system-prompt.ts
decisions:
  - maxOutputTokens (not maxTokens) for AI SDK v6 generateText
  - buildSystemPrompt accepts optional scrollContext parameter for section injection
  - StarterChips accepts optional chips prop for dynamic chip priority cascade
metrics:
  duration: 6min
  completed: "2026-03-27T19:43:34Z"
---

# Phase 04 Plan 02: Returning Visitor Detection Summary

Visitor state CRUD with Upstash Redis, background topic extraction via claude-haiku-4-5, tier-based personalized greetings, and rv cookie issuance via proxy.ts middleware.

## What Was Built

### Task 1: Visitor State CRUD, Topic Extraction, Visitor API, Proxy

Created the full returning visitor infrastructure:

- **`lib/chat/types.ts`** -- Added `VisitorState` interface (lastVisit, topics, sectionsViewed, messageCount) and `VisitorTier` type
- **`lib/chat/visitor.ts`** -- CRUD operations for `visitor:{id}` Redis keys with 90-day TTL. `getVisitorState` returns null on KV failure (D-06). `upsertVisitorState` deduplicates sectionsViewed via Set. `getVisitorTier` classifies into recent/moderate/stale/new tiers.
- **`lib/chat/topic-extract.ts`** -- Fire-and-forget background topic extraction using `generateText` with `claude-haiku-4-5`. Stores topics FIFO (max 5) in visitor state.
- **`app/api/visitor/route.ts`** -- GET endpoint reads rv cookie, looks up Redis, returns tier + topics + lastVisit. Returns `{ tier: 'new', topics: [], lastVisit: null }` on missing cookie or error.
- **`proxy.ts`** -- Next.js 16 middleware issuing `rv` HttpOnly cookie with `crypto.randomUUID()` on first visit. SameSite=Strict, Secure in production, 90-day maxAge, path `/`.

**Commit:** `59167fe`

### Task 2: Wire Greeting Component, Trigger Topic Extraction, Scroll Context

Integrated visitor detection into the chat UI and API:

- **`components/chat/returning-visitor-greeting.tsx`** -- Client component fetching `/api/visitor` on mount. Recent tier shows "Welcome back. You were asking about {topic} last time." with custom chips. Moderate tier shows "Good to see you again." Stale/new/error renders nothing. Fade-in animation with reduced-motion support. `role="status"` + `aria-live="polite"` for screen readers.
- **`components/chat/chat-interface.tsx`** -- Added `ReturningVisitorGreeting` above `StarterChips` in idle state. `returningVisitorChips` state feeds into chip priority cascade via `onChipsReady` callback.
- **`components/chat/starter-chips.tsx`** -- Added optional `chips` prop. Falls back to `STARTER_QUESTIONS` when no dynamic chips provided.
- **`app/api/chat/route.ts`** -- Reads `rv` cookie. In `onFinish`: updates visitor lastVisit/sectionsViewed via `upsertVisitorState`, triggers `extractAndStoreTopic` when >= 2 user messages (fire-and-forget). Parses `scrollContext` from request body.
- **`lib/chat/system-prompt.ts`** -- Accepts optional `scrollContext` parameter, injects `[CURRENT SECTION]` block into system prompt when provided.

**Commit:** `c06310b`

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed maxTokens -> maxOutputTokens in topic-extract.ts**
- **Found during:** Task 2 (TypeScript type check)
- **Issue:** Plan specified `maxTokens: 20` in generateText call, but AI SDK v6 uses `maxOutputTokens` for this parameter. TypeScript caught the error.
- **Fix:** Changed `maxTokens` to `maxOutputTokens` in topic-extract.ts and updated corresponding test assertion.
- **Files modified:** lib/chat/topic-extract.ts, __tests__/chat/visitor-state.test.ts
- **Commit:** c06310b (included in Task 2 commit)

## Decisions Made

| Decision | Rationale |
|----------|-----------|
| `maxOutputTokens` over `maxTokens` | AI SDK v6 renamed the parameter. Plan referenced the old name. TypeScript caught it. |
| `buildSystemPrompt(scrollContext?)` | Added optional parameter to existing function rather than creating a new function. Maintains backward compatibility (existing callers pass no args). |
| `chips` prop on StarterChips | Optional prop with fallback to existing `STARTER_QUESTIONS`. Non-breaking change for existing usage. |

## Test Results

- **New tests:** 48 (25 visitor-state + 23 returning-visitor)
- **Total suite:** 241 tests across 20 files, all passing
- **TypeScript:** `tsc --noEmit` passes with zero errors

## Known Stubs

None. All features are fully wired with real data sources (Upstash Redis via lib/chat/redis.ts).

## Self-Check: PASSED

All 12 files verified present. Both commits (59167fe, c06310b) verified in git log. 241 tests passing. TypeScript clean.
