import Image from 'next/image'
import { EntityMark } from '@/components/brand/entity-mark'
import { ChatInterface } from '@/components/chat/chat-interface'

const ENTITY_TYPES = [
  { type: 'campaign' as const, label: 'Campaign' },
  { type: 'coalition-pac' as const, label: 'Coalition PAC' },
  { type: 'jfc' as const, label: 'JFC' },
  { type: '501c' as const, label: '501(c)(3) / (c)(4)' },
]

function SerifDotRule() {
  return (
    <div
      aria-hidden="true"
      className="flex items-center gap-2 text-[var(--color-rule-strong)]"
    >
      <span className="font-display text-[20px] leading-none">·</span>
      <span className="block h-px w-12 bg-[var(--color-rule-strong)]" />
    </div>
  )
}

export default function Home() {
  return (
    <main className="bg-bg text-text">
      {/* ===== HERO ===== */}
      <section
        id="hero-section"
        className="border-b border-[var(--color-rule)]"
      >
        <div className="mx-auto max-w-[1200px] px-6 lg:px-10 pt-16 lg:pt-24 pb-12 lg:pb-20">
          <div className="flex items-center gap-3 mb-10">
            <div className="flex items-center gap-1.5" aria-hidden="true">
              <EntityMark type="campaign" size={14} tone="primary" />
              <EntityMark type="coalition-pac" size={14} tone="primary" />
              <EntityMark type="jfc" size={14} tone="primary" />
              <EntityMark type="501c" size={14} tone="primary" />
            </div>
            <span className="font-body text-[14px] tracking-[0.08em] uppercase text-text-muted">
              Quartermint
            </span>
          </div>

          <h1 className="font-display font-medium text-[44px] sm:text-[64px] lg:text-[84px] leading-[1.02] tracking-[-0.015em] text-text max-w-[18ch]">
            This is what real treasury infrastructure looks like.
          </h1>

          <p className="mt-8 font-body text-[18px] sm:text-[20px] leading-[1.55] text-text-muted max-w-[58ch]">
            Quartermint is multi-entity financial infrastructure for political
            organizations. One ledger across campaigns, coalition PACs, joint
            fundraising committees, and 501(c)s, with FEC compliance built into
            the platform.
          </p>

          {/* Entity-geometry proof strip */}
          <div className="mt-10 border-y border-[var(--color-rule)] py-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {ENTITY_TYPES.map((e) => (
                <div key={e.type} className="flex items-center gap-3">
                  <EntityMark type={e.type} size={20} tone="primary" />
                  <span className="font-body text-[14px] sm:text-[15px] text-text">
                    {e.label}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-4 font-body text-[13px] text-text-faint">
              All four legal entity types political organizations actually use.
              Encoded into the product as the entity-geometry system.
            </p>
          </div>

          {/* Hero photography: approved dashboard mockup */}
          <div className="mt-12 lg:mt-16 rounded-md overflow-hidden border border-[var(--color-rule-strong)] shadow-[0_4px_24px_rgba(15,61,46,0.08)]">
            <Image
              src="/images/dashboard-hero.png"
              alt="Quartermint unified treasury dashboard showing total cash position across a campaign, coalition PAC, joint fundraising committee, and 501(c)(4)"
              width={1536}
              height={1024}
              priority
              className="block w-full h-auto"
            />
          </div>
          <p className="mt-3 font-body text-[13px] text-text-faint italic">
            Unified Treasury Dashboard. Cash position, approvals pending,
            reports due — across every entity in a portfolio.
          </p>
        </div>
      </section>

      {/* ===== WHAT QUARTERMINT IS ===== */}
      <section
        id="what-is-quartermint"
        className="border-b border-[var(--color-rule)] bg-surface"
      >
        <div className="mx-auto max-w-[1200px] px-6 lg:px-10 py-16 lg:py-24">
          <SerifDotRule />
          <h2 className="mt-4 font-display font-medium text-[32px] sm:text-[40px] leading-[1.1] tracking-[-0.01em] text-text max-w-[24ch]">
            One platform across every entity in a political-ops portfolio.
          </h2>

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            <div>
              <p className="font-body text-[17px] leading-[1.65] text-text">
                A statewide political operation runs five to fifteen legal
                entities at any given moment. A candidate committee. A
                coalition PAC. A joint fundraising committee. Affiliated
                501(c)(4)s and (c)(3)s. Each entity has its own bank account,
                its own FEC or IRS filing cadence, its own approval policy,
                and its own ledger. Today the work of stitching them together
                is done in spreadsheets and email.
              </p>
            </div>
            <div>
              <p className="font-body text-[17px] leading-[1.65] text-text">
                Quartermint replaces that surface with one ledger. Total cash
                position across the portfolio. Cross-entity approvals with
                policy routing. Filing calendar that knows the difference
                between a quarterly FEC report, a 24-hour notice, and a
                501(c)(4) Form 990. Bipartisan by construction — the product
                organizes by entity type and compliance framework, not by
                party.
              </p>
            </div>
          </div>

          <ul className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-5 font-body text-[15px] text-text max-w-[920px]">
            {[
              { type: 'campaign' as const, text: 'Federal and state campaign committees' },
              { type: 'coalition-pac' as const, text: 'Coalition PACs and Super PACs' },
              { type: 'jfc' as const, text: 'Joint Fundraising Committees' },
              { type: '501c' as const, text: '501(c)(3) and 501(c)(4) entities' },
            ].map((row) => (
              <li key={row.type} className="flex items-start gap-3">
                <span className="pt-1.5">
                  <EntityMark type={row.type} size={14} tone="primary" />
                </span>
                <span>{row.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ===== PRODUCT PROOF ===== */}
      <section
        id="product-proof"
        className="border-b border-[var(--color-rule)]"
      >
        <div className="mx-auto max-w-[1200px] px-6 lg:px-10 py-16 lg:py-24">
          <SerifDotRule />
          <h2 className="mt-4 font-display font-medium text-[32px] sm:text-[40px] leading-[1.1] tracking-[-0.01em] text-text max-w-[22ch]">
            Treasury, approvals, and filings — in one ledger.
          </h2>

          <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12">
            <article className="border-t border-[var(--color-rule-strong)] pt-5">
              <div className="flex items-center gap-2">
                <EntityMark type="campaign" size={14} tone="primary" />
                <h3 className="font-display text-[22px] leading-[1.2] text-text">
                  Unified cash position
                </h3>
              </div>
              <p className="mt-3 font-body text-[15px] leading-[1.6] text-text-muted">
                Total balance across every entity, with 7-day delta. Per-entity
                cash balances surface side by side. Negative deltas render in
                italic Fraunces — readable at a glance, no color required.
              </p>
            </article>

            <article className="border-t border-[var(--color-rule-strong)] pt-5">
              <div className="flex items-center gap-2">
                <EntityMark type="coalition-pac" size={14} tone="primary" />
                <h3 className="font-display text-[22px] leading-[1.2] text-text">
                  Approvals pending
                </h3>
              </div>
              <p className="mt-3 font-body text-[15px] leading-[1.6] text-text-muted">
                Wire transfers, vendor payments, media buys, refunds — routed
                by entity policy. Approver chain reflects the legal structure
                of the committee, not a generic two-step workflow.
              </p>
            </article>

            <article className="border-t border-[var(--color-rule-strong)] pt-5">
              <div className="flex items-center gap-2">
                <EntityMark type="jfc" size={14} tone="primary" />
                <h3 className="font-display text-[22px] leading-[1.2] text-text">
                  Reports due
                </h3>
              </div>
              <p className="mt-3 font-body text-[15px] leading-[1.6] text-text-muted">
                FEC and IRS filing calendar with monthly, quarterly, 24-hour,
                and semi-annual obligations tracked per entity. The filing
                deadline is a first-class object, not a Google Calendar event.
              </p>
            </article>
          </div>

          <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-7 rounded-md overflow-hidden border border-[var(--color-rule-strong)]">
              <Image
                src="/images/dashboard-hero.png"
                alt="Detail of the Unified Treasury Dashboard listing recent activity with FEC transaction IDs and settlement status"
                width={1536}
                height={1024}
                className="block w-full h-auto"
              />
            </div>
            <div className="lg:col-span-5">
              <p className="font-body text-[13px] tracking-[0.08em] uppercase text-text-faint">
                Reference surface
              </p>
              <h3 className="mt-3 font-display text-[28px] leading-[1.15] text-text">
                Recent Activity, with the ledger the law cares about.
              </h3>
              <p className="mt-4 font-body text-[16px] leading-[1.6] text-text-muted">
                Every transaction carries its FEC transaction ID, the entity
                that booked it, the settlement status, and the amount in
                tabular numerals. Auditable from the row up. The status tag is
                a hairline border with a leading dot — never a pill bubble.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== DISTRIBUTION ===== */}
      <section
        id="distribution"
        className="border-b border-[var(--color-rule)] bg-surface"
      >
        <div className="mx-auto max-w-[1200px] px-6 lg:px-10 py-16 lg:py-24">
          <SerifDotRule />
          <h2 className="mt-4 font-display font-medium text-[32px] sm:text-[40px] leading-[1.1] tracking-[-0.01em] text-text max-w-[22ch]">
            Who is using it.
          </h2>

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
            <article>
              <div className="flex items-center gap-2 mb-3">
                <EntityMark type="coalition-pac" size={16} tone="primary" />
                <span className="font-body text-[13px] tracking-[0.08em] uppercase text-text-faint">
                  Coalition PAC
                </span>
              </div>
              <p className="font-body text-[16px] leading-[1.6] text-text">
                A PAC running a coalition campaign across multiple affiliated
                committees. Quartermint sits as the shared treasury layer
                under the operation.
              </p>
            </article>

            <article>
              <div className="flex items-center gap-2 mb-3">
                <EntityMark type="jfc" size={16} tone="primary" />
                <span className="font-body text-[13px] tracking-[0.08em] uppercase text-text-faint">
                  Statewide JFC
                </span>
              </div>
              <p className="font-body text-[16px] leading-[1.6] text-text">
                A statewide treasurer managing a joint fundraising committee
                across candidate and party committees. Cross-entity allocation
                math and 24-hour notice tracking handled by the platform.
              </p>
            </article>

            <article>
              <div className="flex items-center gap-2 mb-3">
                <EntityMark type="501c" size={16} tone="primary" />
                <span className="font-body text-[13px] tracking-[0.08em] uppercase text-text-faint">
                  Compliance Operation
                </span>
              </div>
              <p className="font-body text-[16px] leading-[1.6] text-text">
                A county-level compliance officer filing on time across local
                PACs and 501(c)(4)s. One filing calendar, four entity types,
                zero spreadsheets.
              </p>
            </article>
          </div>

          <div className="mt-14 border-t border-[var(--color-rule-strong)] pt-8 max-w-[58ch]">
            <p className="font-body text-[13px] tracking-[0.08em] uppercase text-text-faint">
              Distribution
            </p>
            <p className="mt-3 font-body text-[17px] leading-[1.6] text-text">
              We are in conversations with the bank that already serves the
              political ops universe. The thesis: treasury infrastructure
              belongs next to the account it manages.
            </p>
          </div>
        </div>
      </section>

      {/* ===== EMBEDDED ASSISTANT ===== */}
      <section
        id="chat-section"
        className="border-b border-[var(--color-rule)]"
      >
        <div className="mx-auto max-w-[1200px] px-6 lg:px-10 py-16 lg:py-24">
          <SerifDotRule />
          <h2 className="mt-4 font-display font-medium text-[32px] sm:text-[40px] leading-[1.1] tracking-[-0.01em] text-text max-w-[20ch]">
            Ask the Quartermint assistant.
          </h2>
          <p className="mt-4 font-body text-[16px] leading-[1.55] text-text-muted max-w-[58ch]">
            Streaming answers about the product, the entity-geometry system,
            FEC compliance posture, and how Quartermint fits a political-ops
            treasury stack. Claude Sonnet under the hood; rate-limited and
            logged.
          </p>
          <div className="mt-10">
            <ChatInterface />
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-bg">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-10 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5" aria-hidden="true">
              <EntityMark type="campaign" size={12} tone="primary" />
              <EntityMark type="coalition-pac" size={12} tone="primary" />
              <EntityMark type="jfc" size={12} tone="primary" />
              <EntityMark type="501c" size={12} tone="primary" />
            </div>
            <span className="font-display text-[16px] text-text">
              Quartermint
            </span>
          </div>
          <p className="font-body text-[13px] text-text-faint">
            ryan@quartermint.com
          </p>
        </div>
      </footer>
    </main>
  )
}
