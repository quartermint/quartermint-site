---
phase: 5
slug: operations-go-live
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-27
---

# Phase 5 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest |
| **Config file** | vitest.config.ts |
| **Quick run command** | `npx vitest run --reporter=verbose` |
| **Full suite command** | `npx vitest run --reporter=verbose` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run --reporter=verbose`
- **After every plan wave:** Run `npx vitest run --reporter=verbose`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 05-01-01 | 01 | 1 | OPS-03 | unit | `npx vitest run __tests__/digest` | ❌ W0 | ⬜ pending |
| 05-01-02 | 01 | 1 | OPS-03 | unit | `npx vitest run __tests__/api/digest` | ❌ W0 | ⬜ pending |
| 05-02-01 | 02 | 1 | OPS-05 | unit | `npx vitest run __tests__/systems` | ❌ W0 | ⬜ pending |
| 05-03-01 | 03 | 2 | ENG-06 | unit | `npx vitest run __tests__/animations` | ❌ W0 | ⬜ pending |
| 05-04-01 | 04 | 2 | OPS-01 | integration | `npx next build` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `__tests__/digest-email.test.tsx` — stubs for weekly digest email template
- [ ] `__tests__/api/digest.test.ts` — stubs for digest API route and data aggregation
- [ ] `__tests__/systems-detail.test.tsx` — stubs for /systems/[slug] detail pages
- [ ] `__tests__/scroll-animations.test.ts` — stubs for scroll-speed-adaptive animations

*Existing vitest infrastructure covers framework installation.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| DNS resolution | OPS-01 | Requires live DNS propagation | Verify quartermint.com resolves to Vercel IP after repoint |
| HTTPS certificate | OPS-01 | Requires live TLS handshake | Verify valid certificate on quartermint.com |
| Vercel cron execution | OPS-03 | Requires Vercel deployment + cron trigger | Trigger cron manually in Vercel dashboard, verify email received |
| Resend email delivery | OPS-03 | Requires live Resend account with verified domain | Check Resend dashboard for successful delivery |
| Visual animation smoothness | ENG-06 | Subjective visual quality | Scroll through page at different speeds, verify 3 tiers |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
