---
phase: 05-operations-go-live
plan: 03
status: complete
started: 2026-03-27T21:30:00Z
completed: 2026-03-27T22:10:00Z
duration_minutes: 40
tasks_completed: 2
tasks_total: 2
---

# Plan 05-03 Summary: Scroll-Speed Animations + DNS Repoint

## What Was Built

1. **Scroll-speed-adaptive animations** — SectionWrapper upgraded with dual IntersectionObserver thresholds (0.01 entry, 0.3 visible) that measure elapsed time to classify scroll speed into 3 tiers:
   - Fast (<400ms): 150ms duration, 4px translateY
   - Medium (400-1200ms): 400ms duration, 8px translateY (default)
   - Slow (>1200ms): 800ms duration, 12px translateY
   - All disabled when prefers-reduced-motion is set

2. **DNS repoint + go-live** — quartermint.com live on Vercel with HTTPS:
   - GitHub repo created (quartermint/quartermint-site)
   - Vercel project linked with all 5 env vars
   - Cloudflare DNS: A record → 76.76.21.21, CNAME www → cname.vercel-dns.com (DNS-only)
   - Resend domain verification initiated (DKIM, SPF records added)
   - All routes verified on production: /, /invest, /privacy, /systems/[slug], 404s

3. **Favicon** — Default Vercel favicon replaced with mint Q monogram SVG

## Build Fixes During Deploy

- `proxy.ts`: Renamed `middleware` export to `proxy` (Next.js 16 requirement)
- Resend client: Changed from module-level to lazy initialization (`getResend()`) to avoid build crash when RESEND_API_KEY not in build env
- Vercel env vars: Fixed trailing whitespace from CLI piping (used `printf '%s'` instead of heredoc)

## Key Files

### Created
- `app/icon.svg` — Mint Q monogram favicon

### Modified
- `components/section-wrapper.tsx` — Scroll-speed-adaptive animations
- `__tests__/scroll-speed.test.ts` — 3-tier animation tests
- `__tests__/section-wrapper.test.ts` — Updated for new thresholds
- `proxy.ts` — middleware→proxy export rename
- `app/api/cron/digest/route.ts` — Lazy Resend init
- `app/api/export/route.ts` — Lazy Resend init

## Decisions

- [05-03]: Vercel env vars require `printf '%s'` to avoid trailing newlines from shell piping
- [05-03]: Resend client must be lazy-initialized for build-time safety (no API key at build)
- [05-03]: Next.js 16 Turbopack requires `export function proxy` not `export function middleware`

## Self-Check: PASSED

All production routes return expected status codes. HTTPS active. No cf-ray header (Cloudflare proxy correctly disabled).
