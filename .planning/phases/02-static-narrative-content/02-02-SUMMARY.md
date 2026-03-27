---
phase: 02-static-narrative-content
plan: 02
subsystem: ui
tags: [next.js, react, server-components, hero, featured-systems, isr, tailwind-v4]

# Dependency graph
requires:
  - phase: 02-static-narrative-content/01
    provides: "StickyNav, SectionWrapper, LivingSignal, lib/github.ts, lib/systems.ts, CSS tokens, accessibility baseline"
provides:
  - "HeroSection component with locked copy, headshot, living signal, dual CTAs"
  - "FeaturedSystems component with 4 horizontal narrative rows"
  - "ChatPlaceholder component reserving Phase 3 chat section"
  - "TechBadge reusable component"
  - "Async Server Component page.tsx with ISR (1hr)"
  - "StickyNav wired into layout header"
  - "Anchor link targets #featured-systems and #chat-section"
affects: [02-03, 02-04, 03-chat-interface]

# Tech tracking
tech-stack:
  added: []
  patterns: ["Server Components for static content (no 'use client')", "ISR revalidation via export const revalidate", "SectionWrapper id prop for anchor link targets", "Alternating bg/surface background rhythm"]

key-files:
  created:
    - components/hero-section.tsx
    - components/featured-systems.tsx
    - components/chat-placeholder.tsx
    - components/tech-badge.tsx
    - __tests__/hero.test.ts
    - __tests__/featured-systems.test.ts
  modified:
    - app/page.tsx
    - app/layout.tsx
    - components/section-wrapper.tsx
    - vitest.config.ts

key-decisions:
  - "Server Components for all 4 new components -- no interactivity needed, pure rendering"
  - "Added id prop to SectionWrapper (from Plan 02-01) to support anchor link targets"
  - "Fixed vitest path alias (@/ -> project root) to support imports in test files"

patterns-established:
  - "Server Components as default for static content sections"
  - "SectionWrapper id prop pattern for anchor-linked sections"
  - "Source-level string tests for locked copy verification"

requirements-completed: [NAR-01, NAR-02]

# Metrics
duration: 3min
completed: 2026-03-27
---

# Phase 02 Plan 02: Top-Half Page Components Summary

**Hero with locked narrative copy, 4 featured system rows, chat placeholder, and ISR-enabled async page wired with alternating white/mint rhythm**

## Performance

- **Duration:** 3 min
- **Started:** 2026-03-27T14:09:14Z
- **Completed:** 2026-03-27T14:12:33Z
- **Tasks:** 2
- **Files modified:** 10

## Accomplishments
- Hero section renders all locked copy (H1, subtitle, 2 body paragraphs), headshot with responsive sizing, living signal, and dual CTAs linking to anchor targets
- 4 featured systems render as horizontal narrative rows with problem/solution layout and TechBadge components
- Chat placeholder reserves the section position with heading and "Chat coming soon." subtext
- Home page is an async Server Component with 1hr ISR revalidation for the living signal GitHub API call
- StickyNav wired into layout header, replacing Phase 1 placeholder
- 18 new tests covering locked copy integrity, server component assertions, and data integrity

## Task Commits

Each task was committed atomically:

1. **Task 1: Create TechBadge, HeroSection, FeaturedSystems, ChatPlaceholder components + tests** - `3f9c190` (feat)
2. **Task 2: Wire page.tsx and layout.tsx with top-half sections** - `2e4a4c3` (feat)

## Files Created/Modified
- `components/tech-badge.tsx` - Reusable uppercase tech badge (Server Component)
- `components/hero-section.tsx` - Hero with locked copy, headshot, living signal, CTAs (Server Component)
- `components/featured-systems.tsx` - 4 horizontal narrative rows with TechBadge (Server Component)
- `components/chat-placeholder.tsx` - Placeholder for Phase 3 chat (Server Component)
- `__tests__/hero.test.ts` - 12 tests: locked copy, CTA hrefs, headshot, server component assertion
- `__tests__/featured-systems.test.ts` - 6 tests: imports, server component, data integrity
- `app/page.tsx` - Replaced verification page with async ISR home page
- `app/layout.tsx` - Added StickyNav import and rendering in header
- `components/section-wrapper.tsx` - Added id prop for anchor link targets
- `vitest.config.ts` - Added @ path alias for test imports

## Decisions Made
- All 4 new components are Server Components (no 'use client') since they have no interactivity -- pure rendering of static content
- Added `id` prop to SectionWrapper from Plan 02-01 to support anchor link targets (#featured-systems, #chat-section) -- plan anticipated this might be needed
- Fixed vitest resolve alias to support `@/lib/systems` import in featured-systems test

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Added id prop to SectionWrapper**
- **Found during:** Task 2 (wiring page.tsx)
- **Issue:** SectionWrapper from Plan 02-01 did not accept an `id` prop, needed for anchor link targets from hero CTAs
- **Fix:** Added optional `id?: string` to SectionWrapperProps interface and forwarded it to the `<section>` element
- **Files modified:** components/section-wrapper.tsx
- **Verification:** Build passes, anchor links (#featured-systems, #chat-section) target correct sections
- **Committed in:** 2e4a4c3 (Task 2 commit)

**2. [Rule 3 - Blocking] Added vitest path alias configuration**
- **Found during:** Task 1 (creating featured-systems test)
- **Issue:** vitest.config.ts lacked `resolve.alias` for `@/` path prefix, causing import failures in tests using `@/lib/systems`
- **Fix:** Added `resolve.alias: { '@': path.resolve(__dirname, '.') }` to vitest config
- **Files modified:** vitest.config.ts
- **Verification:** All 94 tests pass including new tests with @/ imports
- **Committed in:** 3f9c190 (Task 1 commit)

---

**Total deviations:** 2 auto-fixed (2 blocking)
**Impact on plan:** Both auto-fixes necessary for functionality. Plan anticipated the SectionWrapper id change. No scope creep.

## Issues Encountered
None -- execution was straightforward.

## User Setup Required

Headshot image must be provided at `public/images/headshot.jpg` (at least 320px wide for retina display). The component renders the path regardless -- the user must provide the image before deploy. This was documented in the plan frontmatter `user_setup`.

## Known Stubs
None -- all components render real data from lib/systems.ts or locked copy. ChatPlaceholder intentionally shows "Chat coming soon." and will be replaced by the real chat interface in Phase 3.

## Next Phase Readiness
- Top half of home page is complete: Hero, Featured Systems, Chat Placeholder
- Plan 02-03 will wire the remaining sections: Origin Story, Systems Shelf, Contact/Investor, FooterStats
- SectionWrapper's new `id` prop is available for any future anchor-linked sections
- All 94 tests green, build passes with zero errors

## Self-Check: PASSED

All 10 created/modified files verified present. Both task commits (3f9c190, 2e4a4c3) confirmed in git log. SUMMARY.md exists.

---
*Phase: 02-static-narrative-content*
*Completed: 2026-03-27*
