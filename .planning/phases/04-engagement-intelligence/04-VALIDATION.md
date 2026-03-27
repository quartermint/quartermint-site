---
phase: 04
slug: engagement-intelligence
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-27
---

# Phase 04 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest 4.1.x |
| **Config file** | vitest.config.ts |
| **Quick run command** | `npx vitest run` |
| **Full suite command** | `npx vitest run && npx tsc --noEmit` |
| **Estimated runtime** | ~2 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run`
- **After every plan wave:** Run `npx vitest run && npx tsc --noEmit`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 2 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 04-01-01 | 01 | 1 | ENG-02 | unit | `npx vitest run __tests__/chat/scroll-context.test.ts` | ❌ W0 | ⬜ pending |
| 04-01-02 | 01 | 1 | ENG-05 | unit | `npx vitest run __tests__/chat/smart-chips.test.ts` | ❌ W0 | ⬜ pending |
| 04-02-01 | 02 | 1 | INT-02 | unit | `npx vitest run __tests__/chat/returning-visitor.test.ts` | ❌ W0 | ⬜ pending |
| 04-02-02 | 02 | 1 | INV-02 | unit | `npx vitest run __tests__/chat/invest-journey.test.ts` | ❌ W0 | ⬜ pending |
| 04-03-01 | 03 | 2 | INT-01 | unit | `npx vitest run __tests__/chat/export.test.ts` | ❌ W0 | ⬜ pending |
| 04-03-02 | 03 | 2 | INT-01 | integration | `npx vitest run __tests__/chat/export-ui.test.ts` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] Test stubs for scroll context, smart chips, returning visitor, invest journey, export
- [ ] Resend mock setup for export email tests

*Existing vitest infrastructure covers all framework requirements.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Scroll-aware chat context in AI response | ENG-02 | Requires runtime Anthropic API + visual inspection | Scroll to Systems Shelf, ask "tell me more" — response should reference systems |
| Returning visitor greeting | INT-02 | Requires cookie persistence across sessions | Visit, close, revisit within 7 days — confirm personalized greeting |
| Mobile overlay export panel | INT-01 | Visual layout at 375px viewport | Open chat on mobile, send 3 msgs, tap envelope, verify slide-down panel |
| /invest variant heading | INV-02 | Requires navigation flow + visual confirmation | View Contact section, navigate to /invest, confirm variant heading text |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 2s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
