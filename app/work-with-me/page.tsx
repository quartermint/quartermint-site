import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Work With Me -- Ryan Stern',
  description: 'Forward-deployed engineering for campaigns, advocacy, and nonprofits.',
  openGraph: {
    title: 'Work With Me -- Ryan Stern',
    description: 'Forward-deployed engineering for campaigns, advocacy, and nonprofits.',
    url: 'https://quartermint.com/work-with-me',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Work With Me -- Ryan Stern',
    description: 'Forward-deployed engineering for campaigns, advocacy, and nonprofits.',
  },
  alternates: {
    canonical: 'https://quartermint.com/work-with-me',
  },
}

export default function WorkWithMePage() {
  return (
    <div className="max-w-[var(--spacing-invest-max)] mx-auto px-4 sm:px-6 lg:px-8 py-[var(--spacing-section-mobile)] lg:py-[var(--spacing-section-desktop)]">
      <h1 className="font-display text-[32px] leading-[1.2] text-text mb-8">
        What I Build For You
      </h1>

      <blockquote className="border-l-[3px] border-accent pl-6 my-8">
        <p className="font-display italic text-[20px] leading-[1.3] text-text">
          Information doesn&apos;t fail because it doesn&apos;t exist. It fails
          because it reaches the wrong person, in the wrong form, at the wrong
          time.
        </p>
      </blockquote>

      <h2 className="font-display text-[20px] leading-[1.3] text-text mt-12 mb-4">
        Who I Work With
      </h2>
      <p className="font-body text-[16px] leading-[1.7] text-text-muted mb-4">
        Campaigns, PACs, C4s, advocacy organizations, and nonprofits. If your
        team is tracking operations in spreadsheets that weren&apos;t built for
        what you&apos;re asking them to do, and you&apos;re losing time to
        tools instead of gaining it, that&apos;s where I come in.
      </p>

      <h2 className="font-display text-[20px] leading-[1.3] text-text mt-12 mb-4">
        How We Work Together
      </h2>
      <div className="space-y-4">
        <p className="font-body text-[16px] leading-[1.7] text-text-muted">
          <span className="font-semibold text-text">1. Start with the problem, not the tool.</span>{' '}
          Tell me what&apos;s breaking. What takes too long. Where the
          information gets stuck. I&apos;ve been on your side of the table
          enough times to know the symptoms.
        </p>
        <p className="font-body text-[16px] leading-[1.7] text-text-muted">
          <span className="font-semibold text-text">2. Rapid prototype, test with your team.</span>{' '}
          I build fast. Within days, not months. We put the tool in front of
          your people and see if it actually solves the problem under
          operational load.
        </p>
        <p className="font-body text-[16px] leading-[1.7] text-text-muted">
          <span className="font-semibold text-text">3. Iterate until it works.</span>{' '}
          Not until it looks good in a demo. Until it works at 2am on filing
          day, when the stakes are real and nobody has time to troubleshoot.
        </p>
      </div>

      <h2 className="font-display text-[20px] leading-[1.3] text-text mt-12 mb-4">
        What I Bring
      </h2>
      <p className="font-body text-[16px] leading-[1.7] text-text-muted mb-4">
        The combination of having been the staffer (Biden-Harris 2024, advance
        work), the consultant (New Deal Strategies, Battle Born Collective,
        Searchlight Institute), and now the builder (40+ repositories,
        production tools). Not just someone who can code; someone who has sat in
        the chair and felt the tools break.
      </p>
      <p className="font-body text-[16px] leading-[1.7] text-text-muted mb-4">
        I&apos;ve been the treasurer reconciling bank data against compliance
        reports by hand. I&apos;ve been the trips director watching event
        logistics tracked in Google Sheets that were built for thirty people and
        serving three hundred. I built tools to fix the problems I lived through.
      </p>

      <p className="font-body text-[16px] text-text-muted mt-12 mb-4">
        If this sounds like your world, let&apos;s talk.
      </p>
      <a
        href="https://calendar.app.google/kQD52ja6x24rATbM8"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] px-6 bg-accent text-text font-body text-[14px] font-semibold rounded-[6px]"
      >
        Book a time
      </a>
    </div>
  )
}
