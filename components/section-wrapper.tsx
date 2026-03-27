'use client'

import { useRef, useEffect, useState, type ReactNode } from 'react'

type AnimTier = 'fast' | 'medium' | 'slow'

const ANIM_CONFIG: Record<AnimTier, { duration: string; translate: string; easing: string }> = {
  fast:   { duration: '150ms',  translate: '4px',  easing: 'ease-out' },
  medium: { duration: '400ms',  translate: '8px',  easing: 'ease' },
  slow:   { duration: '800ms',  translate: '12px', easing: 'ease-in-out' },
}

interface SectionWrapperProps {
  children: ReactNode
  bg: 'bg' | 'surface'
  label: string
  noAnimation?: boolean
  id?: string
}

export function SectionWrapper({
  children,
  bg,
  label,
  noAnimation = false,
  id,
}: SectionWrapperProps) {
  const ref = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(noAnimation)
  const [animTier, setAnimTier] = useState<AnimTier>('medium')

  useEffect(() => {
    if (noAnimation) return

    // Check reduced motion preference (ENG-06: all disabled with prefers-reduced-motion)
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
    if (prefersReducedMotion) {
      setIsVisible(true) // Show immediately, no animation
      return
    }

    const el = ref.current
    if (!el) return
    let entryTime: number | null = null

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Record when element first enters viewport (ratio >= 0.01)
        if (entry.isIntersecting && entry.intersectionRatio >= 0.01 && entryTime === null) {
          entryTime = performance.now()
        }
        // Trigger animation when element reaches 0.3 threshold
        if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
          const elapsed = entryTime !== null ? performance.now() - entryTime : 600
          // Map elapsed time to animation tier (D-07)
          if (elapsed < 400) {
            setAnimTier('fast')
          } else if (elapsed > 1200) {
            setAnimTier('slow')
          } else {
            setAnimTier('medium')
          }
          setIsVisible(true)
          observer.unobserve(el)
        }
      },
      { threshold: [0.01, 0.3] }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [noAnimation])

  const bgClass = bg === 'bg' ? 'bg-bg' : 'bg-surface'
  const config = ANIM_CONFIG[animTier]

  return (
    <section
      ref={ref}
      id={id}
      aria-label={label}
      className={bgClass}
      style={{
        transition: `opacity ${config.duration} ${config.easing}, transform ${config.duration} ${config.easing}`,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : `translateY(${config.translate})`,
      }}
    >
      <div className="max-w-[var(--spacing-content-max)] mx-auto px-4 sm:px-6 lg:px-8 py-[var(--spacing-section-mobile)] lg:py-[var(--spacing-section-desktop)]">
        {children}
      </div>
    </section>
  )
}
