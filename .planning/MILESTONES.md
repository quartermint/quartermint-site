# Milestones

## v1.0 Cathedral Hybrid Narrative (Shipped: 2026-03-28)

**Phases completed:** 5 phases, 18 plans, 25 tasks

**Key accomplishments:**

- StickyNav, SectionWrapper, and LivingSignal client components with GitHub ISR fetch, relative-time utilities, smooth scroll CSS, and 34 new tests
- Hero with locked narrative copy, 4 featured system rows, chat placeholder, and ISR-enabled async page wired with alternating white/mint rhythm
- AI SDK v6 + Upstash Redis packages installed with typed chat interfaces, three-tier rate limiting (cookie/IP/fail-closed), conversation logging, and 884-word curated persona system prompt
- Streaming chat API route using AI SDK v6 with 19 tests covering three-tier rate limiting (including fail-closed D-09), system prompt content validation, and v6 pattern verification
- 7 client components implementing all 5 chat interaction states (idle, active, typing, error, rate limit) plus mobile overlay, using AI SDK v6 DefaultChatTransport pattern with react-markdown rendering
- ChatInterface wired into home page replacing ChatPlaceholder, with desktop inline + mobile overlay split via ChatCTA hero component, 13 UI integration tests, all 193 tests passing
- ScrollContextProvider tracking 6 page sections via IntersectionObserver, feeding scroll-aware system prompt injection and dynamic starter chips to the chat system
- 1. [Rule 1 - Bug] Fixed maxTokens -> maxOutputTokens in topic-extract.ts
- Conversation export via Resend email with clipboard fallback, /invest journey-aware heading via sessionStorage, and keyboard shortcuts modal with ? toggle and / chat focus
- Weekly digest email via Vercel cron with Redis aggregation, React Email template, /invest and export tracking counters
- Per-system detail pages at /systems/[slug] with static generation, conditional content depth, and sitemap integration for all 13 systems

---
