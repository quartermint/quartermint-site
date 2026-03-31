'use client'

import { useEffect, useState, useRef } from 'react'

const SCROLL_THRESHOLD = 100
const SCROLL_DELTA = 5

export function StickyNav() {
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const lastScrollY = useRef(0)

  useEffect(() => {
    function onScroll() {
      const y = window.scrollY
      const delta = y - lastScrollY.current

      setScrolled(y > SCROLL_THRESHOLD)

      // Only toggle visibility when scroll delta exceeds threshold
      // to prevent momentum scroll thrashing on iOS (Pitfall 3)
      if (Math.abs(delta) > SCROLL_DELTA) {
        if (delta > 0 && y > SCROLL_THRESHOLD) {
          setHidden(true)
        } else {
          setHidden(false)
        }
      }

      lastScrollY.current = y
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      aria-label="Main navigation"
      className={`sticky top-0 z-50 h-12 transition-all duration-200 ease-out
        ${scrolled ? 'bg-bg shadow-[0_1px_3px_rgba(0,0,0,0.1)]' : 'bg-transparent'}
        ${hidden ? '-translate-y-full' : 'translate-y-0'}`}
    >
      <div className="max-w-[var(--spacing-content-max)] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-full">
        <a
          href="#"
          className="font-body text-[14px] font-semibold text-text inline-flex items-center min-h-[44px] min-w-[44px]"
        >
          Quartermint
        </a>
        <div className="flex items-center gap-2">
          <a
            href="#featured-systems"
            className="inline-flex items-center justify-center min-h-[36px] px-4 font-body text-[13px] text-text-muted hover:text-text transition-colors duration-150 rounded-[6px]"
          >
            Systems
          </a>
          <a
            href="/work-with-me"
            className="inline-flex items-center justify-center min-h-[36px] px-4 font-body text-[13px] font-semibold text-text bg-accent rounded-[6px]"
          >
            Work With Me
          </a>
        </div>
      </div>
    </nav>
  )
}
