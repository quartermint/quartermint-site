'use client'

import { ChatInterface } from './chat-interface'

export function ChatSection() {
  return (
    <>
      {/* Desktop/tablet: inline chat container, hidden on mobile */}
      <div className="hidden sm:block">
        <ChatInterface />
      </div>

      {/* Mobile: show a CTA that tells user to use the hero button */}
      {/* The actual mobile overlay is rendered by the HeroSection */}
      <div className="block sm:hidden">
        <div className="mx-auto max-w-[720px] min-h-[200px] bg-bg rounded-[8px] shadow-[0_2px_8px_rgba(0,0,0,0.06)] p-4 flex flex-col items-center justify-center text-center">
          <h2 className="font-display text-[24px] leading-[1.2] text-text">
            This is how I think about your problem
          </h2>
          <p className="font-body text-[14px] text-text-muted mt-4">
            Tap &ldquo;Talk to my AI&rdquo; at the top to start chatting.
          </p>
        </div>
      </div>
    </>
  )
}
