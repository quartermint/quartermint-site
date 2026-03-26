# Feature Research

**Domain:** Personal founder narrative site with embedded AI chat (dual-audience: general visitors + investors)
**Researched:** 2026-03-26
**Confidence:** HIGH

## Feature Landscape

### Table Stakes (Users Expect These)

Features users assume exist. Missing these = product feels incomplete or unprofessional.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Hero section with clear value proposition | Visitors decide in 5-10 seconds whether to stay. 72% of professionals evaluate via personal sites (Adobe 2025). No hero = no retention. | LOW | Copy is already locked in design doc. Headshot + thesis + dual CTAs. The living signal (last commit timestamp) is a differentiator layered on top of table stakes positioning. |
| Responsive design (mobile/tablet/desktop) | Over 60% of web traffic is mobile. Non-responsive = broken for most visitors. | MEDIUM | 3 breakpoints defined in spec (<640, 640-1023, >=1024). Standard CSS approach with custom properties. |
| Dark mode support | 82.7% of consumers use dark mode (2026 data). Not supporting it creates jarring visual experience for majority of users. | LOW | `prefers-color-scheme` media query with mapped color palette. Straightforward with CSS custom properties architecture. |
| Navigation (sticky header) | Users need persistent wayfinding on scroll-heavy narrative sites. Absence creates disorientation. | LOW | Minimal: name left, "Invest" right. Scroll-aware show/hide. |
| SEO fundamentals (OG tags, Twitter cards, sitemap, robots.txt) | Sharing the site on social/Slack/email without rich previews looks amateur. Investors share links internally. | LOW | Next.js Metadata API handles this natively. OG images at 1200x630. `summary_large_image` Twitter card type for better engagement. Canonical URLs per route. |
| Contact method | Visitors who want to reach out and can't will leave. | LOW | Dual-column: mailto + Google Calendar booking link for general visitors, /invest link for investors. No contact form needed (out of scope, correct call). |
| Featured work/projects section | Personal founder sites without evidence of building are just claims. Need concrete proof of output. | MEDIUM | 4 featured systems (LifeVault, Relay, OpenEFB, v2cf) with empathy-first framing. Horizontal narrative rows chosen deliberately over 2x2 grid to avoid "AI-generated layout" look. |
| Fast load times (<3s) | Slow sites signal lack of technical competence for a builder/founder. Google Core Web Vitals are table stakes for any technical person's site. | LOW | Next.js static generation for most content. Only dynamic element is chat API. Minimal JS bundle if animations are CSS-driven. |
| Privacy policy | AI chat collecting conversation data requires privacy disclosure. Legal requirement in EU (GDPR) and California (CCPA). | LOW | /privacy page + notice below chat input. Required, not optional, with AI interaction. |
| Accessibility basics (keyboard nav, ARIA landmarks, contrast) | WCAG 2.2 AA is the legal standard in 2026 (EAA in force since June 2025). Investor-facing sites with poor accessibility signal inattention to detail. | MEDIUM | Spec calls for WCAG AAA contrast, which exceeds requirements. 44px touch targets, reduced-motion respect, keyboard nav, ARIA landmarks. AAA is ambitious but achievable for a text-heavy site. |
| Origin story / About section | Investors evaluate founders, not just products. "Who is this person and why should I trust them?" must be answered. | LOW | 120-180 word section reframing campaign history. 3 paragraphs. Prose, not logo carousel. |

### Differentiators (Competitive Advantage)

Features that set this site apart from standard founder portfolio sites. These are where quartermint.com competes.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Embedded AI chat (persona-driven, streaming) | The killer differentiator. Most founder sites are static brochures. An AI that speaks in Ryan's voice, draws from identityvault biographical data, and answers questions in real-time transforms a passive visit into an active conversation. This IS the thesis demonstrated: information routed to the right person, in the right form, at the right time. | HIGH | Port from Stripped: @ai-sdk/anthropic streaming, useChat hook, system prompt builder pulling from identityvault. Architecture is proven. Complexity is in persona tuning and context management, not infrastructure. |
| Chat rate limiting (three-layer) | Prevents the AI chat from becoming a cost liability. Cookie-based session cap (20 msgs), IP-based hard cap (60/hr via Vercel KV), budget alert ($50/mo). Most portfolio chatbots have no cost controls and either get abused or shut down. | MEDIUM | Stripped already has IP-based rate limiting via @vercel/kv. Need to add cookie-based session layer and budget monitoring alert. The layered approach is thoughtful and well-specified. |
| Smart starter chips (context-aware) | Most chatbots show static "ask me about X" prompts. Chips that adapt based on scroll position, last commit recency, time of day, and static fallbacks show the site itself is intelligent. Demonstrates the routing thesis in miniature. | MEDIUM | Scroll context requires section tracking (IntersectionObserver). Commit recency needs a build-time or API fetch from GitHub. Time-of-day is trivial. Priority: scroll context > commit recency > time > static. |
| Chat section scroll awareness | Chat responses adapt based on which section the visitor was reading. "I see you were looking at OpenEFB" creates uncanny relevance. No other personal site does this. | MEDIUM | IntersectionObserver tracks visible section, passes as metadata to chat API. System prompt incorporates "user was viewing [section]" context. Ties chat to narrative flow. |
| /invest route (memo-style investor page) | Dedicated investor-facing content is rare on personal founder sites. Most founders send decks or link to pitch videos. A standalone memo-style page with thesis, stats, trajectory, background, and CTA signals professionalism and respects investor time. | MEDIUM | Must include compliance language (no securities claims). sessionStorage flag for journey detection so main page can show variant heading for visitors who came from /invest. |
| Living signal (last commit timestamp) | Static sites feel abandoned. A "Last shipped: 2 hours ago" indicator in the hero proves the builder is actively building. Most portfolio sites have no evidence of recency. | LOW | Build-time fetch from GitHub API for last commit timestamp. Simple, high-signal. Fade-in animation (opacity 0->1, 600ms ease, 300ms delay). |
| Conversation export via email | After meaningful chat interaction (3+ messages), offer to email the transcript. Creates a touchpoint beyond the visit, captures lead information naturally, extends the conversation. | MEDIUM | Resend from chat@quartermint.com. Slide-down panel after 3rd message. Requires Resend account setup and email template. Natural lead capture without feeling like a form. |
| Returning visitor detection | 90-day cookie + Vercel KV topic tracking. Personalized chat greetings for returning visitors ("Welcome back. Last time we talked about OpenEFB...") create relationship continuity that static sites can never achieve. | MEDIUM | Cookie sets visitor ID, KV stores topic history. System prompt includes prior conversation topics. Privacy notice must cover this data collection. |
| Alternating section visual rhythm | White/mint background alternation creates editorial pacing that prevents scroll fatigue. Combined with Instrument Serif headlines, this produces a magazine-quality reading experience unusual for developer sites. | LOW | CSS custom properties make this trivial. The visual system (Instrument Serif + DM Sans + mint palette) is fully specified in the design doc. |
| Weekly digest email (owner analytics) | Vercel cron + Resend sends Ryan a weekly summary of chat sessions, top questions, and /invest page views. This is founder intelligence, not a user feature, but it creates the feedback loop that makes the site a living product. | MEDIUM | Vercel cron job triggers API route that aggregates KV data and sends via Resend. Analytics for the site owner, not the visitor. |
| DRY systems data source | lib/systems.ts as single source for all system descriptions, tech badges, public repo indicators. Changes propagate everywhere. Clean architecture that prevents drift between featured section, systems shelf, and detail pages. | LOW | Standard pattern but worth calling out as a differentiator because it enables the systems shelf and detail pages without content duplication. |

### Anti-Features (Commonly Requested, Often Problematic)

Features that seem good but create problems. Deliberately NOT building these.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| CMS / MDX content management | "You need a CMS for content updates" | Content changes are infrequent for a personal site. CMS adds build complexity, content modeling overhead, and auth management for a solo builder. MDX introduces a compilation step and content/code coupling. | Hardcoded JSX. Change frequency is low. Edit code, push, auto-deploy. Faster iteration than any CMS for a solo builder. |
| Contact form | "Visitors need a way to reach you" | Forms attract spam, require server-side handling, CAPTCHA, validation, and storage. On a personal site, the conversion funnel is chat or email, not a form submission. | mailto link + Google Calendar booking link. Chat IS the interactive contact method. If spam becomes an issue, add form later. |
| Logo carousel / client list | "Show who you've worked with for credibility" | Logo carousels signal "consultant for hire" which is the opposite of the founder narrative. They also create a "have we heard of any of these?" evaluation that undermines a builder thesis. | Origin story section that reframes campaign history as prose narrative. The work and patterns matter, the names don't. |
| Pitch deck download | "Investors want a PDF deck" | PDFs are untracked, unupdatable, and forwarded out of context. A deck download on a personal site also signals "I'm fundraising" prematurely for the /invest page's softer positioning. | Memo-style /invest page. Text-only for v1. If a deck is created later (e.g., for YC), add as enhancement. |
| Blog / writing section | "Founders should blog to build audience" | A blog without consistent publishing is worse than no blog. Creates "last post: 8 months ago" signal that undermines the living/active thesis. Requires sustained content production from a solo builder already shipping code. | The chat itself demonstrates thinking and opinions dynamically. The systems shelf shows output. If writing emerges, add later. |
| Real-time GitHub activity feed | "Show your commits live" | Live feeds are noisy, context-free, and create "what am I looking at?" reactions from non-technical visitors (including investors). Commit messages are written for developers, not audiences. | Living signal (single timestamp) + footer stats line (40+ repos / 894K files / 9 services). High signal, no noise. |
| Analytics dashboard (visitor-facing) | "Show traffic stats for social proof" | Visitor-facing analytics create a "low numbers" problem early and add visual clutter. They also feel vain on a personal site. | Weekly digest email (owner-only). Analytics inform the builder, not the visitor. |
| Multi-language support | "Reach global audiences" | i18n adds significant complexity (translation management, route handling, content duplication) for a site where the primary audience is US-based investors and collaborators. | English only. Revisit only if clear international demand emerges. |
| Animated 3D elements / WebGL | "Modern sites need 3D" | Heavy JS bundles destroy load times. 3D feels gimmicky on a narrative/editorial site. Incompatible with the editorial typography design direction. | CSS-driven scroll animations (translateY + opacity). Scroll-speed-adaptive timing via IntersectionObserver. Performance-first approach. |
| Custom 404 page | "Polish every touchpoint" | Nice but not worth the effort for v1 on a site with few routes. Default Next.js 404 is acceptable. | Default Next.js 404. Add in a polish pass if the site gains significant traffic. |
| Chat memory / persistent conversations | "Users should pick up where they left off across sessions" | Adds database complexity, session management, auth considerations, and GDPR compliance burden. Over-engineering for a personal site chat. | Returning visitor detection via cookie + KV topic tracking provides the "relationship continuity" feel without full conversation persistence. |

## Feature Dependencies

```
[Hero Section + Visual System]
    |
    +--required-by--> [Navigation (sticky header)]
    |
    +--required-by--> [Section Layout + Alternating Backgrounds]
                          |
                          +--required-by--> [Featured Systems (narrative rows)]
                          |
                          +--required-by--> [Origin Story Section]
                          |
                          +--required-by--> [Systems Shelf]
                          |
                          +--required-by--> [Contact + Investor Dual-Column]
                          |
                          +--required-by--> [Footer Stats Line]

[DRY Data Source (lib/systems.ts)]
    |
    +--required-by--> [Featured Systems Section]
    +--required-by--> [Systems Shelf]
    +--required-by--> [Per-System Detail Pages]

[Chat API Route + Streaming]
    |
    +--required-by--> [Chat Interface Component]
    |                     |
    |                     +--required-by--> [Smart Starter Chips]
    |                     +--required-by--> [Conversation Export via Email]
    |                     +--required-by--> [Returning Visitor Detection]
    |
    +--required-by--> [Chat Rate Limiting (three-layer)]

[Chat Interface Component]
    +--required-by--> [Chat Section Scroll Awareness]
    +--required-by--> [AI Disclosure / Privacy Notice]

[IntersectionObserver (section tracking)]
    |
    +--required-by--> [Chat Section Scroll Awareness]
    +--required-by--> [Smart Starter Chips (scroll context)]
    +--required-by--> [Section Entrance Animations]
    +--required-by--> [Scroll-Speed-Adaptive Animations]

[/invest Route]
    +--required-by--> [/invest Journey Detection (sessionStorage)]

[Resend Email Integration]
    +--required-by--> [Conversation Export via Email]
    +--required-by--> [Weekly Digest Email]

[Vercel KV]
    +--required-by--> [Chat Rate Limiting (IP-based)]
    +--required-by--> [Returning Visitor Detection (topic tracking)]
    +--required-by--> [Weekly Digest Email (data aggregation)]

[Dark Mode] --independent-- (can ship at any phase, CSS-only)
[SEO (OG tags, sitemap)] --independent-- (can ship at any phase)
[Accessibility] --cross-cutting-- (must be considered in every phase)
```

### Dependency Notes

- **Chat API requires ANTHROPIC_API_KEY:** Same key as Stripped deployment. Environment variable, not a build dependency.
- **Conversation export requires Resend:** New account/domain setup for chat@quartermint.com. This is an external dependency that blocks the email features.
- **Weekly digest requires both Vercel KV and Resend:** Ship after both are established and generating data.
- **Smart starter chips degrade gracefully:** If scroll context unavailable, falls back to commit recency > time-of-day > static defaults. Can ship the basic version first, enhance later.
- **Per-system detail pages require DRY data source:** The data model must be right before building detail pages, but the data source also feeds featured systems and systems shelf, so it should be established early.
- **Scroll-speed-adaptive animations enhance section entrance animations:** Build basic entrance animations first (simple IntersectionObserver + CSS), then layer speed detection on top.
- **Returning visitor detection enhances chat but doesn't block it:** Chat works fine without returning visitor awareness. The personalized greetings are an enhancement.

## MVP Definition

### Launch With (v1 / Core Narrative + Chat)

Minimum viable product -- what's needed to replace the current static site and validate the thesis.

- [ ] Hero section with locked copy, headshot, living signal, dual CTAs -- First impression, must be perfect
- [ ] Visual system (Instrument Serif + DM Sans + mint palette + CSS custom properties) -- Foundation for everything
- [ ] Responsive layout (3 breakpoints) -- Mobile visitors are majority
- [ ] Featured systems section (4 narrative rows) -- Proof of building
- [ ] Origin story section -- Context for the builder narrative
- [ ] Systems shelf (dense typographic list) -- Breadth of output
- [ ] Contact + investor dual-column section -- Conversion paths
- [ ] Sticky navigation bar -- Wayfinding
- [ ] Embedded AI chat with streaming (ported from Stripped) -- The differentiator
- [ ] Chat rate limiting (at minimum IP-based, ideally all three layers) -- Cost protection
- [ ] Chat persona with identityvault system prompt -- Chat quality
- [ ] AI disclosure / privacy notice -- Legal and trust requirement
- [ ] Basic starter chips (static defaults) -- Chat onboarding
- [ ] Dark mode (prefers-color-scheme) -- Majority user preference
- [ ] SEO (OG tags, Twitter cards, sitemap, robots.txt) -- Shareability
- [ ] Accessibility (keyboard nav, ARIA, contrast, touch targets) -- Legal and quality baseline
- [ ] Vercel deployment with auto-deploy -- Shipping infrastructure
- [ ] DNS repoint from Cloudflare to Vercel -- Go-live requirement
- [ ] Footer stats line -- Closing credibility signal

### Add After Validation (v1.x / Polish + Intelligence)

Features to add once core is working and receiving traffic.

- [ ] /invest route (memo-style page) -- Add when investor conversations are active or YC deadline approaches
- [ ] /invest journey detection (sessionStorage variant heading) -- Requires /invest to exist
- [ ] Smart starter chips (scroll context + commit recency + time-of-day) -- Enhance after basic chat is validated
- [ ] Chat section scroll awareness -- Enhance after section tracking is in place for animations
- [ ] Section entrance animations (translateY + opacity) -- Visual polish after content is solid
- [ ] Living signal fade-in animation -- Micro-polish
- [ ] Conversation export via email (Resend) -- Add when chat engagement validates demand
- [ ] Returning visitor detection -- Add when repeat traffic is observed
- [ ] Keyboard shortcuts overlay (? key) -- Power user feature, low priority
- [ ] Alternating section backgrounds (if not in v1) -- Visual rhythm enhancement

### Future Consideration (v2+)

Features to defer until site is established and generating regular traffic.

- [ ] Weekly digest email (Vercel cron + Resend) -- Needs accumulated data to be meaningful
- [ ] Per-system detail pages (quartermint.com/systems/[slug]) -- Content investment, defer until systems section drives interest
- [ ] Scroll-speed-adaptive animations (3 speed tiers) -- Refinement of basic animations, diminishing returns
- [ ] Cloudflare Workers migration via v2cf -- Explicitly phase 2 per spec

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Hero section + visual system | HIGH | LOW | P1 |
| Responsive layout | HIGH | MEDIUM | P1 |
| Featured systems (narrative rows) | HIGH | MEDIUM | P1 |
| Embedded AI chat (streaming) | HIGH | HIGH | P1 |
| Chat rate limiting (three-layer) | HIGH (cost protection) | MEDIUM | P1 |
| Chat persona (identityvault prompt) | HIGH | MEDIUM | P1 |
| Dark mode | MEDIUM | LOW | P1 |
| SEO fundamentals | MEDIUM | LOW | P1 |
| Accessibility | HIGH | MEDIUM | P1 |
| Navigation (sticky) | MEDIUM | LOW | P1 |
| Origin story | MEDIUM | LOW | P1 |
| Systems shelf | MEDIUM | LOW | P1 |
| Contact + investor section | HIGH | LOW | P1 |
| Privacy notice | HIGH (legal) | LOW | P1 |
| Footer stats | LOW | LOW | P1 |
| /invest route | HIGH (for investors) | MEDIUM | P2 |
| Smart starter chips (full) | MEDIUM | MEDIUM | P2 |
| Section scroll awareness (chat) | MEDIUM | MEDIUM | P2 |
| Section entrance animations | MEDIUM | LOW | P2 |
| Conversation export (email) | MEDIUM | MEDIUM | P2 |
| Returning visitor detection | MEDIUM | MEDIUM | P2 |
| Keyboard shortcuts | LOW | LOW | P3 |
| Weekly digest email | LOW (owner-only) | MEDIUM | P3 |
| Per-system detail pages | LOW | HIGH | P3 |
| Scroll-speed-adaptive animations | LOW | MEDIUM | P3 |

**Priority key:**
- P1: Must have for launch (core narrative + working chat + deployment)
- P2: Should have, add when possible (intelligence layer + investor path + polish)
- P3: Nice to have, future consideration (analytics + deep content + refinement)

## Competitor Feature Analysis

| Feature | Standard Founder Sites (Webflow/Squarespace) | AI-Enhanced Portfolio (Chatfolio/Portflix) | Technical Founder Sites (custom-built) | quartermint.com Approach |
|---------|----------------------------------------------|------------------------------------------|---------------------------------------|--------------------------|
| Hero/value prop | Template-driven, interchangeable | AI-generated, generic | Custom but often text-heavy | Locked editorial copy with living signal. The timestamp proves recency without clutter. |
| Project showcase | Card grids, screenshot galleries | Auto-generated from resume | GitHub-linked, often raw | Empathy-first narrative rows. Why this matters, not just what it does. |
| AI chat | None | Third-party widget (Botsonic, Wonderchat) | Occasionally custom-built | First-party, persona-driven, streaming, with section awareness. The chat IS the product thesis. |
| Investor content | Rare. Usually a deck download link. | None | Sometimes a /pitch or /about page | Dedicated /invest route with memo-style content and compliance language. Journey detection for cross-page awareness. |
| Dark mode | Template-dependent | Rarely supported | Common | prefers-color-scheme with full mapped palette. |
| Personalization | None | Cookie-based greetings (basic) | Rare | Returning visitor detection + topic tracking + scroll-aware chat chips. Three layers of context. |
| Cost controls for AI | N/A | Platform-managed (often crude) | Ad hoc or absent | Three-layer rate limiting: session cookie, IP/KV, budget alert. Most sophisticated approach in the personal site category. |
| Lead capture | Contact forms, email signups | Chatbot-driven forms | Minimal | Conversation export via email. Organic, non-intrusive, triggered by engagement (3+ messages). |

## Unique Positioning

The core insight is that quartermint.com is not primarily a portfolio site. It is a **demonstration of the thesis**: information routed to the right person, in the right form, at the right time.

Every differentiating feature reinforces this:
- **Chat** routes information to visitors in conversational form
- **Scroll awareness** routes context to the chat based on visitor behavior
- **/invest** routes investor-specific content to that audience
- **Smart chips** route starting points based on temporal and behavioral context
- **Returning visitor detection** routes continuity to repeat visitors

This makes the site itself the strongest artifact in any pitch or application. The features are not just features -- they are evidence.

## Sources

- [Figma portfolio examples](https://www.figma.com/resource-library/portfolio-website-examples/) -- Portfolio design patterns and trends
- [Startup Grind: Website components for raising VC](https://www.startupgrind.com/blog/8-key-components-your-website-needs-to-raise-venture-capital-money/) -- Investor-facing website requirements
- [WaveUp: Investor-friendly startup website design](https://waveup.com/blog/how-to-make-your-startup-website-design-investor-friendly/) -- Investor page best practices
- [Vercel: Securing AI apps with rate limiting](https://vercel.com/kb/guide/securing-ai-app-rate-limiting) -- Rate limiting patterns for AI features
- [Upstash: Edge rate limiting](https://upstash.com/blog/edge-rate-limiting) -- @upstash/ratelimit with Vercel KV
- [GetStream: Scaling AI chat best practices](https://getstream.io/blog/scaling-ai-best-practices/) -- Token optimization and cost management
- [MROY: Scroll animation techniques 2025](https://mroy.club/articles/scroll-animations-techniques-and-considerations-for-2025) -- IntersectionObserver performance patterns
- [Next.js Metadata API docs](https://nextjs.org/docs/app/getting-started/metadata-and-og-images) -- OG tags and SEO implementation
- [WCAG 2.2 overview (W3C)](https://www.w3.org/WAI/standards-guidelines/wcag/) -- Accessibility standards
- [Northwoods: Website design trends 2026](https://www.nwsdigital.com/Blog/Website-Design-Trends-for-2026) -- Dark mode adoption (82.7%), editorial typography trends
- [Webflow: Personalizing for returning visitors](https://webflow.com/blog/website-cookies) -- Cookie-based personalization patterns
- [Heavybit: Personal branding for founders](https://www.heavybit.com/library/article/personal-branding) -- Founder personal brand strategy
- Stripped project (~/stripped/) -- Proven chat architecture: @ai-sdk/anthropic, useChat, Vercel KV rate limiting, system prompt builder

---
*Feature research for: quartermint.com Cathedral Hybrid Narrative*
*Researched: 2026-03-26*
