---
phase: 02-static-narrative-content
verified: 2026-03-27T14:53:36Z
status: gaps_found
score: 11/14 must-haves verified
gaps:
  - truth: "Site is deployed on Vercel with auto-deploy on push to main"
    status: failed
    reason: "No git remote configured, no .vercel directory, no vercel.json. Codebase is not connected to any remote repository. OPS-02 requires a live Vercel deployment."
    artifacts:
      - path: ".vercel/ (missing)"
        issue: "Directory does not exist — project has not been linked to Vercel"
      - path: "vercel.json (missing)"
        issue: "Not present; could be optional but signals no deployment config"
    missing:
      - "Create GitHub/GitLab repository and push codebase"
      - "Link Vercel project (vercel link or Vercel dashboard import)"
      - "Configure SIGNAL_REPOS and FALLBACK_SIGNAL environment variables on Vercel"
      - "Verify auto-deploy on push to main is active"
  - truth: "Headshot renders at /images/headshot.jpg"
    status: failed
    reason: "public/images/ contains only a .gitkeep placeholder. The actual headshot image is missing. HeroSection renders with a broken image on any live deployment."
    artifacts:
      - path: "public/images/headshot.jpg (missing)"
        issue: "Only public/images/.gitkeep exists. Image is required before production deploy."
    missing:
      - "Provide public/images/headshot.jpg (at least 320px wide for retina)"
  - truth: "NAR-04: Systems shelf renders 11 systems per requirement spec"
    status: partial
    reason: "REQUIREMENTS.md NAR-04 specifies 11 systems (including ticker and signal-glass). User removed ticker and signal-glass during Plan 02-03 execution — shelf now has 9 systems. This is a user-approved change but NAR-04 text is not updated to reflect it. The shelf is functional; the gap is documentation/requirement sync."
    artifacts:
      - path: "lib/systems.ts"
        issue: "9 shelf systems (featured: false) instead of the 11 specified in NAR-04"
      - path: ".planning/REQUIREMENTS.md"
        issue: "NAR-04 still lists 11 systems including ticker and signal-glass which were removed"
    missing:
      - "Update NAR-04 in REQUIREMENTS.md to say 9 systems and remove ticker/signal-glass from the list"
human_verification:
  - test: "Visual layout check — alternating white/mint backgrounds"
    expected: "Home page shows 7 sections alternating: Hero(white), Featured Systems(mint), Chat(white), Origin Story(mint), Systems Shelf(white), Contact(mint), Footer(white)"
    why_human: "Background color rendering requires a browser; can't verify CSS class effect programmatically"
  - test: "Sticky nav scroll behavior"
    expected: "Nav is transparent at top, shows white bg + shadow after 100px scroll, hides on scroll-down past 100px, reappears on scroll-up"
    why_human: "Scroll event behavior requires browser interaction"
  - test: "Mobile nav hide/show"
    expected: "On mobile viewport, nav hides when scrolling down and shows when scrolling up"
    why_human: "Requires mobile viewport simulation in browser"
  - test: "Smooth scroll CTAs"
    expected: "'Explore the systems' scrolls to #featured-systems section, 'Ask me anything' scrolls to #chat-section"
    why_human: "Anchor scroll behavior requires browser"
  - test: "OG image social preview"
    expected: "Sharing quartermint.com on Twitter/Slack shows branded card with 'Ryan Stern / Builder. Operator.' on white background"
    why_human: "Requires actual deployment and social media preview tools"
---

# Phase 2: Static Narrative Content Verification Report

**Phase Goal:** A complete, reviewable site that tells the founder narrative across both audience paths -- deployable and shareable before any API keys are connected
**Verified:** 2026-03-27T14:53:36Z
**Status:** gaps_found
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Hero shows locked copy, headshot, living signal, dual CTAs | PARTIAL | Copy and CTAs verified in hero-section.tsx; headshot component wired but image file missing |
| 2 | Sticky nav shows "Ryan Stern" left + "Invest" right, scroll-aware | VERIFIED | sticky-nav.tsx: 'use client', aria-label, passive scroll listener, 100px threshold, min-h-[44px] |
| 3 | Sections alternate white/mint backgrounds | VERIFIED | page.tsx shows bg/surface/bg/surface/bg/surface pattern on 6 SectionWrapper instances |
| 4 | Section entrance animations via IntersectionObserver | VERIFIED | section-wrapper.tsx: threshold: 0.3, fire-once unobserve, translate-y-2/opacity-0 -> opacity-100 translate-y-0 |
| 5 | Living signal fades in with GitHub commit data | VERIFIED | living-signal.tsx: useState(false)+useEffect, duration-[600ms], delay-300, sr-only text |
| 6 | Origin story 3 paragraphs, campaign names, closing sentence | VERIFIED | origin-story.tsx: Obama/Clinton/Sanders/Biden, "I started building because the tools didn't exist." |
| 7 | Systems shelf renders as dense typographic list | VERIFIED | systems-shelf.tsx: imports shelfSystems, GitHub SVG icons, aria-labels, TechBadge; 9 systems per user approval |
| 8 | Contact section dual-column with Calendar, email, links | VERIFIED | contact-investor.tsx: "Schedule a conversation", "For investors and partners", /invest link, ryan@quartermint.com |
| 9 | Footer shows exact stats text | VERIFIED | footer-stats.tsx: "40+ repositories / 894K files indexed / 9 production services", text-[13px] |
| 10 | /invest route memo-style, thesis pull quote, stats grid | VERIFIED | invest/page.tsx: border-l-[3px] border-accent, grid-cols-3, 6 stats, INV-03 compliance clean |
| 11 | /privacy covers all 5 required topics | VERIFIED | privacy/page.tsx: Chat Messages, Section Tracking, Email Collection, Cookies, Third-Party Tracking |
| 12 | SEO: robots.txt, sitemap.xml, OG tags, canonical URLs | VERIFIED | robots.ts + sitemap.ts + opengraph-image.tsx all present; layout.tsx has metadataBase + summary_large_image |
| 13 | Site deployed on Vercel with auto-deploy | FAILED | No git remote, no .vercel dir, no vercel.json. Not connected to any deployment |
| 14 | Headshot renders on hero | FAILED | public/images/headshot.jpg missing; only .gitkeep present |

**Score:** 11/14 truths verified (2 failed, 1 partial treated as verified for code, 5 need human check)

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `components/sticky-nav.tsx` | Scroll-aware nav | VERIFIED | 'use client', passive scroll, 5px delta threshold, aria-label, min-h-[44px] |
| `components/section-wrapper.tsx` | Alternating bg + entrance animation | VERIFIED | IntersectionObserver threshold:0.3, fire-once, noAnimation prop, id prop |
| `components/living-signal.tsx` | GitHub commit fade-in | VERIFIED | 600ms ease-in delay-300, sr-only, stale/fallback logic, null guard |
| `lib/github.ts` | GitHub API ISR fetch + fallback | VERIFIED | SIGNAL_REPOS, FALLBACK_SIGNAL, revalidate:3600, 14-day staleness check |
| `lib/relative-time.ts` | Relative time utilities | VERIFIED | getRelativeTime + isStale exported |
| `components/hero-section.tsx` | Locked copy + headshot + CTAs | VERIFIED (code) | All locked copy present; headshot path /images/headshot.jpg present but file missing |
| `components/featured-systems.tsx` | 4 horizontal narrative rows | VERIFIED | imports featuredSystems, TechBadge, no 'use client' |
| `components/chat-placeholder.tsx` | Chat section placeholder | VERIFIED | "Ask me anything about what I'm building" + "Chat coming soon." |
| `components/origin-story.tsx` | 3-paragraph origin story | VERIFIED | 3 paragraphs, campaign names, closing sentence present |
| `components/systems-shelf.tsx` | Dense typographic shelf list | VERIFIED | shelfSystems, GitHub icons with aria-labels, TechBadge |
| `components/contact-investor.tsx` | Dual-column contact section | VERIFIED | "Schedule a conversation", Calendar CTA, email, GitHub/X links, /invest link |
| `components/footer-stats.tsx` | Footer stats line | VERIFIED | Exact text, text-[13px] |
| `app/page.tsx` | Complete 7-section home page | VERIFIED | All 6 SectionWrapper blocks + imports (FooterStats in layout) |
| `app/layout.tsx` | Layout with StickyNav + FooterStats | VERIFIED | StickyNav in header, FooterStats in footer, metadataBase |
| `app/invest/page.tsx` | /invest memo-style route | VERIFIED | Thesis pull quote, stats grid, compliance clean |
| `app/privacy/page.tsx` | /privacy route | VERIFIED | All 5 required topic sections |
| `app/robots.ts` | robots.txt generation | VERIFIED | sitemap: 'https://quartermint.com/sitemap.xml' |
| `app/sitemap.ts` | sitemap.xml generation | VERIFIED | All 3 routes present |
| `app/opengraph-image.tsx` | Dynamic OG image | VERIFIED | ImageResponse, 1200x630, branded card |
| `public/images/headshot.jpg` | Hero headshot image | MISSING | Only .gitkeep in public/images/ |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `components/living-signal.tsx` | `lib/github.ts` | CommitInfo prop from server parent | WIRED | Imports CommitInfo type; HeroSection passes signal prop from page.tsx |
| `app/page.tsx` | `lib/github.ts` | getLatestCommit() server call | WIRED | `const signal = await getLatestCommit()` on line 13; revalidate:3600 |
| `components/featured-systems.tsx` | `lib/systems.ts` | imports featuredSystems | WIRED | `import { featuredSystems } from '@/lib/systems'` line 1 |
| `components/systems-shelf.tsx` | `lib/systems.ts` | imports shelfSystems | WIRED | `import { shelfSystems } from '@/lib/systems'` line 1 |
| `components/section-wrapper.tsx` | `app/globals.css` | CSS custom properties for bg colors | WIRED | bg-bg / bg-surface Tailwind tokens defined in globals.css @theme |
| `components/hero-section.tsx` | `#featured-systems` | anchor href | WIRED | `href="#featured-systems"` on "Explore the systems" CTA |
| `app/page.tsx` | `components/origin-story.tsx` | import and render | WIRED | `import { OriginStory } from '@/components/origin-story'` |
| `app/invest/page.tsx` | `/invest` route | route file at app/invest/page.tsx | WIRED | `export default function InvestPage()` |
| `app/layout.tsx` | `components/sticky-nav.tsx` | StickyNav in header | WIRED | `<StickyNav />` in header element |
| `app/layout.tsx` | `components/footer-stats.tsx` | FooterStats in footer | WIRED | `<FooterStats />` in footer element |
| `app/robots.ts` | `app/sitemap.ts` | references sitemap URL | WIRED | `sitemap: 'https://quartermint.com/sitemap.xml'` |
| `app/page.tsx` | `app/opengraph-image.tsx` | Next.js file convention | WIRED | Next.js auto-resolves opengraph-image.tsx for og:image meta |
| `components/contact-investor.tsx` | `/invest` | anchor link | WIRED | `href="/invest"` on "View investor page" button |

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
|----------|---------------|--------|-------------------|--------|
| `components/living-signal.tsx` | signal (CommitInfo or null) | lib/github.ts via prop from page.tsx server fetch | GitHub API (env-gated: returns null without SIGNAL_REPOS) | FLOWING — data path complete; signal is null until SIGNAL_REPOS env var set on Vercel |
| `components/featured-systems.tsx` | featuredSystems | lib/systems.ts export | 4 real system entries with problem/solution copy | FLOWING |
| `components/systems-shelf.tsx` | shelfSystems | lib/systems.ts export | 9 real system entries with one-liners | FLOWING |
| `app/invest/page.tsx` | stats (static array) | Hardcoded in component | Real counts (40+, 9, 6, 894K, 452K, 395) | FLOWING — intentionally static |

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| All 161 tests pass | `npx vitest run` | 161 passed (14 files) | PASS |
| Next.js build exits 0 | `npx next build` | All 7 routes built: /, /invest, /privacy, /robots.txt, /sitemap.xml, /opengraph-image, /_not-found | PASS |
| INV-03 compliance scan | grep for securities language | 0 matches for "invest in", "investment opportunity", ROI, equity, valuation, shares | PASS |
| Systems shelf count | `grep -c "featured: false"` in lib/systems.ts | 9 | PASS (user-approved change from 11) |

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|------------|-------------|--------|----------|
| NAR-01 | 02-02 | Hero with locked copy, headshot, living signal, dual CTAs | PARTIAL | Code complete; headshot image file missing |
| NAR-02 | 02-01 | Sticky nav 48px, scroll-aware, mobile hide/show | VERIFIED | sticky-nav.tsx fully implemented |
| NAR-03 | 02-03 | Origin story 120-180 words, 3 paragraphs, campaign names | VERIFIED | origin-story.tsx approved by user |
| NAR-04 | 02-03 | Systems shelf dense list (9 systems after user edits) | VERIFIED (9) | Systems shelf functional; REQUIREMENTS.md still lists 11 — needs sync |
| NAR-05 | 02-03 | Contact + investor dual-column section | VERIFIED | contact-investor.tsx with Calendar, email, GitHub/X, /invest link |
| NAR-06 | 02-01 | Sticky nav behavior | VERIFIED | sticky-nav.tsx scroll logic |
| NAR-07 | 02-01/02 | Alternating section backgrounds | VERIFIED | page.tsx alternating bg/surface pattern |
| NAR-08 | 02-03 | Footer stats line | VERIFIED | footer-stats.tsx exact text |
| INV-01 | 02-04 | /invest route memo-style, max-width 680px | VERIFIED | invest/page.tsx fully built |
| INV-03 | 02-04 | /invest no securities claims | VERIFIED | Compliance tests pass (161 tests green) |
| OPS-02 | 02-05 | Vercel deployment with auto-deploy | FAILED | No git remote, no .vercel config, not deployed |
| OPS-04 | 02-05 | OG tags, Twitter cards, robots.txt, sitemap.xml, canonical URLs | VERIFIED | All metadata present and build verified |
| ENG-03 | 02-01 | Section entrance animations | VERIFIED | SectionWrapper IntersectionObserver implementation |
| ENG-04 | 02-01 | Living signal fade-in | VERIFIED | living-signal.tsx opacity + delay-300 |

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `components/chat-placeholder.tsx` | 6-9 | "Chat coming soon." — intentional placeholder | INFO | Expected: Phase 3 will replace with real chat. Not a blocker for Phase 2 goal. |
| `public/images/headshot.jpg` | - | Image file missing (only .gitkeep) | BLOCKER | Hero section renders a broken image on any live deployment. Must be provided before deploy. |

### Human Verification Required

#### 1. Alternating White/Mint Backgrounds

**Test:** Run `npm run dev`, visit http://localhost:3000, scroll through full page
**Expected:** 7 sections visible: Hero (white), Featured Systems (mint), Chat (white), Origin Story (mint), Systems Shelf (white), Contact (mint), then Footer (white). Each section has clearly distinct background colors.
**Why human:** CSS class → rendered background color requires browser rendering.

#### 2. Sticky Nav Scroll Behavior

**Test:** Visit http://localhost:3000, scroll down slowly past 100px
**Expected:** Nav starts transparent, gets white background + subtle box shadow after 100px scroll. On desktop, nav stays visible throughout. On mobile viewport, nav hides when scrolling down past 100px and reappears when scrolling up.
**Why human:** Scroll event + CSS transition behavior requires live browser.

#### 3. Smooth Scroll CTAs

**Test:** Click "Explore the systems" and "Ask me anything" buttons in hero
**Expected:** Page smoothly scrolls to respective anchor sections (#featured-systems, #chat-section)
**Why human:** Anchor scroll behavior requires browser.

#### 4. /invest Visual Review

**Test:** Visit http://localhost:3000/invest
**Expected:** Memo-style layout (680px max-width centered), thesis pull quote with 3px mint left border, 3x2 stats grid, "Where It's Going" and "Background" sections, Calendar CTA button
**Why human:** Visual layout verification.

#### 5. OG Image Social Preview

**Test:** After Vercel deployment, share URL in Slack or use Twitter Card Validator
**Expected:** Branded card with "Ryan Stern" in serif, "Builder. Operator." italic, thesis tagline, "quartermint.com" in mint
**Why human:** Requires live deployment and social platform preview tooling.

---

### Gaps Summary

Two functional gaps block the phase goal of "deployable and shareable":

**Gap 1 — Vercel deployment (OPS-02):** The repository has no git remote configured. No Vercel project link exists. The code is complete and builds cleanly (`next build` exits 0), but it cannot be deployed or shared until a GitHub repository is created, code pushed, and Vercel project linked. SIGNAL_REPOS and FALLBACK_SIGNAL environment variables also need to be set in the Vercel dashboard for the living signal to function.

**Gap 2 — Headshot image (NAR-01):** `public/images/headshot.jpg` does not exist — only a `.gitkeep` placeholder is present. The hero section renders an `<Image>` tag pointing to `/images/headshot.jpg`. Any live deployment will show a broken image in the hero. This was documented in plan frontmatter `user_setup` as a manual step, but it has not been completed.

One documentation gap: NAR-04 in REQUIREMENTS.md still specifies 11 shelf systems (including ticker and signal-glass) even though the user removed those two systems during Plan 02-03 execution. The shelf is correct at 9 systems per user approval — the requirement text needs updating to reflect the change.

All code quality checks pass: 161 tests green, build exits 0, INV-03 compliance verified, all routing and wiring confirmed.

---

_Verified: 2026-03-27T14:53:36Z_
_Verifier: Claude (gsd-verifier)_
