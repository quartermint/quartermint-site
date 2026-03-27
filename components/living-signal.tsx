'use client'

import { useState, useEffect } from 'react'
import { isStale } from '@/lib/relative-time'
import type { CommitInfo } from '@/lib/github'

interface LivingSignalProps {
  signal: CommitInfo | null
}

export function LivingSignal({ signal }: LivingSignalProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(true)
  }, [])

  if (!signal) return null

  const isFallback = signal.repo === 'fallback'
  const stale = !isFallback && signal.date ? isStale(signal.date, 7) : false
  const colorClass = isFallback || stale ? 'text-text-faint' : 'text-text-muted'

  return (
    <p
      className={`font-body text-[14px] font-normal ${colorClass}
        transition-opacity duration-[600ms] ease-in delay-300
        ${visible ? 'opacity-100' : 'opacity-0'}`}
    >
      <span className="sr-only">Last code pushed to GitHub</span>
      {!isFallback && !stale && (
        <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block mr-2" />
      )}
      {isFallback ? (
        <span>{signal.relativeTime}</span>
      ) : (
        <span>Last shipped to {signal.repo} {signal.relativeTime}</span>
      )}
    </p>
  )
}
