# Design System — quartermint.com (Company Site)

> **Editorial Treasury.** Fintech polish layered onto civic gravitas. Owns an aesthetic space between Mercury-tier fintech craft and Treasury Department typographic restraint. Reads as: "this is how serious institutions present serious money" to a banker at Amalgamated and "finally, modern" to a political-ops director.

**This is the canonical design system for both the company site (`~/quartermint-site` → quartermint.com) and the product app (`~/quartermint`).** The two surfaces share one identity.

**Pivot note (2026-05-23):** quartermint.com was previously a personal founder site for Ryan Stern (Cathedral Hybrid Narrative, mint palette). That direction is preserved at `DESIGN-ARCHIVE-2026-05-cathedral-mint.md` and is no longer active. The site now serves as the company site for Quartermint-the-treasury-platform (the YC S26 pitch).

**Visual ground-truth:** `~/.gstack/projects/quartermint/designs/design-system-20260523/round3-/variant-A.png` (the approved 10/10 dashboard mockup applying this system).

---

## Product Context

- **What this is:** Quartermint — multi-entity financial infrastructure for political organizations. Unified treasury operations across campaigns, PACs, 501(c)(3)s, 501(c)(4)s, Super PACs, and Joint Fundraising Committees, with built-in FEC compliance.
- **Pitch frame:** "Brex for Public Affairs."
- **Memorable thing to leave behind in 30 seconds:** *"This is what political ops should have had 20 years ago — finally modern."*
- **Audiences (priority order):**
  1. YC partners reviewing the S26 application
  2. Amalgamated Bank distribution conversations
  3. Political ops directors / treasurers
  4. Compliance counsel and auditors

---

## Brand Signature: The Entity-Geometry System

Quartermint encodes legal entity types as a four-mark geometric system. **This is the brand the way Mercury's weight-420 is theirs.** Non-negotiable, must appear consistently across every surface.

| Mark | Entity type | Notes |
|------|-------------|-------|
| ● | Campaign | Filled circle |
| ◆ | Coalition PAC | Filled diamond (four distinct shapes — no two in the same family) |
| ▲ | JFC (Joint Fundraising Committee) | Filled triangle |
| ■ | 501(c)(3) / 501(c)(4) | Filled square |

**Where the marks must appear:**
- Beside the wordmark in the brand lockup
- Hero section as the proof element ("we serve all four entity types")
- Section dividers / bullet markers throughout marketing copy
- The favicon uses ● as the primary glyph
- OG/social images feature the four-mark strip prominently

**Color rules for marks:** on Parchment surfaces use Ledger Green; on Ink (dark) surfaces use Aged Gold for accent placements and Cream for neutral placements. Never use a mark color to indicate compliance status.

---

## Aesthetic Direction

- **Direction:** Editorial Treasury
- **Decoration level:** Intentional. Hairline 1px rules, decorative serif dot/short-rule under section heads, subtle paper grain on hero surfaces. Zero gradients. Zero bubbles. Zero stock photography.
- **Mood:** Old-money typographic gravity executed with modern fintech rigor.
- **Anti-patterns (forbidden):** Purple gradients, 3-column-icon SaaS feature grids, bubble border-radius, bouncy motion, partisan red/blue as primary, Capitol/dome/shield/seal/laurel illustration, all-caps mottos, Inter/Roboto/Arial as primary type, system-ui as display.

---

## Typography

All fonts free, Google Fonts via `next/font`.

| Role | Font | Weight | Notes |
|------|------|--------|-------|
| Display / Hero / Page titles | **Fraunces** | 400, 500, 600 (variable) | Use `opsz` axis. Hero numbers at opsz 144, page titles at opsz 72, section heads at opsz 36. |
| Body / UI / Labels / Buttons | **Geist** | 400, 500 | Replaces DM Sans. |
| Numerics / Tables | **Geist** with `font-variant-numeric: tabular-nums` | 400, 500 | Apply to every monetary value. |
| Identifiers / Transaction IDs / FEC IDs | **JetBrains Mono** | 400 | |

### Italic-Loss Signature (mandatory)

Negative deltas render in **italic Fraunces**. Positive deltas upright. Signature move — applies wherever deltas appear:

```
+ $28,541.73    (Fraunces upright, tabular-nums)
− $248,617.00   (Fraunces italic, tabular-nums)
```

### Modular scale

```
12 / 0.75rem    fine print, footnotes
14 / 0.875rem   body small
16 / 1.00rem    body, labels
18 / 1.125rem   body large
22 / 1.375rem   entity card name / inline brand
28 / 1.75rem    section heads
36 / 2.25rem    page subheads
48 / 3.00rem    page titles
72 / 4.50rem    hero callouts
120 / 7.50rem   hero number (Fraunces opsz-144)
```

---

## Color System

### Light mode (default — Parchment)

| Token | Hex | Role |
|-------|-----|------|
| `--color-bg` | `#FAF7EF` | Parchment background |
| `--color-surface` | `#F2EDDF` | Card / elevated surface |
| `--color-surface-subtle` | `#EEE8D6` | Hover, striped rows |
| `--color-primary` | `#0F3D2E` | Ledger Green — nav, CTAs, link |
| `--color-primary-text` | `#FAF7EF` | Text on Ledger Green |
| `--color-accent` | `#B8893A` | Aged Gold — rare emphasis only |
| `--color-text` | `#1C2620` | Primary text |
| `--color-text-muted` | `#5E6862` | Secondary, labels |
| `--color-text-faint` | `#8A938E` | Tertiary, footnotes |
| `--color-rule` | `#D8D2C0` | Hairline 1px dividers |
| `--color-rule-strong` | `#B5AE99` | Card borders |

### Dark mode (Ink)

| Token | Hex | Role |
|-------|-----|------|
| `--color-bg` | `#0E1410` | Ink — near-black with green undertone |
| `--color-surface` | `#1A1F1B` | Card surface |
| `--color-surface-subtle` | `#222825` | Hover, striped rows |
| `--color-primary` | `#2D6B52` | Brighter Ledger Green for Ink contrast |
| `--color-primary-text` | `#0E1410` | Text on bright green |
| `--color-accent` | `#D4A85C` | Brightened Aged Gold |
| `--color-text` | `#E8E2D1` | Cream on Ink |
| `--color-text-muted` | `#9AA09C` | Secondary |
| `--color-text-faint` | `#6B7570` | Tertiary |
| `--color-rule` | `#2A302C` | Hairline divider |
| `--color-rule-strong` | `#3D453F` | Card border |

### Semantic

| Token | Light | Dark | Role |
|-------|-------|------|------|
| `--color-success` | `#3E7C5A` | `#5BA37D` | Filed, compliant, settled |
| `--color-warning` | `#C28B2C` | `#D9A348` | Pending, review required |
| `--color-error` | `#A14132` | `#C45D4C` | Non-compliant, rejected |
| `--color-info` | `#3E6B8C` | `#6291B5` | Notice, informational |

Status presentation: **bordered hairline tag with leading dot**, never pill bubble.

```
[ • Settled ]    [ • Pending ]    [ • Non-Compliant ]
```

### Color use rules

- **Aged Gold is rare.** Used only for emphasis frames (Approvals Pending equivalents on marketing surfaces), the selected-state in product nav, the brand-mark accent dots in the lockup. Never as a primary CTA color.
- **Ledger Green is the brand.** Used for nav, primary CTA, link color, entity card top-stripe.
- **No partisan red, no partisan blue.** Red is error-state only. Blue is info-state only. Never brand or marketing accent.

---

## Spacing

8px base. Comfortable density on marketing.

```
2xs   2px    Inside tags
xs    4px    Icon-to-text gap
sm    8px    Inner card padding small
md   16px    Default card padding, button padding
lg   24px    Card outer margin
xl   32px    Section padding
2xl  48px    Section vertical rhythm
3xl  64px    Section vertical rhythm large
4xl  96px    Hero block vertical
```

---

## Site-Specific Layout

- **Max content width:** 1200px outer
- **Reading column:** 680px for body text (editorial reading width)
- **Vertical rhythm:** 32 / 48 / 64 / 96 between sections
- **Hero:** massive Fraunces headline (opsz-144 if it's a number, opsz-72 if it's a phrase) + Geist subhead + the entity-geometry strip (● ◆ ▲ ■) prominently displayed as proof of breadth
- **Hero photography:** the product dashboard mockup IS the hero. Use `~/.gstack/projects/quartermint/designs/design-system-20260523/round3-/variant-A.png` until a current rebuild ships. No stock photography. No generated illustrations.
- **Section heads:** Fraunces with the decorative serif dot-rule beneath
- **Border radius:** `sm:2px` (inputs/tags), `md:4px` (cards/buttons), `lg:6px` (modals). **Never bubble radius.**

---

## Motion

Minimal-functional. Treasury does not bounce.

| Token | Duration | Easing | Use |
|-------|----------|--------|-----|
| `--motion-micro` | 100ms | ease-out | Hover, focus, color shift |
| `--motion-short` | 150ms | ease-out | Tooltips, dropdowns |
| `--motion-medium` | 250ms | ease-in-out | Sheets, drawer open/close |
| `--motion-long` | 400ms | ease-in-out | Page transitions (sparingly) |

**Forbidden:** scroll-driven animation, entrance choreography, spring physics, parallax, animated gradient backgrounds.

---

## Copy Posture

- Direct, institutional, never breathless
- No "Built for X" / "Designed for Y" template marketing copy
- Every claim is specific (dollar amounts, entity counts, compliance frameworks). Abstract benefit copy reads as SaaS slop.
- **Bipartisan by construction:** copy never references progressive/conservative, party affiliation, or candidate names. Copy DOES reference entity types (campaign, PAC, JFC, 501c4) and compliance frameworks (FEC, IRS) as proof of breadth.
- Embedded AI chat (carried over from the previous direction, if retained): chat answers should adopt the same restrained, specific voice. If chat reads breathless or generic, retune.

---

## Migration From the Cathedral Mint Direction

The previous direction is preserved in `DESIGN-ARCHIVE-2026-05-cathedral-mint.md`. To migrate:

1. **Fonts:** Replace `Instrument Serif` with `Fraunces`; replace `DM Sans` with `Geist` in `app/layout.tsx`
2. **Colors:** In `app/globals.css`, replace the entire `:root` palette and `@media (prefers-color-scheme: dark)` block with the Parchment/Ink tokens above
3. **Surfaces:** Replace `#E6F4F1` mint-tinted surface with `#F2EDDF` Parchment surface
4. **Accent:** Replace `#A8E6CF` mint accent with `#B8893A` Aged Gold
5. **Section vertical:** Keep 80px desktop rhythm but introduce 96px hero block
6. **Favicon:** Switch to `●` glyph (or an SVG of the same)
7. **Hero copy:** Strip personal-founder narrative. Hero is now Quartermint-the-company. Personal-narrative content either retires or moves to a separate domain (see archive doc)
8. **Embedded AI chat:** Decide whether the chat surface survives. If yes, the chat brand becomes a Quartermint assistant (treasury / compliance / FEC questions), not a Ryan-stand-in

---

## Implementation Checklist

### Immediate

- [ ] Swap font imports (Fraunces + Geist + JetBrains Mono)
- [ ] Replace globals.css palette with Editorial Treasury tokens
- [ ] Switch favicon to ●
- [ ] Build the entity-geometry mark component (used everywhere)
- [ ] Strip personal-founder copy from hero, replace with company positioning + entity-geometry proof strip

### Within the next milestone

- [ ] Italic-Fraunces negative-delta formatter component
- [ ] Decorative serif dot-rule component
- [ ] Status-tag component (bordered hairline + dot, no pills)
- [ ] OG / social images using the four-mark strip
- [ ] Re-tune embedded chat persona (if retained) to Quartermint voice

### Polish pass before YC review

- [ ] Audit for any mint / Instrument Serif residue
- [ ] Audit for personal-founder framing leftovers
- [ ] Add hero photography from the approved dashboard mockup
- [ ] Confirm tabular numerals on every monetary value

---

## Decisions Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-05-23 | Editorial Treasury direction locked for the company site | Unclaimed aesthetic space between fintech (Mercury/Brex/Ramp) and political tech (ActBlue/WinRed/NGP VAN). Bipartisan by construction. Calibrated for YC / Amalgamated / political-ops audiences. |
| 2026-05-23 | Cathedral Hybrid Narrative + mint palette retired | Archived in `DESIGN-ARCHIVE-2026-05-cathedral-mint.md`. May resurface if a separate personal site is spun out to its own domain. |
| 2026-05-23 | Entity-geometry mark system ● ◆ ▲ ■ adopted as brand signature | The brand the way Mercury's weight-420 is theirs. Propagates everywhere. |
| 2026-05-23 | Italic-Fraunces for negative deltas | Signature move. Solves loss-vs-gain readability with type, not color. |
| 2026-05-23 | Visual ground-truth approved: round3-A | `~/.gstack/projects/quartermint/designs/design-system-20260523/round3-/variant-A.png` |
