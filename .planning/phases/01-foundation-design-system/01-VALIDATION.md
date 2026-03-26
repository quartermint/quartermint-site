---
phase: 1
slug: foundation-design-system
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-26
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest (via Next.js 16 recommended testing) |
| **Config file** | vitest.config.ts (Wave 0 installs) |
| **Quick run command** | `npx vitest run --reporter=verbose` |
| **Full suite command** | `npx vitest run && npx next build` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run --reporter=verbose`
- **After every plan wave:** Run `npx vitest run && npx next build`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| TBD | TBD | TBD | FOUND-01 | build | `npx next build` | ❌ W0 | ⬜ pending |
| TBD | TBD | TBD | FOUND-02 | unit | `npx vitest run` | ❌ W0 | ⬜ pending |
| TBD | TBD | TBD | FOUND-03 | build | `npx next build` | ❌ W0 | ⬜ pending |
| TBD | TBD | TBD | FOUND-04 | unit | `npx vitest run` | ❌ W0 | ⬜ pending |
| TBD | TBD | TBD | FOUND-05 | build | `npx next build` | ❌ W0 | ⬜ pending |
| TBD | TBD | TBD | FOUND-06 | build | `npx next build` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `vitest` + `@vitejs/plugin-react` — test framework install
- [ ] `vitest.config.ts` — test configuration
- [ ] `__tests__/systems.test.ts` — stubs for FOUND-04 (lib/systems.ts data validation)
- [ ] `__tests__/theme.test.ts` — stubs for FOUND-02 (color token validation)

*Existing infrastructure covers build validation (next build) for FOUND-01, FOUND-03, FOUND-05, FOUND-06.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Dark mode renders without flash | FOUND-02 | Requires visual inspection of theme transition | Load page, toggle system theme, verify no FOUC |
| Focus rings visible on keyboard nav | FOUND-05 | Requires visual + keyboard interaction | Tab through all interactive elements, verify 2px rings |
| Touch targets >= 44px | FOUND-05 | Requires measurement tool or responsive dev tools | Inspect CTAs and nav items at mobile viewport |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
