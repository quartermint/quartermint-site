# Phase 1: Foundation + Design System - Context

**Gathered:** 2026-03-26
**Status:** Ready for planning

<domain>
## Phase Boundary

Deliver a working Next.js 16 scaffold with the complete CSS custom properties design system (mint palette, Instrument Serif + DM Sans typography, dark mode), responsive layout across 3 breakpoints, the `lib/systems.ts` DRY data source for all 15 systems, and accessibility baseline. Every downstream component builds on this foundation.

</domain>

<decisions>
## Implementation Decisions

### Headshot Asset
- **D-01:** Full-size professional headshot provided by user (not from current site). Crop to circle format: 160px desktop, 120px tablet, 80px mobile. Optimize for web (WebP with JPEG fallback).

### Design System Source
- **D-02:** Visual system is fully specified in the design doc — extract CSS custom properties, typography scale, spacing, and dark mode color mapping directly. No design decisions needed; implement exactly as specified.
- **D-03:** All colors via CSS custom properties in `:root`. No raw hex in components. Tailwind v4 `@theme` directive creates both CSS custom properties AND utility classes from the same token definitions.

### Systems Data (lib/systems.ts)
- **D-04:** 4 featured systems have locked copy from design doc (LifeVault, Relay, OpenEFB, v2cf — problem/solution text provided).
- **D-05:** 11 shelf systems have names, tech badges, and public/active status from design doc. Claude drafts one-liner descriptions from project READMEs; user approves before shipping.
- **D-06:** All 15 entries include: name, one-liner, problem, solution, techBadge, isPublic, githubUrl, status (active/paused). Featured systems additionally have full empathy-first problem/solution narratives.

### Footer Stats
- **D-07:** Use exact counts: "40+ repositories / 894K files indexed / 9 production services". Static text, manually updated. Accurate as of March 2026.

### Dark Mode
- **D-08:** Triggered by `prefers-color-scheme: dark` media query only. No toggle. Full color mapping from design doc (no pure black, no pure white, mint accent desaturated for dark backgrounds).

### Claude's Discretion
- Project initialization approach (create-next-app vs manual scaffold)
- Tailwind v4 `@theme` token structure and file organization
- Component file structure within App Router conventions

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Design System Specification
- `~/.gstack/projects/quartermint-throughline/ryanstern-main-eng-review-test-plan-20260326-124217.md` — Eng review test plan with all interaction edge cases
- `~/.gstack/projects/quartermint-lifevault/ryanstern-unknown-design-20260326-010500.md` — Full design doc: visual system (typography scale, color palette, spacing, dark mode mapping), section specs, responsive breakpoints, accessibility requirements, component-level CSS specs

### Requirements
- `.planning/REQUIREMENTS.md` — FOUND-01 through FOUND-06
- `.planning/ROADMAP.md` — Phase 1 success criteria

### Technology Stack
- `CLAUDE.md` — Technology stack section with all package versions, migration notes, and patterns

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- None — greenfield project, no existing code.

### Established Patterns
- Greenfield Next.js 16 App Router project. Patterns will be established in this phase.
- Tailwind v4 CSS-first configuration via `@theme` directive (no `tailwind.config.js`).
- `next/font/google` for self-hosted Instrument Serif and DM Sans.

### Integration Points
- `lib/systems.ts` becomes the single source of truth consumed by Phase 2 (narrative content), Phase 3 (chat system prompt), and Phase 5 (detail pages).
- CSS custom properties established here are used by every subsequent phase.
- Accessibility patterns (focus rings, ARIA landmarks, touch targets) apply to all future components.

</code_context>

<specifics>
## Specific Ideas

- Design doc specifies: "During implementation, extract the Visual System section into a standalone DESIGN.md at project root."
- Badge vocabulary is locked: Go, Swift, TypeScript, Python, Raspberry Pi, Go + Swift. No abbreviations.
- Paused systems (signal-glass) appear with `var(--color-text-faint)` text.
- DM Sans weight 300 explicitly excluded (unused, saves load time).

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 01-foundation-design-system*
*Context gathered: 2026-03-26*
