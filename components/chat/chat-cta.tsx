'use client'

import { useState } from 'react'
import { ChatMobileOverlay } from './chat-mobile-overlay'

export function ChatCTA() {
  const [overlayOpen, setOverlayOpen] = useState(false)

  return (
    <>
      {/* Desktop: smooth scroll to chat section */}
      <a
        href="#chat-section"
        className="hidden sm:inline-flex items-center justify-center min-h-[44px] min-w-[44px] px-6 bg-surface text-text font-body text-[14px] rounded-[6px]"
      >
        Talk to my AI
      </a>

      {/* Mobile: open overlay */}
      <button
        type="button"
        onClick={() => setOverlayOpen(true)}
        className="inline-flex sm:hidden items-center justify-center min-h-[44px] min-w-[44px] px-6 bg-surface text-text font-body text-[14px] rounded-[6px]"
      >
        Talk to my AI
      </button>

      {/* Mobile overlay */}
      <ChatMobileOverlay
        isOpen={overlayOpen}
        onClose={() => setOverlayOpen(false)}
      />
    </>
  )
}
