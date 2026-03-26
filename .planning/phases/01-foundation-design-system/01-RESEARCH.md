# Phase 1: Foundation + Design System - Research

**Researched:** 2026-03-26
**Domain:** Next.js 16 App Router scaffold, Tailwind CSS v4 design tokens, Google Fonts, accessibility baseline, TypeScript data layer
**Confidence:** HIGH

## Summary

Phase 1 is a greenfield scaffold phase. The entire deliverable is a working Next.js 16 App Router project with a CSS custom properties design system (mint palette, Instrument Serif + DM Sans typography, dark mode), responsive layout, a typed `lib/systems.ts` data file, and accessibility baseline. No API calls, no external services, no runtime dependencies beyond the dev server.

The stack is fully locked in CLAUDE.md and verified against npm registry: Next.js 16.2.1, React 19.2.4, TypeScript 6.0.2, Tailwind CSS 4.2.2. `create-next-app@16.2.1 --yes` generates a working scaffold with Tailwind v4 pre-configured (including `@theme inline`, `@tailwindcss/postcss`, and dark mode via `prefers-color-scheme`). The generated template is the ideal starting point -- it already demonstrates the exact patterns this phase needs (font CSS variables on `<html>`, `@theme inline` referencing `:root` variables, media query dark mode).

**Primary recommendation:** Run `npx create-next-app@latest quartermint-site --yes`, then replace the default Geist fonts with Instrument Serif + DM Sans, replace the default color tokens with the mint palette, and add the `lib/systems.ts` data file and accessibility utilities.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Full-size professional headshot provided by user (not from current site). Crop to circle format: 160px desktop, 120px tablet, 80px mobile. Optimize for web (WebP with JPEG fallback).
- **D-02:** Visual system is fully specified in the design doc -- extract CSS custom properties, typography scale, spacing, and dark mode color mapping directly. No design decisions needed; implement exactly as specified.
- **D-03:** All colors via CSS custom properties in `:root`. No raw hex in components. Tailwind v4 `@theme` directive creates both CSS custom properties AND utility classes from the same token definitions.
- **D-04:** 4 featured systems have locked copy from design doc (LifeVault, Relay, OpenEFB, v2cf -- problem/solution text provided).
- **D-05:** 11 shelf systems have names, tech badges, and public/active status from design doc. Claude drafts one-liner descriptions from project READMEs; user approves before shipping.
- **D-06:** All 15 entries include: name, one-liner, problem, solution, techBadge, isPublic, githubUrl, status (active/paused). Featured systems additionally have full empathy-first problem/solution narratives.
- **D-07:** Use exact counts: "40+ repositories / 894K files indexed / 9 production services". Static text, manually updated. Accurate as of March 2026.
- **D-08:** Triggered by `prefers-color-scheme: dark` media query only. No toggle. Full color mapping from design doc (no pure black, no pure white, mint accent desaturated for dark backgrounds).

### Claude's Discretion
- Project initialization approach (create-next-app vs manual scaffold)
- Tailwind v4 `@theme` token structure and file organization
- Component file structure within App Router conventions

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| FOUND-01 | Next.js 16 App Router project with React 19 and TypeScript | `create-next-app@16.2.1 --yes` generates exactly this: Next.js 16.2.1, React 19.2.4, TypeScript 5.x, App Router, Turbopack, strict mode enabled. Verified by running create-next-app locally. |
| FOUND-02 | CSS custom properties design system (Instrument Serif + DM Sans + mint palette, all colors via :root variables) | Tailwind v4 `@theme inline` directive creates CSS custom properties AND utility classes from `:root` variables. `next/font/google` self-hosts fonts with zero external requests. Pattern verified in generated template. |
| FOUND-03 | Dark mode via prefers-color-scheme with full mapped color palette (no pure black, no pure white) | Generated template already uses this exact pattern: `:root` defines light values, `@media (prefers-color-scheme: dark)` overrides in `:root`, `@theme inline` references the variables. All 6 color tokens have dark mappings in the UI spec. |
| FOUND-04 | Responsive layout across 3 breakpoints (mobile <640px, tablet 640-1023px, desktop >=1024px) | Tailwind v4 default breakpoints: `sm: 640px`, `md: 768px`, `lg: 1024px`. The project needs `sm: 640px` and `lg: 1024px` as primary breakpoints. Tablet range (640-1023px) is naturally `sm:` to `lg:` in Tailwind. |
| FOUND-05 | DRY data source (lib/systems.ts) for all 15 system descriptions | TypeScript interface and data array. Schema fully specified in UI spec. Featured system copy locked in design doc. Shelf one-liners need Claude draft + user approval. |
| FOUND-06 | Accessibility baseline (keyboard nav with 2px focus rings, ARIA landmarks, 44px touch targets, WCAG AAA contrast, prefers-reduced-motion support) | Tailwind v4 has `motion-safe:` and `motion-reduce:` variants. Focus ring via `focus-visible:outline` utilities. `sr-only` utility class built into Tailwind. ARIA landmarks are HTML semantic elements. |
</phase_requirements>

## Project Constraints (from CLAUDE.md)

- **No shadcn/ui** -- explicitly rejected as overkill for editorial typography site
- **No `@vercel/kv`** -- deprecated, use `@upstash/redis` (not needed in Phase 1)
- **No `tailwind.config.js`** -- Tailwind v4 uses CSS-first `@theme` directive
- **No `middleware.ts`** -- renamed to `proxy.ts` in Next.js 16 (not needed in Phase 1)
- **No `autoprefixer`** -- handled by `@tailwindcss/postcss` internally
- **No CSS-in-JS** -- incompatible with React Server Components
- **No Pages Router** -- App Router exclusively
- **App Router only** -- no Pages Router
- **Vercel hosting** for v1
- **GSD workflow enforcement** -- all edits via GSD commands

## Standard Stack

### Core (Phase 1 only -- no AI/email/Redis needed yet)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `next` | 16.2.1 | Full-stack React framework | Current stable. Turbopack default. Verified via `npm view next version`. |
| `react` | 19.2.4 | UI library | Required by Next.js 16. Verified via `npm view react version`. |
| `react-dom` | 19.2.4 | React DOM renderer | Required by Next.js 16. |
| `typescript` | ~6.0.2 | Type safety | Latest stable. Next.js 16 requires >=5.1.3. Verified via `npm view typescript version`. |
| `tailwindcss` | 4.2.2 | Utility-first CSS + design tokens | CSS-first config via `@theme`. Verified via `npm view tailwindcss version`. |

### Dev Dependencies (installed by create-next-app)

| Library | Version | Purpose |
|---------|---------|---------|
| `@tailwindcss/postcss` | ^4 (4.2.2 resolved) | PostCSS plugin for Tailwind v4 |
| `@types/node` | ^20 | Node.js type definitions |
| `@types/react` | ^19 | React 19 type definitions |
| `@types/react-dom` | ^19 | React DOM type definitions |
| `eslint` | ^9 | Linting |
| `eslint-config-next` | 16.2.1 | Next.js ESLint rules |

### Not Needed in Phase 1

| Library | Phase | Why Deferred |
|---------|-------|--------------|
| `ai`, `@ai-sdk/anthropic`, `@ai-sdk/react` | Phase 3 | Chat system |
| `@upstash/redis`, `@upstash/ratelimit` | Phase 3 | Rate limiting |
| `resend`, `@react-email/components` | Phase 4 | Email |
| `react-markdown`, `remark-gfm` | Phase 3 | Chat rendering |
| `@vercel/analytics` | Phase 5 | Analytics |

**Installation:**

```bash
# Phase 1: Just create-next-app with defaults
npx create-next-app@latest . --yes
# This installs: next@16.2.1, react@19.2.4, react-dom@19.2.4,
# tailwindcss@^4, @tailwindcss/postcss@^4, typescript@^5, eslint@^9
```

**Version verification (performed 2026-03-26):**
- `next`: 16.2.1 (npm registry)
- `react`: 19.2.4 (npm registry)
- `typescript`: 6.0.2 (npm registry)
- `tailwindcss`: 4.2.2 (npm registry)
- `@tailwindcss/postcss`: 4.2.2 (npm registry)
- `create-next-app`: 16.2.1 (npm registry)

## Architecture Patterns

### Recommended Project Structure

```
app/
  globals.css          # @import "tailwindcss" + @theme inline + :root colors + dark mode
  layout.tsx           # Root layout: fonts, metadata, <html>/<body>, ARIA landmarks
  page.tsx             # Home page (placeholder for Phase 1, real content Phase 2)
  invest/
    page.tsx           # /invest route (placeholder for Phase 1)
lib/
  systems.ts           # DRY data source for all 15 systems (TypeScript)
public/
  images/
    headshot.webp      # Hero headshot (provided by user)
    headshot.jpg       # JPEG fallback
postcss.config.mjs     # @tailwindcss/postcss plugin only
next.config.ts         # Next.js config
tsconfig.json          # TypeScript strict mode (generated)
eslint.config.mjs      # ESLint config (generated)
```

### Pattern 1: Font Loading with CSS Variables + @theme inline

**What:** Load Google Fonts via `next/font/google`, expose as CSS variables on `<html>`, reference in `@theme inline` to create Tailwind utility classes.

**When to use:** Always -- this is the canonical Next.js 16 + Tailwind v4 pattern. Verified in the actual `create-next-app@16.2.1` generated template.

**Example:**

```typescript
// app/layout.tsx
// Source: create-next-app@16.2.1 generated template + Next.js docs
import { Instrument_Serif } from 'next/font/google'
import { DM_Sans } from 'next/font/google'

// Instrument Serif is NOT a variable font -- must specify weight + style
const instrumentSerif = Instrument_Serif({
  weight: '400',
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-instrument-serif',
  display: 'swap',
})

// DM Sans IS a variable font -- no weight needed
const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${instrumentSerif.variable} ${dmSans.variable}`}
    >
      <body>{children}</body>
    </html>
  )
}
```

**Critical detail:** Font variable classes go on `<html>`, NOT `<body>`. The `@theme inline` directive resolves variables from the cascade -- if fonts are on `<body>`, Tailwind cannot see them at theme resolution time. This is confirmed in the generated template and in [Tailwind discussions](https://github.com/tailwindlabs/tailwindcss/discussions/15267).

### Pattern 2: Design Token System with @theme inline

**What:** Define color values in `:root` (and dark mode override), then reference via `@theme inline` to create both CSS custom properties and Tailwind utility classes.

**When to use:** When you need runtime-overridable tokens (dark mode) that also generate Tailwind utilities.

**Why `@theme inline` and NOT `@theme`:**
- `@theme` embeds the literal value into utilities: `.bg-surface { background-color: #E6F4F1; }`
- `@theme inline` references the variable: `.bg-surface { background-color: var(--color-surface); }`
- Since dark mode overrides `:root` variables at runtime, utilities MUST reference the variable (not the literal) to respond to the override.
- This is the same pattern used by the generated `create-next-app` template.

**Example:**

```css
/* app/globals.css */
@import "tailwindcss";

:root {
  /* Color tokens */
  --color-bg: #FFFFFF;
  --color-surface: #E6F4F1;
  --color-accent: #A8E6CF;
  --color-text: #333A45;
  --color-text-muted: #555555;
  --color-text-faint: #888888;

  /* Layout constants (not spacing tokens) */
  --spacing-section-desktop: 80px;
}

@theme inline {
  /* Colors -- creates utilities like bg-bg, text-text, etc. */
  --color-bg: var(--color-bg);
  --color-surface: var(--color-surface);
  --color-accent: var(--color-accent);
  --color-text: var(--color-text);
  --color-text-muted: var(--color-text-muted);
  --color-text-faint: var(--color-text-faint);

  /* Fonts -- creates utilities like font-display, font-body */
  --font-display: var(--font-instrument-serif);
  --font-body: var(--font-dm-sans);

  /* Spacing tokens */
  --spacing-section-mobile: 48px;
  --spacing-content-max: 1120px;
  --spacing-invest-max: 680px;
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: #1A1D23;
    --color-surface: #232830;
    --color-accent: #7CCFB0;
    --color-text: #E8ECF0;
    --color-text-muted: #A0A8B4;
    --color-text-faint: #6B7280;
  }
}

body {
  background-color: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-dm-sans);
}
```

### Pattern 3: Accessibility Baseline in Base Layout

**What:** ARIA landmarks via semantic HTML, skip-nav link, focus ring utility, reduced motion media query.

**Example:**

```tsx
// app/layout.tsx (accessibility elements)
<body>
  <a
    href="#main-content"
    className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50
               focus:px-4 focus:py-2 focus:bg-bg focus:text-text focus:outline-2
               focus:outline-accent focus:outline-offset-2"
  >
    Skip to main content
  </a>
  <header role="banner">
    {/* Nav placeholder */}
  </header>
  <main id="main-content" role="main">
    {children}
  </main>
  <footer role="contentinfo">
    {/* Footer placeholder */}
  </footer>
</body>
```

```css
/* Focus ring utility -- global in globals.css */
*:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

/* Reduced motion -- disable all transitions and animations */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### Anti-Patterns to Avoid

- **Raw hex values in components:** All colors must use `var(--color-*)` or Tailwind utilities like `text-text`, `bg-surface`. Zero raw hex allowed.
- **`tailwind.config.js`:** Does not exist in Tailwind v4. Use `@theme` in CSS.
- **Font variables on `<body>`:** Must go on `<html>` for Tailwind theme resolution.
- **`@theme` without `inline` for dark-mode tokens:** Utilities would embed literal values that don't respond to media query overrides.
- **Using `@tailwind base/components/utilities`:** Tailwind v4 uses `@import "tailwindcss"` instead.
- **DM Sans weight 300:** Explicitly excluded per design doc. Not loaded.
- **DM Sans weight 500/700:** Consolidated to 400 (body) and 600 (emphasis). DM Sans is a variable font so all weights are available, but only 400 and 600 should be used per the type system.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Font self-hosting | Download fonts, configure @font-face | `next/font/google` | Automatic self-hosting, zero FOUT, CSS variable injection, tree-shaking unused weights |
| CSS custom properties + utility classes | Manual `:root` + manual CSS classes | Tailwind v4 `@theme inline` | Single source of truth creates both CSS variables AND utility classes |
| Dark mode color switching | JavaScript toggle + class switching | `@media (prefers-color-scheme: dark)` on `:root` | Decision D-08 locks this. Media query + CSS variable override is zero-JS. |
| Skip navigation link | Custom visibility toggle JS | `sr-only` + `focus:not-sr-only` Tailwind utilities | Built-in, accessible, no JS needed |
| Reduced motion support | Per-component motion checks | Global `@media (prefers-reduced-motion: reduce)` rule | One rule catches everything. `motion-safe:` variant for progressive enhancement. |

**Key insight:** Phase 1 is almost entirely CSS/HTML with a TypeScript data file. There is zero custom JavaScript logic needed. Every feature maps to a CSS pattern or HTML semantic element.

## Common Pitfalls

### Pitfall 1: Font Variables on Wrong Element

**What goes wrong:** Tailwind utilities like `font-display` don't apply any styles. Components show fallback fonts.
**Why it happens:** `next/font/google` CSS variables are applied via `className` on an element. If placed on `<body>`, `@theme inline` (which resolves at `:root` level) cannot see them.
**How to avoid:** Always put font variable classes on `<html>` element: `<html className={`${font1.variable} ${font2.variable}`}>`.
**Warning signs:** `font-display` utility class has no effect, browser DevTools shows `--font-instrument-serif` is `undefined` on `:root`.

### Pitfall 2: @theme vs @theme inline for Dark Mode

**What goes wrong:** Dark mode media query overrides `:root` variables but Tailwind utility classes still show light mode colors.
**Why it happens:** `@theme` (without `inline`) embeds the literal hex value into the utility CSS. The utility class becomes `.bg-bg { background-color: #FFFFFF; }` which never changes.
**How to avoid:** Use `@theme inline` for all tokens that reference `:root` variables. The generated utility becomes `.bg-bg { background-color: var(--color-bg); }` which responds to media query overrides.
**Warning signs:** Tailwind utilities work in light mode but don't change in dark mode. `:root` variables update correctly in DevTools but components don't reflect them.

### Pitfall 3: Instrument Serif Weight Specification

**What goes wrong:** Build error or font not loading.
**Why it happens:** Instrument Serif is NOT a variable font. It only has weight 400 in normal and italic styles. If you omit the `weight` property (valid for variable fonts like DM Sans), `next/font/google` throws an error.
**How to avoid:** Always specify `weight: '400'` for Instrument Serif. Specify `style: ['normal', 'italic']` to load both styles.
**Warning signs:** Build error mentioning "Missing weight for non-variable font."

### Pitfall 4: Tailwind v4 Import Syntax

**What goes wrong:** No Tailwind utilities work. All utility classes are unstyled.
**Why it happens:** Using the old Tailwind v3 syntax: `@tailwind base; @tailwind components; @tailwind utilities;`
**How to avoid:** Use `@import "tailwindcss";` as the single import. This is the v4 way.
**Warning signs:** Utility classes like `text-lg` or `bg-surface` have no effect.

### Pitfall 5: Stale create-next-app Cache

**What goes wrong:** Running `create-next-app` installs an older version than expected.
**Why it happens:** npx caches previously used versions. If you ran it months ago, it may use the cached version.
**How to avoid:** Use `npx create-next-app@latest` (the `@latest` tag forces a fresh fetch). Verify the generated `package.json` shows `next: "16.2.1"` after creation.
**Warning signs:** Generated `package.json` shows `next: "15.x"` or older.

### Pitfall 6: Tailwind v4 Namespace Collision with Project Color Tokens

**What goes wrong:** Tailwind default color palette utilities (`bg-red-500`, etc.) conflict with or clutter the project's intentionally minimal 6-color palette.
**Why it happens:** Tailwind v4 ships with a full default theme. Adding project colors via `@theme inline` ADDS to defaults rather than replacing them.
**How to avoid:** Clear the default color namespace before defining project colors:
```css
@theme {
  --color-*: initial;  /* Remove all default colors */
}
@theme inline {
  --color-bg: var(--color-bg);
  /* ... project colors only */
}
```
**Warning signs:** Autocomplete shows hundreds of color utilities. `bg-blue-500` works when it shouldn't.

## Code Examples

### Complete globals.css (Phase 1)

```css
/* app/globals.css */
/* Source: Tailwind v4 docs + create-next-app@16.2.1 template + project UI spec */
@import "tailwindcss";

/* === Color Tokens (light mode defaults) === */
:root {
  --color-bg: #FFFFFF;
  --color-surface: #E6F4F1;
  --color-accent: #A8E6CF;
  --color-text: #333A45;
  --color-text-muted: #555555;
  --color-text-faint: #888888;

  /* Layout constants */
  --spacing-section-desktop: 80px;
}

/* === Dark Mode === */
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: #1A1D23;
    --color-surface: #232830;
    --color-accent: #7CCFB0;
    --color-text: #E8ECF0;
    --color-text-muted: #A0A8B4;
    --color-text-faint: #6B7280;
  }
}

/* === Clear Tailwind defaults, define project tokens === */
@theme {
  --color-*: initial;
  --font-*: initial;
}

@theme inline {
  /* Colors */
  --color-bg: var(--color-bg);
  --color-surface: var(--color-surface);
  --color-accent: var(--color-accent);
  --color-text: var(--color-text);
  --color-text-muted: var(--color-text-muted);
  --color-text-faint: var(--color-text-faint);

  /* Fonts */
  --font-display: var(--font-instrument-serif);
  --font-body: var(--font-dm-sans);

  /* Layout */
  --spacing-section-mobile: 48px;
  --spacing-content-max: 1120px;
  --spacing-invest-max: 680px;
}

/* === Global Focus Ring === */
*:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

/* === Reduced Motion === */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* === Base Body Styles === */
body {
  background-color: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-dm-sans), ui-sans-serif, system-ui, sans-serif;
}
```

### Complete layout.tsx (Phase 1)

```typescript
// app/layout.tsx
// Source: Next.js 16 docs + create-next-app template
import type { Metadata } from 'next'
import { Instrument_Serif } from 'next/font/google'
import { DM_Sans } from 'next/font/google'
import './globals.css'

const instrumentSerif = Instrument_Serif({
  weight: '400',
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-instrument-serif',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Ryan Stern',
  description: 'Builder. Operator.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${instrumentSerif.variable} ${dmSans.variable}`}
    >
      <body className="min-h-dvh flex flex-col antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50
                     focus:px-4 focus:py-2 focus:bg-bg focus:text-text focus:rounded"
        >
          Skip to main content
        </a>
        <header role="banner">
          {/* Nav placeholder -- Phase 2 */}
        </header>
        <main id="main-content" role="main" className="flex-1">
          {children}
        </main>
        <footer role="contentinfo">
          {/* Footer placeholder -- Phase 2 */}
        </footer>
      </body>
    </html>
  )
}
```

### lib/systems.ts Schema

```typescript
// lib/systems.ts
// Source: UI spec System interface + CONTEXT.md D-04/D-05/D-06

export interface System {
  name: string
  slug: string
  oneLiner: string
  problem: string
  solution: string
  techBadge: 'Go' | 'Swift' | 'TypeScript' | 'Python' | 'Raspberry Pi' | 'Go + Swift'
  isPublic: boolean
  githubUrl: string | null
  status: 'active' | 'paused'
  featured: boolean
}

export const systems: System[] = [
  // 4 featured systems (locked copy from design doc)
  {
    name: 'LifeVault',
    slug: 'lifevault',
    oneLiner: 'Personal intelligence platform unifying a decade of digital life',
    problem: "You've searched your own email for something you know you wrote...",
    solution: 'LifeVault unifies it all into one searchable surface. 894K files indexed.',
    techBadge: 'Go',
    isPublic: false,
    githubUrl: null,
    status: 'active',
    featured: true,
  },
  // ... 14 more entries
]

export const featuredSystems = systems.filter((s) => s.featured)
export const shelfSystems = systems.filter((s) => !s.featured)
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `tailwind.config.js` | `@theme` in CSS | Tailwind v4 (Jan 2025) | No JS config file. CSS-first. |
| `@tailwind base/components/utilities` | `@import "tailwindcss"` | Tailwind v4 (Jan 2025) | Single import replaces three directives. |
| `middleware.ts` | `proxy.ts` | Next.js 16 (Mar 2026) | Renamed. Old name shows deprecation warning. |
| `next dev --turbo` | `next dev` (Turbopack default) | Next.js 16 (Mar 2026) | No flag needed. Use `--webpack` to opt out. |
| `@vercel/kv` | `@upstash/redis` | 2025 | `@vercel/kv` deprecated for new projects. |
| `next lint` in build | Separate `eslint` command | Next.js 16 | `next build` no longer runs linter. |
| `autoprefixer` in PostCSS | Not needed | Tailwind v4 | `@tailwindcss/postcss` handles prefixing internally. |

**Deprecated/outdated:**
- `tailwind.config.js`: Replaced by `@theme` in CSS (Tailwind v4)
- `@tailwind` directives: Replaced by `@import "tailwindcss"` (Tailwind v4)
- `autoprefixer`: No longer needed with Tailwind v4

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Next.js 16 (min 20.9) | Yes | 22.22.0 | -- |
| npm | Package installation | Yes | 10.9.4 | -- |
| npx | create-next-app | Yes | 10.9.4 | -- |
| Git | Version control | Yes | (repo exists) | -- |

**Missing dependencies with no fallback:** None.
**Missing dependencies with fallback:** None.

Phase 1 has no external service dependencies. Everything runs locally with `npm run dev`.

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest (recommended by Next.js 16 docs) |
| Config file | none -- see Wave 0 |
| Quick run command | `npx vitest run --reporter=verbose` |
| Full suite command | `npx vitest run` |

### Phase Requirements -> Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| FOUND-01 | Next.js dev server starts with zero errors | smoke | `npm run build` (catches import/type errors) | N/A (build command) |
| FOUND-02 | Mint palette, Instrument Serif, DM Sans render correctly | visual/manual | Manual browser check + `npm run build` for no errors | N/A |
| FOUND-03 | Dark mode colors apply without flash of wrong theme | visual/manual | Manual browser check with `prefers-color-scheme: dark` | N/A |
| FOUND-04 | Layout responds across 3 breakpoints | visual/manual | Manual browser resize check | N/A |
| FOUND-05 | lib/systems.ts exports 15 entries with correct schema | unit | `npx vitest run tests/lib/systems.test.ts -x` | Wave 0 |
| FOUND-06 | Focus rings, ARIA landmarks, touch targets, reduced motion present | unit + manual | `npx vitest run tests/accessibility.test.ts -x` | Wave 0 |

### Sampling Rate

- **Per task commit:** `npm run build` (catches TypeScript errors, missing imports, SSR issues)
- **Per wave merge:** `npm run build && npx vitest run`
- **Phase gate:** Full build green + manual visual verification in browser

### Wave 0 Gaps

- [ ] `vitest` + `@vitejs/plugin-react` + `jsdom` dev dependencies -- install
- [ ] `vitest.config.mts` -- create
- [ ] `tests/lib/systems.test.ts` -- validates 15 entries, schema completeness, 4 featured, 11 shelf
- [ ] `tests/accessibility.test.ts` -- validates skip-nav link exists, ARIA landmarks present, reduced-motion styles present in globals.css

*(Note: Most Phase 1 requirements are visual/CSS. The primary verification is `npm run build` succeeding and manual browser inspection. Unit tests cover the data layer and structural accessibility.)*

## Open Questions

1. **Headshot asset location**
   - What we know: CONTEXT.md D-01 says "Full-size professional headshot provided by user (not from current site)." The current site has `assets/images/hero/ryan-160.png` but the user wants a new one.
   - What's unclear: Has the user provided the new headshot file yet? No file exists in the repo.
   - Recommendation: Phase 1 scaffold should create `public/images/` directory. The placeholder can use the headshot from the current site or a generic placeholder. The user provides the real asset before Phase 2 ships.

2. **Shelf system one-liners**
   - What we know: D-05 says Claude drafts one-liner descriptions from project READMEs; user approves before shipping.
   - What's unclear: Should the draft happen in Phase 1 (data file creation) or Phase 2 (when shelf renders)?
   - Recommendation: Draft all 11 one-liners in Phase 1 as part of `lib/systems.ts` creation. Mark them as `// DRAFT -- pending user approval` in the code. User reviews during Phase 1 verification or early Phase 2.

3. **`create-next-app` in existing git repo with CLAUDE.md**
   - What we know: The repo already has a `CLAUDE.md` and `.planning/` directory. `create-next-app` with `--yes` generates its own `CLAUDE.md`.
   - What's unclear: Will `create-next-app` overwrite the existing `CLAUDE.md`?
   - Recommendation: Back up `CLAUDE.md` and `.planning/` before running `create-next-app`. Or use manual scaffold approach (install packages manually, create files by hand). Given the repo already exists, manual scaffold may be safer to avoid file conflicts.

## Sources

### Primary (HIGH confidence)
- **npm registry** -- Verified all package versions via `npm view <pkg> version` on 2026-03-26
- **create-next-app@16.2.1 generated template** -- Actually ran `npx create-next-app@16.2.1 --yes` locally and inspected every generated file
- [Next.js 16 installation docs](https://nextjs.org/docs/app/getting-started/installation) -- create-next-app prompts, defaults, file structure
- [Next.js 16 font optimization docs](https://nextjs.org/docs/app/getting-started/fonts) -- next/font/google patterns, variable fonts, CSS variables
- [Tailwind CSS v4 theme docs](https://tailwindcss.com/docs/theme) -- @theme directive syntax, namespaces, inline variant
- [Tailwind CSS + Next.js guide](https://tailwindcss.com/docs/guides/nextjs) -- PostCSS setup, globals.css import
- [Tailwind discussions #15267](https://github.com/tailwindlabs/tailwindcss/discussions/15267) -- Font variables on `<html>` not `<body>` for @theme resolution

### Secondary (MEDIUM confidence)
- [Instrument Serif - Google Fonts](https://fonts.google.com/specimen/Instrument%2BSerif) -- Weight 400 only, normal + italic
- [DM Sans - Google Fonts](https://fonts.google.com/specimen/DM+Sans) -- Variable font, weight 100-1000
- [Tailwind discussions #18560](https://github.com/tailwindlabs/tailwindcss/discussions/18560) -- @theme vs @theme inline behavior differences
- [Next.js testing with Vitest docs](https://nextjs.org/docs/app/guides/testing/vitest) -- Vitest setup for Next.js 16
- Design doc (`~/.gstack/projects/quartermint-lifevault/ryanstern-unknown-design-20260326-010500.md`) -- Full visual system spec
- Eng review test plan (`~/.gstack/projects/quartermint-throughline/ryanstern-main-eng-review-test-plan-20260326-124217.md`) -- Interaction edge cases
- UI spec (`.planning/phases/01-foundation-design-system/01-UI-SPEC.md`) -- Component inventory, token structure, schema

### Tertiary (LOW confidence)
- None -- all findings verified against primary or secondary sources.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- All versions verified against npm registry. Template verified by actually running create-next-app.
- Architecture: HIGH -- Patterns copied from the official create-next-app@16.2.1 generated template and official docs. Font variable placement verified in Tailwind discussions.
- Pitfalls: HIGH -- Each pitfall is based on observed behavior (template inspection) or documented in official discussions.

**Research date:** 2026-03-26
**Valid until:** 2026-04-26 (stable stack, no fast-moving dependencies)
