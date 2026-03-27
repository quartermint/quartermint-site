# Phase 4: Engagement Intelligence - Research

**Researched:** 2026-03-27
**Domain:** Browser scroll tracking, returning visitor state, email transactional delivery, client/server hydration patterns
**Confidence:** HIGH

## Summary

Phase 4 transforms the chat system from a static widget into a contextually aware interface. Five distinct feature domains are involved: (1) scroll-aware chat context via IntersectionObserver feeding section metadata to the chat API, (2) dynamic starter chips using a priority cascade, (3) returning visitor detection via cookie + Upstash Redis with personalized greetings, (4) /invest journey detection via sessionStorage, and (5) conversation export via Resend email with clipboard fallback. Each domain is well-served by browser-native APIs and the existing stack. The only new dependency is `resend` + `@react-email/components` for transactional email.

A critical finding: the CONTEXT.md decision D-07 specifies `suppressHydrationWarning` on the InvestHeading component, but in React 18+/19 this attribute suppresses the warning AND prevents the client-side re-render from patching the mismatched content. The correct pattern is `useState(false)` + `useEffect(() => setMounted(true), [])` to render server content on first pass and swap to client content after hydration. The planner must account for this.

The codebase is well-positioned for Phase 4. The Upstash Redis connection, chat API route, ChatInterface component, StarterChips component, SectionWrapper with IntersectionObserver, and session cookie infrastructure all exist from Phase 3. However, some sections lack `id` props (Origin Story, Systems Shelf, Contact) which are needed for scroll tracking.

**Primary recommendation:** Build in dependency order: scroll context provider first (foundation for dynamic chips), then returning visitor state (extends Redis), then conversation export (independent Resend integration), then /invest journey detection (simple sessionStorage), then keyboard shortcuts (standalone overlay). Each feature is isolated enough for parallel work within waves.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** IntersectionObserver tracks which main page section is visible. Section name passed as metadata to chat API route. System prompt incorporates "user was viewing [section]" context at request time (injected into the deploy-time base prompt).
- **D-02:** Priority cascade: scroll context > commit recency > time-of-day > static defaults. Always exactly 3 chips. Same visual styling for all types.
- **D-03:** Session ID via `crypto.randomUUID()`, generated server-side on first visit. Stored in HttpOnly `rv` cookie, 90-day expiry.
- **D-04:** Upstash Redis stores `visitor:{id}` with: lastVisit, topics[], sectionsViewed[], messageCount.
- **D-05:** Topic extraction: LLM-summarized. After each conversation ends (session close or 5min inactivity), make a Claude API call to extract the main topic from the conversation. Store in `visitor:{id}.topics[]`.
- **D-06:** Greeting tiers: <7 days = specific ("Welcome back. You were asking about [topic]"), 7-30 days = general ("Good to see you again"), >30 days or KV failure = treat as new silently.
- **D-07:** sessionStorage flag set when contact section enters viewport (IntersectionObserver). On /invest: if flag present, variant heading ("You've seen the work. Here's where it's going."). SSR always renders default; variant applied client-side after hydration with `suppressHydrationWarning` on a narrow client component boundary.
- **D-08:** Envelope icon (20px, text-muted) in chat header after 3rd message. Slide-down panel with email input + "Send" button. Sent via Resend from chat@quartermint.com. Success auto-dismisses 3s. Error: "Copy conversation" clipboard fallback. BCC Ryan.
- **D-09:** ? key opens centered modal overlay (400px max-width, blur backdrop). Not shown when input focused. Dismiss: Esc, click outside, or ? again.
- **D-10:** Single Upstash Redis instance (same as Phase 3). Key prefixes: `rate:{ip}`, `visitor:{id}`, `chat:{session}`. All Phase 4 data uses existing Redis connection.

### Claude's Discretion
- IntersectionObserver threshold tuning for section tracking
- Conversation "ended" detection heuristic (session close vs inactivity timer)
- Smart chip content for each context type (scroll, commit, time-of-day)
- Keyboard shortcuts list content

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| ENG-02 | Chat section scroll awareness -- IntersectionObserver tracks which section is visible, passes as metadata to chat API, system prompt incorporates "user was viewing [section]" context | ScrollContextProvider pattern using React Context + IntersectionObserver. Existing SectionWrapper already uses IntersectionObserver for entrance animations at threshold 0.3. Scroll tracking reuses the same threshold. Missing `id` props on 4 of 6 sections must be added. Chat API route `buildSystemPrompt()` must accept optional section context parameter. |
| ENG-05 | Keyboard shortcuts overlay (? key, centered modal 400px max-width, blur backdrop) | Standard React portal/fixed-position modal pattern. `useEffect` keydown listener filtering `document.activeElement` tag name. Toggle state via `useState`. Focus trap pattern already demonstrated in `ChatMobileOverlay`. |
| INT-01 | Conversation export via email -- envelope icon after 3rd message, slide-down panel, Resend from chat@quartermint.com, clipboard fallback | Resend SDK `resend.emails.send({ react: ConversationExportEmail(props) })` in new `app/api/export/route.ts`. React Email template for conversation thread. `navigator.clipboard.writeText()` for fallback. New dependency: `resend@^6.9.4` + `@react-email/components@^1.0.10`. |
| INT-02 | Returning visitor detection -- 90-day rv cookie, Upstash Redis visitor state, greeting tiers | Existing `@upstash/redis` connection. `redis.set(key, jsonObject)` with EX option for TTL. New `app/api/visitor/route.ts` GET endpoint reads cookie, returns visitor tier. Background topic extraction via `generateText` with `claude-haiku-4-5` model (cheapest). |
| INV-02 | /invest journey detection -- sessionStorage flag, variant heading client-side | **CRITICAL: suppressHydrationWarning does NOT work as expected in React 19.** It suppresses the warning but prevents re-render of mismatched content. Correct pattern: `useState(false)` + `useEffect` mount check, render server heading initially, swap after mount. No `suppressHydrationWarning` needed with this approach. |
</phase_requirements>

## Standard Stack

### Core (already installed)
| Library | Version | Purpose | Status |
|---------|---------|---------|--------|
| `@upstash/redis` | ^1.37.0 | Visitor state storage (visitor:{id} keys) | Installed, connection in `lib/chat/redis.ts` |
| `@upstash/ratelimit` | ^2.0.8 | Rate limiting (unchanged from Phase 3) | Installed |
| `ai` | ^6.0.141 | `generateText` for background topic extraction | Installed |
| `@ai-sdk/anthropic` | ^3.0.64 | Anthropic provider for Haiku model | Installed |
| `@ai-sdk/react` | ^3.0.143 | `useChat` hook (unchanged from Phase 3) | Installed |
| `next` | 16.2.1 | Framework (App Router, API routes, cookies) | Installed |
| `react` | 19.2.4 | UI library | Installed |

### New Dependencies
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `resend` | 6.9.4 | Transactional email SDK for conversation export | Official Resend SDK. 1.67M weekly npm downloads. Simple `resend.emails.send()` API with React component support. |
| `@react-email/components` | 1.0.10 | Email template components (Html, Head, Body, Text, Container, Section) | Official React Email library. Build email templates as React components rendered to HTML by Resend. Supports React 19 and Tailwind 4. |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `resend` | Nodemailer + SMTP | More setup, no React Email integration, handles deliverability yourself. Only if you need your own SMTP server. |
| `@react-email/components` | Raw HTML string template | Fragile, no type safety, inconsistent rendering across email clients. React Email handles Gmail/Outlook inconsistencies. |
| `react-intersection-observer` npm package | Browser IntersectionObserver API directly | The project already uses native IntersectionObserver in SectionWrapper. Adding a library for the same API adds bundle size for no benefit. Stick with native. |

**Installation:**
```bash
npm install resend @react-email/components
```

## Architecture Patterns

### Project Structure (Phase 4 additions)
```
app/
  api/
    chat/route.ts          # MODIFY: accept scrollContext + visitorContext in body
    export/route.ts        # NEW: POST, sends conversation export via Resend
    visitor/route.ts       # NEW: GET, returns visitor tier/topics from Redis
  invest/page.tsx          # MODIFY: wrap h1 with InvestHeading client component
  page.tsx                 # MODIFY: wrap with ScrollContextProvider, add KeyboardShortcutsModal
components/
  chat/
    chat-interface.tsx     # MODIFY: accept scroll context, render envelope icon, accept dynamic chips
    starter-chips.tsx      # MODIFY: accept dynamic chip labels via props
    conversation-export-panel.tsx  # NEW: slide-down email panel
    returning-visitor-greeting.tsx # NEW: personalized greeting above chips
  scroll-context-provider.tsx      # NEW: IntersectionObserver + React Context
  keyboard-shortcuts-modal.tsx     # NEW: ? key modal overlay
  invest-heading.tsx               # NEW: client component for /invest heading swap
lib/
  chat/
    visitor.ts             # NEW: visitor state CRUD for Upstash Redis
    scroll-context.ts      # NEW: section-to-chip and section-to-prompt mappings
    topic-extract.ts       # NEW: background topic extraction via generateText + Haiku
  email/
    conversation-export-template.tsx  # NEW: React Email template for export
```

### Pattern 1: ScrollContextProvider (React Context + IntersectionObserver)
**What:** A client component that wraps page content, observes all sections with `id` props, and exposes the currently visible section via React Context.
**When to use:** Anytime you need scroll position state shared across multiple components (chat, starter chips).
**Example:**
```typescript
// Source: Browser IntersectionObserver API + React Context pattern
'use client'
import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from 'react'

type ScrollContextType = { currentSection: string | null }
const ScrollContext = createContext<ScrollContextType>({ currentSection: null })

export function useScrollContext() { return useContext(ScrollContext) }

// Section IDs to observe (must match SectionWrapper id props)
const SECTION_IDS = [
  'hero-section', 'featured-systems', 'chat-section',
  'origin-story', 'systems-shelf', 'contact-section'
]

export function ScrollContextProvider({ children }: { children: ReactNode }) {
  const [currentSection, setCurrentSection] = useState<string | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Find the most visible section
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible.length > 0) {
          setCurrentSection(visible[0].target.id)
        }
      },
      { threshold: 0.3 }
    )

    SECTION_IDS.forEach(id => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <ScrollContext.Provider value={{ currentSection }}>
      {children}
    </ScrollContext.Provider>
  )
}
```

### Pattern 2: Returning Visitor State Flow
**What:** Server-side cookie issuance + Redis lookup + client-side greeting rendering.
**Flow:**
1. First visit: API route (or proxy.ts) generates UUID, sets `rv` cookie (HttpOnly, 90-day, SameSite=Strict)
2. Chat interaction: API route reads `rv` cookie, updates `visitor:{id}` in Redis (lastVisit, messageCount, sectionsViewed)
3. Return visit: Client component calls `GET /api/visitor` which reads `rv` cookie, looks up Redis, returns tier + topics
4. Greeting renders above starter chips based on tier

### Pattern 3: Background Topic Extraction
**What:** After conversation ends, fire-and-forget `generateText` call with cheapest model to summarize the conversation topic.
**When to use:** After conversation "ends" (5min inactivity or session close).
**Example:**
```typescript
// Source: AI SDK generateText docs
import { generateText } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import { redis } from './redis'

export async function extractAndStoreTopic(
  visitorId: string,
  conversationText: string
): Promise<void> {
  try {
    const { text } = await generateText({
      model: anthropic('claude-haiku-4-5'),
      prompt: `Summarize the main topic of this conversation in 3-5 words. Return ONLY the topic, nothing else.\n\n${conversationText}`,
      maxTokens: 20,
    })

    const key = `visitor:${visitorId}`
    const visitor = await redis.get<VisitorState>(key)
    if (visitor) {
      visitor.topics = [text.trim(), ...visitor.topics].slice(0, 5) // FIFO, max 5
      await redis.set(key, visitor, { ex: 90 * 86400 }) // 90-day TTL
    }
  } catch (error) {
    console.error('Topic extraction failed:', error)
    // Fire-and-forget: failure is silent
  }
}
```

### Pattern 4: InvestHeading Client Hydration (CORRECTED from D-07)
**What:** Narrow client component that reads sessionStorage and swaps heading text.

**CRITICAL CORRECTION:** D-07 specifies `suppressHydrationWarning` but this does NOT work correctly in React 19. The attribute suppresses the warning but also prevents the re-render, so the variant heading would never show. The correct pattern uses `useState` + `useEffect` for a two-pass render.

**Example:**
```typescript
'use client'
import { useState, useEffect } from 'react'

export function InvestHeading() {
  const [isJourney, setIsJourney] = useState(false)

  useEffect(() => {
    // Read sessionStorage only after mount (client-side only)
    const flag = sessionStorage.getItem('qm_journey_contact')
    if (flag === 'true') {
      setIsJourney(true)
    }
  }, [])

  return (
    <h1 className="font-display text-[32px] leading-[1.2] text-text mb-8">
      {isJourney
        ? "You've seen the work. Here's where it's going."
        : 'The Infrastructure Behind the Work'}
    </h1>
  )
}
```
No `suppressHydrationWarning` needed. Server renders default heading. Client mounts, reads sessionStorage, and if flag is set, React re-renders with variant text. No hydration mismatch because the initial client render matches the server render.

### Pattern 5: Resend Email in API Route
**What:** POST handler that receives conversation data, renders React Email template, sends via Resend.
**Example:**
```typescript
// Source: Resend official docs (resend.com/docs/send-with-nextjs)
import { Resend } from 'resend'
import { ConversationExportEmail } from '@/lib/email/conversation-export-template'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  const { email, messages, sessionId } = await req.json()

  const { data, error } = await resend.emails.send({
    from: 'Ryan Stern <chat@quartermint.com>',
    to: [email],
    bcc: ['ryan@quartermint.com'],
    subject: 'Your conversation with Ryan Stern',
    react: ConversationExportEmail({ messages }),
  })

  if (error) {
    return Response.json({ error: 'Failed to send' }, { status: 500 })
  }
  return Response.json({ success: true })
}
```

### Anti-Patterns to Avoid
- **Mounting IntersectionObservers per-component:** Do NOT create a separate IntersectionObserver in ChatInterface, StarterChips, and the contact section. Use ONE ScrollContextProvider at the page level and consume via `useScrollContext()`.
- **Storing visitor state in localStorage:** Decision D-03 requires HttpOnly cookie + server-side Redis. localStorage is readable by client JS and lacks server-side access for the API route.
- **Streaming topic extraction:** The topic extraction is a background task. Use `generateText` (awaits full response), not `streamText`. Streaming adds complexity for no benefit here.
- **Polling for visitor state:** Don't poll the visitor API route. Fetch once on mount in `ReturningVisitorGreeting`, cache the result for the session.
- **Using `suppressHydrationWarning` for content that should change:** As documented above, this prevents re-render in React 19. Use the useState + useEffect pattern instead.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Transactional email sending | Custom SMTP client or fetch-to-mailgun | `resend` SDK | Deliverability, SPF/DKIM handling, React Email integration, error handling |
| Email HTML rendering | String template concatenation | `@react-email/components` | Cross-client rendering inconsistencies (Gmail strips styles, Outlook ignores flex). React Email handles these. |
| Rate limiting for export endpoint | Custom counter in Redis | `@upstash/ratelimit` (already installed) | Sliding window, race conditions, atomic operations |
| UUID generation | Custom ID generator | `crypto.randomUUID()` | Browser/Node native, cryptographically random, no dependencies |
| Clipboard copy | Custom selection range manipulation | `navigator.clipboard.writeText()` | Modern async API, handles permissions correctly |

**Key insight:** The conversation export email template is deceptively complex. Email clients have wildly inconsistent CSS support (Gmail strips `<style>` tags, Outlook uses Word renderer). React Email components abstract this by generating inline-style table-based layouts that render consistently across clients. Do not attempt to write raw HTML email templates.

## Common Pitfalls

### Pitfall 1: suppressHydrationWarning Preventing Re-render
**What goes wrong:** InvestHeading uses `suppressHydrationWarning` per D-07, but the variant heading never shows because React 19 skips reconciliation for suppressed elements.
**Why it happens:** React 18+ changed `suppressHydrationWarning` behavior. It was originally just a warning suppressor but now also prevents the DOM from being patched with client content.
**How to avoid:** Use `useState(false)` + `useEffect(() => setMounted(true), [])` pattern. Render server content on first pass, swap on second pass after mount.
**Warning signs:** The /invest page always shows "The Infrastructure Behind the Work" even when navigating from the main page contact section.

### Pitfall 2: Missing Section IDs for Scroll Tracking
**What goes wrong:** ScrollContextProvider observes sections by `id`, but currently only `featured-systems` and `chat-section` have `id` props in `page.tsx`. The Origin Story, Systems Shelf, Contact, and Hero sections lack `id` attributes.
**Why it happens:** Phase 2 only added `id` props to sections that needed anchor link targets.
**How to avoid:** Add `id` props to ALL SectionWrapper instances in `page.tsx`: `hero-section`, `origin-story`, `systems-shelf`, `contact-section`.
**Warning signs:** Scroll context is always null for 4 of 6 sections.

### Pitfall 3: Conversation "Ended" Detection Race Condition
**What goes wrong:** The 5-minute inactivity timer for triggering topic extraction fires even after the user has started a new conversation exchange, extracting topics from a partial conversation.
**Why it happens:** Timer is set after each message but not properly cleared when a new message arrives.
**How to avoid:** Use a debounced timer pattern. Each new message resets the timer. Topic extraction fires only when the timer actually completes without interruption. Also trigger on `beforeunload` / `visibilitychange` as backup.
**Warning signs:** Topics array contains partial/meaningless topics.

### Pitfall 4: Cookie Not Set on First Visit
**What goes wrong:** The `rv` cookie is set server-side, but on the first visit there's no API call to trigger it. The visitor must interact with chat before getting a cookie, missing scroll tracking for the first visit.
**Why it happens:** D-03 says "generated server-side on first visit" but doesn't specify which route sets it.
**How to avoid:** Set the `rv` cookie in `proxy.ts` (Next.js 16's middleware replacement) on first request if not already present. This ensures every visitor gets a session ID regardless of whether they use chat.
**Warning signs:** Visitors who browse but don't chat have no visitor record, so their sections viewed are never tracked.

### Pitfall 5: Resend Domain Verification Not Complete
**What goes wrong:** Emails from `chat@quartermint.com` bounce or go to spam because SPF/DKIM/DMARC records aren't set up.
**Why it happens:** STATE.md notes this as a blocker: "Resend domain verification should start during Phase 3 as background task."
**How to avoid:** Verify quartermint.com domain in Resend dashboard BEFORE implementing the export feature. This requires adding DNS records in Cloudflare.
**Warning signs:** Resend API returns success but emails don't arrive.

### Pitfall 6: Upstash Redis JSON Storage with TTL
**What goes wrong:** Setting TTL on visitor records via `redis.set(key, value, { ex: ttl })` works for new records, but updating a field (like incrementing messageCount) without resetting the TTL causes the TTL to persist from the original set. Conversely, every `redis.set` call resets the TTL.
**Why it happens:** `redis.set` with EX option replaces the entire key including TTL.
**How to avoid:** Always pass the TTL when updating visitor state: `redis.set(key, updatedVisitor, { ex: 90 * 86400 })`. This is actually correct behavior -- the 90-day window restarts from the last interaction, which is the desired behavior for returning visitors.
**Warning signs:** Visitor records expire despite recent activity.

### Pitfall 7: Mobile Chat Overlay and Scroll Context
**What goes wrong:** The mobile chat overlay (ChatMobileOverlay) renders an independent ChatInterface. Scroll context from the main page is irrelevant when the overlay is open because the main page is hidden.
**Why it happens:** Mobile overlay covers the entire viewport; the user can't see any page sections.
**How to avoid:** When scroll context is consumed inside the mobile overlay, either pass null (use static defaults) or skip scroll context for mobile. The ScrollContextProvider's value should be ignored when the overlay is active.
**Warning signs:** Mobile users see scroll-context chips that reference sections they can't see.

## Code Examples

### Upstash Redis Visitor State CRUD
```typescript
// Source: Existing redis.ts pattern + @upstash/redis docs
import { redis } from './redis'

interface VisitorState {
  lastVisit: string          // ISO 8601
  topics: string[]           // LLM-extracted, max 5, FIFO
  sectionsViewed: string[]   // Section names from scroll tracking
  messageCount: number       // Total messages across all sessions
}

const VISITOR_TTL = 90 * 24 * 60 * 60 // 90 days in seconds

export async function getVisitorState(visitorId: string): Promise<VisitorState | null> {
  try {
    return await redis.get<VisitorState>(`visitor:${visitorId}`)
  } catch {
    return null // KV failure = treat as new visitor silently (D-06)
  }
}

export async function upsertVisitorState(
  visitorId: string,
  updates: Partial<VisitorState>
): Promise<void> {
  try {
    const key = `visitor:${visitorId}`
    const existing = await redis.get<VisitorState>(key)
    const state: VisitorState = existing ?? {
      lastVisit: new Date().toISOString(),
      topics: [],
      sectionsViewed: [],
      messageCount: 0,
    }

    if (updates.lastVisit) state.lastVisit = updates.lastVisit
    if (updates.topics) state.topics = updates.topics
    if (updates.sectionsViewed) {
      state.sectionsViewed = [...new Set([...state.sectionsViewed, ...updates.sectionsViewed])]
    }
    if (updates.messageCount !== undefined) state.messageCount = updates.messageCount

    await redis.set(key, state, { ex: VISITOR_TTL })
  } catch (error) {
    console.error('Visitor state update failed:', error)
    // Silent failure -- visitor features degrade gracefully
  }
}
```

### React Email Conversation Export Template
```typescript
// Source: React Email docs (react.email/docs) + Resend Next.js guide
import {
  Html, Head, Body, Container, Section, Text, Hr
} from '@react-email/components'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface ConversationExportEmailProps {
  messages: Message[]
}

export function ConversationExportEmail({ messages }: ConversationExportEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: 'system-ui, sans-serif', backgroundColor: '#ffffff' }}>
        <Container style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
          <Text style={{ fontSize: '20px', fontWeight: 600 }}>
            Your conversation with Ryan Stern
          </Text>
          <Text style={{ fontSize: '14px', color: '#888888' }}>
            via quartermint.com
          </Text>
          <Hr />
          {messages.map((msg, i) => (
            <Section key={i} style={{ marginBottom: '16px' }}>
              <Text style={{
                fontSize: '12px',
                color: '#888888',
                marginBottom: '4px'
              }}>
                {msg.role === 'user' ? 'You' : 'Ryan'}
              </Text>
              <Text style={{
                fontSize: '14px',
                color: '#333A45',
                lineHeight: '1.6'
              }}>
                {msg.content}
              </Text>
            </Section>
          ))}
          <Hr />
          <Text style={{ fontSize: '12px', color: '#888888' }}>
            quartermint.com -- Ryan Stern, Builder. Operator.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
```

### Keyboard Shortcut Listener Pattern
```typescript
// Source: Standard DOM keydown pattern + existing ChatMobileOverlay Escape handler
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    // Don't trigger when typing in input/textarea
    const tag = (e.target as HTMLElement)?.tagName
    if (tag === 'INPUT' || tag === 'TEXTAREA') return

    if (e.key === '?') {
      e.preventDefault()
      setIsOpen(prev => !prev)
    }
    if (e.key === 'Escape' && isOpen) {
      setIsOpen(false)
    }
  }

  document.addEventListener('keydown', handleKeyDown)
  return () => document.removeEventListener('keydown', handleKeyDown)
}, [isOpen])
```

### Section-to-Context Mapping
```typescript
// Source: D-01, UI-SPEC scroll-aware chat section names
export const SECTION_CONTEXT_MAP: Record<string, {
  label: string
  chips: [string, string] // 2 context chips (3rd is always a default)
}> = {
  'hero-section': {
    label: 'the hero introduction',
    chips: ['What are you building?', 'How does LifeVault work?'],
  },
  'featured-systems': {
    label: 'the featured systems: LifeVault, Relay, OpenEFB, and v2cf',
    chips: ['Tell me more about LifeVault', 'How does Relay work?'],
  },
  'chat-section': {
    label: '', // No injection when user is already in chat
    chips: ['What are you building?', "What's the information routing thesis?"],
  },
  'origin-story': {
    label: 'the origin story about building infrastructure',
    chips: ['What made you start building?', 'Tell me about your background'],
  },
  'systems-shelf': {
    label: 'the full systems shelf',
    chips: ['Which of these systems are open source?', 'What does skygate do?'],
  },
  'contact-section': {
    label: 'the contact and investor section',
    chips: ['How can I work with you?', "What's the best way to connect?"],
  },
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `@vercel/kv` for session storage | `@upstash/redis` (direct) | 2025 | Already migrated in Phase 3. Same Redis, no wrapper. |
| AI SDK v3 `useChat` with direct props | AI SDK v6 `useChat` with `DefaultChatTransport` | 2025/2026 | Already using v6 in Phase 3. Topic extraction uses `generateText` from same package. |
| `suppressHydrationWarning` for content swap | `useState` + `useEffect` two-pass render | React 18+ (2022+) | CRITICAL for InvestHeading. D-07 specifies the old pattern. |
| `middleware.ts` | `proxy.ts` | Next.js 16 (2025) | Setting rv cookie in proxy uses the new file name. |

## Open Questions

1. **Conversation "ended" heuristic timing**
   - What we know: D-05 says "session close or 5min inactivity"
   - What's unclear: Is 5 minutes the right threshold? Too short risks extracting topics from mid-conversation. Too long risks the user leaving and the extraction never firing.
   - Recommendation: Use `visibilitychange` event (fires when user switches tabs or closes browser) as primary trigger, with 5-minute debounce as fallback. Extract topic only if conversation has >= 2 user messages.

2. **Resend domain verification status**
   - What we know: STATE.md says "should start during Phase 3 as background task"
   - What's unclear: Whether this was actually done. Domain verification requires DNS records in Cloudflare.
   - Recommendation: First task in Phase 4 should verify Resend domain status. If not done, add DNS records (SPF, DKIM, DMARC) as Wave 0 prerequisite.

3. **rv cookie issuance timing**
   - What we know: D-03 says "generated server-side on first visit"
   - What's unclear: Which route handler sets the cookie on first visit if the user doesn't interact with chat
   - Recommendation: Set in `proxy.ts` (Next.js 16 middleware) so every visitor gets a session ID immediately. This also enables section tracking for non-chat visitors.

4. **Topic extraction model availability**
   - What we know: D-05 says "cheapest model (Haiku)"
   - What's unclear: CLAUDE.md deprecated models table doesn't list Haiku models. The cheapest current Anthropic model via AI SDK is `claude-haiku-4-5`.
   - Recommendation: Use `claude-haiku-4-5` for topic extraction. It's the fastest/cheapest Anthropic model available. Cost is negligible (~$0.001/extraction).

5. **Export rate limiting**
   - What we know: D-08 describes the export UI but not abuse prevention
   - What's unclear: Should the export endpoint have its own rate limit to prevent email bombing?
   - Recommendation: Add a simple rate limit of 3 exports per hour per IP using existing `@upstash/ratelimit`. Prevents abuse without impacting legitimate use.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | All server-side code | Yes | 22.22.0 | -- |
| Upstash Redis | Visitor state, rate limiting | Yes | Configured (env vars from Vercel Marketplace) | -- |
| Resend API key | Conversation export email | Unknown | -- | Must configure RESEND_API_KEY env var |
| Cloudflare DNS | Resend domain verification (SPF/DKIM) | Yes | DNS managed by Cloudflare | -- |
| Vitest | Testing | Yes | 4.1.2 | -- |
| `resend` npm package | Email sending | Not yet installed | 6.9.4 (latest) | Must `npm install resend` |
| `@react-email/components` | Email template | Not yet installed | 1.0.10 (latest) | Must `npm install @react-email/components` |

**Missing dependencies with no fallback:**
- `RESEND_API_KEY` environment variable must be configured in Vercel before email export works
- Resend domain verification (SPF/DKIM/DMARC for quartermint.com) must be complete before emails are deliverable

**Missing dependencies with fallback:**
- If Resend is not configured, the clipboard fallback (INT-01) serves as the export mechanism

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.2 |
| Config file | `vitest.config.ts` |
| Quick run command | `npx vitest run` |
| Full suite command | `npx vitest run --reporter=verbose` |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| ENG-02 | Scroll context provider tracks sections | unit | `npx vitest run __tests__/scroll-context.test.ts -x` | Wave 0 |
| ENG-02 | Chat API route accepts scrollContext in body | unit | `npx vitest run __tests__/chat/scroll-context-api.test.ts -x` | Wave 0 |
| ENG-02 | System prompt includes section context when provided | unit | `npx vitest run __tests__/chat/system-prompt.test.ts -x` | Exists (extend) |
| ENG-05 | Keyboard shortcuts modal renders correctly | unit | `npx vitest run __tests__/keyboard-shortcuts.test.ts -x` | Wave 0 |
| ENG-05 | ? key toggles modal, not when input focused | unit | `npx vitest run __tests__/keyboard-shortcuts.test.ts -x` | Wave 0 |
| INT-01 | Export API route sends email via Resend | unit | `npx vitest run __tests__/chat/export-api.test.ts -x` | Wave 0 |
| INT-01 | Export panel shows after 3rd message | unit | `npx vitest run __tests__/chat/export-panel.test.ts -x` | Wave 0 |
| INT-01 | Clipboard fallback works on error | unit | `npx vitest run __tests__/chat/export-panel.test.ts -x` | Wave 0 |
| INT-02 | Visitor state CRUD in Redis | unit | `npx vitest run __tests__/chat/visitor-state.test.ts -x` | Wave 0 |
| INT-02 | Visitor API route returns correct tier | unit | `npx vitest run __tests__/chat/visitor-api.test.ts -x` | Wave 0 |
| INT-02 | Greeting renders by tier | unit | `npx vitest run __tests__/chat/returning-visitor.test.ts -x` | Wave 0 |
| INT-02 | Topic extraction with Haiku model | unit | `npx vitest run __tests__/chat/topic-extract.test.ts -x` | Wave 0 |
| INV-02 | InvestHeading renders default on server, swaps on client | unit | `npx vitest run __tests__/invest-heading.test.ts -x` | Wave 0 |
| INV-02 | sessionStorage flag set when contact section enters viewport | unit | `npx vitest run __tests__/scroll-context.test.ts -x` | Wave 0 |

### Sampling Rate
- **Per task commit:** `npx vitest run`
- **Per wave merge:** `npx vitest run --reporter=verbose`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `__tests__/scroll-context.test.ts` -- covers ENG-02 (scroll tracking, section IDs)
- [ ] `__tests__/chat/scroll-context-api.test.ts` -- covers ENG-02 (API route metadata)
- [ ] `__tests__/keyboard-shortcuts.test.ts` -- covers ENG-05
- [ ] `__tests__/chat/export-api.test.ts` -- covers INT-01 (Resend API route)
- [ ] `__tests__/chat/export-panel.test.ts` -- covers INT-01 (UI panel, clipboard)
- [ ] `__tests__/chat/visitor-state.test.ts` -- covers INT-02 (Redis CRUD)
- [ ] `__tests__/chat/visitor-api.test.ts` -- covers INT-02 (API route tier logic)
- [ ] `__tests__/chat/returning-visitor.test.ts` -- covers INT-02 (greeting rendering)
- [ ] `__tests__/chat/topic-extract.test.ts` -- covers INT-02 (Haiku extraction)
- [ ] `__tests__/invest-heading.test.ts` -- covers INV-02 (heading swap)
- [ ] Extend `__tests__/chat/system-prompt.test.ts` -- covers ENG-02 (section context in prompt)

## Sources

### Primary (HIGH confidence)
- Existing codebase: `app/api/chat/route.ts`, `components/chat/chat-interface.tsx`, `components/chat/starter-chips.tsx`, `lib/chat/redis.ts`, `lib/chat/system-prompt.ts`, `lib/chat/conversation-log.ts`, `components/section-wrapper.tsx`, `app/invest/page.tsx` -- direct code review of Phase 3 implementation
- [Resend Next.js docs](https://resend.com/docs/send-with-nextjs) -- API route pattern, `resend.emails.send()` with React component
- [AI SDK generateText docs](https://ai-sdk.dev/docs/ai-sdk-core/generating-text) -- non-streaming text generation for background topic extraction
- [AI SDK Anthropic provider](https://ai-sdk.dev/providers/ai-sdk-providers/anthropic) -- `claude-haiku-4-5` model ID confirmed
- [MDN IntersectionObserver API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) -- browser API for scroll tracking
- npm registry: `resend@6.9.4`, `@react-email/components@1.0.10` -- latest versions verified 2026-03-27
- `package.json` -- confirmed all core dependencies already installed

### Secondary (MEDIUM confidence)
- [Next.js suppressHydrationWarning discussion #75890](https://github.com/vercel/next.js/discussions/75890) -- confirms suppressHydrationWarning prevents re-render in React 18+/19 App Router
- [React hydrateRoot docs](https://react.dev/reference/react-dom/client/hydrateRoot) -- official documentation on suppressHydrationWarning behavior
- [Upstash Redis JSON storage docs](https://upstash.com/docs/redis/sdks/ts/commands/json/set) -- JSON.SET pattern (though project uses `redis.set` with plain objects which also works via automatic serialization)

### Tertiary (LOW confidence)
- None -- all findings verified against primary or secondary sources

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- all dependencies verified against npm registry and existing codebase
- Architecture: HIGH -- patterns derived from existing Phase 3 code and official docs
- Pitfalls: HIGH -- suppressHydrationWarning issue verified against React source and Next.js issue tracker; missing section IDs verified by reading page.tsx
- Email integration: MEDIUM -- Resend domain verification status unknown (depends on whether Phase 3 initiated it)

**Research date:** 2026-03-27
**Valid until:** 2026-04-27 (stable stack, no fast-moving dependencies)
