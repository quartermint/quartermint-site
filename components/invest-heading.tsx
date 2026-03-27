'use client'

import { useState, useEffect } from 'react'

export function InvestHeading() {
  const [isJourney, setIsJourney] = useState(false)

  useEffect(() => {
    try {
      const flag = sessionStorage.getItem('qm_journey_contact')
      if (flag === 'true') {
        setIsJourney(true)
      }
    } catch {
      // sessionStorage may not be available in private browsing
    }
  }, [])

  return (
    <h1 className="font-display text-[32px] leading-[1.2] text-text mb-8">
      {isJourney
        ? "You've seen the work. Here's where it's going."
        : 'The Infrastructure Behind the Work'}
    </h1>
  )
}
