# Roadmap: quartermint.com

## Overview

quartermint.com transforms from a static consultant landing page into a narrative-driven founder site with an embedded AI chat interface. The build follows a clear dependency chain: design system and data layer first (everything consumes these), then static narrative content (produces a reviewable site with zero external dependencies), then the chat system (highest-complexity differentiator, all external services at once), then engagement intelligence (enhances chat with context awareness and visitor memory), and finally operations and go-live (DNS repoint, digest email, detail pages). The site ships on Vercel with Upstash Redis and Anthropic API, with DNS remaining on Cloudflare.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Foundation + Design System** - Next.js 16 scaffold, CSS custom properties, fonts, dark mode, data layer, accessibility baseline
- [ ] **Phase 2: Static Narrative Content** - All page sections, /invest route, /privacy route, sticky nav, animations, SEO metadata, Vercel deployment
- [ ] **Phase 3: Chat System** - Embedded AI chat with streaming, persona, three-tier rate limiting, Upstash Redis, cost controls
- [ ] **Phase 4: Engagement Intelligence** - Scroll-aware chat, smart starter chips, returning visitors, /invest journey detection, conversation export, keyboard shortcuts
- [ ] **Phase 5: Operations + Go-Live** - Weekly digest email, per-system detail pages, DNS repoint, scroll-speed animations, final verification

## Phase Details

### Phase 1: Foundation + Design System
**Goal**: Every downstream component has a working scaffold, design token system, and shared data layer to build on
**Depends on**: Nothing (first phase)
**Requirements**: FOUND-01, FOUND-02, FOUND-03, FOUND-04, FOUND-05, FOUND-06
**Success Criteria** (what must be TRUE):
  1. A Next.js 16 App Router dev server starts with zero errors and TypeScript strict mode enabled
  2. The mint color palette, Instrument Serif headlines, and DM Sans body text render correctly in both light and dark mode without any flash of wrong theme
  3. A page layout responds correctly across mobile (<640px), tablet (640-1023px), and desktop (>=1024px) breakpoints
  4. lib/systems.ts exports all 15 system entries with name, one-liner, problem, solution, tech badge, isPublic, and githubUrl fields
  5. Keyboard focus rings (2px), ARIA landmarks, 44px touch targets, and prefers-reduced-motion support are present in the base layout
**Plans:** 3 plans
Plans:
- [x] 01-01-PLAN.md -- Project scaffold + design token system (fonts, colors, dark mode)
- [x] 01-02-PLAN.md -- Systems data layer + test infrastructure (lib/systems.ts, vitest)
- [x] 01-03-PLAN.md -- Responsive layout, accessibility tests, visual verification
**UI hint**: yes

### Phase 2: Static Narrative Content
**Goal**: A complete, reviewable site that tells the founder narrative across both audience paths -- deployable and shareable before any API keys are connected
**Depends on**: Phase 1
**Requirements**: NAR-01, NAR-02, NAR-03, NAR-04, NAR-05, NAR-06, NAR-07, NAR-08, INV-01, INV-03, OPS-02, OPS-04, ENG-03, ENG-04
**Success Criteria** (what must be TRUE):
  1. A visitor landing on the home page sees the hero (locked copy, headshot, living signal, dual CTAs), four featured system narrative rows, origin story, systems shelf, contact/investor section, and footer stats -- in alternating white/mint backgrounds
  2. The sticky nav shows "Ryan Stern" (scrolls to top) and "Invest" (links to /invest), appears after 100px scroll with white background and shadow, and hides on scroll-down / shows on scroll-up on mobile
  3. The /invest route displays a memo-style page with thesis pull quote, stats grid, and calendar CTA -- with no securities claims or forward-looking financial projections
  4. A /privacy route exists with content covering chat logging, section tracking, email opt-in, 90-day cookie, and no third-party tracking
  5. The site is deployed on Vercel with auto-deploy on push to main, and OG tags, Twitter cards, robots.txt, sitemap.xml, and canonical URLs are present on all routes
**Plans:** 5 plans
Plans:
- [ ] 02-01-PLAN.md -- Shared utility components (StickyNav, SectionWrapper, LivingSignal) + supporting libs
- [ ] 02-02-PLAN.md -- Hero section, featured systems, chat placeholder + page wiring
- [ ] 02-03-PLAN.md -- Origin story, systems shelf, contact section, footer stats
- [ ] 02-04-PLAN.md -- Full page assembly, /invest route, /privacy route
- [ ] 02-05-PLAN.md -- SEO metadata, OG image, Vercel deployment, visual verification
**UI hint**: yes

### Phase 3: Chat System
**Goal**: Visitors can have a real-time streaming conversation with Ryan's AI proxy, with cost controls and abuse prevention shipping simultaneously
**Depends on**: Phase 2
**Requirements**: CHAT-01, CHAT-02, CHAT-03, CHAT-04, CHAT-05, CHAT-06, ENG-01
**Success Criteria** (what must be TRUE):
  1. A visitor can type a question and receive a streaming response from the AI chat, with the persona responding as Ryan's digital proxy informed by identityvault biographical data and capped at 500 tokens per response
  2. The chat displays three starter chips on idle, animated dots during thinking, a friendly error fallback with mailto CTA on failure, and a rate limit message with call-booking CTA when limits are hit
  3. Three rate limiting layers are active simultaneously: cookie-based session limit (20 messages), IP-based hard cap (60/hr via Upstash Redis returning 429), and a $50/month Anthropic budget alert configured
  4. A privacy notice appears below the chat input linking to /privacy, and the AI honestly discloses it is a digital proxy when sincerely asked
  5. On mobile, the chat opens as a full-screen overlay triggered by the hero CTA
**Plans**: TBD
**UI hint**: yes

### Phase 4: Engagement Intelligence
**Goal**: The chat becomes contextually aware of what the visitor is doing, remembers returning visitors, and captures leads through conversation export
**Depends on**: Phase 3
**Requirements**: ENG-02, ENG-05, INT-01, INT-02, INV-02
**Success Criteria** (what must be TRUE):
  1. When a visitor scrolls to a specific section and then asks a chat question, the AI response incorporates awareness of which section the visitor was viewing
  2. Smart starter chips reflect scroll context, recent commit activity, and time of day -- degrading gracefully to static defaults when context is unavailable
  3. A returning visitor within 7 days sees a personalized greeting referencing their previous topic; visitors 7-30 days old see a generic welcome-back; visitors over 30 days or with KV failures are treated as new
  4. After viewing the contact section and navigating to /invest, the visitor sees the variant heading "You've seen the work. Here's where it's going." instead of the default
  5. After 3 messages, an envelope icon appears in the chat header; clicking it reveals a slide-down panel where the visitor can enter their email and receive the conversation via Resend, with a clipboard fallback on error
**Plans**: TBD
**UI hint**: yes

### Phase 5: Operations + Go-Live
**Goal**: quartermint.com is live on its domain with operational intelligence, content depth, and polish animations
**Depends on**: Phase 4
**Requirements**: OPS-01, OPS-03, OPS-05, ENG-06
**Success Criteria** (what must be TRUE):
  1. quartermint.com resolves to the Vercel deployment with working HTTPS, and all routes (/, /invest, /privacy, /systems/[slug]) load correctly
  2. A weekly digest email arrives (plain text via Resend) summarizing chat sessions, top questions, export requests, and /invest views from the past week
  3. Each of the 15 systems in lib/systems.ts has a detail page at /systems/[slug] rendering its full data
  4. Scroll-speed-adaptive animations respond across three tiers (fast/medium/slow) and are fully disabled when prefers-reduced-motion is set
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4 -> 5

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation + Design System | 0/3 | Planning complete | - |
| 2. Static Narrative Content | 0/5 | Planning complete | - |
| 3. Chat System | 0/TBD | Not started | - |
| 4. Engagement Intelligence | 0/TBD | Not started | - |
| 5. Operations + Go-Live | 0/TBD | Not started | - |
