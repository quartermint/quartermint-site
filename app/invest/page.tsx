import type { Metadata } from 'next'
import { InvestHeading } from '@/components/invest-heading'

export const metadata: Metadata = {
  title: 'Invest -- Ryan Stern',
  description:
    'Information infrastructure for high-stakes environments. 40+ repositories, 9 production services.',
  openGraph: {
    title: 'Invest -- Ryan Stern',
    description:
      'Information infrastructure for high-stakes environments. 40+ repositories, 9 production services.',
    url: 'https://quartermint.com/invest',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Invest -- Ryan Stern',
    description:
      'Information infrastructure for high-stakes environments. 40+ repositories, 9 production services.',
  },
  alternates: {
    canonical: 'https://quartermint.com/invest',
  },
}

const stats = [
  { value: '40+', label: 'repositories' },
  { value: '9', label: 'production services' },
  { value: '6', label: 'open-source projects' },
  { value: '894K', label: 'files indexed' },
  { value: '452K', label: 'messages searchable' },
  { value: '395', label: 'tests' },
]

export default function InvestPage() {
  return (
    <div className="max-w-[var(--spacing-invest-max)] mx-auto px-4 sm:px-6 lg:px-8 py-[var(--spacing-section-mobile)] lg:py-[var(--spacing-section-desktop)]">
      <InvestHeading />

      <blockquote className="border-l-[3px] border-accent pl-6 my-8">
        <p className="font-display italic text-[20px] leading-[1.3] text-text">
          Information doesn&apos;t fail because it doesn&apos;t exist. It fails
          because it reaches the wrong person, in the wrong form, at the wrong
          time. I build the infrastructure that fixes that.
        </p>
      </blockquote>

      <div className="grid grid-cols-3 gap-6 my-8">
        {stats.map((stat) => (
          <div key={stat.label}>
            <p className="font-body text-[24px] font-semibold text-text">
              {stat.value}
            </p>
            <p className="font-body text-[14px] text-text-muted">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      <h2 className="font-display text-[20px] leading-[1.3] text-text mt-12 mb-4">
        Where It&apos;s Going
      </h2>
      <p className="font-body text-[16px] leading-[1.7] text-text-muted mb-4">
        Relay started as a way to keep teams moving when the one person everyone
        needed couldn&apos;t be in the room. It ingests how you communicate --
        your messages, your meeting patterns, your decision-making instincts --
        and carries that context forward so your team doesn&apos;t stall. The
        technology works. The question now is what it becomes.
      </p>
      <p className="font-body text-[16px] leading-[1.7] text-text-muted">
        The same architecture that powers a personal AI proxy can power any
        persona that needs to be operationally present without being physically
        available. That&apos;s the framework: identity-aware infrastructure
        that routes the right information to the right person in the right form.
        Relay is the first implementation. It won&apos;t be the last.
      </p>

      <h2 className="font-display text-[20px] leading-[1.3] text-text mt-12 mb-4">
        Background
      </h2>
      <p className="font-body text-[16px] leading-[1.7] text-text-muted">
        A decade in political operations -- presidential campaigns, congressional
        offices, advance teams -- taught me that information failures aren&apos;t
        knowledge problems. They&apos;re routing problems. The right data existed
        but reached the wrong person, in the wrong format, at the wrong time. I
        left politics and started building the infrastructure I wished had existed:
        nine services, forty-plus repositories, and a thesis that holds across
        every domain I&apos;ve touched.
      </p>

      <p className="font-body text-[16px] text-text-muted mt-12 mb-4">
        If this resonates, let&apos;s talk.
      </p>
      <a
        href="https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ2NVNKH4FMghHHM7F5dLn_4OOPj8Yf4LkS55X7KRLB0b8Vw2aCL9cK5Ey9a76O8z5l0E8lS3BX"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] px-6 bg-accent text-text font-body text-[14px] font-semibold rounded-[6px]"
      >
        Book a time
      </a>
    </div>
  )
}
