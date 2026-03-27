---
phase: 02-static-narrative-content
plan: 01
subsystem: ui
tags: [react, next.js, intersection-observer, github-api, isr, scroll, animation, accessibility]

# Dependency graph
requires:
  - phase: 01-foundation-design-system
    provides: CSS custom properties, Tailwind v4 @theme tokens, layout.tsx landmarks, accessibility baseline
provides:
  - StickyNav component with scroll-aware background and mobile hide/show
  - SectionWrapper component with alternating backgrounds and IntersectionObserver entrance animations
  - LivingSignal component with fade-in animation and stale/fallback handling
  - lib/github.ts with ISR-cached GitHub API fetch and fallback chain
  - lib/relative-time.ts with getRelativeTime and isStale utilities
  - Smooth scroll CSS on html element
affects: [02-02, 02-03, 02-04, 02-05, 03-chat-interface]

# Tech tracking
tech-stack:
  added: []
  patterns: [client-component-boundary, intersection-observer-fire-once, scroll-delta-threshold, isr-fetch-revalidate]

key-files:
  created:
    - components/sticky-nav.tsx
    - components/section-wrapper.tsx
    - components/living-signal.tsx
    - lib/github.ts
    - lib/relative-time.ts
    - __tests__/living-signal.test.ts
    - __tests__/navigation.test.ts
    - __tests__/section-wrapper.test.ts
  modified:
    - app/globals.css

key-decisions:
  - "5px scroll delta threshold to prevent iOS momentum scroll thrashing on StickyNav"
  - "noAnimation prop on SectionWrapper for above-the-fold sections (Pitfall 4 mitigation)"
  - "Full class names bg-bg/bg-surface in conditional rather than template literals for Tailwind v4 scanning"

patterns-established:
  - "Client boundary pattern: 'use client' only for scroll/IO/animation; all others Server Components"
  - "IntersectionObserver fire-once: observe, setVisible on intersect, unobserve immediately"
  - "ISR fetch pattern: { next: { revalidate: 3600 } } on GitHub API calls with SIGNAL_REPOS env var"
  - "Fallback chain: GitHub API -> FALLBACK_SIGNAL env var -> null (render nothing)"
  - "File-read test pattern: readFileSync source files and assert content (no jsdom needed)"

requirements-completed: [NAR-06, NAR-07, ENG-03, ENG-04]

# Metrics
duration: 3min
completed: 2026-03-27
---

# Phase 2 Plan 01: Shared Utilities Summary

**StickyNav, SectionWrapper, and LivingSignal client components with GitHub ISR fetch, relative-time utilities, smooth scroll CSS, and 34 new tests**

## Performance

- **Duration:** 3 min
- **Started:** 2026-03-27T14:03:31Z
- **Completed:** 2026-03-27T14:06:14Z
- **Tasks:** 2
- **Files modified:** 9

## Accomplishments
- Created 3 client components (StickyNav, SectionWrapper, LivingSignal) that all downstream Phase 2 plans depend on
- Built GitHub API integration with ISR caching (1hr), multi-repo support, 14-day staleness fallback chain
- Added 34 new tests across 3 test files, all passing alongside existing 42 Phase 1 tests (76 total)
- Build passes with zero type errors

## Task Commits

Each task was committed atomically:

1. **Task 1: Create lib/github.ts, lib/relative-time.ts, and their tests** - `972f80d` (feat)
2. **Task 2: Create StickyNav, SectionWrapper, LivingSignal components + smooth scroll + tests** - `0e510e2` (feat)

## Files Created/Modified
- `lib/relative-time.ts` - getRelativeTime (just now/hours/days/weeks/months) and isStale threshold utility
- `lib/github.ts` - getLatestCommit with ISR-cached GitHub API fetch, multi-repo, fallback chain (SIGNAL_REPOS + FALLBACK_SIGNAL env vars)
- `components/sticky-nav.tsx` - Scroll-aware sticky nav with transparent-to-white bg transition, mobile hide/show with 5px delta threshold, 44px touch targets
- `components/section-wrapper.tsx` - Alternating bg-bg/bg-surface backgrounds, IntersectionObserver entrance animation (0.3 threshold, fire-once), noAnimation prop for above-fold
- `components/living-signal.tsx` - GitHub commit display with fade-in (600ms ease-in, 300ms delay), sr-only screen reader text, stale/fallback color handling
- `app/globals.css` - Added smooth scroll on html element (overridden by existing prefers-reduced-motion rule)
- `__tests__/living-signal.test.ts` - 16 tests for relative-time functions and github.ts env var handling
- `__tests__/navigation.test.ts` - 9 tests for sticky-nav component content verification
- `__tests__/section-wrapper.test.ts` - 9 tests for section-wrapper component content verification

## Decisions Made
- Used 5px scroll delta threshold on StickyNav to prevent iOS Safari momentum scroll thrashing (per Research Pitfall 3)
- Added noAnimation prop to SectionWrapper to allow Hero section to render immediately without animation (per Research Pitfall 4)
- Used conditional full class names (`bg === 'bg' ? 'bg-bg' : 'bg-surface'`) instead of template literals for Tailwind v4 scanner compatibility

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required. SIGNAL_REPOS and FALLBACK_SIGNAL env vars will be configured during Vercel deployment (Phase 2 Plan 5).

## Known Stubs

None - all components are fully wired with their data sources. LivingSignal receives CommitInfo from server parent via props. SectionWrapper and StickyNav are self-contained.

## Next Phase Readiness
- All 3 shared utility components ready for import by downstream plans (02-02 through 02-05)
- StickyNav ready to be placed in layout.tsx header
- SectionWrapper ready to wrap each page section with alternating bg + entrance animation
- LivingSignal ready to receive CommitInfo prop from server component calling getLatestCommit()
- lib/github.ts and lib/relative-time.ts ready for import

## Self-Check: PASSED

All 9 created files verified present. Both task commits (972f80d, 0e510e2) verified in git log.

---
*Phase: 02-static-narrative-content*
*Completed: 2026-03-27*
