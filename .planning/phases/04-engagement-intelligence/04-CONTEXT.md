# Phase 4: Engagement Intelligence - Context

**Gathered:** 2026-03-26
**Status:** Ready for planning

<domain>
## Phase Boundary

Make the chat contextually aware of visitor behavior: scroll-aware responses, dynamic smart starter chips, returning visitor detection with personalized greetings, /invest journey detection with variant heading, conversation export via email, and keyboard shortcuts overlay.

</domain>

<decisions>
## Implementation Decisions

### Scroll-Aware Chat
- **D-01:** IntersectionObserver tracks which main page section is visible. Section name passed as metadata to chat API route. System prompt incorporates "user was viewing [section]" context at request time (injected into the deploy-time base prompt).

### Smart Starter Chips (dynamic)
- **D-02:** Priority cascade: scroll context > commit recency > time-of-day > static defaults. Always exactly 3 chips. Same visual styling for all types.

### Returning Visitor Detection
- **D-03:** Session ID via `crypto.randomUUID()`, generated server-side on first visit. Stored in HttpOnly `rv` cookie, 90-day expiry.
- **D-04:** Upstash Redis stores `visitor:{id}` with: lastVisit, topics[], sectionsViewed[], messageCount.
- **D-05:** Topic extraction: LLM-summarized. After each conversation ends (session close or 5min inactivity), make a Claude API call to extract the main topic from the conversation. Store in `visitor:{id}.topics[]`.
- **D-06:** Greeting tiers: <7 days = specific ("Welcome back. You were asking about [topic]"), 7-30 days = general ("Good to see you again"), >30 days or KV failure = treat as new silently.

### /invest Journey Detection
- **D-07:** sessionStorage flag set when contact section enters viewport (IntersectionObserver). On /invest: if flag present, variant heading ("You've seen the work. Here's where it's going."). SSR always renders default; variant applied client-side after hydration with `suppressHydrationWarning` on a narrow client component boundary.

### Conversation Export
- **D-08:** Envelope icon (20px, text-muted) in chat header after 3rd message. Slide-down panel with email input + "Send" button. Sent via Resend from chat@quartermint.com. Success auto-dismisses 3s. Error: "Copy conversation" clipboard fallback. BCC Ryan.

### Keyboard Shortcuts
- **D-09:** ? key opens centered modal overlay (400px max-width, blur backdrop). Not shown when input focused. Dismiss: Esc, click outside, or ? again.

### Redis Data Model
- **D-10:** Single Upstash Redis instance (same as Phase 3). Key prefixes: `rate:{ip}`, `visitor:{id}`, `chat:{session}`. All Phase 4 data uses existing Redis connection.

### Claude's Discretion
- IntersectionObserver threshold tuning for section tracking
- Conversation "ended" detection heuristic (session close vs inactivity timer)
- Smart chip content for each context type (scroll, commit, time-of-day)
- Keyboard shortcuts list content

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Design Doc (engagement features spec)
- `~/.gstack/projects/quartermint-lifevault/ryanstern-unknown-design-20260326-010500.md` — CEO Expansion Features section: returning visitor detection (greeting tiers, cookie spec, KV schema), smart starter chips (priority cascade, styling), keyboard shortcuts overlay (design spec), conversation export (slide-down panel, Resend integration, error fallback), /invest journey detection (sessionStorage + SSR note), scroll-speed-adaptive animations (3 tiers)

### Requirements
- `.planning/REQUIREMENTS.md` — ENG-02, ENG-05, INT-01, INT-02, INV-02
- `.planning/ROADMAP.md` — Phase 4 success criteria

### Upstream Dependencies
- Phase 3 CONTEXT.md — Upstash Redis setup, chat API route structure, session cookie format

### Email Service
- Resend account required. Domain verification (SPF/DKIM/DMARC for quartermint.com) should be started during Phase 3 as background task per STATE.md blocker note.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- Phase 3 Upstash Redis connection and chat API route — Phase 4 extends these with visitor state and scroll context.
- Phase 3 session cookie — Phase 4 adds the `rv` cookie alongside it.
- Phase 2 IntersectionObserver (section entrance animations) — similar pattern reused for scroll tracking.

### Established Patterns
- Chat component from Phase 3 gets enhanced with: dynamic starter chips, returning visitor greetings, envelope icon, scroll context metadata.
- Phase 3's static system prompt gets request-time injection of scroll context and returning visitor state.

### Integration Points
- Chat API route: add scroll context + visitor context to request metadata.
- System prompt: inject `[RETURNING VISITOR CONTEXT]` and `[CURRENT SECTION]` blocks at request time around the deploy-time base prompt.
- /invest page: narrow client component boundary around heading for journey detection.
- Resend integration: new API route for conversation export email.

</code_context>

<specifics>
## Specific Ideas

- Design doc: "Tone: barista who remembers your order, not database reciting history."
- Returning visitor starter chips (<7 days): "Continue where I left off" / "What's new since I was here?" / one rotated default.
- The LLM topic summarization call should use the cheapest model (Haiku) since it's a background task, not user-facing.
- STATE.md note: "Resend domain verification (SPF/DKIM/DMARC for quartermint.com) should start during Phase 3 as background task for Phase 4 email."

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 04-engagement-intelligence*
*Context gathered: 2026-03-26*
