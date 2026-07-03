import { EntityMark } from '@/components/brand/entity-mark'

/**
 * Homepage — minimal credibility card (Editorial Treasury).
 *
 * Deliberately opaque: no product detail, no dashboard, no chat. The job of this
 * page is to signal a serious company when someone types quartermint.com after
 * getting an email from an @quartermint.com address. The political read is a
 * faint whiff carried by the copy ("campaigns, advocacy organizations"); the
 * four entity marks are quiet visual texture, not a claimed taxonomy.
 *
 * Locked to Parchment (light) regardless of system theme — the color vars are
 * redefined on the root element so the site-wide dark-mode tokens can't flip
 * this page. Scoped here so /lm, /fi, /fi-epic keep their own theming.
 */
const PARCHMENT = {
  colorScheme: 'light',
  '--color-bg': '#FAF7EF',
  '--color-surface': '#F2EDDF',
  '--color-primary': '#0F3D2E',
  '--color-accent': '#B8893A',
  '--color-text': '#1C2620',
  '--color-text-muted': '#5E6862',
  '--color-text-faint': '#8A938E',
  '--color-rule': '#D8D2C0',
  '--color-rule-strong': '#B5AE99',
} as React.CSSProperties

export default function Home() {
  return (
    <div style={PARCHMENT} className="min-h-screen flex flex-col bg-bg text-text">
      <main className="flex-1 flex flex-col justify-center mx-auto w-full max-w-[1200px] px-7 sm:px-12 lg:px-[120px]">
        {/* Eyebrow: entity marks as quiet visual texture + wordmark */}
        <div className="flex items-center gap-3 mb-14">
          <div className="flex items-center gap-3" aria-hidden="true">
            <EntityMark type="campaign" size={15} tone="primary" />
            <EntityMark type="coalition-pac" size={15} tone="primary" />
            <EntityMark type="jfc" size={15} tone="primary" />
            <EntityMark type="501c" size={15} tone="primary" />
          </div>
          <span className="ml-1.5 font-mono text-[12px] tracking-[0.28em] uppercase text-text-muted">
            Quartermint
          </span>
        </div>

        <h1 className="font-display text-[40px] sm:text-[64px] lg:text-[82px] leading-[1.02] tracking-[-0.015em] text-primary max-w-[16ch]">
          One ledger for the whole operation.
        </h1>

        <p className="mt-8 font-body text-[16px] sm:text-[18px] lg:text-[19px] leading-[1.6] text-text-muted max-w-[48ch]">
          Treasury and reconciliation software for campaigns, advocacy
          organizations, and the money that moves around them.
        </p>

        <div className="mt-[52px] h-px w-full max-w-[640px] bg-[var(--color-rule)]" />
        <a
          href="mailto:hello@quartermint.com"
          className="mt-7 self-start font-mono text-[14px] text-primary border-b border-[var(--color-rule-strong)] pb-0.5 transition-colors hover:border-[var(--color-accent)]"
        >
          hello@quartermint.com
        </a>
      </main>

      <footer className="mx-auto w-full max-w-[1200px] px-7 sm:px-12 lg:px-[120px] py-[22px] flex items-center justify-between gap-4 border-t border-[var(--color-rule)]">
        <span className="font-display font-medium text-[15px] text-primary">
          Quartermint
        </span>
        <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-text-faint">
          Available by introduction
        </span>
      </footer>
    </div>
  )
}
