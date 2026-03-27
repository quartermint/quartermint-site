import { systems, featuredSystems, shelfSystems } from '@/lib/systems'

export default function Home() {
  return (
    <div className="max-w-[var(--spacing-content-max)] mx-auto px-4 sm:px-6 lg:px-8 py-[var(--spacing-section-mobile)] lg:py-[var(--spacing-section-desktop)]">

      {/* === Section 1: Typography Scale === */}
      <section aria-label="Typography verification" className="mb-16">
        <h1 className="font-display text-[32px] leading-[1.2] text-text mb-2">
          Ryan Stern
        </h1>
        <p className="font-display text-[20px] italic leading-[1.3] text-text-muted mb-6">
          Builder. Operator.
        </p>
        <p className="font-body text-[16px] leading-[1.7] text-text-muted mb-4">
          Body text at 16px / DM Sans / 400 weight / 1.7 line-height. This paragraph validates the
          primary body text style used throughout the site. All colors respond to dark mode via
          prefers-color-scheme media query.
        </p>
        <p className="font-body text-[14px] leading-[1.4] font-semibold text-text-faint uppercase tracking-[1px]">
          Caption / Badge Style — 14px / DM Sans / 600 / Uppercase
        </p>
      </section>

      {/* === Section 2: Color Palette === */}
      <section aria-label="Color palette verification" className="mb-16">
        <h2 className="font-display text-[32px] leading-[1.2] text-text mb-6">
          Color Tokens
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="p-4 rounded-lg bg-bg border border-text-faint/20 min-h-[80px]">
            <span className="font-body text-[14px] font-semibold text-text">bg</span>
            <span className="font-body text-[12px] text-text-faint block mt-1">--color-bg</span>
          </div>
          <div className="p-4 rounded-lg bg-surface min-h-[80px]">
            <span className="font-body text-[14px] font-semibold text-text">surface</span>
            <span className="font-body text-[12px] text-text-faint block mt-1">--color-surface</span>
          </div>
          <div className="p-4 rounded-lg bg-accent min-h-[80px]">
            <span className="font-body text-[14px] font-semibold text-text">accent</span>
            <span className="font-body text-[12px] text-text-faint block mt-1">--color-accent</span>
          </div>
          <div className="p-4 rounded-lg bg-bg border border-text-faint/20 min-h-[80px]">
            <span className="font-body text-[14px] text-text">text</span>
            <span className="font-body text-[12px] text-text-faint block mt-1">--color-text</span>
          </div>
          <div className="p-4 rounded-lg bg-bg border border-text-faint/20 min-h-[80px]">
            <span className="font-body text-[14px] text-text-muted">text-muted</span>
            <span className="font-body text-[12px] text-text-faint block mt-1">--color-text-muted</span>
          </div>
          <div className="p-4 rounded-lg bg-bg border border-text-faint/20 min-h-[80px]">
            <span className="font-body text-[14px] text-text-faint">text-faint</span>
            <span className="font-body text-[12px] text-text-faint block mt-1">--color-text-faint</span>
          </div>
        </div>
      </section>

      {/* === Section 3: Responsive Layout === */}
      <section aria-label="Responsive layout verification" className="mb-16">
        <h2 className="font-display text-[32px] leading-[1.2] text-text mb-6">
          Responsive Breakpoints
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-6 bg-surface rounded-lg">
            <h3 className="font-display text-[20px] leading-[1.3] text-text mb-2">Mobile</h3>
            <p className="font-body text-[14px] text-text-muted">&lt;640px — 16px horizontal padding, single column</p>
          </div>
          <div className="p-6 bg-surface rounded-lg">
            <h3 className="font-display text-[20px] leading-[1.3] text-text mb-2">Tablet</h3>
            <p className="font-body text-[14px] text-text-muted">640-1023px — 24px horizontal padding, 2 columns</p>
          </div>
          <div className="p-6 bg-surface rounded-lg">
            <h3 className="font-display text-[20px] leading-[1.3] text-text mb-2">Desktop</h3>
            <p className="font-body text-[14px] text-text-muted">&gt;=1024px — 1120px max-width centered, 3 columns</p>
          </div>
        </div>
      </section>

      {/* === Section 4: Touch Targets & Focus === */}
      <section aria-label="Interactive elements verification" className="mb-16">
        <h2 className="font-display text-[32px] leading-[1.2] text-text mb-6">
          Interactive Elements
        </h2>
        <p className="font-body text-[14px] text-text-faint mb-4">
          Tab through these elements to verify 2px accent focus rings. All have 44px minimum touch targets.
        </p>
        <div className="flex flex-wrap gap-4">
          <button
            type="button"
            className="min-h-[44px] min-w-[44px] px-6 bg-accent text-text font-body text-[14px] font-semibold rounded-[6px]"
          >
            Explore the systems
          </button>
          <button
            type="button"
            className="min-h-[44px] min-w-[44px] px-6 bg-surface text-text font-body text-[14px] rounded-[6px]"
          >
            Ask me anything
          </button>
          <a
            href="#main-content"
            className="inline-flex items-center min-h-[44px] min-w-[44px] px-6 bg-bg border border-text-faint/20 text-text font-body text-[14px] rounded-[6px]"
          >
            Focusable Link
          </a>
        </div>
      </section>

      {/* === Section 5: Featured Systems (data integration) === */}
      <section aria-label="Featured systems data" className="mb-16 bg-surface -mx-4 sm:-mx-6 lg:mx-0 px-4 sm:px-6 lg:px-0 lg:rounded-lg py-12">
        <div className="lg:px-8">
          <h2 className="font-display text-[32px] leading-[1.2] text-text mb-8">
            Featured Systems ({featuredSystems.length})
          </h2>
          <div className="space-y-8">
            {featuredSystems.map((system) => (
              <div key={system.slug} className="flex flex-col sm:flex-row gap-4 sm:gap-8">
                <div className="sm:w-1/2">
                  <p className="font-body text-[14px] leading-[1.7] text-text-faint">
                    {system.problem}
                  </p>
                </div>
                <div className="sm:w-1/2">
                  <h3 className="font-display text-[20px] leading-[1.3] text-text mb-1">
                    {system.name}
                  </h3>
                  <span className="font-body text-[12px] font-semibold text-text-faint uppercase tracking-[1px] mb-2 inline-block">
                    {system.techBadge}
                  </span>
                  <p className="font-body text-[14px] leading-[1.7] text-text-muted font-semibold">
                    {system.solution}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === Section 6: Shelf Systems (data integration) === */}
      <section aria-label="Systems shelf data" className="mb-16">
        <h2 className="font-display text-[32px] leading-[1.2] text-text mb-6">
          Systems Shelf ({shelfSystems.length})
        </h2>
        <div className="space-y-1">
          {shelfSystems.map((system) => (
            <div
              key={system.slug}
              className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 py-1"
            >
              <div className="flex items-baseline gap-2 shrink-0">
                <span className={`font-body text-[16px] font-semibold ${system.status === 'paused' ? 'text-text-faint' : 'text-text'}`}>
                  {system.name}
                </span>
                {system.isPublic && system.githubUrl && (
                  <a
                    href={system.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text-faint hover:text-text relative inline-flex items-center justify-center w-4 h-4"
                    aria-label={`${system.name} on GitHub`}
                  >
                    {/* 44px touch target via pseudo-element, no layout impact */}
                    <span className="absolute inset-0 -m-[14px]" aria-hidden="true" />
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
                    </svg>
                  </a>
                )}
              </div>
              <span className="font-body text-[14px] font-semibold text-text-faint uppercase tracking-[1px]">
                {system.techBadge}
              </span>
              <span className="font-body text-[14px] text-text-muted flex-1">
                {system.oneLiner}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* === Section 7: Footer Stats (D-07) === */}
      <footer className="text-center py-8 border-t border-text-faint/10">
        <p className="font-body text-[13px] text-text-faint">
          40+ repositories / 894K files indexed / 9 production services
        </p>
      </footer>
    </div>
  )
}
