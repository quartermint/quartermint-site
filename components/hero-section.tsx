import Image from 'next/image'
import { LivingSignal } from '@/components/living-signal'
import type { CommitInfo } from '@/lib/github'

interface HeroSectionProps {
  signal: CommitInfo | null
}

export function HeroSection({ signal }: HeroSectionProps) {
  return (
    <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
      {/* Headshot -- centered on mobile, right side on desktop */}
      <div className="order-first lg:order-last shrink-0">
        <Image
          src="/images/headshot.jpg"
          alt="Ryan Stern"
          width={160}
          height={160}
          className="rounded-full object-cover object-[center_25%] aspect-square w-20 sm:w-[120px] lg:w-[160px]"
          priority
        />
      </div>

      {/* Text content */}
      <div className="flex-1 text-center lg:text-left">
        <h1 className="font-display text-[32px] lg:text-[48px] leading-[1.2] lg:leading-[1.1] text-text">
          Ryan Stern
        </h1>

        <p className="font-display italic text-[20px] leading-[1.3] text-text-muted mt-2">
          Forward-deployed engineer for campaigns, advocacy, and nonprofits
        </p>

        <div className="mt-3">
          <LivingSignal signal={signal} />
        </div>

        <p className="font-body text-[16px] leading-[1.7] text-text mt-6">
          Your field team has one spreadsheet, advance has another, and the
          principal&apos;s office has a PDF from last week. You spend forty
          minutes on a call syncing information that should have been routed
          automatically.
        </p>

        <p className="font-body text-[16px] leading-[1.7] text-text font-semibold mt-4">
          Fast prototypes, real tools, built by someone who&apos;s been in
          your war room.
        </p>

        <div className="mt-4">
          <a
            href="#contact-section"
            className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] px-6 bg-accent text-on-accent font-body text-[14px] font-semibold rounded-[6px]"
          >
            Contact me
          </a>
        </div>
      </div>
    </div>
  )
}
