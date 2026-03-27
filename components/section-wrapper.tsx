'use client'

import { useRef, useEffect, useState, type ReactNode } from 'react'

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

  useEffect(() => {
    if (noAnimation) return

    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(el)
        }
      },
      { threshold: 0.3 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [noAnimation])

  const bgClass = bg === 'bg' ? 'bg-bg' : 'bg-surface'

  return (
    <section
      ref={ref}
      id={id}
      aria-label={label}
      className={`${bgClass} transition-all duration-[400ms] ease-out
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
    >
      <div className="max-w-[var(--spacing-content-max)] mx-auto px-4 sm:px-6 lg:px-8 py-[var(--spacing-section-mobile)] lg:py-[var(--spacing-section-desktop)]">
        {children}
      </div>
    </section>
  )
}
