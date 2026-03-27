# Phase 2: Static Narrative Content - Research

**Researched:** 2026-03-26
**Domain:** Next.js 16 App Router static content, ISR data fetching, SEO metadata, Vercel deployment, scroll-driven UI patterns
**Confidence:** HIGH

## Summary

Phase 2 transforms the Phase 1 foundation (design tokens, data layer, accessibility baseline) into a complete, reviewable, and deployable narrative site. The phase scope includes 8 page-level components (StickyNav, HeroSection, FeaturedSystems, ChatPlaceholder, OriginStory, SystemsShelf, ContactInvestor, FooterStats), 3 routes (`/`, `/invest`, `/privacy`), a living signal that queries GitHub's public API with ISR caching, scroll-triggered entrance animations via IntersectionObserver, full SEO metadata (OG tags, Twitter cards, robots.txt, sitemap.xml, canonical URLs), and Vercel deployment with auto-deploy on push to main.

The technical surface area is moderate -- all components are React Server Components or lightweight client components (only StickyNav and SectionWrapper require client-side JavaScript). The living signal is the only data-fetching component, using a single unauthenticated GitHub API call cached via ISR with a 1-hour revalidation window. No external services beyond GitHub's public API are needed for Phase 2, making it fully deployable without API keys.

**Primary recommendation:** Build components as Server Components by default, introduce `'use client'` only for StickyNav (scroll detection), SectionWrapper (IntersectionObserver), and LivingSignal (fade-in animation). Use `export const revalidate = 3600` on the home page to enable ISR for the living signal GitHub fetch. Deploy to Vercel via Git integration (import repo, auto-detect Next.js). All copy is either locked in the design doc or drafted by the executor for user approval.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Hero copy is LOCKED. H1: "Ryan Stern", subtitle: "Builder. Operator." Two paragraphs of body copy provided in design doc. Do not modify or ship with placeholder text.
- **D-02:** Headshot: user-provided full-size photo cropped to circle (160px desktop, 120px tablet, 80px mobile). Right-aligned on desktop, centered above name on mobile.
- **D-03:** Living signal: query public repos from quartermint org + vanboompow org. Unauthenticated GitHub API. 1hr ISR cache. SIGNAL_REPOS env var with curated list. Fallback to FALLBACK_SIGNAL env var if >14 days stale or API error.
- **D-04:** Dual CTAs: "Explore the systems" (scrolls to featured) + "Ask me anything" (scrolls to chat section / opens overlay on mobile).
- **D-05:** 4 empathy-first horizontal narrative rows (not 2x2 grid). Copy is LOCKED in design doc for LifeVault, Relay, OpenEFB, v2cf. Problem left, solution right, 32px gap. Mobile: stack vertically.
- **D-06:** Claude drafts, user approves. 120-180 words, 3 paragraphs max. Campaign names in prose (Obama, Biden, Harris, Clinton, Sanders, Warren, Booker, Nixon). Closes with "I started building because the tools didn't exist."
- **D-07:** Dense typographic list, not cards. 11 systems with name + one-liner + tech badge. Claude drafts one-liners from project READMEs, user approves. Public repos get GitHub link icon.
- **D-08:** Content skeleton from design doc: thesis pull quote, stats as 3x2 grid, direction, background (one paragraph), CTA. Max-width 680px. White background throughout.
- **D-09:** Stats use exact counts (894K files, 452K messages, 395 tests). Accurate as of March 2026.
- **D-10:** Compliance: no securities claims, no forward-looking financial projections, no "invest in" framing.
- **D-11:** Same layout as /invest (680px max-width). Plain text covering: chat messages logged server-side, sections viewed tracked, email opt-in only, 90-day visitor cookie, no third-party tracking.
- **D-12:** "40+ repositories / 894K files indexed / 9 production services" -- static, exact counts.
- **D-13:** Sticky nav: 48px height, "Ryan Stern" left (scroll to top), "Invest" right (/invest). Transparent at top, white bg + shadow after 100px scroll. Mobile: hide-on-scroll-down, show-on-scroll-up.
- **D-14:** Two motions only: living signal fade-in (opacity 0->1, 600ms ease, 300ms delay) and section entrance (translateY 8px->0 + opacity, 400ms ease, IntersectionObserver at 0.3 threshold). Both respect prefers-reduced-motion.
- **D-15:** Vercel deployment. Fresh project on existing Vercel account. Auto-deploy on push to main. OG tags, Twitter cards, robots.txt, sitemap.xml, canonical URLs on all routes.

### Claude's Discretion
- Smooth scroll implementation approach
- OG image design (headshot vs branded card)
- Section animation stagger timing

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| NAR-01 | Narrative hero with locked copy, headshot, living signal, dual CTAs | ISR pattern for GitHub fetch, `next/image` for headshot, smooth scroll for CTAs, `'use client'` for living signal fade-in |
| NAR-02 | Featured systems section (4 empathy-first entries) with horizontal narrative rows | Server Component consuming `featuredSystems` from `lib/systems.ts`, responsive flex layout |
| NAR-03 | Origin story section (120-180 words, 3 paragraphs, campaign names) | Static content, executor-drafted copy requiring user approval before shipping |
| NAR-04 | Systems shelf as dense typographic list (11 systems) with tech badges and GitHub icons | Server Component consuming `shelfSystems` from `lib/systems.ts`, inline SVG GitHub icon |
| NAR-05 | Contact + investor dual-column section | Static layout with external links (`target="_blank" rel="noopener noreferrer"`), Calendar booking link |
| NAR-06 | Minimal sticky nav bar with scroll-aware behavior | `'use client'` component with scroll event listener, `position: sticky`, CSS transition |
| NAR-07 | Alternating section backgrounds (white/mint rhythm) | SectionWrapper utility component applying bg-bg or bg-surface per section index |
| NAR-08 | Footer stats line | Static Server Component, centered text |
| INV-01 | /invest route -- memo-style page | New route at `app/invest/page.tsx`, static metadata export, 680px max-width |
| INV-03 | /invest compliance language | Copy review: no securities claims, no projections, no "invest in" framing |
| OPS-02 | Vercel deployment with auto-deploy | Git integration, `vercel.json` not required for basic deployment, env vars for living signal |
| OPS-04 | Metadata per route (OG tags, Twitter cards, robots.txt, sitemap.xml, canonical URLs) | Next.js Metadata API (`generateMetadata`, `sitemap.ts`, `robots.ts`), `opengraph-image` convention |
| ENG-03 | Section entrance animations | `'use client'` SectionWrapper with IntersectionObserver at 0.3 threshold, CSS transitions, `prefers-reduced-motion` respected by Phase 1 globals |
| ENG-04 | Living signal fade-in | CSS animation on mount with 300ms delay, 600ms duration, `prefers-reduced-motion` disable |
</phase_requirements>

## Project Constraints (from CLAUDE.md)

- **No shadcn/ui** -- all components custom-built with Tailwind v4 utilities
- **No CSS-in-JS** -- incompatible with React Server Components
- **No Tailwind config.js** -- v4 uses `@theme` in CSS (already set up in Phase 1)
- **No middleware.ts** -- renamed to `proxy.ts` in Next.js 16 (not needed for Phase 2)
- **No `@vercel/kv`** -- deprecated, not needed for Phase 2 (no Redis dependencies)
- **App Router exclusively** -- no Pages Router
- **GSD workflow enforcement** -- all work through GSD commands
- **Vercel hosting for v1** -- Cloudflare owns DNS only
- **Hero copy is PRE-BUILD BLOCKER** -- locked in design doc, must not ship with placeholder text

## Standard Stack

### Core (inherited from Phase 1 -- already installed)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 16.2.1 | Full-stack React framework | Installed, running, verified by `npm run build` |
| React | 19.2.4 | UI library | Installed, required by Next.js 16 |
| TypeScript | ^5 | Type safety | Installed, strict mode |
| Tailwind CSS | ^4 | Utility-first CSS | Installed, `@theme inline` tokens configured |

### Supporting (Phase 2 additions -- none required)
No new npm dependencies are required for Phase 2. All functionality is achievable with Next.js built-in APIs (Metadata, ISR, Image optimization) and browser APIs (IntersectionObserver, scroll events).

### Development Tools (already installed)
| Tool | Version | Purpose |
|------|---------|---------|
| Vitest | ^4.1.2 | Test runner |
| eslint + eslint-config-next | 16.2.1 | Linting |

**Installation:** No new packages needed for Phase 2.

## Architecture Patterns

### Recommended Project Structure (Phase 2 additions)
```
app/
├── layout.tsx              # UPDATE: populate header with StickyNav, footer with FooterStats
├── page.tsx                # REPLACE: current verification page with production content
├── globals.css             # INHERITED: no changes
├── favicon.ico             # INHERITED
├── robots.ts               # NEW: allow all crawlers, reference sitemap
├── sitemap.ts              # NEW: /, /invest, /privacy
├── opengraph-image.tsx     # NEW: dynamic OG image (Claude's discretion: headshot vs branded card)
├── invest/
│   └── page.tsx            # NEW: /invest route
└── privacy/
    └── page.tsx            # NEW: /privacy route
components/
├── sticky-nav.tsx          # NEW: 'use client' -- scroll-aware sticky nav
├── hero-section.tsx        # NEW: Server Component -- locked hero copy + headshot + CTAs
├── living-signal.tsx       # NEW: Server Component with ISR fetch (client wrapper for fade-in)
├── featured-systems.tsx    # NEW: Server Component -- 4 horizontal narrative rows
├── chat-placeholder.tsx    # NEW: Server Component -- "Chat coming soon" static box
├── origin-story.tsx        # NEW: Server Component -- 3-paragraph story
├── systems-shelf.tsx       # NEW: Server Component -- 11-system dense list
├── contact-investor.tsx    # NEW: Server Component -- dual-column section
├── footer-stats.tsx        # NEW: Server Component -- stat line (moves from page to component)
└── section-wrapper.tsx     # NEW: 'use client' -- alternating bg + entrance animation
lib/
└── systems.ts              # INHERITED: no changes needed
public/
└── images/
    └── headshot.jpg        # NEW: user-provided headshot photo (MUST be added before build)
```

### Pattern 1: Server Component by Default, Client Boundary Only for Interactivity
**What:** Most Phase 2 components are static content rendered as Server Components (zero JS sent to client). Only components requiring browser APIs get `'use client'`.
**When to use:** Every component unless it needs scroll events, IntersectionObserver, or CSS animation state.
**Client components (3 total):**
1. `StickyNav` -- needs `window.scrollY` for background transition and scroll-direction detection
2. `SectionWrapper` -- needs `IntersectionObserver` for entrance animation
3. `LivingSignalClient` -- needs CSS animation class toggle for fade-in on mount

**Example (Server Component with data):**
```typescript
// components/featured-systems.tsx -- Server Component, no 'use client'
import { featuredSystems } from '@/lib/systems'

export function FeaturedSystems() {
  return (
    <div className="space-y-8">
      {featuredSystems.map((system) => (
        <div key={system.slug} className="flex flex-col sm:flex-row gap-8">
          <div className="sm:w-1/2">
            <p className="font-body text-[16px] leading-[1.7] text-text-muted">
              {system.problem}
            </p>
          </div>
          <div className="sm:w-1/2">
            <h3 className="font-display text-[20px] leading-[1.3] text-text">
              {system.name}
            </h3>
            {/* ... */}
          </div>
        </div>
      ))}
    </div>
  )
}
```

### Pattern 2: ISR for Living Signal (GitHub API Fetch)
**What:** Fetch latest commit from GitHub public API at build time, revalidate every hour using `export const revalidate = 3600`.
**When to use:** The living signal is the only data-fetching component in Phase 2.

**Example:**
```typescript
// lib/github.ts
interface CommitInfo {
  repo: string
  date: string
  relativeTime: string
}

export async function getLatestCommit(): Promise<CommitInfo | null> {
  const repos = process.env.SIGNAL_REPOS?.split(',') ?? []
  if (repos.length === 0) return null

  try {
    const commits = await Promise.all(
      repos.map(async (repo) => {
        const res = await fetch(
          `https://api.github.com/repos/${repo.trim()}/commits?per_page=1`,
          { next: { revalidate: 3600 } } // ISR: 1 hour
        )
        if (!res.ok) return null
        const data = await res.json()
        if (!data[0]) return null
        return {
          repo: repo.trim().split('/')[1],
          date: data[0].commit.author.date,
        }
      })
    )
    // Find most recent commit across all repos
    const valid = commits.filter(Boolean)
    if (valid.length === 0) return null
    const latest = valid.sort(
      (a, b) => new Date(b!.date).getTime() - new Date(a!.date).getTime()
    )[0]!
    return {
      repo: latest.repo,
      date: latest.date,
      relativeTime: getRelativeTime(latest.date),
    }
  } catch {
    return null
  }
}
```

**Critical:** GitHub unauthenticated API rate limit is 60 requests/hour per IP. With ISR caching at 1 hour and only 1 request per revalidation (fetching multiple repos in parallel counts as N requests but only triggers once per revalidation), this stays well within limits on Vercel. Vercel serverless functions share IPs though, so the `next.revalidate` approach is better than per-request fetching.

### Pattern 3: IntersectionObserver for Section Entrance Animation
**What:** A client-side wrapper component that observes its own visibility and applies a CSS transition on first appearance.
**When to use:** Wrap each content section on the home page.

**Example:**
```typescript
// components/section-wrapper.tsx
'use client'

import { useRef, useEffect, useState, type ReactNode } from 'react'

interface SectionWrapperProps {
  children: ReactNode
  bg: 'bg' | 'surface'
  label: string
}

export function SectionWrapper({ children, bg, label }: SectionWrapperProps) {
  const ref = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(el)  // Fire once
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={ref}
      aria-label={label}
      className={`bg-${bg} transition-all duration-[400ms] ease-out
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
    >
      <div className="max-w-[var(--spacing-content-max)] mx-auto px-4 sm:px-6 lg:px-8 py-[var(--spacing-section-mobile)] lg:py-[var(--spacing-section-desktop)]">
        {children}
      </div>
    </section>
  )
}
```

### Pattern 4: Next.js Metadata API for SEO
**What:** Use static `metadata` export on each page, plus `robots.ts` and `sitemap.ts` file conventions.
**When to use:** Every route in Phase 2.

**Example (per-route metadata):**
```typescript
// app/invest/page.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Invest -- Ryan Stern',
  description: 'Information infrastructure for high-stakes environments. 40+ repositories, 9 production services.',
  openGraph: {
    title: 'Invest -- Ryan Stern',
    description: 'Information infrastructure for high-stakes environments. 40+ repositories, 9 production services.',
    url: 'https://quartermint.com/invest',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Invest -- Ryan Stern',
    description: 'Information infrastructure for high-stakes environments. 40+ repositories, 9 production services.',
  },
  alternates: {
    canonical: 'https://quartermint.com/invest',
  },
}
```

**Example (robots.ts):**
```typescript
// app/robots.ts
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://quartermint.com/sitemap.xml',
  }
}
```

**Example (sitemap.ts):**
```typescript
// app/sitemap.ts
import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://quartermint.com', lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: 'https://quartermint.com/invest', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://quartermint.com/privacy', lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ]
}
```

### Pattern 5: Sticky Nav with Scroll Direction Detection
**What:** A `'use client'` component that tracks scroll position (>100px for background) and scroll direction (for mobile hide/show).
**When to use:** The StickyNav component.

**Example:**
```typescript
'use client'

import { useEffect, useState, useRef } from 'react'

export function StickyNav() {
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const lastScrollY = useRef(0)

  useEffect(() => {
    function onScroll() {
      const y = window.scrollY
      setScrolled(y > 100)
      // Mobile: hide on scroll down, show on scroll up
      if (y > lastScrollY.current && y > 100) {
        setHidden(true)
      } else {
        setHidden(false)
      }
      lastScrollY.current = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={`sticky top-0 z-50 h-12 flex items-center justify-between px-4 sm:px-6 lg:px-8
        transition-all duration-200 ease-out
        ${scrolled ? 'bg-bg shadow-[0_1px_3px_rgba(0,0,0,0.1)]' : 'bg-transparent'}
        ${hidden ? '-translate-y-full' : 'translate-y-0'}`}
    >
      {/* ... */}
    </nav>
  )
}
```

### Anti-Patterns to Avoid
- **Making all sections client components:** Only StickyNav, SectionWrapper, and LivingSignal need `'use client'`. Everything else is static content that should be Server Components for zero JS overhead.
- **Using `useEffect` for data fetching:** The living signal fetch happens server-side via ISR, not client-side. No `useEffect(() => fetch(...))`.
- **Dynamic route segments where static suffices:** `/invest` and `/privacy` are static pages with hardcoded content. Do NOT use `generateStaticParams` or dynamic segments.
- **Importing the entire systems array into client components:** `lib/systems.ts` data should flow through Server Components. Don't mark data-consuming components as `'use client'`.
- **Using `cacheComponents: true` / `'use cache'` when `revalidate` suffices:** For Phase 2's simple ISR needs, `export const revalidate = 3600` is cleaner and more straightforward than the `use cache` directive. The `use cache` pattern is more powerful but adds complexity that isn't needed for a single GitHub API call.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Relative time formatting ("3 hours ago") | Custom date math | `Intl.RelativeTimeFormat` or a 3-line helper | Edge cases in time zones, locale-sensitive, tested |
| Sitemap XML generation | Manual XML string | `app/sitemap.ts` file convention | Next.js generates correct XML with proper headers |
| robots.txt | Static file in public/ | `app/robots.ts` file convention | Programmatic, type-safe, co-located with app |
| OG image generation | Static PNG | `app/opengraph-image.tsx` with `ImageResponse` | Dynamic, always matches current content, no asset management |
| Scroll-to-section | Manual `window.scrollTo` | Native `<a href="#section-id">` with `scroll-behavior: smooth` on `<html>` | Browser-native, accessible, works without JS |
| ISR caching for GitHub API | Custom cache layer / Redis | `export const revalidate = 3600` + `fetch(..., { next: { revalidate: 3600 } })` | Built into Next.js, zero config on Vercel |
| Image optimization | Manual resizing / srcset | `next/image` component | Automatic WebP/AVIF, lazy loading, responsive sizing |

**Key insight:** Phase 2 has zero need for external npm dependencies. Every feature maps to a Next.js built-in or a browser API. The temptation to add libraries for animations, scroll tracking, or relative time is unnecessary complexity.

## Common Pitfalls

### Pitfall 1: Headshot Image Missing at Build Time
**What goes wrong:** Build fails or headshot renders as broken image because the user hasn't provided the photo yet.
**Why it happens:** CONTEXT D-02 specifies "user-provided full-size photo" but `public/images/` currently contains only `.gitkeep`.
**How to avoid:** Plan must include an explicit step for the user to provide the headshot image BEFORE the hero section is implemented. Use `next/image` with `alt="Ryan Stern"` and sized appropriately (160px/120px/80px per breakpoint). If image is not yet available, use a colored circle placeholder that can be swapped -- but DO NOT ship to production without the real headshot.
**Warning signs:** Empty `public/images/` directory, `next/image` errors about missing src.

### Pitfall 2: Living Signal Fails Silently in ISR
**What goes wrong:** GitHub API returns 403 (rate limited) or 404, and the living signal shows nothing permanently because the stale cache was never populated.
**Why it happens:** First build has no cache. If the GitHub API call fails during `next build`, there's no cached result to serve stale.
**How to avoid:** Implement the fallback chain explicitly: (1) try GitHub API, (2) if fail or >14 days stale, use `FALLBACK_SIGNAL` env var, (3) if env var missing, render nothing (no skeleton, no flash). The `FALLBACK_SIGNAL` env var MUST be set on Vercel for the fallback to work.
**Warning signs:** Empty living signal area on first deploy, no `SIGNAL_REPOS` or `FALLBACK_SIGNAL` in Vercel env vars.

### Pitfall 3: Scroll-Direction Detection Causes Layout Thrash on Mobile
**What goes wrong:** Nav rapidly toggles between visible/hidden during momentum scrolling on iOS Safari.
**Why it happens:** `scroll` events fire at high frequency during momentum scrolling. Without a threshold, tiny scroll direction changes cause flickering.
**How to avoid:** Add a minimum scroll delta threshold (e.g., 5-10px) before changing the hidden state. Debouncing is NOT the right solution (it delays the response); instead, accumulate scroll delta and only toggle when it exceeds the threshold.
**Warning signs:** Nav flickers during fast scrolling on iPhone.

### Pitfall 4: IntersectionObserver Fires on Initial Layout
**What goes wrong:** Sections above the fold animate on page load (opacity 0 -> 1), causing the hero to flash in.
**Why it happens:** IntersectionObserver immediately fires for elements already in the viewport when first observed.
**How to avoid:** Hero section should NOT use the SectionWrapper animation -- it should render immediately (it's always above the fold). Only sections below the fold get the entrance animation. Alternatively, check if the initial intersection ratio is already >= threshold and skip the animation.
**Warning signs:** Hero content fading in on page load instead of being immediately visible.

### Pitfall 5: OG Image Not Rendering on Social Platforms
**What goes wrong:** Sharing the link on Twitter/LinkedIn shows no preview image.
**Why it happens:** The `opengraph-image.tsx` file uses `ImageResponse` which requires specific rendering constraints (flexbox only, limited CSS, specific font loading).
**How to avoid:** Keep the OG image simple -- white background, name, subtitle, maybe headshot. Test with Twitter Card Validator and Facebook Sharing Debugger after deployment. Verify the `og:image` meta tag points to the correct URL.
**Warning signs:** Missing `og:image` in page source, 500 error on `/opengraph-image` route.

### Pitfall 6: `next.config.ts` Missing `images.remotePatterns` for Headshot
**What goes wrong:** If using `next/image` with a remote source, build fails.
**Why it happens:** Next.js requires explicit allowlisting of remote image domains.
**How to avoid:** The headshot should be in `public/images/` (local), not remote. Using `next/image` with a local `src="/images/headshot.jpg"` requires no config. Only add `remotePatterns` if images come from external URLs.
**Warning signs:** Build error about image hostname not configured.

### Pitfall 7: Vercel Deployment Fails Due to Missing Env Vars
**What goes wrong:** The living signal returns null on every request because `SIGNAL_REPOS` is not set.
**Why it happens:** Env vars exist in the plan but are not configured in the Vercel dashboard.
**How to avoid:** Deployment plan must include explicit steps to set `SIGNAL_REPOS` and `FALLBACK_SIGNAL` in Vercel project settings. These are the ONLY env vars needed for Phase 2 (no API keys required).
**Warning signs:** Living signal area is permanently empty on production.

### Pitfall 8: Origin Story Copy Not Approved Before Shipping
**What goes wrong:** Site ships with draft origin story that doesn't match the user's voice.
**Why it happens:** D-06 specifies "Claude drafts, user approves" but the approval step is skipped in execution speed.
**How to avoid:** Plan must include an explicit user-approval gate for origin story copy, /invest heading, /invest direction section, and /invest background paragraph. These are the ONLY pieces of copy that need drafting -- everything else is locked.
**Warning signs:** Origin story reads like generic AI-generated founder content.

## Code Examples

### Next.js 16 Static Metadata Export
```typescript
// Source: https://nextjs.org/docs/app/getting-started/metadata-and-og-images
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Ryan Stern -- Builder. Operator.',
  description: 'Nine services, forty repositories, and a thesis: information routed to the right person, in the right form, at the right time.',
  metadataBase: new URL('https://quartermint.com'),
  openGraph: {
    title: 'Ryan Stern -- Builder. Operator.',
    description: 'Nine services, forty repositories, and a thesis: information routed to the right person, in the right form, at the right time.',
    url: 'https://quartermint.com',
    siteName: 'Ryan Stern',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ryan Stern -- Builder. Operator.',
    description: 'Nine services, forty repositories, and a thesis: information routed to the right person, in the right form, at the right time.',
  },
  alternates: {
    canonical: 'https://quartermint.com',
  },
}
```

### ISR with Route Segment Config
```typescript
// Source: https://nextjs.org/docs/app/guides/incremental-static-regeneration
// app/page.tsx -- sets revalidation for the entire page
export const revalidate = 3600  // 1 hour

export default async function Home() {
  // This fetch will be cached and revalidated every hour
  const signal = await getLatestCommit()
  return (
    <>
      <HeroSection signal={signal} />
      {/* ... */}
    </>
  )
}
```

### Dynamic OG Image with ImageResponse
```typescript
// Source: https://nextjs.org/docs/app/getting-started/metadata-and-og-images
// app/opengraph-image.tsx
import { ImageResponse } from 'next/og'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', width: '100%', height: '100%',
        backgroundColor: '#FFFFFF', padding: '80px',
      }}>
        <div style={{ fontSize: '64px', fontWeight: 400, color: '#333A45' }}>
          Ryan Stern
        </div>
        <div style={{ fontSize: '32px', color: '#555555', marginTop: '16px' }}>
          Builder. Operator.
        </div>
      </div>
    )
  )
}
```

### Smooth Scroll with Native HTML
```typescript
// Smooth scroll via href="#id" -- works with prefers-reduced-motion from globals.css
// The reduced-motion media query in globals.css sets scroll-behavior: auto
<a href="#featured-systems" className="...">
  Explore the systems
</a>

// Target section has matching id
<section id="featured-systems" aria-label="Featured Systems">
  {/* ... */}
</section>
```

### Relative Time Helper (no dependency needed)
```typescript
// lib/relative-time.ts -- pure function, no npm dependency
export function getRelativeTime(dateString: string): string {
  const now = Date.now()
  const then = new Date(dateString).getTime()
  const diffMs = now - then
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffHours < 1) return 'just now'
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`
  return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? 's' : ''} ago`
}

export function isStale(dateString: string, thresholdDays: number): boolean {
  const diffMs = Date.now() - new Date(dateString).getTime()
  return diffMs > thresholdDays * 24 * 60 * 60 * 1000
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `middleware.ts` | `proxy.ts` | Next.js 16.0 | Phase 2 doesn't need proxy, but if added later use `proxy.ts` |
| `unstable_cache` | `'use cache'` directive | Next.js 16.0 | For Phase 2's simple ISR, `revalidate` route config is sufficient |
| Implicit fetch caching | Explicit `{ cache: 'force-cache' }` or `next: { revalidate }` | Next.js 15+ | Fetches are NOT cached by default. Must explicitly set revalidation. |
| `@vercel/kv` | `@upstash/redis` | 2025 | Not needed for Phase 2 (no Redis), but noted for Phase 3 |
| `tailwind.config.js` | `@theme` in CSS | Tailwind v4 | Already configured in Phase 1 |
| OG images as static files | `opengraph-image.tsx` with `ImageResponse` | Next.js 13.3+ | Dynamic generation, always current |

**Deprecated/outdated:**
- `getStaticProps` / `getServerSideProps`: Pages Router only. Use `async` Server Components + `revalidate` export.
- `next/head`: Replaced by `Metadata` export and `generateMetadata`.
- `_document.tsx` / `_app.tsx`: Pages Router. Use `layout.tsx` in App Router.
- `middleware.ts`: Still works in Next.js 16 but shows deprecation warning. Use `proxy.ts`.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Next.js runtime | Yes | v22.22.0 | -- |
| npm | Package management | Yes | 10.9.4 | -- |
| Vercel CLI | Deployment (optional) | No | -- | Deploy via Git integration (recommended approach anyway) |
| GitHub API (public) | Living signal | Yes (external) | REST v3 | FALLBACK_SIGNAL env var |
| Headshot image | Hero section | No | -- | User must provide before hero build |

**Missing dependencies with no fallback:**
- Headshot image (`public/images/headshot.jpg`) -- user must provide before the hero section can be completed

**Missing dependencies with fallback:**
- Vercel CLI -- not needed; deploy via Git integration (import repo into Vercel dashboard)

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.2 |
| Config file | `vitest.config.ts` (exists, configured) |
| Quick run command | `npx vitest run` |
| Full suite command | `npx vitest run && npm run build` |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| NAR-01 | Hero renders locked copy, headshot, CTAs | unit (content check) | `npx vitest run __tests__/hero.test.ts -t "hero"` | Wave 0 |
| NAR-02 | Featured systems renders 4 rows with correct copy | unit | `npx vitest run __tests__/featured-systems.test.ts` | Wave 0 |
| NAR-03 | Origin story within 120-180 word limit, contains closing sentence | unit | `npx vitest run __tests__/origin-story.test.ts` | Wave 0 |
| NAR-04 | Systems shelf renders 11 systems, public repos have GitHub links | unit | `npx vitest run __tests__/systems.test.ts` (partial -- exists) | Partial |
| NAR-05 | Contact section has Calendar link and /invest link | unit | `npx vitest run __tests__/contact.test.ts` | Wave 0 |
| NAR-06 | Sticky nav scroll behavior | manual | Manual: scroll page, verify nav background and mobile hide/show | Manual only |
| NAR-07 | Alternating backgrounds white/mint | unit (CSS class check) | `npx vitest run __tests__/sections.test.ts` | Wave 0 |
| NAR-08 | Footer stats text matches spec | unit | `npx vitest run __tests__/footer.test.ts` | Wave 0 |
| INV-01 | /invest route renders thesis, stats grid, CTA | unit | `npx vitest run __tests__/invest.test.ts` | Wave 0 |
| INV-03 | /invest has no securities language | unit (regex scan) | `npx vitest run __tests__/invest.test.ts -t "compliance"` | Wave 0 |
| OPS-02 | Build succeeds, Vercel deploy works | smoke | `npm run build` | Exists (build passes) |
| OPS-04 | OG tags, sitemap, robots present | unit | `npx vitest run __tests__/metadata.test.ts` | Wave 0 |
| ENG-03 | Section entrance animation config | unit (component test) | `npx vitest run __tests__/section-wrapper.test.ts` | Wave 0 |
| ENG-04 | Living signal renders with fallback | unit | `npx vitest run __tests__/living-signal.test.ts` | Wave 0 |

### Sampling Rate
- **Per task commit:** `npx vitest run`
- **Per wave merge:** `npx vitest run && npm run build`
- **Phase gate:** Full suite green + successful Vercel deployment before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `__tests__/hero.test.ts` -- covers NAR-01 (locked copy verification, CTA labels)
- [ ] `__tests__/featured-systems.test.ts` -- covers NAR-02 (4 systems, horizontal row rendering)
- [ ] `__tests__/origin-story.test.ts` -- covers NAR-03 (word count, closing sentence)
- [ ] `__tests__/contact.test.ts` -- covers NAR-05 (Calendar link, /invest link)
- [ ] `__tests__/sections.test.ts` -- covers NAR-07 (alternating bg classes)
- [ ] `__tests__/footer.test.ts` -- covers NAR-08 (stats text)
- [ ] `__tests__/invest.test.ts` -- covers INV-01, INV-03 (content + compliance)
- [ ] `__tests__/metadata.test.ts` -- covers OPS-04 (sitemap, robots file existence)
- [ ] `__tests__/living-signal.test.ts` -- covers ENG-04 (GitHub API mock, fallback chain)
- [ ] `__tests__/section-wrapper.test.ts` -- covers ENG-03 (IntersectionObserver mock)

Note: Vitest environment is `node` (not `jsdom`). Component render tests will need `@testing-library/react` + jsdom environment OR be structured as content/data verification tests reading source files (the existing pattern from Phase 1). The Phase 1 tests use file-reading patterns (read CSS/TSX as strings, assert content). This pattern is efficient for content verification and avoids the jsdom setup cost. Recommend continuing this pattern for Phase 2 content tests.

## Open Questions

1. **Headshot image source and format**
   - What we know: Design doc says "reuse existing asset (assets/images/hero/ryan-160.png from current site)". CONTEXT D-02 says "user-provided full-size photo cropped to circle."
   - What's unclear: The current quartermint-site repo has no image in `public/images/`. The "current site" (static HTML on Cloudflare) has a 160px image, but the UI-SPEC calls for 160px/120px/80px responsive sizing which benefits from a higher-resolution source image.
   - Recommendation: User needs to provide the headshot image. Plan should include an explicit "provide headshot" step early. Use `next/image` with a high-res source (at least 320px for 2x retina) and let Next.js handle responsive sizing.

2. **OG image strategy (Claude's discretion)**
   - What we know: CONTEXT D-15 says Claude has discretion on "headshot vs branded card."
   - Recommendation: Use `opengraph-image.tsx` with `ImageResponse` to generate a branded card: white background, "Ryan Stern" in Instrument Serif, "Builder. Operator." subtitle, quartermint.com URL. This is more professional for social sharing than a headshot crop, and stays current automatically. If the headshot is high enough resolution, it could be included in the card.

3. **Shelf system one-liners approval**
   - What we know: One-liners in `lib/systems.ts` are marked `// DRAFT -- pending user approval`.
   - What's unclear: Whether these drafts have been approved yet.
   - Recommendation: Plan should include an approval gate for one-liners before the shelf section ships.

4. **Smooth scroll approach (Claude's discretion)**
   - Recommendation: Use native `scroll-behavior: smooth` on the `<html>` element (via Tailwind's `scroll-smooth` utility class). The "Explore the systems" CTA becomes `<a href="#featured-systems">` and the "Ask me anything" CTA becomes `<a href="#chat-section">`. This is the simplest, most accessible approach and is already disabled by the `prefers-reduced-motion` rule in `globals.css`.

## Sources

### Primary (HIGH confidence)
- Next.js 16.2.1 official docs -- ISR guide, `use cache` directive, metadata API, sitemap/robots file conventions
  - https://nextjs.org/docs/app/guides/incremental-static-regeneration
  - https://nextjs.org/docs/app/api-reference/directives/use-cache
  - https://nextjs.org/docs/app/getting-started/metadata-and-og-images
  - https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
  - https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
- GitHub REST API docs -- rate limits for unauthenticated requests
  - https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api
- Local codebase -- Phase 1 implementation verified via file reads and `npm run build`
  - `app/globals.css`, `app/layout.tsx`, `app/page.tsx`, `lib/systems.ts`
  - `package.json` confirms Next.js 16.2.1, React 19.2.4, Tailwind v4

### Secondary (MEDIUM confidence)
- Vercel deployment docs -- auto-deploy, Git integration, env var configuration
  - https://vercel.com/docs/frameworks/full-stack/nextjs
  - https://nextjs.org/docs/app/getting-started/deploying
- GitHub changelog -- updated unauthenticated rate limits (May 2025)
  - https://github.blog/changelog/2025-05-08-updated-rate-limits-for-unauthenticated-requests/

### Tertiary (LOW confidence)
- None. All findings verified against official documentation.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- Phase 1 already installed, verified by build, no new dependencies
- Architecture: HIGH -- patterns verified against Next.js 16.2.1 official docs
- Pitfalls: HIGH -- based on actual codebase state (missing headshot, missing env vars) and known browser behavior (IntersectionObserver initial fire, momentum scroll)
- ISR/caching: HIGH -- verified against Next.js ISR guide, `revalidate` route config confirmed for 16.2.1
- SEO metadata: HIGH -- sitemap.ts, robots.ts, and Metadata export patterns confirmed in official docs

**Research date:** 2026-03-26
**Valid until:** 2026-04-25 (stable -- no fast-moving dependencies in Phase 2)
