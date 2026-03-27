'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react'
import { SECTION_IDS } from '@/lib/chat/scroll-context'

type ScrollContextType = { currentSection: string | null }

const ScrollContext = createContext<ScrollContextType>({
  currentSection: null,
})

/** Hook to read the currently visible page section */
export function useScrollContext() {
  return useContext(ScrollContext)
}

/**
 * Wraps page content and tracks which main section is visible
 * using a single IntersectionObserver. Exposes current section
 * via React Context for the chat system to consume.
 */
export function ScrollContextProvider({ children }: { children: ReactNode }) {
  const [currentSection, setCurrentSection] = useState<string | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible.length > 0) {
          setCurrentSection(visible[0].target.id)
        }
      },
      { threshold: 0.3 }
    )

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <ScrollContext.Provider value={{ currentSection }}>
      {children}
    </ScrollContext.Provider>
  )
}
