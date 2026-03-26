<!-- GSD:project-start source:PROJECT.md -->
## Project

**quartermint.com — Cathedral Hybrid Narrative**

A personal founder site for Ryan Stern at quartermint.com that tells the story of a builder-operator with a thesis and a body of work. Replaces the current consultant-positioning landing page with a narrative-driven site featuring an embedded AI chat interface (ported from Stripped/Relay), empathy-first system showcases, an investor-facing /invest route, and a visual design system rooted in editorial typography and mint color palette. The site itself demonstrates the thesis: information routed to the right person, in the right form, at the right time.

**Core Value:** A visitor with no context understands what Ryan builds and why within 60 seconds — and can interact with the site to get answers in real time via the embedded chat.

### Constraints

- **Solo builder**: Must ship and maintain without a team
- **Hosting**: Vercel for v1 (chat streaming + KV out of the box). Fresh project on existing Vercel account. Cloudflare owns DNS only.
- **Timeline**: Build immediately — not gated on May 4 YC deadline, ship as fast as possible
- **Chat dependency**: Requires ANTHROPIC_API_KEY (existing, same key as Stripped deployment)
- **Email dependency**: Requires Resend account for conversation export and weekly digest (chat@quartermint.com sender)
- **Carry-over assets**: Google Calendar booking link, email address, headshot (assets/images/hero/ryan-160.png from current site)
- **Copy quality**: Hero copy is a PRE-BUILD BLOCKER — locked in the design doc, must not ship with placeholder text
- **Design system**: Visual system fully specified in design doc — Instrument Serif + DM Sans, mint palette, CSS custom properties only
<!-- GSD:project-end -->

<!-- GSD:stack-start source:research/STACK.md -->
## Technology Stack

## Recommended Stack
### Core Technologies
| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Next.js | 16.2.x | Full-stack React framework | Current stable (16.2.1 as of 2026-03-25). Greenfield project should use latest -- Turbopack is now default bundler with 87% faster startup, `use cache` directive replaces implicit caching, and middleware renamed to `proxy.ts` (Node.js runtime). Next.js 15 is entering maintenance mode. **Confidence: HIGH** |
| React | 19.x | UI library | Required by Next.js 16. Ships with React 19.2 canary features including improved streaming and concurrent rendering. **Confidence: HIGH** |
| TypeScript | ~5.7 | Type safety | Next.js 16 requires minimum 5.1.3 for async Server Components; use latest 5.x for best DX and type inference. **Confidence: HIGH** |
| Tailwind CSS | 4.2.x | Utility-first CSS | v4 is a ground-up Rust-based rewrite with CSS-first configuration via `@theme` directive. Design tokens become CSS custom properties automatically -- aligns perfectly with the project's CSS custom properties design system requirement. 5x faster full builds, 100x faster incremental builds. **Confidence: HIGH** |
### AI Chat Stack
| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| `ai` | ^6.0.x | Core AI SDK | AI SDK 6 is current major. Stripped uses `ai@^3.4.33` which is 3 major versions behind. The v6 release has minimal breaking changes from v5 (codemod available via `npx @ai-sdk/codemod v6`), but the jump from v3 is significant -- `generateObject`/`streamObject` are deprecated in favor of `streamText` with `output` setting. Worth starting fresh on v6 rather than porting v3 patterns. **Confidence: HIGH** |
| `@ai-sdk/anthropic` | ^3.0.x | Anthropic provider | Current version 3.0.64. Stripped uses `^0.0.55`. Supports Claude Opus 4.5/4.6 with effort/speed options, tool call streaming. Same import patterns but major version bump. **Confidence: HIGH** |
| `@ai-sdk/react` | ^3.0.x | React hooks (`useChat`) | Provides `useChat` hook for streaming chat UI. In AI SDK 5+, useChat uses a transport-based architecture and no longer manages input state internally -- different from the v3-era patterns in Stripped. **Confidence: HIGH** |
### Data & Infrastructure
| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| `@upstash/redis` | ^1.37.x | Session storage, rate limiting data | **`@vercel/kv` is DEPRECATED** (no longer available for new projects). Upstash Redis is the official replacement -- same underlying infrastructure (Vercel KV was always whitelabeled Upstash), HTTP-based/connectionless, works on serverless. Install via Vercel Marketplace integration for automatic env var setup. **Confidence: HIGH** |
| `@upstash/ratelimit` | ^2.0.x | IP-based rate limiting | Purpose-built serverless rate limiting on top of Upstash Redis. Supports sliding window, fixed window, and token bucket algorithms. Handles the 60/hr IP cap requirement natively. No TCP connections needed. **Confidence: HIGH** |
### Email
| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| `resend` | ^6.9.x | Transactional email API | Conversation export emails and weekly digest. Developer-first API, React Email integration, simple SDK. 1.67M weekly npm downloads. **Confidence: HIGH** |
| `@react-email/components` | ^1.0.x | Email templates in JSX | Build email templates as React components -- digest email and conversation export template. Supports Tailwind 4 and React 19. Pairs natively with Resend. **Confidence: HIGH** |
### Typography & Fonts
| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| `next/font/google` | (bundled) | Self-hosted Google Fonts | Auto-self-hosts Instrument Serif and DM Sans at build time. Zero external requests to Google at runtime. Works identically in Next.js 16 as it has since v13. **Confidence: HIGH** |
### Rendering & Content
| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| `react-markdown` | ^10.1.0 | Chat message rendering | Renders AI chat responses as markdown with proper formatting. Same version as Stripped -- stable, no changes needed. **Confidence: HIGH** |
| `remark-gfm` | ^4.0.x | GitHub-flavored markdown | Tables, strikethrough, task lists in chat responses. **Confidence: HIGH** |
### Analytics & Monitoring
| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| `@vercel/analytics` | ^2.0.x | Page view analytics | Free tier covers a personal site. Resilient intake in v2 improves data collection. One-line setup in root layout. **Confidence: HIGH** |
### Development Tools
| Tool | Purpose | Notes |
|------|---------|-------|
| `@tailwindcss/postcss` | Tailwind v4 PostCSS plugin | Required for Tailwind v4 with Next.js. Replace `tailwindcss` and `autoprefixer` in postcss config with single `@tailwindcss/postcss` plugin. |
| `eslint` + `eslint-config-next` | Linting | Bundled with `create-next-app`. Next.js 16 version. |
| `@types/react` + `@types/react-dom` | React type definitions | Use latest React 19 types (`^19`). |
| `@types/node` | Node.js types | Use `^22` for current LTS. |
## Installation
# Initialize project
# Core AI chat
# Data infrastructure (rate limiting + session)
# Email
# Chat content rendering
# Analytics
# Dev dependencies (Tailwind v4 should be set up by create-next-app)
# If not, manually:
## Critical Migration Notes (Stripped -> quartermint)
| Stripped Version | quartermint Version | Migration Impact |
|-----------------|---------------------|------------------|
| `next@14.2.35` | `next@16.2.x` | Major. `middleware.ts` renamed to `proxy.ts`. Async request APIs (params, searchParams must be awaited). Turbopack default. `use cache` replaces implicit caching. |
| `ai@^3.4.33` | `ai@^6.0.x` | Major. 3 major versions. `useChat` API changed (transport-based, no internal input state). `streamText` patterns updated. Start fresh, don't port line-by-line. |
| `@ai-sdk/anthropic@^0.0.55` | `@ai-sdk/anthropic@^3.0.x` | Major. Import paths same but API surface different. |
| `@vercel/kv@^3.0.0` | `@upstash/redis@^1.37.x` | **Package replaced entirely.** `@vercel/kv` is deprecated. Switch to `@upstash/redis` + `@upstash/ratelimit`. API is similar but not identical. |
| `tailwindcss@^3.4.1` | `tailwindcss@4.2.x` | Major. No `tailwind.config.js` -- use `@theme` in CSS. No `@tailwind` directives -- use `@import 'tailwindcss'`. |
| `react@^18` | `react@^19` | Major. React 19 required by Next.js 16. |
## Alternatives Considered
| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Next.js 16 | Next.js 15 | Never for greenfield. 15 is entering maintenance. Only if a critical dependency is incompatible with 16 (unlikely for this stack). |
| Next.js 16 | Astro + React islands | If the site were content-heavy with minimal interactivity. But embedded chat requires full React hydration on most pages, making Astro's island model more complex than helpful. |
| `@upstash/redis` | `@vercel/kv` | Never. `@vercel/kv` is deprecated for new projects. |
| `@upstash/redis` | Direct Redis (ioredis) | Only if you need pub/sub or complex Redis operations. For KV + rate limiting, Upstash's HTTP client is simpler and works on serverless without connection management. |
| `@upstash/ratelimit` | Custom rate limiting in proxy.ts | Only if rate limiting logic is trivial. The 3-tier rate limiting spec (cookie session + IP cap + budget alert) benefits from a purpose-built library. |
| Tailwind CSS v4 | CSS Modules only | If you want zero build-tool CSS. But Tailwind v4's `@theme` directive gives CSS custom properties for free AND utility classes -- perfect for the mint color palette + editorial typography system. |
| Tailwind CSS v4 | Tailwind CSS v3 | Never for greenfield. v4 is stable, faster, and its CSS-first config with `@theme` aligns with the project's CSS custom properties requirement. |
| `resend` | Nodemailer + SMTP | If you need to send from your own SMTP server. Resend is simpler for transactional email, has React Email integration, and handles deliverability. |
| `resend` | AWS SES | If sending high volume (10K+/month). For a personal site's conversation exports and weekly digests, Resend's free tier (100 emails/day) is more than sufficient. |
| `react-markdown` | `marked` + sanitizer | If you need more control over HTML output. `react-markdown` renders directly to React components, which is safer (no raw HTML injection) and integrates naturally with the chat UI. |
## What NOT to Use
| Avoid | Why | Use Instead |
|-------|-----|-------------|
| `@vercel/kv` | Deprecated. Not available for new Vercel projects. | `@upstash/redis` + `@upstash/ratelimit` |
| `ai@3.x` or `ai@4.x` | 3 major versions behind. Missing agent abstractions, updated streaming patterns, provider-specific tools. | `ai@^6.0.x` |
| `tailwind.config.js` | Tailwind v4 uses CSS-first configuration via `@theme`. JS config is the v3 way. | `@theme` directive in your global CSS file |
| `middleware.ts` | Renamed to `proxy.ts` in Next.js 16. Still works but shows deprecation warning and will be removed. | `proxy.ts` with Node.js runtime |
| `autoprefixer` | Not needed with Tailwind v4 -- the `@tailwindcss/postcss` plugin handles vendor prefixes internally. | Just `@tailwindcss/postcss` in PostCSS config |
| `@tailwindcss/typography` | The prose plugin exists for v4 but may not be needed -- chat messages use `react-markdown` which renders React components directly. Only add if you need long-form article styling on /invest. | Custom styles on `react-markdown` components via Tailwind utilities |
| CSS-in-JS (styled-components, Emotion) | Incompatible with React Server Components. Tailwind v4 + CSS custom properties handles all styling needs. | Tailwind v4 + CSS custom properties |
| shadcn/ui | Overkill for a narrative site with editorial typography. The design system is custom (Instrument Serif + DM Sans + mint palette), not a component library pattern. Adds unnecessary abstraction. | Custom components with Tailwind utilities |
| Next.js Pages Router | App Router is the only actively developed routing model. Pages Router receives no new features. | App Router exclusively |
## Stack Patterns
- Define all colors, fonts, and spacing as `@theme` tokens in `app/globals.css`
- Tailwind v4 automatically creates CSS custom properties AND utility classes from `@theme`
- Use `next/font/google` to self-host Instrument Serif (display) and DM Sans (body)
- Apply fonts via CSS custom properties referenced in `@theme`
- Use `streamText` from `ai` in an App Router route handler (`app/api/chat/route.ts`)
- Use `useChat` from `@ai-sdk/react` in the client-side chat component
- System prompt built from identityvault data at build time or request time
- 500-token response cap via `maxTokens` parameter on `streamText`
- **Tier 1 (UX):** Cookie-based session counter (20 messages) -- client-side cookie + server validation
- **Tier 2 (Abuse):** IP-based hard cap (60/hr) via `@upstash/ratelimit` with sliding window algorithm
- **Tier 3 (Budget):** Monthly Anthropic API spend tracking in Upstash Redis, alert at $50 threshold
- Runs on Node.js runtime in Next.js 16 (not Edge)
- Use for: rate limiting checks, scroll-aware header injection, /invest journey detection
- Keep it thin -- delegate to `@upstash/ratelimit` for actual rate limit logic
- Build email templates as React components with `@react-email/components`
- Send via `resend` SDK from API routes
- Weekly digest via Vercel Cron Job (`vercel.json` cron config) calling an API route
## Version Compatibility
| Package | Compatible With | Notes |
|---------|-----------------|-------|
| `next@16.2.x` | `react@^19`, `typescript@>=5.1.3` | Turbopack is default bundler. React 19 required. |
| `ai@^6.0.x` | `@ai-sdk/react@^3.0.x`, `@ai-sdk/anthropic@^3.0.x` | All AI SDK packages must be on v6-compatible versions. Don't mix v3/v4 provider packages with v6 core. |
| `tailwindcss@4.2.x` | `@tailwindcss/postcss@4.2.x` | Must match major.minor versions. No `tailwind.config.js` needed. |
| `@react-email/components@^1.0.x` | `react@^19`, `resend@^6.x` | Supports Tailwind 4 for email styling and React 19. |
| `@upstash/ratelimit@^2.0.x` | `@upstash/redis@^1.37.x` | Ratelimit is built on top of the Redis client. Both must be Upstash packages. |
## Environment Variables
# Anthropic (reuse existing key from Stripped deployment)
# Upstash Redis (auto-populated by Vercel Marketplace integration)
# Resend
# Optional: Vercel Analytics (auto-enabled, no env var needed)
## Sources
- [Next.js 16 blog post](https://nextjs.org/blog/next-16) -- Next.js 16 features, Turbopack default, proxy rename -- **HIGH confidence**
- [Next.js 16.2 blog post](https://nextjs.org/blog/next-16-2) -- Latest stable release, performance improvements -- **HIGH confidence**
- [Next.js 16 upgrade guide](https://nextjs.org/docs/app/guides/upgrading/version-16) -- middleware to proxy migration, async APIs -- **HIGH confidence**
- [AI SDK 6 announcement](https://vercel.com/blog/ai-sdk-6) -- Agent abstractions, minimal breaking changes from v5 -- **HIGH confidence**
- [AI SDK 5.x to 6.0 migration](https://ai-sdk.dev/docs/migration-guides/migration-guide-6-0) -- Breaking changes, codemod -- **HIGH confidence**
- [@ai-sdk/anthropic npm](https://www.npmjs.com/package/@ai-sdk/anthropic) -- Version 3.0.64 current -- **HIGH confidence**
- [@upstash/redis npm](https://www.npmjs.com/package/@upstash/redis) -- Version 1.37.0, connectionless HTTP client -- **HIGH confidence**
- [@upstash/ratelimit npm](https://www.npmjs.com/package/@upstash/ratelimit) -- Version 2.0.8, serverless rate limiting -- **HIGH confidence**
- [Vercel KV deprecation](https://www.npmjs.com/package/@vercel/kv) -- Deprecated, use @upstash/redis -- **HIGH confidence**
- [Tailwind CSS v4.0 announcement](https://tailwindcss.com/blog/tailwindcss-v4) -- Rust engine, CSS-first config, @theme directive -- **HIGH confidence**
- [Tailwind theme variables docs](https://tailwindcss.com/docs/theme) -- @theme directive, CSS custom properties -- **HIGH confidence**
- [Tailwind + Next.js setup](https://tailwindcss.com/docs/guides/nextjs) -- @tailwindcss/postcss setup for Next.js -- **HIGH confidence**
- [resend npm](https://www.npmjs.com/package/resend) -- Version 6.9.4, 1.67M weekly downloads -- **HIGH confidence**
- [React Email 5.0](https://resend.com/blog/react-email-5) -- Tailwind 4 + React 19 support -- **HIGH confidence**
- [Next.js font optimization](https://nextjs.org/docs/app/getting-started/fonts) -- next/font/google self-hosting -- **HIGH confidence**
- [@vercel/analytics npm](https://www.npmjs.com/package/@vercel/analytics) -- Version 2.0.1 with resilient intake -- **HIGH confidence**
- Stripped project `package.json` (`~/stripped/package.json`) -- Reference architecture versions (outdated) -- **HIGH confidence** (local source)
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

Conventions not yet established. Will populate as patterns emerge during development.
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

Architecture not yet mapped. Follow existing patterns found in the codebase.
<!-- GSD:architecture-end -->

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
