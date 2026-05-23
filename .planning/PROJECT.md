# quartermint.com — Quartermint Company Site (Editorial Treasury)

## What This Is

The marketing site for **Quartermint**, multi-entity financial infrastructure for political organizations ("Brex for Public Affairs" — YC S26 pitch). Lives at quartermint.com and shares its visual identity with the product app (`~/quartermint`). Built on the **Editorial Treasury** design system: Fraunces + Geist typography, Ledger Green + Parchment + Ink palette, and the four-mark **entity-geometry** brand signature (● ◉ ▲ ■) encoding the legal entity types Quartermint serves — campaigns, coalition PACs, JFCs, and 501(c)(3)/(c)(4)s. Old-money typographic gravity executed with modern fintech rigor.

> **Pivot 2026-05-23:** This site was previously a personal founder site for Ryan Stern under the "Cathedral Hybrid Narrative" direction (Instrument Serif + DM Sans, mint palette, embedded AI chat). That direction is archived at `DESIGN-ARCHIVE-2026-05-cathedral-mint.md` and is no longer active. The canonical visual spec is now `DESIGN.md`. The v1.0 codebase shipped under the prior direction; restyling to Editorial Treasury is tracked as a separate engineering milestone.

## Core Value

A YC partner, banker at Amalgamated, or political-ops director landing on quartermint.com understands within 30 seconds that Quartermint is the serious, modern treasury platform built for the four legal entity types political organizations actually use — and leaves with the takeaway *"this is what political ops should have had 20 years ago — finally modern."*

## Audiences (priority order)

1. YC partners reviewing the S26 application
2. Amalgamated Bank distribution conversations
3. Political ops directors / treasurers
4. Compliance counsel and auditors

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

- **Current state:** quartermint.com is live on Vercel under the prior (Cathedral Hybrid Narrative) v1.0 codebase. Next.js 16, AI SDK v6, Upstash Redis, Resend email. 5,870 LOC TypeScript, 356 tests, 107 commits. All routes: /, /invest, /privacy, /systems/[slug]. The Editorial Treasury restyle and Quartermint-the-company information architecture is a separate engineering milestone, not yet executed.
- **Stack:** Next.js 16.2 (Turbopack), React 19, Tailwind CSS v4, AI SDK v6, @ai-sdk/anthropic, @upstash/redis + @upstash/ratelimit, Resend, React Email
- **Infrastructure:** Vercel (hosting + cron), Cloudflare (DNS only), Upstash Redis (rate limiting + visitor state + chat logs), Resend (export + digest emails)
- **Canonical design doc:** `DESIGN.md` (Editorial Treasury). Prior direction at `DESIGN-ARCHIVE-2026-05-cathedral-mint.md`.

## Constraints

- **Solo builder**: Must ship and maintain without a team
- **Hosting**: Vercel (existing project, chat streaming + KV out of the box). Cloudflare owns DNS only.
- **Canonical design doc**: `DESIGN.md` (Editorial Treasury). Prior direction preserved at `DESIGN-ARCHIVE-2026-05-cathedral-mint.md`.
- **Visual ground-truth:** `~/.gstack/projects/quartermint/designs/design-system-20260523/round3-/variant-A.png` (approved 10/10 dashboard mockup applying the Editorial Treasury system)
- **Brand signature (non-negotiable):** Entity-geometry marks (● ◉ ▲ ■) must appear in lockup, hero proof element, section dividers, favicon, and OG images
- **Typography**: Fraunces (display serif) + Geist (sans body), self-hosted via `next/font/google`
- **Anti-patterns (forbidden):** purple gradients, 3-column-icon SaaS feature grids, bubble border-radius, partisan red/blue as primary, Capitol/dome/shield illustration, Inter/Roboto as primary type
- **Chat dependency**: ANTHROPIC_API_KEY (existing, same key as Stripped deployment) — the embedded chat capability ships from v1.0 and remains
- **Email dependency**: Resend account for conversation export and weekly digest (chat@quartermint.com sender)

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
| **Pivot to Quartermint company site (Editorial Treasury)** — 2026-05-23 | quartermint.com is the natural home for the Quartermint-the-company brand (YC S26 pitch); founder-narrative direction outlived its purpose | Active — canonical design at `DESIGN.md`, prior direction preserved at `DESIGN-ARCHIVE-2026-05-cathedral-mint.md`; restyle is a separate engineering milestone |

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
*Last updated: 2026-05-23 — pivot from "Cathedral Hybrid Narrative" personal founder site to Quartermint-the-company site under Editorial Treasury design system. Prior content (v1.0 milestone, validated requirements, key decisions) preserved above for historical record.*

*Previously updated: 2026-03-28 after v1.0 milestone*
