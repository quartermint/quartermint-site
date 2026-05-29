# Plan — Landing page updates + demo strategy

**Date:** 2026-05-28 · **Source:** `/gsd:explore` ecosystem session
**Repos involved:** `quartermint-site` (marketing landing), `quartermint-demos-hub`
(the actual demos.quartermint.com), + each product app.

---

## CORRECTION (3rd premise fix this session)
`demos.quartermint.com` is **NOT lora-ops**. It is a **static hub** — repo
`quartermint/demos-hub` (`~/quartermint-demos-hub`), `index.html` served by Caddy on the
**Quail box `5.78.187.186`** from `/var/www/demos-hub/`. Individual demos are subdomains.

The hub README already defines four tiles (currently OLD names/states):

| Tile (current label) | Subdomain | State (per hub README) | → new label |
|---|---|---|---|
| PAC — AMP Ops | `pac.demos.quartermint.com` | Coming this week | **PAC Ops** |
| Candidate — Candidate Ops | `candidate.demos.quartermint.com` | **Live** | **Campaign Manager Ops** |
| Compliance — Lora Ops | `compliance.demos.quartermint.com` | Coming this week | **Compliance Ops** |
| Principals — Forward | `principals.demos.quartermint.com` | Design preview (static) | **REMOVE tile** (Forward/Scheduler parked) |

Each real demo = the full app deployed with `DEMO_MODE=true` (read-only, OAuth-bypassed,
seeded). Forward tile is a static sketch (Forward v0 hasn't shipped). The hub also has
`amalgamated-preview/` and `personified-preview/` dirs — other static previews.

Deploy is `scp` to `root@100.118.34.18:/var/www/demos-hub/` (Caddy, no reload). See hub README.

---

## RESOLVED — the 4th surface
**Forward / Principals is the Scheduler surface** (`~/forward`, vendor-side). It was only on
the hub as 2×2 scaffolding. **Decision (2026-05-28): pull the Forward tile off the demos hub**
until there's a real need to invest in it. Forward is parked, not a current demo.

The canonical family is the **four 2×2 products**: PAC Ops, Campaign Manager Ops, Compliance
Ops, Multi-Candidate Strategist. The Strategist takes the 4th hub slot (state: In Design)
once it exists. Until then the hub carries three: PAC Ops, Campaign Manager Ops, Compliance Ops.

> Action: remove the `principals.demos.quartermint.com` / Forward tile from
> `quartermint-demos-hub/index.html`. (The `forward-preview/` static dir + Caddy vhost can stay
> dormant; just drop the tile so the hub doesn't advertise it.)

(Also: the `● ◉ ▲ ■` marks are the 4 **legal entity types** — campaign / coalition-PAC / JFC /
501(c) — NOT 1:1 with products. The product↔mark mapping earlier was a loose visual device.)

## A. Demos-hub (`quartermint-demos-hub/index.html`) updates
- **Remove the Forward/Principals tile** (parked — see resolved decision above).
- Relabel tiles: AMP Ops → **PAC Ops**, Candidate Ops → **Campaign Manager Ops**,
  Lora Ops → **Compliance Ops**.
- Update states once demos are live (PAC + Compliance currently "Coming this week").
- Add the **Multi-Candidate Strategist** tile (state: In Design) when ready.
- Refresh hero carousel screenshots from the live demos (process in hub README).

## B. quartermint-site landing (`app/page.tsx`) updates
The "Commercial Floor" tiles (`FLOOR_LIVE` line 17, `FLOOR_DESIGN` line 23) should align with
the family + **link out to the demos-hub / subdomains** (currently no demo links on the page):
- "Statewide IE Committee" → **PAC Ops** → link `pac.demos.quartermint.com`
- "Compliance Firm" → **Compliance Ops** → link `compliance.demos.quartermint.com`
- "Candidate Strategy Firm" → **Multi-Candidate Strategist** (in design)
- consider adding **Campaign Manager Ops** (`candidate.demos…` is already Live!)
- Keep signature design: italic-Fraunces, four-mark geometry, ledger-green/parchment/aged-gold,
  "knowing what moving it triggers." Descriptive product names kept (catchy branding deferred).

## C. Demos — all 4, each EXCELLENT, real working feel, realistic dummy data
User bar: each demo feels like a real working version of the product (dummy data).
**Define "better" FIRST** (user chose this) before building.

- **Model for "good":** the `candidate.demos.quartermint.com` (candidate-ops) demo is already
  LIVE — dogfood it, set the quality bar from it. lora-ops + amp-ops have demo reseeders to model.
- **Stand up PAC Ops demo** (user chose): amp-ops demo currently only at internal
  `preview.qm0dev.com` (:8002) → deploy a `DEMO_MODE` build to `pac.demos.quartermint.com`.
  Hostname check lives at `amp-ops/frontend/src/router.tsx:1`.
- **Compliance Ops demo:** hub says "coming this week" — finish/deploy to `compliance.demos…`.
- **Strategist demo:** gated on the new greenfield repo MVP.

### "Excellent demo" definition — OPEN
- Guided tour vs free-roam (lean free-roam + dismissible hint).
- **Shared synthetic-data generator** producing ONE coherent fake political universe across
  all demos (same fake committees/candidates/vendors) vs per-app seeders. Strong rec: build
  once. Possible home: demos-hub or a shared faker package.
- Realism bar: plausible names, donor enrichment, filing deadlines, cash curves — not lorem.

## Sequencing
1. Lock "excellent demo" definition + the Forward/Strategist 4th-tile question.
2. (Shared faker, if chosen.)
3. Relabel demos-hub tiles + quartermint-site tiles + add demo links.
4. Deploy PAC Ops demo to `pac.demos…`; finish Compliance Ops demo.
5. Strategist demo — after the new-repo MVP.
