---
gsd_artifact: quick-plan
quick_id: 260523-jtp
slug: pivot-editorial-treasury
date: 2026-05-23
status: in-progress
mode: quick
---

# Quick Task: Pivot Project Metadata to Editorial Treasury Design System

## Description

Pivot project metadata from "personal founder site with Cathedral Hybrid Narrative" to "Quartermint-the-company site under Editorial Treasury design system." Update planning artifacts that reference the old direction. Reference `DESIGN.md` as the new canonical visual spec and `DESIGN-ARCHIVE-2026-05-cathedral-mint.md` for the prior direction.

## Scope (metadata only — DO NOT touch app code)

In-scope files:
- `CLAUDE.md` — project title + description block (`GSD:project-start`/`GSD:project-end`)
- `.planning/PROJECT.md` — title, "What This Is", Core Value, Audiences, Constraints (design system line), Key Decisions note
- `.planning/STATE.md` — milestone_name + "Project Reference" Core value line
- `.planning/MILESTONES.md` — historical heading clarifies v1.0 was the prior direction (no rewrite of accomplishments)

Out-of-scope (explicitly forbidden):
- `app/` code, `components/`, `globals.css`, `lib/`, `next/font` config
- `DESIGN-ARCHIVE-2026-05-cathedral-mint.md` (preserved as-is)
- ROADMAP.md / REQUIREMENTS.md / research/ / phases/ (historical record of v1.0 milestone — leave intact)

## Pivot Summary

| Aspect | Before (Cathedral Hybrid Narrative) | After (Editorial Treasury) |
|---|---|---|
| Site identity | Personal founder site for Ryan Stern | Quartermint-the-company site (YC S26 pitch) |
| Audience | Builders + investors evaluating Ryan | YC partners, Amalgamated Bank, political ops directors, compliance counsel |
| Typography | Instrument Serif + DM Sans | Fraunces + Geist |
| Palette | Mint | Ledger Green + Parchment + Ink + Aged Gold + Cream |
| Visual signature | Editorial mint narrative | Entity-Geometry mark system (● ◉ ▲ ■) |
| Canonical design doc | (old design doc, archived) | `DESIGN.md` + archive at `DESIGN-ARCHIVE-2026-05-cathedral-mint.md` |

## Tasks

1. Update `CLAUDE.md` project block (lines 2-20) — new title, description, constraints reflecting Editorial Treasury + entity-geometry + audiences.
2. Update `.planning/PROJECT.md` — title, What This Is, Core Value, Audiences, Constraints (design system line), add pivot note + Key Decision row.
3. Update `.planning/STATE.md` — milestone_name + "Project Reference" Core value line to reflect new direction.
4. Update `.planning/MILESTONES.md` — annotate v1.0 section to make clear it was the prior (archived) direction; no rewriting of v1.0 accomplishments themselves.
5. Stage only the four files. Commit with conventional message.

## Verification

- `git diff --stat` shows ONLY CLAUDE.md, .planning/PROJECT.md, .planning/STATE.md, .planning/MILESTONES.md, and new files under .planning/quick/260523-jtp-pivot-editorial-treasury/
- `DESIGN-ARCHIVE-2026-05-cathedral-mint.md` is untouched (still untracked, ready for a separate commit)
- No edits to `app/`, `components/`, `lib/`, `globals.css`, or any font/style file
- GSD frontmatter integrity preserved (no changes to `gsd_state_version`, `milestone`, `status`, `progress` fields in STATE.md)
