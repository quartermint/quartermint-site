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
          Builder. Operator.
        </p>

        <div className="mt-3">
          <LivingSignal signal={signal} />
        </div>

        <p className="font-body text-[16px] leading-[1.7] text-text mt-6">
          Twenty years in political operations. Campaigns, congressional offices,
          scheduling teams where five people looked at the same event and nobody
          got the version they actually needed. The problem was never that the
          information didn&apos;t exist. Someone got fifty pages when they needed
          two. An email chain hit thirty replies when one person needed to make a
          call.
        </p>

        <p className="font-body text-[16px] leading-[1.7] text-text mt-4">
          So the tools got built. Nine services, forty repositories, open-source
          projects, a platform that makes a decade of email and photos actually
          searchable. The pattern was the same every time. The tools are too.
        </p>

        {/* Dual CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <a
            href="#featured-systems"
            className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] px-6 bg-accent text-text font-body text-[14px] font-semibold rounded-[6px]"
          >
            Explore the systems
          </a>
          <ChatCTA />
        </div>
      </div>
    </div>
  )
}
