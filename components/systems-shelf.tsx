import { shelfSystems } from '@/lib/systems'

function TechBadge({ badge }: { badge: string }) {
  return (
    <span className="font-body text-[14px] font-semibold text-text-faint uppercase tracking-[1px]">
      {badge}
    </span>
  )
}

export function SystemsShelf() {
  return (
    <div className="space-y-1">
      {shelfSystems.map((system) => (
        <div
          key={system.slug}
          className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 py-1"
        >
          <div className="flex items-baseline gap-2 shrink-0">
            <span
              className={`font-body text-[16px] font-semibold ${system.status === 'paused' ? 'text-text-faint' : 'text-text'}`}
            >
              {system.name}
            </span>
            {system.isPublic && system.githubUrl && (
              <a
                href={system.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-faint hover:text-text relative inline-flex items-center justify-center w-4 h-4"
                aria-label={`${system.name} on GitHub`}
              >
                {/* 44px touch target via pseudo-element, no layout impact */}
                <span className="absolute inset-0 -m-[14px]" aria-hidden="true" />
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                </svg>
              </a>
            )}
          </div>
          <TechBadge badge={system.techBadge} />
          <span className="font-body text-[14px] text-text-muted flex-1">
            {system.oneLiner}
          </span>
        </div>
      ))}
    </div>
  )
}
