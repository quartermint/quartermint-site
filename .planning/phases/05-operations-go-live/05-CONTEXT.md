# Phase 5: Operations + Go-Live - Context

**Gathered:** 2026-03-26
**Status:** Ready for planning

<domain>
## Phase Boundary

Ship the final operational layer: weekly digest email via Vercel cron, per-system detail pages at /systems/[slug], DNS repoint from Cloudflare to Vercel, scroll-speed-adaptive animations, and final end-to-end verification across all routes.

</domain>

<decisions>
## Implementation Decisions

### Weekly Digest Email
- **D-01:** Plain text email via Resend. System sans-serif font. Subject: "quartermint.com -- Week of [date]". Body: chat sessions/messages/top 3 questions/export requests//invest views. Footer: "Sent automatically. Reply to stop."
- **D-02:** Vercel cron job (weekly) calling an API route. React Email template built with `@react-email/components`.

### Per-System Detail Pages
- **D-03:** Dynamic route at `/systems/[slug]` consuming `lib/systems.ts` data. Each of the 15 systems gets a detail page rendering its full data (name, one-liner, problem, solution, tech badge, isPublic, githubUrl).
- **D-04:** Detail page layout: same max-width and nav as /invest. Content depth is whatever is available in `lib/systems.ts` — no additional content sources.

### DNS Repoint
- **D-05:** Last operation. Cloudflare retains DNS ownership. A/CNAME records point to Vercel. Only after ALL features verified on Vercel preview URLs.
- **D-06:** End-to-end verification checklist: DNS resolution, HTTPS, all routes (/, /invest, /privacy, /systems/[slug]), chat streaming, rate limiting, living signal, returning visitor flow.

### Scroll-Speed-Adaptive Animations
- **D-07:** 3 tiers from design doc: fast (<400ms/150ms/4px), medium (400-1200ms/400ms/8px), slow (>1200ms/800ms/12px). IntersectionObserver callback timing detection. All disabled with prefers-reduced-motion. Medium is default.

### Claude's Discretion
- Vercel cron schedule (e.g., Monday 9am UTC)
- Digest email data aggregation approach (query Upstash Redis for weekly stats)
- Detail page design beyond the basic data rendering
- DNS repoint verification automation

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Design Doc
- `~/.gstack/projects/quartermint-lifevault/ryanstern-unknown-design-20260326-010500.md` — Weekly digest email format, scroll-speed-adaptive animations (3-tier table), distribution plan (Vercel deploy + DNS repoint)

### Test Plan
- `~/.gstack/projects/quartermint-throughline/ryanstern-main-eng-review-test-plan-20260326-124217.md` — Critical paths for full chat flow, investor discovery flow, living signal lifecycle, static build verification

### Requirements
- `.planning/REQUIREMENTS.md` — OPS-01, OPS-03, OPS-05, ENG-06
- `.planning/ROADMAP.md` — Phase 5 success criteria

### Upstream Dependencies
- Phase 1 CONTEXT.md — `lib/systems.ts` data structure (consumed by detail pages)
- Phase 3 CONTEXT.md — Upstash Redis (digest reads chat stats from same instance)
- Phase 4 CONTEXT.md — Resend integration (digest uses same Resend account as conversation export)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `lib/systems.ts` (from Phase 1) — data source for detail pages.
- Upstash Redis (from Phase 3) — chat session data for digest aggregation.
- Resend integration (from Phase 4) — same account/SDK for digest email.
- Section entrance animations (from Phase 2) — scroll-speed detection extends the existing IntersectionObserver pattern.

### Established Patterns
- All prior phases establish the component patterns, styling, and layout conventions.
- /invest and /privacy routes (Phase 2) establish the memo-style page layout reused by detail pages.

### Integration Points
- `/systems/[slug]` dynamic route needs to generate static params from `lib/systems.ts`.
- Weekly digest cron needs read access to Upstash Redis chat/visitor data.
- DNS repoint is a manual Cloudflare operation, not code — but verification is automated.

</code_context>

<specifics>
## Specific Ideas

- The design doc says per-system detail pages are "phase 2" in its own phasing (different from our roadmap Phase 2). Our roadmap places them in Phase 5.
- Digest email should be dead simple — no complex aggregation. Count keys matching `chat:*` with timestamps in the past week.
- DNS repoint should be the absolute last step after comprehensive end-to-end verification on Vercel preview URLs.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 05-operations-go-live*
*Context gathered: 2026-03-26*
