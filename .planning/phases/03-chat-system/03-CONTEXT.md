# Phase 3: Chat System - Context

**Gathered:** 2026-03-26
**Status:** Ready for planning

<domain>
## Phase Boundary

Build the embedded AI chat with streaming responses, persona system prompt, three-tier rate limiting, and all chat interaction states. The visitor can have a real-time conversation with Ryan's AI proxy, with cost controls and abuse prevention shipping simultaneously.

</domain>

<decisions>
## Implementation Decisions

### Claude Model
- **D-01:** Use Claude Sonnet 4.6 (`claude-sonnet-4-6`) via `@ai-sdk/anthropic`. Higher quality persona reasoning justifies the ~$0.01/conversation cost. Monthly $50 budget alert covers ~5,000 conversations.

### System Prompt Architecture
- **D-02:** System prompt built at deploy time (not request time). Read identityvault YAML/markdown during build, bake into a static string in the deployed bundle. Update by redeploying.
- **D-03:** Curated identityvault subset (~2K tokens): cherry-pick most relevant biography, key experiences, and skills. Not the full dump.
- **D-04:** System prompt components: (1) curated identity data, (2) hardcoded system descriptions from `lib/systems.ts`, (3) manually curated FAQ pairs for common questions, (4) persona voice instructions, (5) deflection rules.

### Persona & Deflections
- **D-05:** Voice: first person, conversational but substantive. Honest AI disclosure when sincerely asked. 500-token max per response.
- **D-06:** Deflection list (complete, no additions needed): political opinions, personal/private questions, code requests, jailbreak attempts, questions about other people. Deflection format: brief acknowledgment + redirect.

### Rate Limiting
- **D-07:** Single Upstash Redis instance for all data. Key prefixes: `rate:{ip}` (rate limiting), `visitor:{id}` (visitor state, Phase 4), `chat:{session}` (conversation logging).
- **D-08:** Three layers active simultaneously:
  - Layer 1 (UX): Cookie-based session, 20 messages. HttpOnly, SameSite=Strict, 24h expiry. Friendly rate limit with calendar CTA.
  - Layer 2 (Abuse): IP-based hard cap, 60/hr via `@upstash/ratelimit` sliding window. Returns 429.
  - Layer 3 (Budget): $50/mo Anthropic API spend alert — dashboard config, not code.
- **D-09:** Fail closed: if Upstash Redis unreachable, chat returns error state with mailto fallback. Budget protected.

### Chat States
- **D-10:** All interaction states from design doc: idle (heading + 3 starter chips + input), typing (animated dots + "Thinking..."), error (friendly + mailto), rate limit (calendar CTA), mobile (full-screen overlay from hero CTA).
- **D-11:** Session persistence: conversations clear on page reload. Upstash Redis logs conversations server-side (no TTL, kept indefinitely).

### Smart Starter Chips (Phase 3 scope: static defaults only)
- **D-12:** Phase 3 ships with static default starter chips. Dynamic chips (scroll context, commit recency, time-of-day) are Phase 4 scope. Always exactly 3 chips.

### Claude's Discretion
- Chat API route structure (single route handler vs middleware composition)
- Error message copy beyond the specified states
- Cookie name and session ID storage format
- Conversation log schema in Upstash Redis

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Design Doc (chat system spec)
- `~/.gstack/projects/quartermint-lifevault/ryanstern-unknown-design-20260326-010500.md` — Chat container spec (shadow, radius, max-width, internal layout), chat interaction states table, chat persona spec (voice, handles well, deflects gracefully, boundaries), rate limiting architecture, smart starter chips, privacy notice, mobile behavior

### Reference Implementation
- `~/stripped/components/chat-interface.tsx` — Existing chat UI (127 lines, adapt styling to quartermint theme). NOTE: Stripped uses AI SDK v3, quartermint uses v6 — extract patterns, don't copy line-by-line.
- `~/stripped/app/api/chat/route.ts` — Existing streaming endpoint
- `~/stripped/lib/system-prompt.ts` — Profile-aware prompt builder pattern
- `~/stripped/content/profile/` — Identity data format (also at `~/identityvault/`)

### Identity Data
- `~/identityvault/` — Biographical YAML/markdown for system prompt curation

### Test Plan
- `~/.gstack/projects/quartermint-throughline/ryanstern-main-eng-review-test-plan-20260326-124217.md` — Chat edge cases (empty body, missing API key, timeout, non-POST, max length, cleared cookies)

### Requirements
- `.planning/REQUIREMENTS.md` — CHAT-01 through CHAT-06, ENG-01
- `.planning/ROADMAP.md` — Phase 3 success criteria

### Technology Stack
- `CLAUDE.md` — AI SDK v6 + @ai-sdk/anthropic v3 + @upstash/redis + @upstash/ratelimit versions and migration notes from Stripped

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `lib/systems.ts` (from Phase 1) — System descriptions feed into the chat system prompt.
- Stripped chat architecture at `~/stripped/` — proven patterns for streaming chat, but 3 major versions behind on AI SDK. Extract patterns, don't port line-by-line.

### Established Patterns
- Phase 1/2 establish the component patterns, styling approach, and layout that the chat component integrates with.
- The chat section is position 3 on the main page (after hero and featured systems).

### Integration Points
- Chat container replaces the placeholder/coming-soon state from Phase 2.
- Privacy notice below chat input links to /privacy route (built in Phase 2).
- Rate limit CTA links to Google Calendar booking (same link as contact section).
- Upstash Redis setup serves both Phase 3 (rate limiting + logging) and Phase 4 (visitor state + topic storage).

</code_context>

<specifics>
## Specific Ideas

- The design doc emphasizes: "Start fresh on AI SDK v6 rather than porting v3 patterns." The jump from Stripped's v3 to v6 is 3 major versions — `useChat` API changed (transport-based, no internal input state), `streamText` patterns updated.
- Upstash Redis via Vercel Marketplace integration for automatic env var setup (UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN).
- STATE.md blocker: "Vercel plan tier (Hobby vs Pro) affects Phase 3 chat route timeout — confirm before Phase 3 planning."
- STATE.md blocker: "identityvault content curation for system prompt needs scoping during Phase 3 planning."

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 03-chat-system*
*Context gathered: 2026-03-26*
