---
phase: quick
plan: 260330-kx8
subsystem: content, chat, ui
tags: [gray-matter, profile-system, campaigns, advocacy, repositioning]

requires: []
provides:
  - Modular profile content system with gray-matter frontmatter parsing
  - Campaigns/advocacy audience-targeted homepage copy
  - Dynamic chat system prompt built from profile content files
  - /work-with-me client-facing page replacing /invest
affects: [chat-system, homepage, navigation, systems-showcase]

tech-stack:
  added: [gray-matter]
  patterns: [modular-profile-content, audience-aware-system-prompt, markdown-frontmatter-config]

key-files:
  created:
    - lib/chat/profile-types.ts
    - lib/chat/profile-loader.ts
    - content/profile/identity.md
    - content/profile/preferences.md
    - content/profile/personality/tone.md
    - content/profile/personality/opinions.md
    - content/profile/personality/edges.md
    - content/profile/personality/throughline.md
    - content/profile/audiences/campaigns-advocacy.md
    - content/profile/experiences/biden-harris-2024.md
    - content/profile/experiences/quartermint-builder.md
    - content/profile/experiences/new-deal-strategies.md
    - content/profile/experiences/battle-born-collective.md
    - content/profile/experiences/searchlight-institute.md
    - content/profile/experiences/affordable-maryland-pac.md
    - content/profile/experiences/campaign-rallies-2024.md
    - app/work-with-me/page.tsx
  modified:
    - components/hero-section.tsx
    - components/origin-story.tsx
    - components/footer-stats.tsx
    - components/featured-systems.tsx (no code change, data source changed)
    - components/contact-investor.tsx
    - components/sticky-nav.tsx
    - components/chat/chat-cta.tsx
    - components/chat/chat-interface.tsx
    - components/chat/chat-section.tsx
    - components/chat/starter-chips.tsx
    - lib/systems.ts
    - lib/chat/system-prompt.ts
    - lib/chat/scroll-context.ts
    - app/page.tsx
    - app/invest/page.tsx
    - package.json

key-decisions:
  - "Ported profile system from Stripped with audience-aware emphasis overrides for campaigns/advocacy"
  - "Removed all non-political systems (OpenEFB, v2cf, skygate, etc.) from featured and shelf"
  - "Added Campaign Finance Dashboard and whatamivotingon as new featured systems"
  - "Replaced hardcoded 884-word system prompt with dynamic profile-based builder"
  - "Converted /invest to redirect, created /work-with-me with client-facing content"

patterns-established:
  - "Profile content system: markdown files with YAML frontmatter in content/profile/, loaded by profile-loader.ts"
  - "Audience profiles: emphasis_overrides in audience YAML control which experiences get surfaced"
  - "Dynamic system prompt: buildSystemPrompt loads profile content at request time on server"

requirements-completed: []

duration: 10min
completed: 2026-03-30
---

# Quick Task 260330-kx8: Site Repositioning Summary

**Full site repositioned from investor-facing builder portfolio to client-facing campaigns/advocacy/nonprofit targeting, with modular profile content system ported from Stripped for audience-aware chat.**

## What Changed

### Homepage Copy (Task 2)
- **Hero:** Subtitle changed from "Builder. Operator." to "Forward-deployed engineer for campaigns, advocacy, and nonprofits". Body copy now grounds in concrete campaign pain (10K rally Google Sheets failure, tracker of trackers, trip presentation given six times).
- **Featured Systems:** Replaced LifeVault/Relay/OpenEFB/v2cf with Relay/Campaign Finance Dashboard/LifeVault/whatamivotingon. All four are politically relevant.
- **Systems Shelf:** Removed entirely. No aviation, developer tools, or personal projects visible.
- **Origin Story:** Rewritten in second person ("You've been in the room...") addressing campaign/advocacy visitors directly.
- **Footer Stats:** Replaced "40+ repositories / 894K files indexed / 9 production services" with "A decade of campaign operations. Staffer, consultant, builder."
- **Contact:** Removed investor column. Single-column client-facing layout asking "what's breaking."
- **Nav:** "Invest" link replaced with "Work With Me" pointing to /work-with-me.

### Profile Content System (Task 1)
- 16 markdown files in content/profile/ with gray-matter YAML frontmatter
- Profile loader reads files with fs.readFileSync (server-only, used by API route)
- Audience profile (campaigns-advocacy.md) has emphasis_overrides that control which experiences surface
- 7 experience files covering Biden-Harris 2024, Quartermint builder, NDS, BBC, Searchlight, Affordable Maryland PAC, and 2024 campaign rallies

### Chat System (Task 3)
- System prompt dynamically built from profile content instead of hardcoded 884 words
- Loads campaigns-advocacy audience profile, filters experiences by emphasis
- New rules: client confidentiality, diagnostic-first approach ("what's breaking?")
- Chat heading: "This is how I think about your problem"
- Starter chips: campaign/advocacy focused ("How would you fix our campaign ops?", "What have you built for PACs?", "What's your campaign experience?")
- Input placeholder: "Ask about campaigns, advocacy tools, or operations..."

### Routes
- /work-with-me: New client-facing page with "What I Build For You" framing
- /invest: Now redirects to /work-with-me (SEO-safe, old links still work)

## Commits

| Task | Commit | Description |
|------|--------|-------------|
| 1 | 0337a29 | Profile content system with gray-matter |
| 2 | 7cf6991 | Homepage components rewritten for campaigns/advocacy |
| 3 | 3b0dd25 | Dynamic profile-based chat system |

## Deviations from Plan

None. Plan executed exactly as written.

## Known Stubs

None. All content is substantive, no placeholder text or TODO markers.

## Self-Check: PASSED
