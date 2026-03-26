# quartermint.com — Cathedral Hybrid Narrative

## What This Is

A personal founder site for Ryan Stern at quartermint.com that tells the story of a builder-operator with a thesis and a body of work. Replaces the current consultant-positioning landing page with a narrative-driven site featuring an embedded AI chat interface (ported from Stripped/Relay), empathy-first system showcases, an investor-facing /invest route, and a visual design system rooted in editorial typography and mint color palette. The site itself demonstrates the thesis: information routed to the right person, in the right form, at the right time.

## Core Value

A visitor with no context understands what Ryan builds and why within 60 seconds — and can interact with the site to get answers in real time via the embedded chat.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Narrative hero with locked copy, headshot, living signal (last commit timestamp), and dual CTAs
- [ ] Featured systems section (4 cards: LifeVault, Relay, OpenEFB, v2cf) with empathy-first framing
- [ ] Embedded chat interface ported from Stripped architecture (@ai-sdk/anthropic streaming)
- [ ] Chat persona with identityvault-informed system prompt, 500-token response cap, honest AI disclosure
- [ ] Chat rate limiting: cookie-based session (20 msgs), IP-based hard cap (60/hr via Vercel KV), $50 budget alert
- [ ] Origin story section reframing campaign history (120-180 words, 3 paragraphs)
- [ ] Systems shelf as dense typographic list (11 systems with tech badges, public repo indicators)
- [ ] Contact + investor path dual-column section with Google Calendar booking + /invest link
- [ ] /invest route — memo-style page with thesis, stats, trajectory, background, CTA
- [ ] Minimal sticky nav bar (Ryan Stern left, Invest right, scroll-aware)
- [ ] Alternating section backgrounds (white/mint visual rhythm)
- [ ] Dark mode via prefers-color-scheme media query with mapped color palette
- [ ] Visual system: Instrument Serif headlines, DM Sans body, mint color palette, CSS custom properties
- [ ] Responsive design across 3 breakpoints (mobile <640, tablet 640-1023, desktop >=1024)
- [ ] Accessibility: keyboard nav, ARIA landmarks, 44px touch targets, WCAG AAA contrast, reduced-motion
- [ ] Privacy notice below chat input with /privacy page
- [ ] Footer stats line (40+ repos / 894K files / 9 services)
- [ ] /invest journey detection (sessionStorage flag, variant heading for main-page visitors)
- [ ] /invest compliance language (no securities claims)
- [ ] Smart starter chips (scroll context > commit recency > time-of-day > static defaults)
- [ ] Keyboard shortcuts overlay (? key)
- [ ] Chat context awareness (section scroll tracking informs chat responses)
- [ ] Conversation export via email (Resend from chat@quartermint.com, slide-down panel after 3rd message)
- [ ] Returning visitor detection (90-day cookie, Vercel KV topic tracking, personalized chat greetings)
- [ ] Weekly digest email via Vercel cron + Resend (chat sessions, top questions, /invest views)
- [ ] Scroll-speed-adaptive animations (IntersectionObserver timing, 3 speed tiers)
- [ ] Per-system detail pages (quartermint.com/systems/[slug])
- [ ] Section entrance animations (translateY + opacity on scroll, respects reduced-motion)
- [ ] Living signal fade-in animation (opacity 0->1, 600ms ease, 300ms delay)
- [ ] OG tags, Twitter cards, robots.txt, sitemap.xml, canonical URLs per route
- [ ] DRY data source: lib/systems.ts single source for all system descriptions
- [ ] Vercel deployment with auto-deploy on git push to main
- [ ] DNS repoint from Cloudflare to Vercel

### Out of Scope

- Cloudflare Workers migration via v2cf — explicitly phase 2, after the site ships on Vercel
- CMS or MDX content management — content changes are infrequent, hardcoded JSX is sufficient
- Contact form — use mailto for now, form if spam becomes an issue
- Pitch deck download on /invest — text-only for now, deck added later if created for YC
- Archiving current HTML site — user chose to skip
- Shared Vercel KV with Stripped — fresh KV store for quartermint
- Custom 404 page — default Next.js 404 acceptable for v1

## Context

- **Current state:** quartermint.com is a single static HTML file on Cloudflare CDN. Tailwind, Inter font, mint palette. Positions Ryan as a fractional operator for hire — wrong for current trajectory.
- **Catalyst:** YC S26 application (deadline May 4), FI Core enrollment, pitch feedback from Jonathan Greechan (VIP Pitch Lounge, 2026-03-24) — "the pitch needs work," current framing doesn't establish immediate understanding.
- **Chat architecture source:** ~/stripped/ contains the proven Next.js 14 App Router chat implementation (ChatInterface component + API route + system prompt builder + @ai-sdk/anthropic streaming). Extract and adapt, don't rebuild.
- **Identity data source:** ~/identityvault/ and ~/stripped/content/profile/ contain biography, personality, experiences, and skills data for the chat system prompt.
- **Design doc:** Extensively reviewed — CEO review, Codex adversarial review, Claude adversarial review, 2x design review, eng review. All cleared. Hero copy locked. Visual system defined.
- **Audiences:** (1) People who need systems Ryan builds — not hiring fractional, engaging with builder. (2) Investors/accelerators evaluating Ryan as founder.

## Constraints

- **Solo builder**: Must ship and maintain without a team
- **Hosting**: Vercel for v1 (chat streaming + KV out of the box). Fresh project on existing Vercel account. Cloudflare owns DNS only.
- **Timeline**: Build immediately — not gated on May 4 YC deadline, ship as fast as possible
- **Chat dependency**: Requires ANTHROPIC_API_KEY (existing, same key as Stripped deployment)
- **Email dependency**: Requires Resend account for conversation export and weekly digest (chat@quartermint.com sender)
- **Carry-over assets**: Google Calendar booking link, email address, headshot (assets/images/hero/ryan-160.png from current site)
- **Copy quality**: Hero copy is a PRE-BUILD BLOCKER — locked in the design doc, must not ship with placeholder text
- **Design system**: Visual system fully specified in design doc — Instrument Serif + DM Sans, mint palette, CSS custom properties only

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Vercel over Cloudflare for v1 | Chat streaming + KV out of the box, same platform as Stripped | — Pending |
| Extract chat from Stripped, not fresh build | Proven architecture, same stack (Next.js 14, App Router, @ai-sdk/anthropic) | — Pending |
| Horizontal narrative rows for featured systems (A/B vs 2x2 grid) | Both Codex and Claude flagged 2x2 card grid as most common AI-generated layout | — Pending |
| Thesis stated once in hero (not subtext-only) | Codex challenged subtext-only approach; Greechan pitch feedback on immediate understanding | — Pending |
| Campaign names in prose, not logo carousel | Reframes as origin story, not credentials for hire | — Pending |
| Cookie-based + IP-based + budget alert rate limiting | Three layers: UX (20 msgs/session), abuse (60/hr/IP), budget ($50 monthly alert) | — Pending |
| No CMS — hardcoded JSX | Content changes infrequent, solo builder, reduces complexity | — Pending |
| Full scope including phase 2 features | User chose "everything" — digest email, scroll-speed animations, per-system detail pages all in roadmap | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd:transition`):
1. Requirements invalidated? -> Move to Out of Scope with reason
2. Requirements validated? -> Move to Validated with phase reference
3. New requirements emerged? -> Add to Active
4. Decisions to log? -> Add to Key Decisions
5. "What This Is" still accurate? -> Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-03-26 after initialization*
