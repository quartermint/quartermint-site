'use client'

import { useState, useEffect } from 'react'

interface ReturningVisitorGreetingProps {
  /** Callback to inform parent about returning visitor chips (recent tier only) */
  onChipsReady?: (chips: string[]) => void
}

/** Static default chips pool (same as starter-chips.tsx) */
const STATIC_DEFAULT_CHIPS = [
  'What are you building?',
  'How does LifeVault work?',
  "What's the information routing thesis?",
]

/**
 * Renders a personalized greeting above starter chips based on visitor tier.
 *
 * - Recent (<7 days): "Welcome back. You were asking about [topic] last time."
 *   + returning visitor chips via onChipsReady callback
 * - Moderate (7-30 days): "Good to see you again."
 * - Stale/New/Error: Renders nothing (per D-06)
 *
 * Fetches visitor state once on mount, no polling (RESEARCH anti-pattern).
 */
export function ReturningVisitorGreeting({
  onChipsReady,
}: ReturningVisitorGreetingProps) {
  const [tier, setTier] = useState<string | null>(null)
  const [topics, setTopics] = useState<string[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    async function fetchVisitorState() {
      try {
        const res = await fetch('/api/visitor')
        if (!res.ok) {
          setLoaded(true)
          return
        }
        const data = await res.json()
        setTier(data.tier)
        setTopics(data.topics ?? [])

        // For recent visitors, provide returning visitor chips
        if (data.tier === 'recent' && onChipsReady) {
          onChipsReady([
            'Continue where I left off',
            "What's new since I was here?",
            STATIC_DEFAULT_CHIPS[0],
          ])
        }
      } catch {
        // On fetch error, treat as new visitor (D-06)
      }
      setLoaded(true)
    }

    fetchVisitorState()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Don't render for stale, new, or error states
  if (!loaded || !tier || tier === 'stale' || tier === 'new') return null

  let greetingText = ''
  if (tier === 'recent') {
    greetingText =
      topics.length > 0
        ? `Welcome back. You were asking about ${topics[0]} last time.`
        : 'Welcome back.'
  } else if (tier === 'moderate') {
    greetingText = 'Good to see you again.'
  }

  if (!greetingText) return null

  return (
    <div
      role="status"
      aria-live="polite"
      className="text-center font-body text-[16px] font-normal leading-[1.7] text-text mb-4 motion-safe:animate-[fadeIn_300ms_ease] motion-reduce:animate-none"
    >
      {greetingText}
    </div>
  )
}
