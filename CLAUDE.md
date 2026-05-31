<!-- GSD:project-start source:PROJECT.md -->
## Project

**quartermint.com — Quartermint Company Site (Editorial Treasury)**

The public marketing site for **Quartermint**, multi-entity treasury infrastructure for
public affairs ("Brex for Public Affairs"). Next.js 16 App Router, deployed on Vercel. This
is the marketing site — **not** `~/quartermint` (the prototype app / schema-docs repo).

## Current State (v2.1 — LIVE)

quartermint.com v2.1 is LIVE on Vercel (team **qm-r**, project `quartermint-site`, orgId
`team_EaQ0BFmeVJnHqxocLMsFfCeX` — NOT the ryan-5143-stripe team). Shipped 2026-05-27.

- The Editorial Treasury restyle is **DONE**, not pending — it is the live design system.
- The v2.1 copy reframe is canonical: lead with *"the job isn't moving the money — it's
  knowing what moving it triggers."* The $10k Maryland independent-expenditure cascade
  (`app/page.tsx`) is the anchor narrative — do not revert to generic "donor enrichment +
  filings" framing.
- Site is `robots: noindex` sitewide (intentional, `app/layout.tsx`).

## /lm — Strategist Preview (password-gated)

- `/lm` serves a private preview of the Multi-Candidate Strategist (shared with Bella).
- Gate: `middleware.ts` (matcher `/lm/:path*`) requires cookie `lm_access=granted`.
- `/lm` itself renders the password form (`app/lm/page.tsx`); on success it iframes
  `public/lm/demo.html`.
- `app/api/lm/route.ts` validates a single shared password and sets a 30-day httpOnly cookie.
  To rotate the password, edit `PASSWORD` in `app/api/lm/route.ts` (no username, no DB).

## Stack (as built)

Next.js 16.2.1 (App Router) · React 19 · TypeScript strict · Tailwind v4 (`@theme`).
Chat: `ai@6` + `@ai-sdk/anthropic`, rate-limited via `@upstash/ratelimit` + `@upstash/redis`.
Email: `resend` + `@react-email` (chat@quartermint.com). Analytics: `@vercel/analytics`.
Fonts (`next/font/google`): Fraunces (`--font-display`, italic = signature), Geist
(`--font-body`), JetBrains Mono (`--font-mono`). Design tokens in `app/globals.css`; see
`DESIGN.md`. Run: `npm run dev` / `npm run build` / `npm start`. Tests: vitest.

Full stack-selection rationale (alternatives, migration notes, sources) is archived in
`.planning/` / `DESIGN.md` — research history, not durable agent guidance.

## Design system — non-negotiable

`DESIGN.md` is canonical. The prior "Cathedral mint" direction (Instrument Serif + DM Sans +
mint) is archived in `DESIGN-ARCHIVE-2026-05-cathedral-mint.md` and must not be reintroduced.
Brand signature: italic Fraunces accent + the four-mark entity geometry (● ◉ ▲ ■) rendered as
SVG in `components/brand/entity-mark.tsx` (not unicode glyphs). Palette: Ledger Green
`#0F3D2E` / Parchment `#FAF7EF` / Ink (dark) / Aged Gold `#B8893A`.

## Weekly digest cron

`vercel.json` declares a weekly cron `/api/cron/digest` (Mon 09:00 UTC). The route
(`app/api/cron/digest/route.ts`) authenticates the `Authorization: Bearer ${CRON_SECRET}`
header Vercel attaches, aggregates the week via `lib/digest/aggregate.ts`, renders
`lib/email/digest-template.tsx`, and sends to `ryan@quartermint.com` via Resend (sender
`chat@quartermint.com`). Requires `CRON_SECRET` + `RESEND_API_KEY` env vars (both in the
Vercel project). To test locally:
`curl -H "Authorization: Bearer $CRON_SECRET" localhost:3000/api/cron/digest`.
To smoke-test prod: pull `CRON_SECRET` and curl `https://quartermint.com/api/cron/digest`
with the bearer — a `{"ok":true,...}` response means aggregate + Resend send both worked.

## Infra dependency — Upstash Redis (chat + digest)

Both the chat widget and the digest read Redis via `Redis.fromEnv()` (`lib/chat/redis.ts`),
which requires **`UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN`**. Chat is **fail-closed**
(`rate-limit.ts` D-09): if Redis is unreachable, chat 503s and the digest cron 500s at the
aggregate stage.

> **Gotcha (bit us 2026-05-31):** the prior Upstash DB was deleted, so those vars resolved to
> a dead host (NXDOMAIN) — chat and digest both down. Re-provisioning via
> `vercel integration add upstash/upstash-kv` writes **`KV_*`-prefixed** env vars
> (`KV_REST_API_URL`, `KV_REST_API_TOKEN`), NOT `UPSTASH_REDIS_REST_*`. After provisioning you
> MUST copy those values into `UPSTASH_REDIS_REST_URL`/`_TOKEN` (what the app reads) and
> redeploy — env changes only apply to new deployments. Current DB: `prompt-adder-140422`.
<!-- GSD:project-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

Design tokens are `@theme` custom properties in `app/globals.css`. Fonts via
`next/font/google` in `app/layout.tsx`. Chat lives at `app/api/chat/route.ts` (Anthropic,
Upstash rate-limit). Pull env with `vercel env pull`.
<!-- GSD:conventions-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd:quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd:debug` for investigation and bug fixing
- `/gsd:execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd:profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
