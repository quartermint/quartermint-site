# Phase 2: Static Narrative Content - Context

**Gathered:** 2026-03-26
**Status:** Ready for planning

<domain>
## Phase Boundary

Build all static page content: hero section with locked copy, 4 featured system narrative rows, origin story, systems shelf, contact/investor section, footer, sticky nav, /invest route, /privacy route, section animations, SEO metadata, and Vercel deployment. The site should be complete, reviewable, and shareable — deployable before any API keys are connected.

</domain>

<decisions>
## Implementation Decisions

### Hero Section
- **D-01:** Hero copy is LOCKED. H1: "Ryan Stern", subtitle: "Builder. Operator." Two paragraphs of body copy provided in design doc. Do not modify or ship with placeholder text.
- **D-02:** Headshot: user-provided full-size photo cropped to circle (160px desktop, 120px tablet, 80px mobile). Right-aligned on desktop, centered above name on mobile.
- **D-03:** Living signal: query public repos from quartermint org + sternryan. Unauthenticated GitHub API. 1hr ISR cache. SIGNAL_REPOS env var with curated list. Fallback to FALLBACK_SIGNAL env var if >14 days stale or API error.
- **D-04:** Dual CTAs: "Explore the systems" (scrolls to featured) + "Ask me anything" (scrolls to chat section / opens overlay on mobile).

### Featured Systems
- **D-05:** 4 empathy-first horizontal narrative rows (not 2x2 grid). Copy is LOCKED in design doc for LifeVault, Relay, OpenEFB, v2cf. Problem left, solution right, 32px gap. Mobile: stack vertically.

### Origin Story
- **D-06:** Claude drafts, user approves. 120-180 words, 3 paragraphs max. Campaign names in prose (Obama, Biden, Harris, Clinton, Sanders, Warren, Booker, Nixon). Closes with "I started building because the tools didn't exist."

### Systems Shelf
- **D-07:** Dense typographic list, not cards. 11 systems with name + one-liner + tech badge. Claude drafts one-liners from project READMEs, user approves. Public repos get GitHub link icon.

### /invest Route
- **D-08:** Content skeleton from design doc: thesis pull quote, stats as 3x2 grid, direction, background (one paragraph), CTA. Max-width 680px. White background throughout.
- **D-09:** Stats use exact counts (894K files, 452K messages, 395 tests). Accurate as of March 2026.
- **D-10:** Compliance: no securities claims, no forward-looking financial projections, no "invest in" framing.

### /privacy Route
- **D-11:** Same layout as /invest (680px max-width). Plain text covering: chat messages logged server-side, sections viewed tracked, email opt-in only, 90-day visitor cookie, no third-party tracking.

### Footer
- **D-12:** "40+ repositories / 894K files indexed / 9 production services" — static, exact counts.

### Navigation
- **D-13:** Sticky nav: 48px height, "Ryan Stern" left (scroll to top), "Invest" right (/invest). Transparent at top, white bg + shadow after 100px scroll. Mobile: hide-on-scroll-down, show-on-scroll-up.

### Animations
- **D-14:** Two motions only: living signal fade-in (opacity 0->1, 600ms ease, 300ms delay) and section entrance (translateY 8px->0 + opacity, 400ms ease, IntersectionObserver at 0.3 threshold). Both respect prefers-reduced-motion.

### Deployment
- **D-15:** Vercel deployment. Fresh project on existing Vercel account. Auto-deploy on push to main. OG tags, Twitter cards, robots.txt, sitemap.xml, canonical URLs on all routes.

### Claude's Discretion
- Smooth scroll implementation approach
- OG image design (headshot vs branded card)
- Section animation stagger timing

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Design Doc (PRIMARY — contains all locked copy and visual specs)
- `~/.gstack/projects/quartermint-lifevault/ryanstern-unknown-design-20260326-010500.md` — Hero copy (LOCKED), featured system copy (LOCKED), section layout specs, responsive behavior table, /invest content skeleton, dark mode mapping, accessibility specs, copy principles (Greechan lens)

### Test Plan
- `~/.gstack/projects/quartermint-throughline/ryanstern-main-eng-review-test-plan-20260326-124217.md` — Key interactions to verify, edge cases, critical paths

### Requirements
- `.planning/REQUIREMENTS.md` — NAR-01 through NAR-08, INV-01, INV-03, OPS-02, OPS-04, ENG-03, ENG-04
- `.planning/ROADMAP.md` — Phase 2 success criteria

### Upstream Dependencies
- Phase 1 CONTEXT.md — Design system tokens, lib/systems.ts structure, accessibility patterns

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `lib/systems.ts` (from Phase 1) — DRY data source for featured systems, shelf, and future chat prompt + detail pages.
- CSS custom properties and font setup (from Phase 1) — all visual tokens ready.
- Responsive breakpoints (from Phase 1) — mobile/tablet/desktop patterns established.

### Established Patterns
- Phase 1 establishes component structure, styling approach (Tailwind v4 + CSS custom properties), and App Router conventions.
- Accessibility patterns (focus rings, ARIA landmarks, touch targets) from Phase 1 apply to all new components.

### Integration Points
- Hero CTA "Ask me anything" links to chat section (Phase 3). In Phase 2, this scrolls to the chat section position but the chat component is a placeholder/coming-soon state.
- /invest route uses same nav component as main page.
- Living signal requires SIGNAL_REPOS and FALLBACK_SIGNAL env vars on Vercel.

</code_context>

<specifics>
## Specific Ideas

- Design doc specifically states: "Try horizontal narrative rows first" for featured systems. If they "feel too tall or don't scan well on mobile, fall back to 2x2 card grid."
- The /invest journey detection (sessionStorage flag + variant heading) is in Phase 4, not Phase 2. Phase 2 ships the default /invest heading only.
- Section visual rhythm: Hero=white, Featured Systems=mint, Chat=white, Origin Story=mint, Systems Shelf=white, Contact=mint.
- Contact section: left column "Schedule a conversation" (Calendar + email), right column "For investors and partners" (/invest link). Tertiary: GitHub + X/Twitter links.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 02-static-narrative-content*
*Context gathered: 2026-03-26*
