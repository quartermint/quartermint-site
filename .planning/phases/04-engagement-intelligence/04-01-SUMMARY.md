---
phase: 04-engagement-intelligence
plan: 01
subsystem: chat
tags: [intersection-observer, scroll-tracking, react-context, system-prompt, smart-chips]

# Dependency graph
requires:
  - phase: 03-chat-system
    provides: ChatInterface, StarterChips, chat API route, system prompt builder
provides:
  - ScrollContextProvider with IntersectionObserver tracking 6 page sections
  - SECTION_CONTEXT_MAP with labels and 2-chip suggestions per section
  - getScrollChips function returning 3 context-aware starter chips
  - getSectionPromptContext function for system prompt injection
  - Scroll-aware chat API accepting scrollContext in request body
  - Dynamic starter chips in ChatInterface
affects: [04-02, 04-03, 04-04]

# Tech tracking
tech-stack:
  added: []
  patterns: [ScrollContextProvider React Context + IntersectionObserver, section-to-context mapping, request-time prompt injection]

key-files:
  created:
    - components/scroll-context-provider.tsx
    - lib/chat/scroll-context.ts
    - __tests__/chat/scroll-context.test.ts
    - __tests__/chat/smart-chips.test.ts
  modified:
    - app/page.tsx
    - components/chat/chat-interface.tsx
    - components/chat/starter-chips.tsx
    - app/api/chat/route.ts
    - lib/chat/system-prompt.ts
    - __tests__/chat/system-prompt.test.ts

key-decisions:
  - "Single IntersectionObserver at page level via ScrollContextProvider, not per-component observers"
  - "chat-section returns static defaults (no scroll injection when user is already in chat)"
  - "Scroll context appended to system prompt at request time, not baked into deploy-time prompt"

patterns-established:
  - "ScrollContextProvider: React Context wrapping page content with IntersectionObserver at threshold 0.3"
  - "Section-to-context mapping: SECTION_CONTEXT_MAP for both prompt injection and chip suggestions"
  - "Dynamic chip prop pattern: StarterChips accepts optional chips array, falling back to static defaults"

requirements-completed: [ENG-02]

# Metrics
duration: 3min
completed: 2026-03-27
---

# Phase 04 Plan 01: Scroll Context Infrastructure Summary

**ScrollContextProvider tracking 6 page sections via IntersectionObserver, feeding scroll-aware system prompt injection and dynamic starter chips to the chat system**

## Performance

- **Duration:** 3 min
- **Started:** 2026-03-27T19:37:49Z
- **Completed:** 2026-03-27T19:41:17Z
- **Tasks:** 2
- **Files modified:** 10

## Accomplishments
- ScrollContextProvider wraps all page content and tracks which of 6 sections is visible via IntersectionObserver (threshold 0.3)
- Chat API accepts scrollContext in request body and injects a [CURRENT SECTION] block into the system prompt for context-aware responses
- Dynamic starter chips reflect the currently visible section (2 context + 1 default), falling back to static defaults when no context is available
- All 6 page sections now have id props for scroll tracking (hero-section, featured-systems, chat-section, origin-story, systems-shelf, contact-section)

## Task Commits

Each task was committed atomically:

1. **Task 1: Create scroll context infrastructure and section-to-context mappings** - `1c53e67` (test: failing tests), `674de42` (feat: implementation)
2. **Task 2: Wire scroll context into page, chat interface, chat API, and system prompt** - `6222555` (feat)

## Files Created/Modified
- `components/scroll-context-provider.tsx` - React Context + IntersectionObserver tracking current visible section
- `lib/chat/scroll-context.ts` - SECTION_CONTEXT_MAP, getScrollChips, getSectionPromptContext mappings
- `__tests__/chat/scroll-context.test.ts` - 14 unit tests for scroll context mappings and provider exports
- `__tests__/chat/smart-chips.test.ts` - 5 unit tests for dynamic chip logic
- `app/page.tsx` - Added ScrollContextProvider wrapper and id props to all 6 sections
- `components/chat/chat-interface.tsx` - Consumes scroll context, passes to API and dynamic chips
- `components/chat/starter-chips.tsx` - Accepts optional chips prop for dynamic suggestions
- `app/api/chat/route.ts` - Extracts scrollContext from body, passes to buildSystemPrompt
- `lib/chat/system-prompt.ts` - Accepts optional scrollContext, appends section prompt injection
- `__tests__/chat/system-prompt.test.ts` - 5 new tests for scroll context injection

## Decisions Made
- Single IntersectionObserver at page level via ScrollContextProvider rather than per-component observers (anti-pattern from RESEARCH.md)
- chat-section returns static defaults with no prompt injection, since the user is already looking at the chat
- Scroll context appended at request time to the system prompt, keeping the deploy-time base prompt unchanged
- StarterChips uses optional chips prop pattern with fallback to existing STARTER_QUESTIONS constant

## Deviations from Plan

None -- plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None -- no external service configuration required.

## Next Phase Readiness
- Scroll context infrastructure is the foundation for plans 02-04 in this phase
- useScrollContext hook available for returning visitor detection and /invest journey detection
- SECTION_CONTEXT_MAP extensible for future section additions

## Known Stubs

None -- all data sources are wired and functional.

---
*Phase: 04-engagement-intelligence*
*Completed: 2026-03-27*
