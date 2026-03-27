---
phase: 04-engagement-intelligence
plan: 03
subsystem: ui, email, api
tags: [resend, react-email, email-export, sessionStorage, keyboard-shortcuts, intersection-observer]

# Dependency graph
requires:
  - phase: 04-engagement-intelligence plan 01
    provides: ScrollContextProvider, useScrollContext, SECTION_IDS, getScrollChips
  - phase: 04-engagement-intelligence plan 02
    provides: VisitorState, visitor CRUD, returning visitor greeting, rv cookie
provides:
  - ConversationExportEmail React Email template
  - POST /api/export route (Resend from chat@quartermint.com with BCC, rate limited 3/hr/IP)
  - ConversationExportPanel client component with email input, clipboard fallback
  - InvestHeading client component with sessionStorage-based journey detection
  - KeyboardShortcutsModal with ? toggle, / chat focus, Esc dismiss
  - sessionStorage qm_journey_contact flag on contact section viewport entry
affects: [05-production-readiness]

# Tech tracking
tech-stack:
  added: [resend@6.9.4, "@react-email/components@1.0.10"]
  patterns: [React Email template rendering via Resend SDK, useState+useEffect hydration pattern for sessionStorage reads, global keyboard shortcut listener with input/textarea filtering]

key-files:
  created:
    - lib/email/conversation-export-template.tsx
    - app/api/export/route.ts
    - components/chat/conversation-export-panel.tsx
    - components/invest-heading.tsx
    - components/keyboard-shortcuts-modal.tsx
    - __tests__/chat/export.test.ts
    - __tests__/chat/invest-journey.test.ts
  modified:
    - components/chat/chat-interface.tsx
    - components/scroll-context-provider.tsx
    - app/invest/page.tsx
    - app/page.tsx
    - package.json

key-decisions:
  - "useState(false)+useEffect for InvestHeading (no suppressHydrationWarning per React 19 behavior)"
  - "3 exports/hr/IP rate limit on export endpoint via @upstash/ratelimit sliding window"
  - "AI SDK v6 message parts extraction for export content (filter text parts from parts array)"

patterns-established:
  - "React Email templates: define self-contained interface, import from @react-email/components, render via Resend"
  - "Keyboard shortcut listener: useEffect keydown, filter INPUT/TEXTAREA tags, toggle state"
  - "Client-side sessionStorage detection: useState(false) + useEffect mount pattern avoids hydration mismatch"

requirements-completed: [INT-01, INV-02, ENG-05]

# Metrics
duration: 5min
completed: 2026-03-27
---

# Phase 04 Plan 03: Engagement Intelligence - Export, Journey, Shortcuts Summary

**Conversation export via Resend email with clipboard fallback, /invest journey-aware heading via sessionStorage, and keyboard shortcuts modal with ? toggle and / chat focus**

## Performance

- **Duration:** 5 min
- **Started:** 2026-03-27T19:51:01Z
- **Completed:** 2026-03-27T19:56:03Z
- **Tasks:** 3
- **Files modified:** 12

## Accomplishments
- Conversation export email sending via Resend from chat@quartermint.com with BCC to ryan@quartermint.com, rate limited to 3/hr/IP
- ConversationExportPanel with email input, send button, success auto-dismiss, and clipboard fallback on error
- InvestHeading swaps heading based on sessionStorage flag (correct useState+useEffect pattern, no suppressHydrationWarning)
- KeyboardShortcutsModal with ? toggle, / chat focus, Esc dismiss, blur backdrop, focus management, reduced motion support
- ScrollContextProvider sets qm_journey_contact flag when contact section enters viewport

## Task Commits

Each task was committed atomically:

1. **Task 1: Install Resend, create email template, and build export API route** - `997f37d` (test: failing tests) + `b6c4762` (feat: implementation)
2. **Task 2: Build export panel, /invest journey detection, and keyboard shortcuts modal** - `9cd12c7` (feat)
3. **Task 3: Wire export panel and keyboard shortcuts into chat interface and page** - `3ffe1a3` (feat)

## Files Created/Modified
- `lib/email/conversation-export-template.tsx` - React Email template for conversation export (Html, Body, Container, messages map)
- `app/api/export/route.ts` - POST endpoint: Resend email send with rate limiting (3/hr/IP), input validation, BCC
- `components/chat/conversation-export-panel.tsx` - Slide-down email panel: email input, send button, success/error states, clipboard fallback
- `components/invest-heading.tsx` - Client component: reads qm_journey_contact from sessionStorage, renders variant heading
- `components/keyboard-shortcuts-modal.tsx` - Modal: ? toggle, / chat focus, Esc dismiss, blur backdrop, focus management
- `components/scroll-context-provider.tsx` - Added qm_journey_contact sessionStorage flag on contact section viewport entry
- `components/chat/chat-interface.tsx` - Added envelope icon (after 3 messages), ConversationExportPanel, AI SDK v6 parts extraction
- `app/invest/page.tsx` - Replaced static h1 with InvestHeading client component
- `app/page.tsx` - Added KeyboardShortcutsModal inside ScrollContextProvider
- `package.json` - Added resend and @react-email/components dependencies
- `__tests__/chat/export.test.ts` - 13 tests: template content, API route validation, dependencies
- `__tests__/chat/invest-journey.test.ts` - 16 tests: InvestHeading, ScrollContextProvider flag, KeyboardShortcutsModal, ConversationExportPanel

## Decisions Made
- Used useState(false) + useEffect for InvestHeading instead of suppressHydrationWarning (React 19 behavior makes suppressHydrationWarning prevent re-render, not just suppress warning)
- 3 exports/hr/IP rate limit on export endpoint per RESEARCH recommendation (prevents email bombing without impacting legitimate use)
- AI SDK v6 message parts extraction: filter parts by type=text and extract .text field, handling the parts array structure

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- Vitest 4 does not support `-x` flag (bail on first failure) -- used `npx vitest run` without the flag
- JSX entity `&apos;` in ConversationExportPanel source does not match literal `'` in test assertions -- adjusted test to match source encoding

## User Setup Required

**External services require manual configuration** for the export feature to function:

1. **RESEND_API_KEY** - Create API key at Resend Dashboard -> API Keys, add to Vercel environment variables
2. **Domain verification** - Add quartermint.com domain in Resend Dashboard -> Domains, configure SPF/DKIM/DMARC DNS records in Cloudflare
3. **Sender verification** - Verify chat@quartermint.com sender address in Resend

Without these, the clipboard fallback (navigator.clipboard.writeText) serves as the export mechanism.

## Next Phase Readiness
- All engagement intelligence features complete (scroll context, visitor detection, export, journey detection, keyboard shortcuts)
- Phase 04 is fully implemented with 4 plans complete
- Ready for Phase 05 (production readiness) or /gsd:verify-work

## Self-Check: PASSED

All 7 created files verified on disk. All 4 commit hashes (997f37d, b6c4762, 9cd12c7, 3ffe1a3) found in git log.

---
*Phase: 04-engagement-intelligence*
*Completed: 2026-03-27*
