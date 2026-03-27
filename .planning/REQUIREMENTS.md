# Requirements: quartermint.com

**Defined:** 2026-03-26
**Core Value:** A visitor with no context understands what Ryan builds and why within 60 seconds — and can interact with the site to get answers in real time via the embedded chat.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Foundation

- [ ] **FOUND-01**: Next.js 16 App Router project with React 19 and TypeScript
- [ ] **FOUND-02**: CSS custom properties design system (Instrument Serif + DM Sans + mint palette, all colors via :root variables)
- [ ] **FOUND-03**: Dark mode via prefers-color-scheme with full mapped color palette (no pure black, no pure white)
- [ ] **FOUND-04**: Responsive layout across 3 breakpoints (mobile <640px, tablet 640-1023px, desktop >=1024px)
- [ ] **FOUND-05**: DRY data source (lib/systems.ts) for all 15 system descriptions (name, one-liner, problem, solution, tech badge, isPublic, githubUrl)
- [ ] **FOUND-06**: Accessibility baseline (keyboard nav with 2px focus rings, ARIA landmarks, 44px touch targets, WCAG AAA contrast, prefers-reduced-motion support)

### Narrative Content

- [x] **NAR-01**: Narrative hero with locked copy ("Ryan Stern / Builder. Operator."), headshot (160px circle desktop, 80px mobile), living signal (last commit from GitHub API with 1hr ISR cache), dual CTAs ("Explore the systems" + "Ask me anything")
- [x] **NAR-02**: Featured systems section (4 empathy-first entries: LifeVault, Relay, OpenEFB, v2cf) with horizontal narrative rows (problem left, solution right, 32px gap between rows)
- [ ] **NAR-03**: Origin story section (120-180 words, 3 paragraphs, campaign names in prose — environment/failure, what Ryan noticed, "I started building because the tools didn't exist")
- [ ] **NAR-04**: Systems shelf as dense typographic list (11 systems: msgvault, pixvault, drivevault, Mainline, Mission Control, SFR, foundry, skygate, open-ez, ticker, signal-glass) with tech badges and public repo GitHub link icons
- [ ] **NAR-05**: Contact + investor dual-column section (left: "Schedule a conversation" with Calendar booking + email + tertiary GitHub/X links; right: "For investors and partners" linking to /invest)
- [x] **NAR-06**: Minimal sticky nav bar (48px height, "Ryan Stern" left -> top, "Invest" right -> /invest, transparent at top, white bg + shadow after 100px scroll, hide-on-scroll-down/show-on-scroll-up on mobile)
- [x] **NAR-07**: Alternating section backgrounds (Hero=white, Featured Systems=mint, Chat=white, Origin Story=mint, Systems Shelf=white, Contact=mint)
- [ ] **NAR-08**: Footer stats line centered below contact ("40+ repositories / 894K files indexed / 9 production services", DM Sans 13px, text-faint)

### Chat System

- [x] **CHAT-01**: Embedded AI chat with streaming responses (AI SDK v6 useChat hook, @ai-sdk/anthropic provider, streamText API, architecture ported from Stripped ~/stripped/)
- [x] **CHAT-02**: Chat persona with identityvault-informed system prompt (biographical data from ~/identityvault/), 500-token max per response, honest AI disclosure when sincerely asked ("I'm Ryan's digital proxy"), deflection for political opinions/private questions/code requests
- [x] **CHAT-03**: Three-layer rate limiting — Layer 1: cookie-based session (20 msgs/session, HttpOnly SameSite=Strict 24h), Layer 2: IP-based hard cap (60 msgs/hr via Upstash Redis, returns 429), Layer 3: $50/mo Anthropic API spend alert (dashboard config)
- [x] **CHAT-04**: Privacy notice below chat input (DM Sans 12px, text-faint, links to /privacy page covering: chat logging, section tracking, email opt-in, 90-day cookie, no third-party tracking)
- [x] **CHAT-05**: Chat interaction states — idle (heading + 3 starter chips + input), typing (animated dots with "Thinking..." label), error (friendly fallback with mailto CTA), rate limit (CTA to book a call), mobile (full-screen overlay triggered by hero CTA)
- [x] **CHAT-06**: Chat container (box-shadow: 0 2px 8px rgba(0,0,0,0.06), border-radius 8px, max-width 720px centered, min-height 200px idle, heading "Ask me anything about what I'm building" in Instrument Serif 24px)

### Investor Path

- [ ] **INV-01**: /invest route — memo-style page (max-width 680px, same nav, thesis as pull quote with 3px mint-accent left border, stats as 3x2 inline grid, body in DM Sans, white background throughout)
- [x] **INV-02**: /invest journey detection — sessionStorage flag set when contact section enters viewport, variant heading on /invest ("You've seen the work. Here's where it's going.") applied client-side after hydration, default heading for direct-link visitors
- [ ] **INV-03**: /invest compliance language — no securities claims, no forward-looking financial projections, no "invest in" framing

### Engagement

- [x] **ENG-01**: Smart starter chips (exactly 3 chips, priority: scroll context > commit recency > time-of-day > static defaults, DM Sans 14px, surface bg, 6px border-radius, disappear after first click)
- [x] **ENG-02**: Chat section scroll awareness — IntersectionObserver tracks which section is visible, passes as metadata to chat API, system prompt incorporates "user was viewing [section]" context
- [x] **ENG-03**: Section entrance animations (translateY 8px -> 0 + opacity on scroll into viewport, 400ms ease, via IntersectionObserver at 0.3 threshold)
- [x] **ENG-04**: Living signal fade-in (opacity 0 -> 1, 600ms ease, 300ms delay on load)
- [x] **ENG-05**: Keyboard shortcuts overlay (? key, centered modal 400px max-width, bg with 80% opacity backdrop-filter blur, Instrument Serif 20px heading, DM Sans 14px shortcuts, dismiss on Esc/click-outside/?, not shown when input focused)
- [ ] **ENG-06**: Scroll-speed-adaptive animations (3 tiers: fast <400ms/150ms/4px, medium 400-1200ms/400ms/8px, slow >1200ms/800ms/12px, all disabled with prefers-reduced-motion)

### Intelligence

- [x] **INT-01**: Conversation export via email — envelope icon (20px, text-muted) in chat header after 3rd message, slide-down panel with email input + "Send" button, sent via Resend from chat@quartermint.com, success auto-dismisses 3s, error shows "Copy conversation" clipboard fallback, BCC Ryan
- [x] **INT-02**: Returning visitor detection — 90-day `rv` cookie with session ID, Upstash Redis stores visitor:{id} with lastVisit/topics[]/sectionsViewed[]/messageCount, <7 days: "Welcome back. You were asking about [topic]", 7-30 days: "Good to see you again", >30 days: treat as new, KV failure: treat as new silently

### Operations

- [x] **OPS-01**: Weekly digest email via Vercel cron + Resend — plain text, system sans-serif, chat sessions/messages/top 3 questions/export requests//invest views, "Reply to stop" footer
- [ ] **OPS-02**: Vercel deployment (fresh project on existing account, auto-deploy on git push to main, ANTHROPIC_API_KEY env var configured)
- [ ] **OPS-03**: DNS repoint from Cloudflare to Vercel (Cloudflare retains DNS ownership, A/CNAME records to Vercel)
- [ ] **OPS-04**: Metadata per route — og:title, og:description, og:image (headshot or branded card), Twitter summary_large_image card, robots.txt (allow all), sitemap.xml (/ and /invest), canonical URLs
- [ ] **OPS-05**: Per-system detail pages at quartermint.com/systems/[slug] — dynamic route consuming lib/systems.ts data

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Infrastructure Migration

- **MIG-01**: Cloudflare Workers migration via v2cf (move from Vercel to Cloudflare)

## Out of Scope

| Feature | Reason |
|---------|--------|
| CMS / MDX content management | Content changes infrequent, hardcoded JSX sufficient, solo builder |
| Contact form | Chat IS the interactive contact method; mailto + Calendar for direct contact |
| Logo carousel / client list | Signals "consultant for hire" — the opposite of the founder narrative |
| Pitch deck download on /invest | PDFs untracked/unupdatable; text-only memo-style page for now |
| Archiving current HTML site | User chose to skip |
| Blog / writing section | Blog without consistent publishing undermines "living/active" thesis |
| Real-time GitHub activity feed | Noisy, context-free for non-technical visitors; living signal is sufficient |
| Analytics dashboard (visitor-facing) | Low-number problem early; weekly digest serves owner analytics |
| Multi-language support | Primary audience US-based investors and collaborators |
| 3D/WebGL elements | Heavy JS, gimmicky on editorial site, incompatible with design direction |
| Custom 404 page | Default Next.js 404 acceptable for v1 |
| Chat memory / persistent conversations | Over-engineering; returning visitor detection provides continuity feel |
| Shared Vercel KV with Stripped | Fresh Upstash Redis store for quartermint |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| FOUND-01 | Phase 1: Foundation + Design System | Pending |
| FOUND-02 | Phase 1: Foundation + Design System | Pending |
| FOUND-03 | Phase 1: Foundation + Design System | Pending |
| FOUND-04 | Phase 1: Foundation + Design System | Pending |
| FOUND-05 | Phase 1: Foundation + Design System | Pending |
| FOUND-06 | Phase 1: Foundation + Design System | Pending |
| NAR-01 | Phase 2: Static Narrative Content | Complete |
| NAR-02 | Phase 2: Static Narrative Content | Complete |
| NAR-03 | Phase 2: Static Narrative Content | Pending |
| NAR-04 | Phase 2: Static Narrative Content | Pending |
| NAR-05 | Phase 2: Static Narrative Content | Pending |
| NAR-06 | Phase 2: Static Narrative Content | Complete |
| NAR-07 | Phase 2: Static Narrative Content | Complete |
| NAR-08 | Phase 2: Static Narrative Content | Pending |
| CHAT-01 | Phase 3: Chat System | Complete |
| CHAT-02 | Phase 3: Chat System | Complete |
| CHAT-03 | Phase 3: Chat System | Complete |
| CHAT-04 | Phase 3: Chat System | Complete |
| CHAT-05 | Phase 3: Chat System | Complete |
| CHAT-06 | Phase 3: Chat System | Complete |
| INV-01 | Phase 2: Static Narrative Content | Pending |
| INV-02 | Phase 4: Engagement Intelligence | Complete |
| INV-03 | Phase 2: Static Narrative Content | Pending |
| ENG-01 | Phase 3: Chat System | Complete |
| ENG-02 | Phase 4: Engagement Intelligence | Complete |
| ENG-03 | Phase 2: Static Narrative Content | Complete |
| ENG-04 | Phase 2: Static Narrative Content | Complete |
| ENG-05 | Phase 4: Engagement Intelligence | Complete |
| ENG-06 | Phase 5: Operations + Go-Live | Pending |
| INT-01 | Phase 4: Engagement Intelligence | Complete |
| INT-02 | Phase 4: Engagement Intelligence | Complete |
| OPS-01 | Phase 5: Operations + Go-Live | Complete |
| OPS-02 | Phase 2: Static Narrative Content | Pending |
| OPS-03 | Phase 5: Operations + Go-Live | Pending |
| OPS-04 | Phase 2: Static Narrative Content | Pending |
| OPS-05 | Phase 5: Operations + Go-Live | Pending |

**Coverage:**
- v1 requirements: 36 total
- Mapped to phases: 36
- Unmapped: 0

---
*Requirements defined: 2026-03-26*
*Last updated: 2026-03-26 after roadmap creation*
