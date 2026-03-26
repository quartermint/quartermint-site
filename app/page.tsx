export default function Home() {
  return (
    <div className="max-w-[var(--spacing-content-max)] mx-auto px-4 sm:px-6 lg:px-8 py-[var(--spacing-section-mobile)] lg:py-[var(--spacing-section-desktop)]">
      {/* Typography verification */}
      <h1 className="font-display text-[32px] leading-[1.2] text-text mb-4">
        Ryan Stern
      </h1>
      <p className="font-display text-[20px] italic leading-[1.3] text-text-muted mb-8">
        Builder. Operator.
      </p>
      <p className="font-body text-[16px] leading-[1.7] text-text-muted mb-8">
        Design system verification page. This text uses DM Sans at 16px body size.
        All colors below should change when your system switches to dark mode.
      </p>

      {/* Color token verification */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        <div className="p-4 bg-bg border border-text-faint/20 rounded-lg">
          <span className="font-body text-[14px] font-semibold text-text">bg</span>
        </div>
        <div className="p-4 bg-surface rounded-lg">
          <span className="font-body text-[14px] font-semibold text-text">surface</span>
        </div>
        <div className="p-4 bg-accent rounded-lg">
          <span className="font-body text-[14px] font-semibold text-text">accent</span>
        </div>
        <div className="p-4 bg-bg border border-text-faint/20 rounded-lg">
          <span className="text-text font-body text-[14px]">text</span>
        </div>
        <div className="p-4 bg-bg border border-text-faint/20 rounded-lg">
          <span className="text-text-muted font-body text-[14px]">text-muted</span>
        </div>
        <div className="p-4 bg-bg border border-text-faint/20 rounded-lg">
          <span className="text-text-faint font-body text-[14px]">text-faint</span>
        </div>
      </div>

      {/* Touch target / focus verification */}
      <div className="flex flex-wrap gap-4">
        <button
          type="button"
          className="min-h-[44px] min-w-[44px] px-4 bg-accent text-text font-body text-[14px] font-semibold rounded-[6px]"
        >
          44px Touch Target
        </button>
        <a
          href="#main-content"
          className="inline-flex items-center min-h-[44px] min-w-[44px] px-4 bg-surface text-text font-body text-[14px] rounded-[6px]"
        >
          Focusable Link
        </a>
      </div>
    </div>
  )
}
