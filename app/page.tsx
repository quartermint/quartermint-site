import Image from 'next/image'
import { EntityMark } from '@/components/brand/entity-mark'
import { ChatInterface } from '@/components/chat/chat-interface'

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

const FLOOR_LIVE = {
  type: 'coalition-pac' as const,
  who: 'Statewide IE Committee',
  what: 'Donation enrichment to regulatory filing pipeline. Donor address and occupation data captured and reconciled against state IE report requirements before the report is opened.',
}

const FLOOR_DESIGN = [
  {
    type: '501c' as const,
    who: 'Compliance Firm',
    what: 'Multi-client filing calendar and information-chase flagging across federal and state committees. Surfaces the missing donor and vendor data before the deadline calls start.',
  },
  {
    type: 'campaign' as const,
    who: 'Candidate Strategy Firm',
    what: 'The same organized data, surfaced as qualitative insight for an operator carrying many candidates — segments, top-of-list donors, and audit posture across an entire book of clients.',
  },
]

const CASCADE = [
  { strong: 'Every unreported transaction', rest: 'since the last report has to be in the filing — not just the IE itself.' },
  { strong: 'Every donor', rest: 'over the itemization threshold needs a full address, occupation, and employer on file.' },
  { strong: 'Every vendor disbursement', rest: 'needs a line-item purpose and a settled bank reference.' },
  { strong: 'Every receipt', rest: 'tied to a reportable line has to reconcile to the bank statement before submission.' },
]

const PROOF = [
  {
    type: 'campaign' as const,
    title: 'One cash position',
    body: 'Total cash across every committee on one screen — the number you need for a Monday morning walkthrough, without a spreadsheet refresh first.',
  },
  {
    type: 'coalition-pac' as const,
    title: 'Donor data found before it’s asked for',
    body: 'Address, occupation, and employer enrichment runs in the background as contributions land — so when the filing window opens, the line items are already complete instead of the start of a chase list.',
  },
  {
    type: 'jfc' as const,
    title: 'Filings as deliverables, not reminders',
    body: 'FEC and state deadlines per committee — monthly, quarterly, 24-hour, semi-annual, Form 990. Each filing is a piece of work with a status and an owner.',
  },
]

export default function Home() {
  return (
    <main className="bg-bg text-text">
      {/* ===== HERO ===== */}
      <section className="border-b border-[var(--color-rule)]">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-10 pt-16 lg:pt-24 pb-12 lg:pb-20">
          <div className="flex items-center gap-3 mb-10">
            <div className="flex items-center gap-1.5" aria-hidden="true">
              <EntityMark type="campaign" size={14} tone="primary" />
              <EntityMark type="coalition-pac" size={14} tone="primary" />
              <EntityMark type="jfc" size={14} tone="primary" />
              <EntityMark type="501c" size={14} tone="primary" />
            </div>
            <span className="font-body text-[13px] tracking-[0.10em] uppercase text-text-muted">
              Multi-Entity Treasury for Public Affairs
            </span>
          </div>

          <h1 className="font-display font-medium text-[44px] sm:text-[64px] lg:text-[84px] leading-[1.02] tracking-[-0.018em] text-text max-w-[18ch]">
            Cashflow infrastructure for the applications political pros actually run.
          </h1>

          <p className="mt-8 font-body text-[18px] sm:text-[20px] leading-[1.55] text-text-muted max-w-[56ch]">
            Quartermint is one ledger across campaigns, coalition PACs, joint fundraising committees, and 501(c)s. Cross-entity cash position, approvals routed by the policy each committee actually uses, and FEC and state filings that already know what they&rsquo;re going to ask you for.
          </p>

          {/* Hero photography: real Editorial Treasury dashboard render */}
          <div className="mt-12 lg:mt-16 rounded-md overflow-hidden border border-[var(--color-rule-strong)] shadow-[0_4px_28px_rgba(15,61,46,0.10)] bg-surface">
            <Image
              src="/images/dashboard-hero.png"
              alt="Quartermint Unified Treasury Dashboard — total cash position across a campaign, a coalition PAC, a joint fundraising committee, and a 501(c)(4), with approvals pending and reports due"
              width={1536}
              height={1024}
              priority
              className="block w-full h-auto"
            />
          </div>
          <p className="mt-3 font-display italic text-[14px] text-text-faint">
            Unified Treasury Dashboard. Cash position, approvals, and filings &mdash; across every entity in a portfolio.
          </p>
        </div>
      </section>

      {/* ===== COMMERCIAL FLOOR (two tiers) ===== */}
      <section className="border-b border-[var(--color-rule)] bg-surface">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-10 py-10">
          {/* Running live */}
          <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-6 lg:gap-14 items-start">
            <div className="font-body text-[12px] tracking-[0.10em] uppercase text-text-faint pt-1">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--color-success)] mr-2 align-middle" />
              Running live
            </div>
            <div className="max-w-[520px]">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2.5">
                  <EntityMark type={FLOOR_LIVE.type} size={14} tone="primary" />
                  <span className="font-display font-medium text-[19px] tracking-[-0.003em] text-text">
                    {FLOOR_LIVE.who}
                  </span>
                </div>
                <p className="font-body text-[14px] leading-[1.55] text-text-muted">
                  {FLOOR_LIVE.what}
                </p>
              </div>
            </div>
          </div>

          {/* In active design */}
          <div className="mt-8 pt-8 border-t border-[var(--color-rule)] grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-6 lg:gap-14 items-start">
            <div className="font-body text-[12px] tracking-[0.10em] uppercase text-text-faint pt-1">
              In active design
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10">
              {FLOOR_DESIGN.map((item) => (
                <div key={item.who} className="flex flex-col gap-2">
                  <div className="flex items-center gap-2.5">
                    <EntityMark type={item.type} size={14} tone="primary" />
                    <span className="font-display font-medium text-[19px] tracking-[-0.003em] text-text">
                      {item.who}
                    </span>
                  </div>
                  <p className="font-body text-[14px] leading-[1.55] text-text-muted">
                    {item.what}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== THE JOB (reframed: triggers, not money movement) ===== */}
      <section id="product" className="border-b border-[var(--color-rule)] bg-surface">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-10 py-16 lg:py-24">
          <SerifDotRule />
          <h2 className="mt-4 font-display font-medium text-[32px] sm:text-[40px] lg:text-[44px] leading-[1.08] tracking-[-0.012em] text-text max-w-[22ch]">
            The job isn&rsquo;t moving the money. It&rsquo;s knowing what moving it triggers.
          </h2>

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-9 lg:gap-20">
            <p className="font-body text-[17px] leading-[1.7] text-text">
              When a coalition PAC drops <em className="font-display italic">$10,000</em> on an independent expenditure in Maryland, the filing it triggers isn&rsquo;t just that $10,000. It&rsquo;s every other transaction the committee has run since the last report &mdash; every donor name with a complete address, occupation, and employer, every vendor disbursement with a line item, every receipt tied to a reportable check. The IE is the headline. The supporting cast is the work.
            </p>
            <p className="font-body text-[17px] leading-[1.7] text-text">
              Today the supporting cast gets built at 11pm by a treasurer making chase calls to donors for an employer and a ZIP code, hand-stitching vendor invoices, and praying the bank statement and the accounting tool agree. Quartermint finds that data before the trigger fires &mdash; donor enrichment for address and occupation, vendor matching, bank reconciliation &mdash; so when the report opens, the filing is already underneath it.
            </p>
          </div>

          {/* Cascade pictogram */}
          <div className="mt-14 rounded-md border border-[var(--color-rule-strong)] bg-bg p-7 lg:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-5 sm:gap-8 items-start">
              <div className="font-body text-[11px] tracking-[0.10em] uppercase text-text-faint whitespace-nowrap pt-0.5">
                Trigger &rarr;
              </div>
              <div>
                <div className="font-display italic text-[22px] leading-[1.25] tracking-[-0.005em] text-text">
                  A coalition PAC makes a qualifying <span className="not-italic font-display font-medium tabular-nums">$10,000</span> expense in Maryland.
                </div>
                <ul className="mt-5 grid gap-3">
                  {CASCADE.map((row) => (
                    <li key={row.strong} className="grid grid-cols-[18px_1fr] items-baseline gap-3 font-body text-[15px] leading-[1.55] text-text-muted">
                      <span className="font-display text-[14px] text-[var(--color-rule-strong)]">&#x21B3;</span>
                      <span>
                        <strong className="font-medium text-text">{row.strong}</strong> {row.rest}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PRODUCT PROOF ===== */}
      <section className="border-b border-[var(--color-rule)]">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-10 py-16 lg:py-24">
          <SerifDotRule />
          <h2 className="mt-4 font-display font-medium text-[32px] sm:text-[40px] lg:text-[44px] leading-[1.08] tracking-[-0.012em] text-text">
            What that looks like in the product.
          </h2>

          <div className="mt-14 grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12">
            {PROOF.map((card) => (
              <article key={card.title} className="border-t border-[var(--color-rule-strong)] pt-5">
                <div className="flex items-center gap-2.5">
                  <EntityMark type={card.type} size={14} tone="primary" />
                  <h3 className="font-display font-medium text-[22px] leading-[1.2] tracking-[-0.003em] text-text">
                    {card.title}
                  </h3>
                </div>
                <p className="mt-3.5 font-body text-[15px] leading-[1.65] text-text-muted">
                  {card.body}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-20 grid grid-cols-1 lg:grid-cols-12 gap-9 lg:gap-14 items-center">
            <div className="lg:col-span-7 rounded-md overflow-hidden border border-[var(--color-rule-strong)] bg-surface">
              <Image
                src="/images/recent-activity-detail.png"
                alt="Recent Activity ledger detail: each transaction shows its entity mark, FEC transaction ID, amount in tabular numerals (italic Fraunces for negative deltas), and a hairline status tag"
                width={920}
                height={510}
                className="block w-full h-auto"
              />
            </div>
            <div className="lg:col-span-5">
              <p className="font-body text-[12px] tracking-[0.10em] uppercase text-text-faint">
                Reference surface
              </p>
              <h3 className="mt-3 font-display font-medium text-[28px] lg:text-[30px] leading-[1.12] tracking-[-0.008em] text-text max-w-[18ch]">
                By the time the filing window opens, the work is already done.
              </h3>
              <p className="mt-4 font-body text-[16px] leading-[1.65] text-text-muted max-w-[38ch]">
                Every transaction has the committee it belongs to, the bank reference, and the line it rolls up to in the next report. When the deadline arrives, the draft is sitting there for a treasurer to review &mdash; not a four-day spreadsheet sprint and a phone tree of donor chase calls.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== EMBEDDED ASSISTANT ===== */}
      <section id="assistant" className="border-b border-[var(--color-rule)] bg-surface">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-10 py-16 lg:py-24">
          <SerifDotRule />
          <h2 className="mt-4 font-display font-medium text-[32px] sm:text-[40px] lg:text-[44px] leading-[1.08] tracking-[-0.012em] text-text max-w-[20ch]">
            Ask the Quartermint assistant.
          </h2>
          <p className="mt-4 font-body text-[17px] leading-[1.6] text-text-muted max-w-[60ch]">
            Streaming answers about the product, how each entity type maps to a filing obligation, and how Quartermint fits a political-ops treasury stack.
          </p>
          <div className="mt-10">
            <ChatInterface />
          </div>
        </div>
      </section>

      {/* ===== CONTACT ===== */}
      <section id="contact" className="border-b border-[var(--color-rule)]">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-10 py-16 lg:py-20">
          <SerifDotRule />
          <h3 className="mt-4 font-display font-medium text-[24px] sm:text-[28px] lg:text-[32px] tracking-[-0.008em] text-text">
            Contact directly for more info:
          </h3>
          <a
            href="mailto:hello@quartermint.com"
            className="mt-4 inline-block font-display italic text-[22px] text-[var(--color-primary)] border-b border-[var(--color-rule-strong)] pb-0.5 hover:text-[var(--color-accent)] hover:border-[var(--color-accent)] transition-colors"
          >
            hello@quartermint.com
          </a>
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
          <div className="flex items-center gap-4 font-body text-[13px] text-text-faint">
            <span>Multi-Entity Treasury for Public Affairs</span>
            <span className="text-[var(--color-rule-strong)]">·</span>
            <a href="mailto:hello@quartermint.com" className="hover:text-text">
              hello@quartermint.com
            </a>
          </div>
        </div>
      </footer>
    </main>
  )
}
