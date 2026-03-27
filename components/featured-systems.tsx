import { featuredSystems } from '@/lib/systems'
import { TechBadge } from '@/components/tech-badge'

export function FeaturedSystems() {
  return (
    <div className="space-y-8">
      {featuredSystems.map((system) => (
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

          {/* System name + badge + solution (right column) */}
          <div className="sm:w-1/2">
            <h3 className="font-display text-[20px] leading-[1.3] text-text">
              {system.name}
            </h3>
            <div className="mt-1 mb-2">
              <TechBadge badge={system.techBadge} />
            </div>
            <p className="font-body text-[16px] leading-[1.7] text-text-muted font-semibold">
              {system.solution}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
