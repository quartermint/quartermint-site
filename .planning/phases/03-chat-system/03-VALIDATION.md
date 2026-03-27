---
phase: 3
slug: chat-system
status: draft
nyquist_compliant: false
wave_0_complete: false
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

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| TBD | TBD | TBD | CHAT-01 | integration | `npx vitest run` | ❌ W0 | ⬜ pending |
| TBD | TBD | TBD | CHAT-02 | unit | `npx vitest run` | ❌ W0 | ⬜ pending |
| TBD | TBD | TBD | CHAT-03 | unit | `npx vitest run` | ❌ W0 | ⬜ pending |
| TBD | TBD | TBD | CHAT-04 | unit | `npx vitest run` | ❌ W0 | ⬜ pending |
| TBD | TBD | TBD | CHAT-05 | build | `npx next build` | ❌ W0 | ⬜ pending |
| TBD | TBD | TBD | CHAT-06 | unit | `npx vitest run` | ❌ W0 | ⬜ pending |

---

## Wave 0 Requirements

- [ ] `__tests__/chat-api.test.ts` — stubs for CHAT-01, CHAT-03
- [ ] `__tests__/chat-ui.test.ts` — stubs for CHAT-02, CHAT-06
- [ ] `__tests__/rate-limit.test.ts` — stubs for CHAT-04

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

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 25s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
