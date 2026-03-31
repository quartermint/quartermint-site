'use client'

import { featuredSystems } from '@/lib/systems'
import { trackEvent } from '@/lib/tracking'

export function FeaturedSystems() {
  return (
    <div className="space-y-12">
      {featuredSystems.map((system) => {
        const isExternal = system.url?.startsWith('http')

        return (
          <div
            key={system.slug}
            className="flex flex-col sm:flex-row gap-8"
          >
            {/* Problem (left column) */}
            <div className="sm:w-1/2">
              <p className="font-body text-[16px] leading-[1.7] text-text-muted">
                {system.problem}
              </p>
            </div>

            {/* System name + solution (right column) */}
            <div className="sm:w-1/2 border-l-[3px] border-accent pl-6">
              <h3 className="font-display text-[20px] leading-[1.3] text-text">
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
              <p className="font-body text-[14px] leading-[1.7] text-text-muted mt-1">
                {system.oneLiner}
              </p>
              <p className="font-body text-[16px] leading-[1.7] text-text mt-3">
                {system.solution}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
