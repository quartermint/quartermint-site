# quartermint.com — Cathedral Hybrid Narrative

## What This Is

A personal founder site live at quartermint.com that tells the story of a builder-operator with a thesis and a body of work. Features an embedded AI chat interface (streaming via Claude Sonnet 4.6), empathy-first system showcases, an investor-facing /invest route, per-system detail pages, and a visual design system rooted in editorial typography and mint color palette. The site demonstrates the thesis: information routed to the right person, in the right form, at the right time.

## Core Value

A visitor with no context understands what Ryan builds and why within 60 seconds — and can interact with the site to get answers in real time via the embedded chat.

## Requirements

### Validated

- Narrative hero with locked copy, headshot, living signal, dual CTAs — v1.0
- Featured systems (LifeVault, Relay, OpenEFB, v2cf) with empathy-first framing — v1.0
- Embedded AI chat with streaming (AI SDK v6 + Claude Sonnet 4.6) — v1.0
- Chat persona with 884-word curated system prompt, 500-token cap, honest AI disclosure — v1.0
- Three-tier rate limiting (cookie 20/session, IP 60/hr, fail-closed) — v1.0
- Origin story, systems shelf (9 systems), contact/investor section — v1.0
- /invest memo page with journey detection variant heading — v1.0
- Sticky nav, alternating backgrounds, dark mode, responsive 3-breakpoint layout — v1.0
- Accessibility baseline (focus rings, ARIA landmarks, 44px targets, reduced-motion) — v1.0
- Privacy page, footer stats, OG/Twitter meta, sitemap, robots.txt — v1.0
- Smart starter chips (scroll context > recency > time-of-day > defaults) — v1.0
- Keyboard shortcuts overlay (? key) — v1.0
- Scroll-aware chat context via IntersectionObserver — v1.0
- Conversation export via Resend email with clipboard fallback — v1.0
- Returning visitor detection (rv cookie, Redis state, 3 greeting tiers) — v1.0
- Weekly digest email via Vercel cron + Resend — v1.0
- Scroll-speed-adaptive animations (3 tiers + reduced-motion) — v1.0
- Per-system detail pages at /systems/[slug] for 13 systems — v1.0
- Section entrance animations (translateY + opacity, IntersectionObserver) — v1.0
- Living signal fade-in (600ms ease, 300ms delay) — v1.0
- DRY data source (lib/systems.ts) — v1.0
- Vercel deployment with auto-deploy on push — v1.0
- DNS repoint from Cloudflare to Vercel (DNS-only, no proxy) — v1.0

### Active

(None — v1.0 complete. Define with /gsd:new-milestone)

### Out of Scope

- Cloudflare Workers migration via v2cf — explicitly phase 2, after the site ships on Vercel
- CMS or MDX content management — content changes are infrequent, hardcoded JSX is sufficient
- Contact form — use mailto for now, form if spam becomes an issue
- Pitch deck download on /invest — text-only for now, deck added later if created for YC
- Archiving current HTML site — user chose to skip
- Shared Vercel KV with Stripped — fresh KV store for quartermint
- Custom 404 page — default Next.js 404 acceptable for v1

## Context

- **Current state:** quartermint.com is live on Vercel. Next.js 16, AI SDK v6, Upstash Redis, Resend email. 5,870 LOC TypeScript, 356 tests, 107 commits. All routes: /, /invest, /privacy, /systems/[slug].
- **Stack:** Next.js 16.2 (Turbopack), React 19, Tailwind CSS v4, AI SDK v6, @ai-sdk/anthropic, @upstash/redis + @upstash/ratelimit, Resend, React Email
- **Infrastructure:** Vercel (hosting + cron), Cloudflare (DNS only), Upstash Redis (rate limiting + visitor state + chat logs), Resend (export + digest emails)
- **Audiences:** (1) People who need systems Ryan builds — engaging with builder. (2) Investors/accelerators evaluating Ryan as founder via /invest route.

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
| Vercel over Cloudflare for v1 | Chat streaming + KV out of the box | ✓ Good — streaming works, cron works |
| Fresh AI SDK v6, not Stripped v3 port | 3 major version gap too risky to port line-by-line | ✓ Good — clean patterns, no legacy debt |
| Horizontal narrative rows for featured systems | Avoided AI-generic 2x2 card grid | ✓ Good — distinctive layout |
| Thesis stated once in hero | Greechan pitch feedback on immediate understanding | ✓ Good |
| Campaign names in prose, not logo carousel | Origin story framing, not credentials for hire | ✓ Good |
| Three-tier rate limiting (cookie + IP + fail-closed) | UX (20/session), abuse (60/hr/IP), safety (fail-closed on Redis error) | ✓ Good |
| No CMS — hardcoded JSX | Solo builder, content changes infrequent | ✓ Good |
| Upstash Redis direct (not Vercel KV) | @vercel/kv deprecated, Upstash free tier no card needed | ✓ Good |
| Lazy Resend client initialization | Avoids build crash when RESEND_API_KEY not in build env | ✓ Good |
| proxy.ts export name `proxy` not `middleware` | Next.js 16 requirement — Turbopack rejects `middleware` export | ✓ Good |

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
*Last updated: 2026-03-28 after v1.0 milestone*
