import Image from 'next/image'
import { EntityMark } from '@/components/brand/entity-mark'

/**
 * /more — the fuller reveal.
 *
 * The home page is a deliberately opaque credibility card. This page is the
 * "you've earned the real story" version, built from what Quartermint actually
 * is today: a treasury layer whose compliance/filing work is the wedge. Framing
 * and language are the founders' own (treasury layer, true zero, the midnight
 * spreadsheet, automation not AI). Traction is anonymized: no named customers,
 * no real committee dollar figures, only PAC Ops is described as live.
 *
 * Parchment locked (scoped here), noindex inherited from layout metadata.
 */
const PARCHMENT = {
  colorScheme: 'light',
  '--color-bg': '#FAF7EF',
  '--color-surface': '#F2EDDF',
  '--color-surface-subtle': '#EEE8D6',
  '--color-primary': '#0F3D2E',
  '--color-primary-text': '#FAF7EF',
  '--color-accent': '#B8893A',
  '--color-text': '#1C2620',
  '--color-text-muted': '#5E6862',
  '--color-text-faint': '#8A938E',
  '--color-rule': '#D8D2C0',
  '--color-rule-strong': '#B5AE99',
  '--color-success': '#3E7C5A',
} as React.CSSProperties

const CALENDAR = 'https://calendar.app.google/vVCjKkdKjbCKSEQs9'

function DotRule() {
  return (
    <div aria-hidden="true" className="flex items-center gap-2 text-[var(--color-rule-strong)]">
      <span className="font-display text-[20px] leading-none">·</span>
      <span className="block h-px w-12 bg-[var(--color-rule-strong)]" />
    </div>
  )
}

const CASCADE = [
  { strong: 'Every unreported transaction', rest: 'since the last report has to be in the filing, not just the IE itself.' },
  { strong: 'Every donor', rest: 'over the itemization threshold needs a full address, occupation, and employer on file.' },
  { strong: 'Every vendor disbursement', rest: 'needs a line-item purpose and a settled bank reference.' },
  { strong: 'Every receipt', rest: 'tied to a reportable line has to reconcile to the bank statement before submission.' },
]

const PROOF = [
  'A state independent expenditure committee has run treasury and compliance to reconcile and file nearly a dozen reports this cycle, each drafted automatically and submitted by a human.',
  'On a live congressional campaign, the pre-filing review surfaced fourteen issues before the report opened, including one donor over the contribution limit. Each flag was resolved from a queue, on real bank data.',
  'About ten hours of manual work per filing, compressed to roughly one.',
  'Quartermint found and reported a bug in a state’s new filing system. Their own IT team confirmed it, and is working with Quartermint to find and solve their problem.',
]

const DIFF = [
  { k: 'Fundraising-first software', v: 'Most committee tools start from the donor database. The books and the filing are bolted on afterward, and the money position is never the first thing you see.' },
  { k: 'Treasury and budgeting tools', v: 'The tools that do touch treasury depend on manual double entry. The moment one number changes somewhere else, the whole picture is quietly wrong.' },
  { k: 'The people who do it by hand', v: 'The best compliance operators already do all of this manually, and do it well. Quartermint is their leverage: the same judgment, running across thirty committees instead of three.' },
]

export default function More() {
  return (
    <div style={PARCHMENT} className="bg-bg text-text">
      {/* ===== HERO ===== */}
      <section className="border-b border-[var(--color-rule)]">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-10 pt-10 lg:pt-14 pb-14 lg:pb-20">
          <div className="flex items-center justify-between mb-12 lg:mb-16">
            <div className="flex items-center gap-3" aria-hidden="true">
              <EntityMark type="campaign" size={14} tone="primary" />
              <EntityMark type="coalition-pac" size={14} tone="primary" />
              <EntityMark type="jfc" size={14} tone="primary" />
              <EntityMark type="501c" size={14} tone="primary" />
            </div>
            <a href="/" className="font-display font-medium text-[15px] text-primary no-underline transition-colors hover:text-[var(--color-accent)]">
              Quartermint
            </a>
          </div>

          <h1 className="font-display font-medium text-[42px] sm:text-[62px] lg:text-[78px] leading-[1.02] tracking-[-0.018em] text-primary max-w-[15ch]">
            The treasury layer for political money.
          </h1>

          <p className="mt-8 font-body text-[18px] sm:text-[20px] leading-[1.55] text-text-muted max-w-[58ch]">
            Quartermint sits at the intersection of the bank account. It enriches every transaction from the processor and the CRM, categorizes it, and reconciles it. The first thing you see when you log in is the one number that actually matters: how much this committee can spend right now.
          </p>

          <div className="mt-12 lg:mt-16 rounded-md overflow-hidden border border-[var(--color-rule-strong)] shadow-[0_4px_28px_rgba(15,61,46,0.10)] bg-surface">
            <Image
              src="/images/treasury-dashboard.png"
              alt="Quartermint treasury dashboard: a portfolio of a coalition PAC, a campaign, a joint fundraising committee, and a 501(c)(4), with the spendable-now true-zero number, a cash-position trend, approvals pending, and filings due"
              width={1600}
              height={760}
              priority
              className="block w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* ===== PROBLEM: THE MIDNIGHT SPREADSHEET ===== */}
      <section className="border-b border-[var(--color-rule)] bg-surface">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-10 py-16 lg:py-24">
          <DotRule />
          <h2 className="mt-4 font-display font-medium text-[32px] sm:text-[40px] lg:text-[46px] leading-[1.06] tracking-[-0.014em] text-text max-w-[20ch]">
            The whole job runs on four systems that do not talk.
          </h2>
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-9 lg:gap-20">
            <p className="font-body text-[17px] leading-[1.7] text-text">
              The bank, the fundraising platform, the books, and the filing tool. Each one holds a piece of the truth, and none of them agree. Reconciling them is a person&rsquo;s job, and that person is usually a consultant at 11pm before a deadline, stitching it together by hand.
            </p>
            <p className="font-body text-[17px] leading-[1.7] text-text">
              We call it the midnight spreadsheet scramble. It does not scale, it breaks when the person holding the receipt is out with the candidate, and the penalty for getting it wrong can land on a treasurer personally, years after the committee has spent its last dollar.
            </p>
          </div>
        </div>
      </section>

      {/* ===== WHAT IT DOES: AUTOMATION, NOT AI ===== */}
      <section className="border-b border-[var(--color-rule)]">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-10 py-16 lg:py-24">
          <DotRule />
          <h2 className="mt-4 font-display font-medium text-[32px] sm:text-[40px] lg:text-[46px] leading-[1.06] tracking-[-0.014em] text-text">
            It is an automation,<br /><span className="whitespace-nowrap">not AI.</span>
          </h2>
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-9 lg:gap-20">
            <p className="font-body text-[17px] leading-[1.7] text-text">
              Dollar in, dollar out, dollar reported. Quartermint reconciles every transaction deterministically and drafts the filing underneath it. No model deciding what your numbers are, and nothing you cannot audit line by line.
            </p>
            <p className="font-body text-[17px] leading-[1.7] text-text">
              The hero number is the true zero: not the bank balance, but what you can safely commit once the timing is sequenced. What is coming in, what is going out, and when. You can spend on a Friday because the money you are counting on lands before next Friday&rsquo;s bills are due. It is the answer to the only question an operator asks on a Monday: how much can I actually spend. There is a natural-language layer on top if you want to ask questions, but the crux is the automation.
            </p>
          </div>
        </div>
      </section>

      {/* ===== THE CASCADE ===== */}
      <section className="border-b border-[var(--color-rule)] bg-surface">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-10 py-16 lg:py-24">
          <DotRule />
          <h2 className="mt-4 font-display font-medium text-[32px] sm:text-[40px] lg:text-[46px] leading-[1.06] tracking-[-0.014em] text-text max-w-[22ch]">
            The job is not moving the money. It is knowing what moving it triggers.
          </h2>
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-9 lg:gap-20">
            <p className="font-body text-[17px] leading-[1.7] text-text">
              When a coalition PAC drops <em className="font-display italic">$10,000</em> on an independent expenditure in Maryland, the filing it triggers is not just that $10,000. It is every other transaction the committee has run since the last report. The IE is the headline. The supporting cast is the work.
            </p>
            <p className="font-body text-[17px] leading-[1.7] text-text">
              Today that supporting cast gets built at 11pm by a treasurer making chase calls for an employer and an address. Quartermint finds the data before the trigger fires, so when the report opens, the filing is already underneath it.
            </p>
          </div>

          <div className="mt-14 rounded-md border border-[var(--color-rule-strong)] bg-bg p-7 lg:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-5 sm:gap-8 items-start">
              <div className="font-mono text-[11px] tracking-[0.10em] uppercase text-text-faint whitespace-nowrap pt-0.5">
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
                      <span><strong className="font-medium text-text">{row.strong}</strong> {row.rest}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PROOF ===== */}
      <section className="border-b border-[var(--color-rule)]">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-10 py-16 lg:py-24">
          <DotRule />
          <h2 className="mt-4 font-display font-medium text-[32px] sm:text-[40px] lg:text-[46px] leading-[1.06] tracking-[-0.014em] text-text max-w-[18ch]">
            In production, on real money.
          </h2>
          <p className="mt-4 font-body text-[17px] leading-[1.6] text-text-muted max-w-[56ch]">
            One product is live with real customers today. The rest of the family is in active design with partners. Here is what the live product has already done.
          </p>

          <div className="mt-12 rounded-md overflow-hidden border border-[var(--color-rule-strong)] shadow-[0_4px_28px_rgba(15,61,46,0.10)] bg-surface">
            <Image
              src="/images/compliance-review.png"
              alt="Quartermint pre-filing compliance review: a queue of fourteen flags with nine cleared, including a contribution over the primary limit, itemized donors missing employer data, a disbursement missing its purpose, and an unreconciled receipt, each with a resolve action"
              width={1500}
              height={864}
              className="block w-full h-auto"
            />
          </div>

          <ul className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-7">
            {PROOF.map((p, i) => (
              <li key={i} className="grid grid-cols-[auto_1fr] gap-4 items-baseline">
                <span className="font-mono text-[12px] text-[var(--color-accent)] tabular-nums pt-1">{String(i + 1).padStart(2, '0')}</span>
                <p className="font-body text-[16px] leading-[1.6] text-text">{p}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ===== WHO IT'S FOR ===== */}
      <section className="border-b border-[var(--color-rule)] bg-surface">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-10 py-16 lg:py-24">
          <DotRule />
          <h2 className="mt-4 font-display font-medium text-[32px] sm:text-[40px] lg:text-[46px] leading-[1.06] tracking-[-0.014em] text-text max-w-[20ch]">
            Built for the people who already do this by hand.
          </h2>
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-9 lg:gap-20">
            <p className="font-body text-[17px] leading-[1.7] text-text">
              The first customer is the compliance consultant running a book of clients. Win one, and you reach the twenty committees they carry. The second is the solo operator running a PAC without a back office.
            </p>
            <p className="font-body text-[17px] leading-[1.7] text-text">
              These are not people who want to learn new software. They are people who have perfected a twenty-year process on a bank portal, a spreadsheet, and a filing tool. Quartermint is that process, digitized. You are the market, digitizing yourself.
            </p>
          </div>
        </div>
      </section>

      {/* ===== WHY NOW ===== */}
      <section className="border-b border-[var(--color-rule)]">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-10 py-16 lg:py-24">
          <DotRule />
          <h2 className="mt-4 font-display font-medium text-[32px] sm:text-[40px] lg:text-[46px] leading-[1.06] tracking-[-0.014em] text-text max-w-[12ch]">
            Why now.
          </h2>
          <p className="mt-10 font-body text-[17px] leading-[1.7] text-text max-w-[62ch]">
            The tool most of the field was built on has changed hands. When NGP VAN was acquired, the incumbent that political infrastructure quietly depended on became something operators no longer trust by default. They are running searches for a replacement, and money is moving to fund one. Everyone is racing to rebuild the fundraising CRM. Quartermint is building the treasury layer underneath it.
          </p>
        </div>
      </section>

      {/* ===== HOW IT'S DIFFERENT ===== */}
      <section className="border-b border-[var(--color-rule)] bg-surface">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-10 py-16 lg:py-24">
          <DotRule />
          <h2 className="mt-4 font-display font-medium text-[32px] sm:text-[40px] lg:text-[46px] leading-[1.06] tracking-[-0.014em] text-text max-w-[16ch]">
            There are other tools. None sit here.
          </h2>
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12">
            {DIFF.map((d) => (
              <article key={d.k} className="border-t border-[var(--color-rule-strong)] pt-5">
                <h3 className="font-display font-medium text-[20px] leading-[1.2] tracking-[-0.003em] text-text">{d.k}</h3>
                <p className="mt-3.5 font-body text-[15px] leading-[1.65] text-text-muted">{d.v}</p>
              </article>
            ))}
          </div>
          <p className="mt-12 font-body text-[17px] leading-[1.7] text-text max-w-[62ch]">
            Nobody combines bank distribution, treasury-first reconciliation, FEC and state compliance, and multi-client operation for the firms that run many committees at once. That intersection is the whole point.
          </p>
        </div>
      </section>

      {/* ===== CONTACT ===== */}
      <section className="border-b border-[var(--color-rule)]">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-10 py-16 lg:py-20">
          <DotRule />
          <h2 className="mt-4 font-display font-medium text-[28px] sm:text-[34px] lg:text-[40px] leading-[1.08] tracking-[-0.012em] text-text max-w-[18ch]">
            See it on your own committees.
          </h2>
          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
            <a
              href={CALENDAR}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block font-mono text-[13px] tracking-[0.06em] uppercase text-primary-text bg-[var(--color-primary)] px-6 py-3.5 rounded-[3px] no-underline transition-colors hover:bg-[var(--color-text)]"
            >
              Book a time
            </a>
            <a
              href="mailto:hello@quartermint.com"
              className="font-mono text-[14px] text-primary border-b border-[var(--color-rule-strong)] pb-0.5 transition-colors hover:border-[var(--color-accent)]"
            >
              hello@quartermint.com
            </a>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="mx-auto w-full max-w-[1200px] px-6 lg:px-10 py-[22px] flex items-center justify-between gap-4">
        <a href="/" className="font-display font-medium text-[15px] text-primary no-underline">Quartermint</a>
        <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-text-faint">
          The first of several
        </span>
      </footer>
    </div>
  )
}
