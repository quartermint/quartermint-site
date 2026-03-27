# Phase 5: Operations + Go-Live - Research

**Researched:** 2026-03-27
**Domain:** Vercel deployment, cron jobs, DNS configuration, scroll animations, dynamic routes
**Confidence:** HIGH

## Summary

Phase 5 is the final operational layer: weekly digest email via Vercel cron, per-system detail pages at `/systems/[slug]`, DNS repoint from Cloudflare to Vercel, and scroll-speed-adaptive animations. The technical surface area is well-understood -- all required libraries are already installed, patterns are established from prior phases, and the infrastructure (Upstash Redis, Resend, Next.js 16 App Router) is proven in production.

The primary complexity is the digest email, which requires new Redis tracking counters (for `/invest` views and export requests -- currently untracked) plus a data aggregation function that scans `chat:index` entries from the past week. The scroll-speed-adaptive animations extend the existing `SectionWrapper` IntersectionObserver pattern with timing measurement. The system detail pages are straightforward `generateStaticParams` usage consuming the existing `lib/systems.ts` data source. DNS repoint is a manual Cloudflare operation gated behind end-to-end verification.

**Primary recommendation:** Ship in 3 plans: (1) digest email infrastructure + cron route, (2) system detail pages + sitemap update, (3) scroll-speed animations + DNS verification checklist. Animations and detail pages are independent; digest requires new tracking counters wired into existing API routes.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Plain text email via Resend. System sans-serif font. Subject: "quartermint.com -- Week of [date]". Body: chat sessions/messages/top 3 questions/export requests//invest views. Footer: "Sent automatically. Reply to stop."
- **D-02:** Vercel cron job (weekly) calling an API route. React Email template built with `@react-email/components`.
- **D-03:** Dynamic route at `/systems/[slug]` consuming `lib/systems.ts` data. Each system gets a detail page rendering its full data (name, one-liner, problem, solution, tech badge, isPublic, githubUrl).
- **D-04:** Detail page layout: same max-width and nav as /invest. Content depth is whatever is available in `lib/systems.ts` -- no additional content sources.
- **D-05:** DNS repoint is last operation. Cloudflare retains DNS ownership. A/CNAME records point to Vercel. Only after ALL features verified on Vercel preview URLs.
- **D-06:** End-to-end verification checklist: DNS resolution, HTTPS, all routes (/, /invest, /privacy, /systems/[slug]), chat streaming, rate limiting, living signal, returning visitor flow.
- **D-07:** 3 animation tiers from design doc: fast (<400ms/150ms/4px), medium (400-1200ms/400ms/8px), slow (>1200ms/800ms/12px). IntersectionObserver callback timing detection. All disabled with prefers-reduced-motion. Medium is default.

### Claude's Discretion
- Vercel cron schedule (e.g., Monday 9am UTC)
- Digest email data aggregation approach (query Upstash Redis for weekly stats)
- Detail page design beyond the basic data rendering
- DNS repoint verification automation

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| OPS-01 | Weekly digest email via Vercel cron + Resend -- plain text, system sans-serif, chat sessions/messages/top 3 questions/export requests//invest views, "Reply to stop" footer | Vercel cron configuration (vercel.json), CRON_SECRET auth pattern, Resend plain text email API, Redis aggregation of chat:index + new counters |
| OPS-03 | DNS repoint from Cloudflare to Vercel (Cloudflare retains DNS ownership, A/CNAME records to Vercel) | Cloudflare DNS-only mode (disable proxy/orange cloud), Vercel domain settings for apex + www, HTTPS auto-provisioning, verification checklist |
| OPS-05 | Per-system detail pages at /systems/[slug] -- dynamic route consuming lib/systems.ts data | Next.js 16 generateStaticParams with async params, existing System interface, sitemap.xml update |
| ENG-06 | Scroll-speed-adaptive animations (3 tiers: fast/medium/slow, all disabled with prefers-reduced-motion) | IntersectionObserver timing measurement extending existing SectionWrapper pattern, CSS custom properties for dynamic animation params, prefers-reduced-motion media query |
</phase_requirements>

## Standard Stack

### Core (Already Installed)
| Library | Version | Purpose | Status |
|---------|---------|---------|--------|
| `next` | 16.2.1 | Framework, Vercel cron host | Installed |
| `@upstash/redis` | ^1.37.0 | Digest data aggregation from chat logs | Installed |
| `resend` | ^6.9.4 | Digest email sending | Installed |
| `@react-email/components` | ^1.0.10 | Digest email template | Installed |

### No New Dependencies Required
Phase 5 requires zero new npm packages. All infrastructure is already in place from Phases 1-4.

## Architecture Patterns

### Recommended File Structure (New Files Only)
```
app/
  api/
    cron/
      digest/
        route.ts          # Weekly digest cron endpoint (GET, CRON_SECRET auth)
  systems/
    [slug]/
      page.tsx            # Per-system detail page
lib/
  digest/
    aggregate.ts          # Redis data aggregation for digest
    digest-template.tsx   # React Email template for weekly digest
components/
  section-wrapper.tsx     # MODIFY: add scroll-speed detection
vercel.json               # NEW: cron schedule configuration
```

### Pattern 1: Vercel Cron Job with CRON_SECRET Authentication
**What:** A GET route handler protected by `CRON_SECRET` Bearer token, invoked weekly by Vercel's cron scheduler.
**When to use:** Any scheduled task on Vercel.
**Key details:**
- Vercel sends `Authorization: Bearer {CRON_SECRET}` header automatically
- Hobby plan: max once per day, timing precision +/- 59 minutes within the specified hour
- Cron jobs only run on production deployments (not preview)
- No retries on failure -- must be idempotent
- User agent is always `vercel-cron/1.0`

**Example (from Vercel official docs):**
```typescript
// app/api/cron/digest/route.ts
import type { NextRequest } from 'next/server'

export function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  // ... digest logic here

  return Response.json({ success: true })
}
```

**vercel.json configuration:**
```json
{
  "crons": [
    {
      "path": "/api/cron/digest",
      "schedule": "0 9 * * 1"
    }
  ]
}
```

**Schedule recommendation (Claude's Discretion):** `0 9 * * 1` = Monday at 9:00 AM UTC. On Hobby plan, this will fire sometime between 9:00-9:59 AM UTC on Mondays. Monday morning provides a natural "last week" review cadence.

**Confidence:** HIGH (verified against Vercel official docs 2026-03-27)

### Pattern 2: Static Generation with generateStaticParams
**What:** Pre-render all system detail pages at build time using the existing `lib/systems.ts` data source.
**When to use:** Dynamic routes with a known, finite set of paths.

**Key detail for Next.js 16:** The `params` prop is now a Promise and MUST be awaited. This is different from Next.js 14/15.

**Example:**
```typescript
// app/systems/[slug]/page.tsx
import { systems } from '@/lib/systems'
import { notFound } from 'next/navigation'

export function generateStaticParams() {
  return systems.map((system) => ({ slug: system.slug }))
}

export default async function SystemPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params  // Next.js 16: params is a Promise
  const system = systems.find((s) => s.slug === slug)
  if (!system) notFound()

  return (
    // ... render system detail
  )
}
```

**Confidence:** HIGH (Next.js 16 docs confirm async params pattern)

### Pattern 3: Scroll-Speed-Adaptive Animations via IntersectionObserver Timing
**What:** Measure the time between a section entering the viewport (intersecting=false -> intersecting=true at low threshold) and reaching the 0.3 threshold. This time correlates with scroll speed.
**When to use:** Adapting animation intensity to user scroll behavior.

**Implementation approach:**
1. Use two thresholds on IntersectionObserver: `[0.01, 0.3]`
2. When element first intersects (ratio >= 0.01), record `performance.now()` timestamp
3. When element reaches 0.3 ratio, calculate elapsed time
4. Map elapsed time to animation tier: <400ms = fast, 400-1200ms = medium, >1200ms = slow
5. Apply tier-specific CSS variables: `--anim-duration`, `--anim-transform`, `--anim-easing`
6. Check `prefers-reduced-motion` media query and skip all animation if matched

**Integration point:** The existing `SectionWrapper` component already uses IntersectionObserver at 0.3 threshold with `translateY(8px)` and `400ms` duration. The scroll-speed detection extends this -- the values that are currently hardcoded become dynamic based on measured scroll speed.

**Confidence:** HIGH (IntersectionObserver timing is a well-established pattern; existing codebase pattern is clear)

### Pattern 4: Redis Aggregation for Digest Data
**What:** Scan Upstash Redis to build weekly summary statistics.
**Data sources already in Redis:**
- `chat:index` -- list of all session IDs (lpush on first message)
- `chat:{sessionId}` -- full conversation log with `startedAt` timestamp and messages array
- `visitor:{visitorId}` -- visitor state (not directly needed for digest)

**Data NOT yet tracked in Redis (must add):**
- `/invest` page views -- no current tracking mechanism
- Export request count -- exports are sent but not counted

**Aggregation approach (Claude's Discretion recommendation):**
1. Scan `chat:index` to get all session IDs
2. For each, fetch `chat:{sessionId}` and filter by `startedAt` within past 7 days
3. Count sessions, sum messages, extract user questions (role='user' messages), count by frequency
4. Read `stats:invest_views` counter (new, see below)
5. Read `stats:export_requests` counter (new, see below)

**New counters to add:**
- `stats:invest_views:{week}` -- increment in `/invest` page via a lightweight API call or proxy.ts
- `stats:export_requests:{week}` -- increment in `app/api/export/route.ts` on successful send

**Weekly key format:** Use ISO week string like `2026-W13` to allow natural rollover without cleanup.

**Confidence:** MEDIUM (aggregation approach is sound but untested; chat:index could grow large over time -- consider LRANGE with pagination)

### Anti-Patterns to Avoid
- **Cloudflare proxy (orange cloud) in front of Vercel:** Vercel explicitly warns against this. Causes lost traffic visibility, increased latency, breaks DDoS protection and Bot Protection. MUST use DNS-only mode (grey cloud).
- **Weekly cron on Hobby plan with sub-daily frequency:** Hobby plans are limited to once-per-day cron expressions. `0 9 * * 1` (weekly) is valid. `0 */6 * * *` (every 6 hours) would fail deployment.
- **Hardcoded animation values in SectionWrapper:** The current component hardcodes `duration-[400ms]` and `translate-y-2`. The scroll-speed upgrade must make these dynamic without breaking the existing animation for non-JS or reduced-motion scenarios.
- **Scanning all Redis keys with KEYS command:** Use the existing `chat:index` list, not `redis.keys('chat:*')` which is O(N) and can block Redis.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Cron scheduling | Custom interval timer or external scheduler | Vercel cron via vercel.json | Vercel handles invocation, monitoring, and production-only execution |
| Cron endpoint auth | Custom API key middleware | `CRON_SECRET` env var + Bearer check | Vercel auto-sends the header; matches their documented pattern exactly |
| Email sending | SMTP client, Nodemailer | Resend SDK (already installed) | Domain verification, deliverability, React Email integration already configured |
| Static page generation | Manual page creation for each system | `generateStaticParams` | Build-time generation with automatic 404 for unknown slugs |
| Reduced motion detection | Custom JS scroll listener | `prefers-reduced-motion` CSS media query + `window.matchMedia` | Browser-native, SSR-safe, and covers system-level accessibility settings |

## Common Pitfalls

### Pitfall 1: Hobby Plan Cron Timing Imprecision
**What goes wrong:** Cron scheduled for `0 9 * * 1` fires at 9:47 AM instead of 9:00 AM.
**Why it happens:** Vercel Hobby plans have hourly precision (+/- 59 min) to distribute load.
**How to avoid:** Design the digest to be time-insensitive. Use "past 7 days" window, not "since last Monday 9 AM."
**Warning signs:** Digest email arrives at unexpected times. Not a bug -- it is expected behavior on Hobby.

### Pitfall 2: Next.js 16 Async Params
**What goes wrong:** `params.slug` returns a Promise object instead of the slug string.
**Why it happens:** Next.js 16 made `params` async. Code that worked in 14/15 breaks silently.
**How to avoid:** Always `await params` before accessing properties. The project already does this correctly in other routes.
**Warning signs:** "Object is not a string" errors, pages rendering `[object Promise]`.

### Pitfall 3: Cloudflare Orange Cloud (Proxy) Mode
**What goes wrong:** Site loads but with intermittent SSL errors, broken streaming, increased latency, Vercel analytics show no traffic.
**Why it happens:** Cloudflare proxy intercepts traffic, breaks Vercel's edge network and TLS termination.
**How to avoid:** Set DNS records to DNS-only mode (grey cloud icon in Cloudflare dashboard). Vercel handles SSL via Let's Encrypt.
**Warning signs:** `cf-ray` headers in responses, SSL certificate showing Cloudflare instead of Vercel.

### Pitfall 4: System Count Mismatch
**What goes wrong:** Requirements and CONTEXT.md reference "15 systems" but `lib/systems.ts` contains exactly 13 (4 featured + 9 shelf). NAR-04 specifies 11 shelf systems (including ticker and signal-glass) but the data source has 9 shelf.
**Why it happens:** The requirements were written before data source was finalized. The test suite asserts 13 systems and passes.
**How to avoid:** Use the actual data source count (13 systems). The detail pages render whatever is in `lib/systems.ts`. If additional systems are needed, they must be added to `lib/systems.ts` first (and tests updated).
**Warning signs:** Test failures if system count assertions change.

### Pitfall 5: Chat Index Unbounded Growth
**What goes wrong:** `chat:index` list grows indefinitely as every new conversation is lpushed.
**Why it happens:** No TTL on the list, no cleanup mechanism.
**How to avoid:** For the weekly digest, use `LRANGE` with limits rather than `LRANGE 0 -1`. Iterate in batches. Consider adding a weekly cleanup step that trims processed entries after digest send.
**Warning signs:** Digest aggregation takes > 10 seconds, approaching Vercel function timeout.

### Pitfall 6: Missing /invest View and Export Tracking
**What goes wrong:** Digest reports 0 /invest views and 0 export requests forever.
**Why it happens:** Neither metric is currently tracked in Redis. The codebase tracks /invest journey in sessionStorage (client-side only) and exports are sent but not counted.
**How to avoid:** Add Redis INCR counters in the /invest page load path and the export API route success path BEFORE building the digest.
**Warning signs:** Digest always shows "0" for these metrics despite real traffic.

### Pitfall 7: Vercel Cron Does Not Retry
**What goes wrong:** Digest email fails (Redis timeout, Resend error) and no email is sent that week.
**Why it happens:** Vercel cron makes one attempt per invocation with no automatic retry.
**How to avoid:** Build defensive error handling in the digest route. Log errors clearly. Consider a manual trigger endpoint for re-sending.
**Warning signs:** Missing weekly digests with error logs in Vercel runtime logs.

## Code Examples

### Weekly Digest Cron Route (Skeleton)
```typescript
// app/api/cron/digest/route.ts
// Source: Vercel cron docs + project patterns
import type { NextRequest } from 'next/server'
import { redis } from '@/lib/chat/redis'
import { Resend } from 'resend'
import type { ChatLog } from '@/lib/chat/types'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function GET(request: NextRequest) {
  // Auth check (Vercel sends CRON_SECRET as Bearer token)
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  const oneWeekAgo = new Date(Date.now() - 7 * 86400000).toISOString()

  // Aggregate chat data from Redis
  const sessionIds = await redis.lrange('chat:index', 0, -1)
  let totalSessions = 0
  let totalMessages = 0
  const questionCounts: Record<string, number> = {}

  for (const id of sessionIds) {
    const log = await redis.get<ChatLog>(`chat:${id}`)
    if (!log || log.startedAt < oneWeekAgo) continue
    totalSessions++
    totalMessages += log.messages.length
    // Count user questions for "top 3"
    for (const msg of log.messages) {
      if (msg.role === 'user') {
        const q = msg.content.slice(0, 80)
        questionCounts[q] = (questionCounts[q] || 0) + 1
      }
    }
  }

  const topQuestions = Object.entries(questionCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([q]) => q)

  // Read weekly counters
  const weekKey = getISOWeek() // e.g. "2026-W13"
  const investViews = await redis.get<number>(`stats:invest_views:${weekKey}`) ?? 0
  const exportRequests = await redis.get<number>(`stats:export_requests:${weekKey}`) ?? 0

  // Format and send plain text email via Resend
  const weekOf = new Date().toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric'
  })

  const body = [
    `Chat sessions: ${totalSessions}`,
    `Messages: ${totalMessages}`,
    `Top questions:`,
    ...topQuestions.map((q, i) => `  ${i + 1}. ${q}`),
    `Export requests: ${exportRequests}`,
    `/invest views: ${investViews}`,
    ``,
    `Sent automatically. Reply to stop.`,
  ].join('\n')

  await resend.emails.send({
    from: 'quartermint.com <chat@quartermint.com>',
    to: ['ryan@quartermint.com'],
    subject: `quartermint.com -- Week of ${weekOf}`,
    text: body,
  })

  return Response.json({ success: true, sessions: totalSessions })
}
```

### System Detail Page with generateStaticParams
```typescript
// app/systems/[slug]/page.tsx
import { systems } from '@/lib/systems'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export function generateStaticParams() {
  return systems.map((system) => ({ slug: system.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const system = systems.find((s) => s.slug === slug)
  if (!system) return {}
  return {
    title: `${system.name} -- Ryan Stern`,
    description: system.oneLiner,
    alternates: { canonical: `https://quartermint.com/systems/${slug}` },
  }
}

export default async function SystemPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const system = systems.find((s) => s.slug === slug)
  if (!system) notFound()

  return (
    <div className="max-w-[var(--spacing-invest-max)] mx-auto ...">
      {/* System detail content */}
    </div>
  )
}
```

### Scroll-Speed Detection in SectionWrapper
```typescript
// Extending existing SectionWrapper IntersectionObserver
// Two-threshold approach for timing measurement

useEffect(() => {
  if (noAnimation) return

  // Check reduced motion preference
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches
  if (prefersReducedMotion) {
    setIsVisible(true) // Show immediately, no animation
    return
  }

  const el = ref.current
  if (!el) return
  let entryTime: number | null = null

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting && entry.intersectionRatio >= 0.01 && !entryTime) {
        entryTime = performance.now()
      }
      if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
        const elapsed = entryTime ? performance.now() - entryTime : 600
        // Map to tier
        if (elapsed < 400) {
          setAnimTier('fast')      // 150ms, 4px, ease-out
        } else if (elapsed > 1200) {
          setAnimTier('slow')      // 800ms, 12px, ease-in-out
        } else {
          setAnimTier('medium')    // 400ms, 8px, ease (default)
        }
        setIsVisible(true)
        observer.unobserve(el)
      }
    },
    { threshold: [0.01, 0.3] }
  )

  observer.observe(el)
  return () => observer.disconnect()
}, [noAnimation])
```

### vercel.json Cron Configuration
```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "crons": [
    {
      "path": "/api/cron/digest",
      "schedule": "0 9 * * 1"
    }
  ]
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `middleware.ts` | `proxy.ts` | Next.js 16 | Project already uses `proxy.ts` -- no action needed |
| `@vercel/kv` | `@upstash/redis` | 2025 deprecation | Project already uses `@upstash/redis` -- no action needed |
| Sync `params` in page components | Async `params` (must `await`) | Next.js 16 | All new pages must await params |
| `tailwind.config.js` | CSS-first `@theme` | Tailwind v4 | Project already uses `@theme` -- no action needed |

## Open Questions

1. **System count: 13 vs 15**
   - What we know: `lib/systems.ts` has 13 systems (4 featured + 9 shelf). Tests assert 13. Requirements say "15 systems" and NAR-04 lists 11 shelf systems (including ticker and signal-glass which are not in the data source).
   - What's unclear: Whether the user wants to add ticker and signal-glass to `lib/systems.ts` before building detail pages.
   - Recommendation: Build detail pages for all systems present in `lib/systems.ts` (currently 13). If systems are added later, pages are auto-generated. Note this in the plan as a potential human action item.

2. **Hobby vs Pro Vercel plan**
   - What we know: Hobby plan supports daily cron (sufficient for weekly digest), but timing is imprecise (+/- 59 min). The chat route already has `maxDuration = 60`.
   - What's unclear: Whether the project is on Hobby or Pro. STATE.md flagged this as a concern during Phase 3.
   - Recommendation: The weekly digest works on either plan. Document that timing imprecision is expected on Hobby.

3. **Resend domain verification status**
   - What we know: `.continue-here.md` lists Resend domain verification (SPF/DKIM/DMARC for quartermint.com) as a blocking human action before Phase 5 execution.
   - What's unclear: Whether this is done yet.
   - Recommendation: Mark as a prerequisite in the plan. The export route already sends from `chat@quartermint.com` -- if that's working in dev, domain verification may already be in progress or complete.

4. **/invest view tracking mechanism**
   - What we know: No server-side tracking of /invest page views exists. sessionStorage is client-only.
   - What's unclear: Best place to increment -- proxy.ts (runs on every request) vs. a lightweight API call from the /invest page vs. server component request-time increment.
   - Recommendation: Increment in `proxy.ts` where the path matches `/invest`. This is lightweight, requires no client JS, and runs on every /invest page load. The proxy already runs for all non-API/static routes.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Next.js 16 runtime | Verified (Phases 1-4 running) | 22.x | -- |
| Vercel CLI | Production deployment | Not checked locally (deploy via git push) | -- | Git push to main triggers auto-deploy |
| Upstash Redis | Digest aggregation | Verified (chat + rate limit working) | HTTP API | -- |
| Resend | Digest email | Verified (export email working) | SDK ^6.9.4 | -- |
| Cloudflare DNS | DNS repoint | External service (manual operation) | -- | -- |
| GitHub repo | Vercel auto-deploy | Listed as blocking human action | -- | Manual Vercel deployment |

**Missing dependencies with no fallback:**
- GitHub repo creation (human action, blocks Vercel auto-deploy)
- Vercel project linked to repo (human action, blocks production deployment)
- Vercel env vars configured (ANTHROPIC_API_KEY, UPSTASH_*, RESEND_API_KEY, CRON_SECRET)
- Resend domain verification for chat@quartermint.com

**Missing dependencies with fallback:**
- None -- all technical dependencies are already installed and verified.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.2 |
| Config file | `vitest.config.ts` |
| Quick run command | `npx vitest run --reporter=verbose` |
| Full suite command | `npx vitest run --reporter=verbose` |

### Phase Requirements to Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| OPS-01 | Weekly digest cron route exists, authenticates with CRON_SECRET, aggregates Redis data, sends email via Resend | unit | `npx vitest run __tests__/digest.test.ts -x` | Wave 0 |
| OPS-03 | DNS verification checklist (manual) + all routes return 200 | manual + smoke | Manual verification on production URL | N/A |
| OPS-05 | /systems/[slug] route exists, renders system data, returns 404 for unknown slugs, generateStaticParams returns all systems | unit | `npx vitest run __tests__/systems-detail.test.ts -x` | Wave 0 |
| ENG-06 | SectionWrapper applies scroll-speed tiers, respects prefers-reduced-motion | unit | `npx vitest run __tests__/scroll-speed.test.ts -x` | Wave 0 |

### Sampling Rate
- **Per task commit:** `npx vitest run --reporter=verbose`
- **Per wave merge:** `npx vitest run --reporter=verbose`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `__tests__/digest.test.ts` -- covers OPS-01 (cron route auth, data aggregation, email content format)
- [ ] `__tests__/systems-detail.test.ts` -- covers OPS-05 (generateStaticParams, page rendering, 404 for unknown slug)
- [ ] `__tests__/scroll-speed.test.ts` -- covers ENG-06 (animation tiers, prefers-reduced-motion disable)

*(Existing test infrastructure covers all other needs -- vitest config, path aliases, React plugin are all configured)*

## Project Constraints (from CLAUDE.md)

- **Hosting:** Vercel for v1. Fresh project on existing Vercel account. Cloudflare owns DNS only.
- **GSD Workflow:** Before using Edit, Write, or other file-changing tools, start work through a GSD command.
- **Design system:** CSS custom properties via `@theme` in `globals.css`. No shadcn/ui.
- **Stack:** Next.js 16.2.x, React 19, AI SDK v6, Tailwind v4, Upstash Redis (not @vercel/kv), Resend.
- **Git workflow:** Work on main. No feature branches unless rare and short-lived.
- **Testing:** Vitest. Run tests when they exist.
- **Proxy:** Use `proxy.ts` (not `middleware.ts`).

## Sources

### Primary (HIGH confidence)
- [Vercel Cron Jobs documentation](https://vercel.com/docs/cron-jobs) -- cron expression format, how invocations work, production-only execution
- [Vercel Cron Jobs Quickstart](https://vercel.com/docs/cron-jobs/quickstart) -- vercel.json config pattern, route handler setup
- [Vercel Cron Jobs Management](https://vercel.com/docs/cron-jobs/manage-cron-jobs) -- CRON_SECRET Bearer auth, error handling (no retries), idempotency, local testing
- [Vercel Cron Usage & Pricing](https://vercel.com/docs/cron-jobs/usage-and-pricing) -- Hobby: max 1/day, hourly precision; Pro: per-minute precision
- [Cloudflare + Vercel guidance](https://vercel.com/docs/integrations/external-platforms/cloudflare) -- DO NOT use Cloudflare proxy, use DNS-only mode
- [Next.js generateStaticParams](https://nextjs.org/docs/app/api-reference/functions/generate-static-params) -- dynamic route static generation
- [Resend plain text emails](https://resend.com/docs/api-reference/emails/send-email) -- `text` parameter for plain text, auto-generation from html/react
- Project codebase: `lib/systems.ts`, `lib/chat/conversation-log.ts`, `lib/chat/redis.ts`, `components/section-wrapper.tsx`, `app/api/export/route.ts`, `proxy.ts`

### Secondary (MEDIUM confidence)
- [Cloudflare community: DNS records for Vercel](https://community.cloudflare.com/t/help-setting-up-a-cname-record-from-vercel/636105) -- A/CNAME record patterns, grey cloud requirement
- Design doc (`ryanstern-unknown-design-20260326-010500.md`) -- scroll-speed animation tiers table, weekly digest format spec

### Tertiary (LOW confidence)
- None -- all findings verified against official sources.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- zero new dependencies, all libraries verified in prior phases
- Architecture: HIGH -- Vercel cron, generateStaticParams, and IntersectionObserver are well-documented patterns
- Pitfalls: HIGH -- identified from official docs (Hobby cron limits, Cloudflare proxy warning) and codebase audit (missing Redis counters, system count mismatch)

**Research date:** 2026-03-27
**Valid until:** 2026-04-27 (stable -- no fast-moving dependencies)
