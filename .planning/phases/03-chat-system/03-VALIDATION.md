---
phase: 3
slug: chat-system
status: draft
nyquist_compliant: true
wave_0_complete: true
created: 2026-03-27
---

# Phase 3 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest 4.x (from Phase 1) |
| **Config file** | vitest.config.ts |
| **Quick run command** | `npx vitest run --reporter=verbose` |
| **Full suite command** | `npx vitest run && npx next build` |
| **Estimated runtime** | ~25 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run --reporter=verbose`
- **After every plan wave:** Run `npx vitest run && npx next build`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 25 seconds

---

## Wave 0 Rationale

Wave 1 (Plan 03-01) creates library modules: types, Redis client, rate limiting, conversation logging, and system prompt. These are non-UI TypeScript files where **compilation is the correct sampling method** -- `npx tsc --noEmit` validates type correctness, import resolution, and API surface contracts. Dedicated test files are created in Wave 2 (Plan 03-02 creates `__tests__/chat/rate-limit.test.ts`, `__tests__/chat/system-prompt.test.ts`, `__tests__/chat/api-route.test.ts`; Plan 03-04 creates `__tests__/chat/chat-ui.test.ts`). This is correct architecture: library modules first, then tests + consumers that exercise them.

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | Status |
|---------|------|------|-------------|-----------|-------------------|--------|
| 03-01-T1 | 01 | 1 | CHAT-02, CHAT-03 | compilation | `npx tsc --noEmit` | ⬜ pending |
| 03-01-T2 | 01 | 1 | CHAT-02, CHAT-03 | compilation | `npx tsc --noEmit` | ⬜ pending |
| 03-02-T1 | 02 | 2 | CHAT-01, CHAT-03 | compilation | `npx tsc --noEmit` | ⬜ pending |
| 03-02-T2 | 02 | 2 | CHAT-01, CHAT-03, ENG-01 | unit | `npx vitest run __tests__/chat/` | ⬜ pending |
| 03-03-T1 | 03 | 2 | CHAT-04, CHAT-05, CHAT-06 | compilation | `npx tsc --noEmit` | ⬜ pending |
| 03-03-T2 | 03 | 2 | CHAT-05, ENG-01 | compilation | `npx tsc --noEmit` | ⬜ pending |
| 03-03-T3 | 03 | 2 | CHAT-05 | compilation | `npx tsc --noEmit` | ⬜ pending |
| 03-04-T1 | 04 | 3 | CHAT-01, CHAT-05 | build | `npx next build` | ⬜ pending |
| 03-04-T2 | 04 | 3 | CHAT-01, CHAT-05, CHAT-06 | unit | `npx vitest run __tests__/chat/` | ⬜ pending |
| 03-04-T3 | 04 | 3 | ALL | manual | human verification | ⬜ pending |

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Streaming response renders incrementally | CHAT-01 | Requires browser with streaming SSE | Open chat, ask question, observe tokens appearing progressively |
| Mobile full-screen overlay opens from hero CTA | CHAT-05 | Requires mobile viewport + tap interaction | Set viewport to 375px, tap "Ask me anything", verify overlay |
| Rate limit message with booking CTA | CHAT-04 | Requires hitting actual rate limit | Send 20+ messages, verify rate limit UI appears |
| AI discloses proxy status when asked | CHAT-03 | Requires semantic evaluation | Ask "Are you a real person?" and verify honest disclosure |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 rationale documented -- compilation-based sampling for library modules, test files created in Wave 2
- [x] No watch-mode flags
- [x] Feedback latency < 25s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** approved
