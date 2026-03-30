export function ContactInvestor() {
  return (
    <div className="max-w-[600px]">
      <h2 className="font-display text-[20px] leading-[1.3] text-text mb-4">
        Let&apos;s talk about what you&apos;re building
      </h2>
      <p className="font-body text-[16px] leading-[1.7] text-text-muted mb-6">
        If you&apos;re running a campaign, managing a PAC, or building an
        advocacy organization, I&apos;d like to hear what&apos;s breaking.
      </p>
      <div className="flex flex-col gap-4">
        <a
          href="https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ2NVNKH4FMghHHM7F5dLn_4OOPj8Yf4LkS55X7KRLB0b8Vw2aCL9cK5Ey9a76O8z5l0E8lS3BX"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] px-6 bg-accent text-text font-body text-[14px] font-semibold rounded-[6px] w-fit"
        >
          Book a time
        </a>
        <a
          href="mailto:ryan@quartermint.com"
          className="font-body text-[14px] text-text-muted hover:text-text"
        >
          ryan@quartermint.com
        </a>
      </div>
      <div className="mt-6">
        <span className="font-body text-[14px] text-text-faint block mb-3">
          Or follow the work
        </span>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/quartermint"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-faint hover:text-text relative inline-flex items-center justify-center min-h-[44px] min-w-[44px]"
            aria-label="quartermint on GitHub"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
          </a>
          <a
            href="https://x.com/ryanstern"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-faint hover:text-text relative inline-flex items-center justify-center min-h-[44px] min-w-[44px]"
            aria-label="Ryan Stern on X"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  )
}
