---
phase: 2
slug: static-narrative-content
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-27
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest 4.x (installed in Phase 1) |
| **Config file** | vitest.config.ts |
| **Quick run command** | `npx vitest run --reporter=verbose` |
| **Full suite command** | `npx vitest run && npx next build` |
| **Estimated runtime** | ~20 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run --reporter=verbose`
- **After every plan wave:** Run `npx vitest run && npx next build`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 20 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| TBD | TBD | TBD | NAR-01 | build | `npx next build` | ❌ W0 | ⬜ pending |
| TBD | TBD | TBD | NAR-02 | build | `npx next build` | ❌ W0 | ⬜ pending |
| TBD | TBD | TBD | NAR-03 | build | `npx next build` | ❌ W0 | ⬜ pending |
| TBD | TBD | TBD | NAR-04 | build | `npx next build` | ❌ W0 | ⬜ pending |
| TBD | TBD | TBD | NAR-05 | build | `npx next build` | ❌ W0 | ⬜ pending |
| TBD | TBD | TBD | INV-01 | build | `npx next build` | ❌ W0 | ⬜ pending |
| TBD | TBD | TBD | OPS-02 | build | `npx next build` | ❌ W0 | ⬜ pending |
| TBD | TBD | TBD | ENG-03 | unit | `npx vitest run` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `__tests__/navigation.test.ts` — stubs for NAR-02 (sticky nav behavior)
- [ ] `__tests__/metadata.test.ts` — stubs for ENG-03 (OG tags, canonical URLs)

*Existing test infrastructure from Phase 1 covers build validation.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Alternating white/mint section backgrounds | NAR-01 | Visual rhythm requires human eye | Scroll through home page, verify 7 sections alternate |
| Sticky nav hides on scroll-down, shows on scroll-up | NAR-02 | Scroll behavior requires browser interaction | Scroll down 200px (nav should hide), scroll up (should appear) |
| /invest has no securities claims | INV-01 | Legal content review | Read /invest page, verify no forward-looking financial projections |
| OG image renders correctly | ENG-03 | Requires social media preview tools | Share URL in Slack/Twitter preview |
| Vercel auto-deploy working | OPS-02 | Requires push + Vercel dashboard check | Push to main, verify deploy completes |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 20s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
