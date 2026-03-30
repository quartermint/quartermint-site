import Image from 'next/image'
import { LivingSignal } from '@/components/living-signal'
import { ChatCTA } from '@/components/chat/chat-cta'
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
          className="rounded-full object-cover aspect-square w-20 sm:w-[120px] lg:w-[160px]"
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
          Fall 2024: 10,000-person rallies running concurrently, every system
          tracking attendance in Google Sheets. Intake through Google Forms. By
          the end of the cycle, we had a literal tracker of trackers. I watched
          a trip presentation get given six times in one day because every person
          added to the call wouldn&apos;t take authority.
        </p>

        <p className="font-body text-[16px] leading-[1.7] text-text mt-4">
          I&apos;ve been the staffer watching tools break at 2am. I&apos;ve been
          the consultant watching committees grow instead of delegate. Now I
          build the operational infrastructure campaigns actually need. Fast
          prototypes, real tools, built by someone who&apos;s been in your war
          room.
        </p>

        {/* Dual CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <a
            href="#featured-systems"
            className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] px-6 bg-accent text-text font-body text-[14px] font-semibold rounded-[6px]"
          >
            See the tools
          </a>
          <ChatCTA />
        </div>
      </div>
    </div>
  )
}
