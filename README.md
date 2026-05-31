# quartermint-site

The public marketing site for **Quartermint** — multi-entity treasury infrastructure for
public affairs ("Brex for Public Affairs"). This is the quartermint.com landing page, **not**
the prototype app / schema-docs repo (`~/quartermint`).

**Status:** v2.1 live on Vercel (team `qm-r`), as of 2026-05-27.

## Stack

- **Next.js 16.2.1** (App Router) · React 19 · TypeScript (strict)
- **Tailwind v4** with CSS custom-property theming (`app/globals.css`)
- **AI chat:** `ai@6` + `@ai-sdk/anthropic`, rate-limited with `@upstash/ratelimit` + `@upstash/redis`
- **Email:** `resend` + React Email (weekly digest, conversation export)
- **Analytics:** `@vercel/analytics`

## Quick start

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve the production build
npm run lint     # eslint
npx vitest       # tests (chat QA in scripts/chat-qa.ts)
```

Copy `.env.local` from the Vercel project (`vercel env pull`). Required: `ANTHROPIC_API_KEY`,
Upstash Redis vars (auto-set by the Vercel Upstash integration), and Resend credentials.

## Design system — Editorial Treasury (non-negotiable)

The brand identity is signature and load-bearing. See `DESIGN.md` (canonical). The prior
"Cathedral mint" direction is archived in `DESIGN-ARCHIVE-2026-05-cathedral-mint.md` and must
not be reintroduced.

- **Typography:** Fraunces (display, `--font-display`) — *italic Fraunces is the signature
  accent* — Geist (body), JetBrains Mono (mono), via `next/font/google` in `app/layout.tsx`.
- **Palette:** Ledger Green `#0F3D2E` / Parchment `#FAF7EF` / Ink (dark mode) / Aged Gold
  `#B8893A` (rare accent). Tokens in `app/globals.css`.
- **Entity geometry:** the four-mark brand signature `● ◉ ▲ ■` — campaign / coalition-PAC /
  JFC / 501(c) — rendered as SVG in `components/brand/entity-mark.tsx` (not unicode glyphs).
- **Copy thesis (v2.1):** lead with *"the job isn't moving the money — it's knowing what
  moving it triggers."* The $10k Maryland independent-expenditure cascade (`app/page.tsx`) is
  the canonical anchor. Do not revert to generic "donor enrichment + filings" framing.

The whole site is `robots: noindex` by design (`app/layout.tsx`).

## Routes

- `/` — landing page (`app/page.tsx`)
- `/lm` — **password-gated** Multi-Candidate Strategist preview (shared with Bella).
  `middleware.ts` gates `/lm/*` on the `lm_access` cookie; the password is validated by
  `app/api/lm/route.ts`, which iframes `public/lm/demo.html`. To rotate the password, edit
  `PASSWORD` in `app/api/lm/route.ts`.
- `/api/chat` — embedded Anthropic chat (rate-limited)
- `/api/lm` — password validation + cookie issuance for `/lm`

## Deploy

Hosted on **Vercel**, project `quartermint-site` under the **qm-r** team (orgId
`team_EaQ0BFmeVJnHqxocLMsFfCeX` — **not** the `ryan-5143-stripe` team). Cloudflare owns DNS
only. Pushes to `main` deploy via the Vercel Git integration.

`vercel.json` declares a weekly digest cron (`/api/cron/digest`, Mondays 09:00 UTC). The
route (`app/api/cron/digest/route.ts`) aggregates the week's analytics and emails the digest
to `ryan@quartermint.com` via Resend. It requires the `CRON_SECRET` and `RESEND_API_KEY` env
vars (both already set in the Vercel project) — Vercel attaches the bearer token automatically
on cron invocations.
