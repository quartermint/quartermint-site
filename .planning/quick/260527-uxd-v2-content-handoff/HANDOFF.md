# Session Handoff — quartermint.com v2.0 content pass

**Date:** 2026-05-27
**Status:** v2.0 code committed locally (`0287e71`), NOT redeployed. Site is currently offline.
**Reason for handoff:** Ryan flagged content needs a back-and-forth editorial pass before going live. Starting fresh session for that work.

## Single source of truth

Full context, design system, commit ledger, deferred punch list:
`~/.claude/projects/-Users-ryanstern/memory/project_quartermint_editorial_treasury.md`

## What's already done

- All Editorial Treasury tokens implemented (`086a4f5`)
- v2.0 content scaffolding shipped (`0287e71`): hero, "What Quartermint Is", Product Proof, Distribution sections, chat retuned to Quartermint assistant
- Build passes (`npm run build` green)
- Old founder narrative removed from imports

## Pick-up checklist for the new session

1. Editorial pass on hero copy ("This is what real treasury infrastructure looks like." is the placeholder — confirm or revise)
2. Product Proof captions (currently agent-drafted)
3. Distribution section voicing (3 customers framed by entity type only — currently agent-drafted)
4. Chat assistant system prompt voice tune (`lib/chat/system-prompt.ts`)
5. Verify the entity-geometry strip lands as the hero proof element
6. Decide fate of `/privacy` link (currently 404 from chat UI)
7. Prune unimported founder-era components and `lib/chat/profile-loader.ts` / `topic-extract.ts` / `visitor.ts` / `content/profile/*.md`
8. Deploy: `vercel --prod` once content lands

## Visual ground-truth

`~/.gstack/projects/quartermint/designs/design-system-20260523/round3-/variant-A.png`

## Canonical design spec

`~/quartermint-site/DESIGN.md` (mirrors `~/quartermint/DESIGN.md`)
