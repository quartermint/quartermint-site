import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy -- Ryan Stern',
  description: 'How quartermint.com handles your data.',
  openGraph: {
    title: 'Privacy -- Ryan Stern',
    description: 'How quartermint.com handles your data.',
    url: 'https://quartermint.com/privacy',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy -- Ryan Stern',
    description: 'How quartermint.com handles your data.',
  },
  alternates: {
    canonical: 'https://quartermint.com/privacy',
  },
}

export default function PrivacyPage() {
  return (
    <div className="max-w-[var(--spacing-invest-max)] mx-auto px-4 sm:px-6 lg:px-8 py-[var(--spacing-section-mobile)] lg:py-[var(--spacing-section-desktop)]">
      <h1 className="font-display text-[32px] leading-[1.2] text-text mb-8">
        Privacy
      </h1>

      <section>
        <h2 className="font-display text-[20px] leading-[1.3] text-text mt-8 mb-4">
          Chat Messages
        </h2>
        <p className="font-body text-[16px] leading-[1.7] text-text-muted">
          Chat messages are logged server-side to improve response quality.
          Messages are not shared with third parties.
        </p>
      </section>

      <section>
        <h2 className="font-display text-[20px] leading-[1.3] text-text mt-8 mb-4">
          Section Tracking
        </h2>
        <p className="font-body text-[16px] leading-[1.7] text-text-muted">
          Which sections you view are tracked anonymously to provide
          context-aware chat responses. This data is not linked to your identity
          unless you provide your email.
        </p>
      </section>

      <section>
        <h2 className="font-display text-[20px] leading-[1.3] text-text mt-8 mb-4">
          Email Collection
        </h2>
        <p className="font-body text-[16px] leading-[1.7] text-text-muted">
          Your email is collected only if you choose to export a conversation.
          It is used solely to send the export and is not added to any mailing
          list.
        </p>
      </section>

      <section>
        <h2 className="font-display text-[20px] leading-[1.3] text-text mt-8 mb-4">
          Cookies
        </h2>
        <p className="font-body text-[16px] leading-[1.7] text-text-muted">
          A 90-day cookie is stored to recognize returning visitors and
          personalize your experience. No advertising or analytics cookies are
          used.
        </p>
      </section>

      <section>
        <h2 className="font-display text-[20px] leading-[1.3] text-text mt-8 mb-4">
          Third-Party Tracking
        </h2>
        <p className="font-body text-[16px] leading-[1.7] text-text-muted">
          quartermint.com does not use third-party tracking, advertising pixels,
          or analytics services that share data with external parties.
        </p>
      </section>
    </div>
  )
}
