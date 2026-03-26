# Architecture Patterns

**Domain:** Personal founder narrative site with embedded AI chat, editorial design, multi-route architecture
**Researched:** 2026-03-26

## Recommended Architecture

### High-Level Structure

```
quartermint.com
|
|-- Next.js 15 App Router (React 19, Server Components by default)
|   |
|   |-- LAYOUT SHELL (root layout.tsx)
|   |   |-- Sticky Nav (client component, scroll-aware)
|   |   |-- Dark mode via CSS custom properties + prefers-color-scheme
|   |   |-- Google Fonts: Instrument Serif + DM Sans
|   |   |-- Footer (static)
|   |
|   |-- PAGES (server components by default)
|   |   |-- / (home) ............. Narrative hero + sections + embedded chat panel
|   |   |-- /invest .............. Memo-style investor route (server component)
|   |   |-- /systems/[slug] ..... Per-system detail pages (dynamic route)
|   |   |-- /privacy ............ Privacy notice (static)
|   |
|   |-- API ROUTES
|   |   |-- /api/chat ........... AI streaming endpoint (POST)
|   |   |-- /api/export ......... Conversation email export via Resend (POST)
|   |   |-- /api/digest ......... Weekly digest cron handler (GET, Vercel cron)
|   |
|   |-- CLIENT ISLANDS (interactive components)
|   |   |-- ChatPanel ........... Embedded chat interface ("use client")
|   |   |-- StickyNav ........... Scroll-aware navigation ("use client")
|   |   |-- ScrollTracker ....... IntersectionObserver section awareness ("use client")
|   |   |-- StarterChips ........ Context-aware conversation starters ("use client")
|   |   |-- AnimatedSection ..... Scroll-speed-adaptive entrance animations ("use client")
|   |   |-- KeyboardShortcuts ... ? key overlay ("use client")
|   |
|   |-- DATA LAYER
|   |   |-- lib/systems.ts ...... Single source for all system descriptions (DRY)
|   |   |-- lib/system-prompt.ts  Chat persona builder (identityvault-informed)
|   |   |-- lib/rate-limit.ts ... Three-tier rate limiting
|   |   |-- lib/chat-session.ts . Cookie-based session + returning visitor detection
|   |   |-- lib/analytics.ts .... Vercel KV topic tracking + /invest view logging
|   |
|   |-- EXTERNAL SERVICES
|       |-- Vercel KV ........... Rate limiting, session state, topic tracking, visitor detection
|       |-- Anthropic API ....... Chat streaming (@ai-sdk/anthropic)
|       |-- Resend .............. Conversation export email + weekly digest
|       |-- Vercel Cron ......... Weekly digest trigger
|       |-- Cloudflare DNS ...... DNS only (CNAME to Vercel)
```

### Component Boundaries

| Component | Responsibility | Communicates With | Rendering |
|-----------|---------------|-------------------|-----------|
| Root Layout | Font loading, nav, footer, dark mode shell, skip-to-content | All pages, StickyNav | Server |
| Home Page | Narrative sections, section ordering, static content | ScrollTracker, ChatPanel, AnimatedSection | Server (with client islands) |
| Invest Page | Memo-style investor content, journey detection | lib/analytics (sessionStorage flag) | Server (mostly static) |
| System Detail Pages | Per-system deep dive ([slug] routing) | lib/systems.ts for data | Server |
| ChatPanel | Message display, input, streaming, starter chips, export trigger | /api/chat, lib/chat-session, ScrollTracker | Client |
| ScrollTracker | IntersectionObserver for visible section detection | ChatPanel (via context/state), StickyNav | Client |
| StickyNav | Scroll-aware visibility, "Ryan Stern" left / "Invest" right | ScrollTracker (via shared state) | Client |
| AnimatedSection | translateY + opacity entrance animations, scroll-speed tiers | ScrollTracker (for speed detection) | Client |
| StarterChips | Context-aware conversation starters (section + recency + time) | ScrollTracker, ChatPanel, lib/systems.ts | Client |
| KeyboardShortcuts | ? key overlay with shortcut list | DOM event listeners | Client |
| /api/chat | Rate limiting, streaming, conversation logging, system prompt | Vercel KV, Anthropic API, lib/system-prompt | Server (API route) |
| /api/export | Email conversation transcript via Resend | Vercel KV (conversation retrieval), Resend | Server (API route) |
| /api/digest | Weekly cron: aggregate chat sessions, /invest views, top questions | Vercel KV, Resend | Server (cron-triggered) |
| lib/systems.ts | Single source of truth for system descriptions, tech badges, repo links | Home page, System Detail pages, StarterChips | Shared data module |
| lib/system-prompt.ts | Build chat persona from identityvault content | /api/chat | Server-only |
| lib/rate-limit.ts | Cookie session (20 msgs), IP hard cap (60/hr), budget alert ($50) | Vercel KV, /api/chat | Server-only |
| lib/chat-session.ts | 90-day returning visitor cookie, session management | ChatPanel, /api/chat | Shared (cookie read on client, write on server) |

### Data Flow

#### Chat Message Flow (Primary Data Path)

```
User types message
    |
    v
ChatPanel (useChat hook) ---> POST /api/chat
    |                              |
    |                              |--> checkRateLimit(ip, sessionCookie)
    |                              |     |-> Vercel KV: increment counter
    |                              |     |-> Cookie: check 20-msg session limit
    |                              |     |-> Return 429 if any limit hit
    |                              |
    |                              |--> buildSystemPrompt()
    |                              |     |-> Read identityvault content (build-time or cached)
    |                              |     |-> Inject scroll context from request body
    |                              |
    |                              |--> streamText({ model: anthropic(...), ... })
    |                              |     |-> Anthropic API (SSE streaming)
    |                              |
    |                              |--> onFinish: log to Vercel KV
    |                              |     |-> Store conversation for export/digest
    |                              |
    |                              |--> Return toUIMessageStreamResponse()
    |                                    with X-Conversation-Id, X-Rate-Limit-Remaining
    |
    v
ChatPanel receives SSE stream chunks
    |-> Render incrementally (message parts)
    |-> After 3rd message: show export slide-down panel
    |-> Update starter chips based on conversation state
```

#### Scroll Context Flow (Section Awareness)

```
User scrolls page
    |
    v
ScrollTracker (IntersectionObserver)
    |-> Observes all <section> elements with data-section attribute
    |-> Calculates: most visible section, scroll speed tier (slow/medium/fast)
    |-> Updates shared state (React context or zustand store)
    |
    +--> StickyNav: highlight current section (if nav items map to sections)
    +--> AnimatedSection: adjust animation timing based on scroll speed
    +--> StarterChips: select context-relevant conversation starters
    +--> ChatPanel: include current section in next /api/chat request body
```

#### Visitor Identity Flow

```
First visit:
    |-> Set 90-day cookie (visitor_id = UUID)
    |-> Vercel KV: create visitor record
    |-> ChatPanel: show default greeting
    |-> StarterChips: use static defaults

Return visit (cookie present):
    |-> Read visitor_id from cookie
    |-> Vercel KV: fetch previous topic history
    |-> ChatPanel: show personalized greeting ("Welcome back...")
    |-> StarterChips: prioritize topics not yet discussed

/invest journey:
    |-> Set sessionStorage flag on /invest visit
    |-> If flag present on home page: variant heading in hero
    |-> Vercel KV: log /invest view for weekly digest
```

#### Weekly Digest Flow

```
Vercel Cron (weekly, e.g., Monday 9am UTC)
    |
    v
GET /api/digest
    |-> Vercel KV: aggregate past 7 days
    |     |-> Total chat sessions
    |     |-> Top questions (by frequency)
    |     |-> /invest page views
    |     |-> Unique visitors
    |
    |-> Build email with React Email components
    |-> Resend: send to ryan@quartermint.com
    |-> Vercel KV: clear weekly counters
```

#### Conversation Export Flow

```
User clicks "Email this conversation" (after 3rd message)
    |
    v
Slide-down panel: email input
    |-> POST /api/export { conversationId, email }
    |     |-> Vercel KV: retrieve conversation by ID
    |     |-> Build email with React Email template
    |     |-> Resend: send from chat@quartermint.com
    |     |-> Return success/failure
    |
    v
ChatPanel: show confirmation toast
```

## Patterns to Follow

### Pattern 1: Server Components by Default, Client Islands for Interactivity

**What:** Every page and layout is a React Server Component. Only components that need browser APIs (scroll events, user input, animations) get the "use client" directive.

**When:** Always. This is the App Router's fundamental model.

**Why:** Zero JS shipped for static content sections (hero, origin story, systems shelf, invest page). Only the chat panel, nav, and animations send JavaScript to the browser.

**Example:**
```typescript
// app/page.tsx (Server Component - no "use client")
import { ChatPanel } from '@/components/chat-panel' // client island
import { AnimatedSection } from '@/components/animated-section' // client island
import { systems } from '@/lib/systems' // shared data

export default function Home() {
  return (
    <main>
      <section data-section="hero">
        {/* Static JSX - zero JS */}
        <h1>...</h1>
      </section>
      <AnimatedSection name="systems">
        {/* Server-rendered content inside client wrapper */}
        {systems.featured.map(s => <SystemCard key={s.slug} system={s} />)}
      </AnimatedSection>
      <ChatPanel />
    </main>
  )
}
```

### Pattern 2: AI SDK v6 Streaming with UIMessage Protocol

**What:** Use the current AI SDK v6 `streamText` + `toUIMessageStreamResponse` on the server, and `useChat` with `sendMessage` on the client. Messages use the `parts` array structure, not plain `content` strings.

**When:** For the chat API route and ChatPanel component.

**Why:** Stripped uses AI SDK v3 (`"ai": "^3.4.33"`). The current stable is v6 with significant API changes (see Pitfalls). Building fresh on v6 avoids migration debt.

**Critical API differences from Stripped's v3 patterns:**
- `toDataStreamResponse()` is now `toUIMessageStreamResponse()`
- Messages use `UIMessage` type with `parts: [{ type: 'text', text: '...' }]` instead of `content: string`
- `useChat` no longer manages input state internally -- must manage with `useState`
- `append()` replaced by `sendMessage({ text: '...' })`
- `CoreMessage` replaced by `ModelMessage` + `convertToModelMessages()` (async)
- Provider import: `@ai-sdk/anthropic` still works, but model string format changed

**Example:**
```typescript
// app/api/chat/route.ts (AI SDK v6)
import { streamText, UIMessage, convertToModelMessages } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import { buildSystemPrompt } from '@/lib/system-prompt'
import { checkRateLimit } from '@/lib/rate-limit'

export const maxDuration = 30

export async function POST(req: Request) {
  const { messages, sectionContext, conversationId }:
    { messages: UIMessage[]; sectionContext?: string; conversationId: string } = await req.json()

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown'
  const { allowed, remaining } = await checkRateLimit(ip)
  if (!allowed) return Response.json({ error: 'Rate limit exceeded' }, { status: 429 })

  const result = streamText({
    model: anthropic('claude-sonnet-4-20250514'),
    system: buildSystemPrompt(sectionContext),
    messages: await convertToModelMessages(messages),
    maxOutputTokens: 500, // 500-token response cap per PROJECT.md
  })

  return result.toUIMessageStreamResponse({
    headers: {
      'X-Conversation-Id': conversationId,
      'X-Rate-Limit-Remaining': remaining.toString(),
    },
  })
}
```

### Pattern 3: Three-Tier Rate Limiting

**What:** Layer cookie-based session limits (UX), IP-based hard caps (abuse), and monthly budget alerts (cost).

**When:** Every /api/chat request passes through all three checks.

**Why:** Each tier serves a different purpose. Cookie limits create good UX (soft limit, clearable). IP limits prevent abuse (hard limit). Budget alerts prevent runaway costs.

**Implementation:**
```typescript
// lib/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit'
import { kv } from '@vercel/kv'

// Tier 2: IP-based hard cap (60 requests/hour)
const ipLimiter = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.fixedWindow(60, '1h'),
  prefix: 'rate:ip:',
})

export async function checkRateLimit(ip: string, sessionMsgCount: number) {
  // Tier 1: Cookie-based session (20 messages) - checked client-side + server-side
  if (sessionMsgCount >= 20) {
    return { allowed: false, reason: 'session', remaining: 0 }
  }

  // Tier 2: IP-based hard cap
  const { success, remaining } = await ipLimiter.limit(ip)
  if (!success) {
    return { allowed: false, reason: 'ip', remaining: 0 }
  }

  // Tier 3: Budget alert (checked async, doesn't block - alerts owner)
  await checkBudgetAlert() // logs to KV, sends alert if threshold hit

  return { allowed: true, reason: null, remaining }
}
```

### Pattern 4: CSS Custom Properties Design System (No Tailwind)

**What:** Define the visual system entirely in CSS custom properties. Instrument Serif for headlines, DM Sans for body, mint color palette, alternating section backgrounds, dark mode via media query.

**When:** Global styles in `app/globals.css`, consumed by all components.

**Why:** The PROJECT.md specifies "CSS custom properties only" and the design system is fully defined. Tailwind adds build complexity and fights the editorial aesthetic. The Stripped reference uses Tailwind, but quartermint needs a different visual identity.

**Note:** The PROJECT.md and design doc specify CSS custom properties. While Stripped uses Tailwind, the quartermint design system is editorial/typographic in nature. CSS custom properties give direct control over the design token system without a utility class abstraction layer. This is an opinionated choice that trades Tailwind's development speed for tighter control over the editorial aesthetic.

**Example:**
```css
/* app/globals.css */
:root {
  /* Typography */
  --font-display: 'Instrument Serif', serif;
  --font-body: 'DM Sans', sans-serif;

  /* Mint palette - light mode */
  --color-bg-primary: #ffffff;
  --color-bg-secondary: #f0faf4; /* mint tint for alternating sections */
  --color-text-primary: #1a1a2e;
  --color-text-secondary: #4a4a68;
  --color-accent: #2dd4a8; /* mint */
  --color-accent-hover: #22b893;

  /* Spacing scale */
  --space-section: 6rem;
  --space-element: 2rem;
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-bg-primary: #0f1419;
    --color-bg-secondary: #111d1a; /* dark mint */
    --color-text-primary: #e8e8ed;
    --color-text-secondary: #a0a0b8;
    --color-accent: #3ee8b8;
    --color-accent-hover: #55f0c8;
  }
}
```

### Pattern 5: Shared Scroll State via React Context

**What:** A ScrollContext provider wraps the home page, updated by IntersectionObserver, consumed by ChatPanel, StickyNav, StarterChips, and AnimatedSection.

**When:** Home page only (other pages don't need section awareness).

**Why:** Multiple components need to react to scroll position. Prop drilling would be unwieldy. A context provider at the page level keeps the dependency graph clean.

**Example:**
```typescript
// components/scroll-context.tsx
'use client'
import { createContext, useContext, useState, useCallback } from 'react'

interface ScrollState {
  activeSection: string | null
  scrollSpeed: 'slow' | 'medium' | 'fast'
  visibleSections: string[]
}

const ScrollContext = createContext<ScrollState>({
  activeSection: null,
  scrollSpeed: 'medium',
  visibleSections: [],
})

export const useScrollState = () => useContext(ScrollContext)
export function ScrollProvider({ children }: { children: React.ReactNode }) {
  // IntersectionObserver logic here, updates state
  // ...
  return <ScrollContext.Provider value={state}>{children}</ScrollContext.Provider>
}
```

### Pattern 6: DRY Data Source for Systems

**What:** A single `lib/systems.ts` file defines all system descriptions, tech badges, repo links, featured status, and slug for routing. Every component that displays system information reads from this source.

**When:** Always. This is a data normalization requirement from PROJECT.md.

**Why:** System data appears in featured cards, the systems shelf, detail pages, chat context, and starter chips. A single source prevents drift.

```typescript
// lib/systems.ts
export interface System {
  slug: string
  name: string
  tagline: string        // empathy-first framing
  description: string    // longer description for detail page
  techBadges: string[]   // e.g., ['Swift', 'MapLibre', 'GRDB']
  repoUrl?: string       // public repo link (if public)
  isPublic: boolean
  featured: boolean      // true for LifeVault, Relay, OpenEFB, v2cf
  order: number          // display order in shelf
}

export const systems: System[] = [
  {
    slug: 'lifevault',
    name: 'LifeVault',
    tagline: 'Your life, organized by you, for you.',
    // ...
    featured: true,
  },
  // ... 10 more systems
]

export const featuredSystems = systems.filter(s => s.featured)
export const getSystemBySlug = (slug: string) => systems.find(s => s.slug === slug)
```

## Anti-Patterns to Avoid

### Anti-Pattern 1: Using AI SDK v3 Patterns in a v6 Project

**What:** Copying Stripped's `useChat` / `append` / `toDataStreamResponse` / `content: string` patterns directly.

**Why bad:** Stripped uses AI SDK v3. The current SDK is v6 with two major version bumps worth of breaking changes. Using v3 patterns will either fail at compile time or produce subtle runtime bugs. The message type system changed fundamentally from `content: string` to `parts: Part[]`.

**Instead:** Build the chat layer fresh on AI SDK v6 patterns. Port the *architecture concepts* from Stripped (rate limiting, conversation logging, system prompt building) but rewrite the API surface code.

### Anti-Pattern 2: Tailwind for Editorial Typography

**What:** Using Tailwind utility classes to implement the editorial design system.

**Why bad:** The design doc specifies Instrument Serif headlines, DM Sans body, mint palette, CSS custom properties. Tailwind's utility-first approach fights editorial typography where you want semantic class names (`.hero-headline`, `.section-body`) rather than `text-4xl font-serif tracking-tight`. The Stripped approach of utility classes works for a minimal chat app but doesn't serve the narrative-driven visual identity.

**Instead:** CSS custom properties + a minimal set of semantic CSS classes. CSS Modules or a thin global stylesheet are both viable. Use `next/font/google` for Instrument Serif and DM Sans.

### Anti-Pattern 3: Global Client-Side State for Everything

**What:** Making the entire app a client component tree, or using a global state manager for data that's only needed in one place.

**Why bad:** Most of this site is static content. The hero, origin story, systems shelf, invest page, and footer need zero JavaScript. Making them client components ships unnecessary JS and hurts performance metrics.

**Instead:** Server Components for all content sections. Client islands only for: ChatPanel, StickyNav, ScrollTracker, AnimatedSection, KeyboardShortcuts. Pass server-rendered content as children to client wrappers when animation is needed.

### Anti-Pattern 4: Storing Chat History Only Client-Side

**What:** Relying on the `useChat` hook's in-memory state as the only record of conversations.

**Why bad:** Conversations disappear on page refresh. Can't power the weekly digest. Can't support conversation export. Breaks the returning visitor experience.

**Instead:** Log every message to Vercel KV server-side (in the API route's `onFinish` callback). Use the conversation ID to retrieve history for exports and digest aggregation. Client state is ephemeral; server state is durable.

### Anti-Pattern 5: Hardcoding the System Prompt

**What:** Embedding the entire chat persona as a string literal in the API route.

**Why bad:** The system prompt for quartermint needs to incorporate identityvault content, scroll context from the user's current section, and potentially different framing for returning visitors. A hardcoded string can't adapt.

**Instead:** `buildSystemPrompt(context)` function that composes the prompt from identityvault data + runtime context (current section, visitor type). Same architectural pattern as Stripped's `buildSystemPrompt()` but with different inputs.

## Scalability Considerations

| Concern | At 100 visitors/day | At 1K visitors/day | At 10K visitors/day |
|---------|---------------------|---------------------|----------------------|
| Chat API costs | ~$5/mo, budget alert at $50 | ~$50/mo, may need to tighten rate limits | $500+/mo, need per-visitor session limits or gating |
| Vercel KV usage | Well within free tier | May hit free tier limits | Upgrade to paid KV plan |
| Vercel function invocations | Free tier sufficient | Monitor invocation count | May need Pro plan |
| Conversation storage (KV) | Negligible | Set TTL on conversations (30 days) | TTL required, consider archiving to external store |
| Build time | <30s (static content, few pages) | Same (content is static) | Same |

This site is unlikely to hit 10K visitors/day. The architecture is designed for the 100-1K range with graceful degradation (rate limiting prevents cost blowouts at any scale).

## Suggested Build Order (Dependency Graph)

The build order is driven by what blocks what:

### Phase 1: Foundation (nothing depends on externals yet)

```
1. Next.js 15 project scaffold
2. CSS custom properties design system (globals.css)
3. Root layout (fonts, nav shell, footer)
4. lib/systems.ts (DRY data source)
```

**Rationale:** Everything else depends on the design system and data layer existing. The layout shell must exist before pages.

### Phase 2: Static Content (depends on Phase 1)

```
5. Home page sections (hero, featured systems, origin story, systems shelf, contact/invest CTA)
6. /invest route
7. /privacy route
8. Section entrance animations (AnimatedSection)
9. Sticky nav with scroll awareness
```

**Rationale:** All static content can be built and verified before adding the chat system. This gives a complete, reviewable site without any external dependencies.

### Phase 3: Chat System (depends on Phase 1 design, adds external deps)

```
10. /api/chat route (AI SDK v6, Anthropic streaming)
11. lib/system-prompt.ts (identityvault-informed)
12. lib/rate-limit.ts (three-tier)
13. ChatPanel component (useChat, message display, starter chips)
14. Scroll context integration (section awareness in chat)
15. Conversation logging to Vercel KV
```

**Rationale:** Chat is the highest-complexity, highest-risk feature. Building it after static content means the site is shippable even if chat encounters blockers. Chat also requires Vercel KV and ANTHROPIC_API_KEY environment variables.

### Phase 4: Engagement Features (depends on Phase 3 chat working)

```
16. Returning visitor detection (90-day cookie + KV)
17. Conversation export via Resend
18. /invest journey detection (sessionStorage + variant heading)
19. Smart starter chips (full context: scroll + recency + time)
20. Keyboard shortcuts overlay
```

**Rationale:** These features enhance the core experience but none are shippable blockers. They all depend on the chat system or visitor tracking infrastructure being in place.

### Phase 5: Operations (depends on Phase 3-4 infrastructure)

```
21. Weekly digest cron (/api/digest + Vercel cron)
22. Budget alert monitoring
23. OG tags, sitemap.xml, robots.txt, canonical URLs
24. Per-system detail pages (/systems/[slug])
25. DNS repoint from Cloudflare to Vercel
```

**Rationale:** Operational features are the final layer. The digest needs chat data to aggregate. SEO metadata and detail pages can be added post-launch. DNS repoint is the last step before the site goes live.

### Dependency Graph (Arrows = "depends on")

```
Phase 1: Foundation
  |
  +--> Phase 2: Static Content
  |       |
  |       +--> Phase 5: SEO + detail pages (partial)
  |
  +--> Phase 3: Chat System
          |
          +--> Phase 4: Engagement Features
          |       |
          |       +--> Phase 5: Digest + monitoring
          |
          +--> Phase 5: DNS repoint (after all phases verified)
```

**Critical path:** Foundation -> Chat System -> Engagement -> Operations. Static content can be built in parallel with chat.

## Technology Version Decisions

| Technology | Version | Rationale |
|------------|---------|-----------|
| Next.js | 15 (latest stable) | New project, no migration baggage. React 19, improved caching defaults, Turbopack. |
| React | 19 | Required by Next.js 15. Server Components stable. |
| AI SDK | 6.x (latest) | Current stable. Stripped uses v3 which has two major versions of breaking changes. Build fresh on v6. |
| @ai-sdk/anthropic | Latest compatible with AI SDK 6 | Provider package for Claude models. |
| @vercel/kv | 3.x | Rate limiting, session state, conversation logging, visitor tracking. |
| @upstash/ratelimit | Latest | Purpose-built rate limiting on Vercel KV. Better than hand-rolling counters. |
| Resend | Latest | Email for conversation export and weekly digest. Direct Next.js integration. |
| TypeScript | 5.x | Strict mode. Required by Next.js 15. |
| CSS | Custom properties only | No Tailwind. Editorial design system per design doc. |
| next/font/google | Built-in | Instrument Serif + DM Sans, no FOUT. |

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Overall architecture | HIGH | Standard Next.js App Router patterns, well-documented |
| AI SDK v6 migration path | HIGH | Verified against official migration guides (v3->v5->v6 changes documented) |
| Chat streaming pattern | HIGH | Proven in Stripped (architecture, not API surface), official AI SDK docs confirm pattern |
| Rate limiting approach | HIGH | Official Vercel/Upstash pattern, documented and templated |
| CSS custom properties design system | MEDIUM | Less common than Tailwind in Next.js ecosystem, but well-supported. May encounter DX friction without utility classes. |
| Scroll-speed-adaptive animations | MEDIUM | IntersectionObserver is stable API, but three speed tiers add custom complexity |
| Weekly digest cron | HIGH | Standard Vercel cron pattern, well-documented |
| Returning visitor detection | MEDIUM | Cookie + KV pattern is straightforward, but edge cases around cookie consent, privacy |

## Sources

- Stripped project source code: ~/stripped/ (proven reference architecture)
- [AI SDK Getting Started - Next.js App Router](https://ai-sdk.dev/docs/getting-started/nextjs-app-router) - Official docs, AI SDK v6
- [AI SDK Migration Guide 5.x to 6.0](https://ai-sdk.dev/docs/migration-guides/migration-guide-6-0) - Breaking changes documentation
- [AI SDK Migration Guide 4.x to 5.0](https://ai-sdk.dev/docs/migration-guides/migration-guide-5-0) - Prior breaking changes
- [AI SDK Advanced: Rate Limiting](https://ai-sdk.dev/docs/advanced/rate-limiting) - Official rate limiting pattern
- [Vercel Cron Jobs Documentation](https://vercel.com/docs/cron-jobs) - Cron scheduling for digest
- [Resend Next.js Integration](https://resend.com/docs/send-with-nextjs) - Email sending
- [Add Rate Limiting with Vercel KV](https://vercel.com/guides/rate-limiting-edge-middleware-vercel-kv) - Official Vercel guide
- [Securing AI Applications with Rate Limiting](https://vercel.com/kb/guide/securing-ai-app-rate-limiting) - Vercel AI-specific rate limiting
- [Next.js CSS Documentation](https://nextjs.org/docs/app/getting-started/css) - CSS support in App Router
- [MDN: Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) - Browser API reference
