'use client'

import { featuredSystems } from '@/lib/systems'
import { trackEvent } from '@/lib/tracking'

export function FeaturedSystems() {
  return (
    <div className="space-y-16">
      {featuredSystems.map((system) => {
        const isExternal = system.url?.startsWith('http')

        return (
          <div key={system.slug}>
            {/* Product name + one-liner — full width, leads the entry */}
            <div className="mb-6">
              <h3 className="font-display text-[28px] lg:text-[32px] leading-[1.2] text-text">
                {system.url ? (
                  <a
                    href={system.url}
                    {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className="hover:text-accent transition-colors duration-150"
                    onClick={() => trackEvent('system_click', system.slug)}
                  >
                    {system.name}
                  </a>
                ) : (
                  system.name
                )}
              </h3>
              <p className="font-body text-[16px] leading-[1.5] text-text-muted mt-1">
                {system.oneLiner}
              </p>
            </div>

            {/* Two columns: situation → solution */}
            <div className="flex flex-col sm:flex-row gap-8">
              {/* The situation */}
              <div className="sm:w-1/2">
                <span className="font-body text-[12px] font-semibold uppercase tracking-wider text-text-faint">
                  The situation
                </span>
                <p className="font-body text-[16px] leading-[1.7] text-text-muted mt-2">
                  {system.problem}
                </p>
                {/* Image placeholder — future update */}
              </div>

              {/* What it does */}
              <div className="sm:w-1/2 border-l-[3px] border-accent pl-6">
                <span className="font-body text-[12px] font-semibold uppercase tracking-wider text-accent">
                  What it does
                </span>
                <p className="font-body text-[16px] leading-[1.7] text-text mt-2">
                  {system.solution}
                </p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
