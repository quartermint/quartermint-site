'use client'

import { useEffect, useRef } from 'react'
import { ChatInterface } from './chat-interface'

interface ChatMobileOverlayProps {
  isOpen: boolean
  onClose: () => void
}

export function ChatMobileOverlay({ isOpen, onClose }: ChatMobileOverlayProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Escape key handler
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // Focus trap: focus close button on open
  useEffect(() => {
    if (isOpen) {
      closeButtonRef.current?.focus()
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[60] bg-bg flex flex-col transition-transform duration-300 ease-out"
      role="dialog"
      aria-modal="true"
      aria-label="Chat with Ryan"
    >
      {/* Header: 48px height */}
      <div className="flex items-center justify-end min-h-[48px] px-4 border-b border-text-faint/20">
        <button
          ref={closeButtonRef}
          onClick={onClose}
          className="font-body text-[14px] font-semibold text-text min-h-[44px] min-w-[44px] inline-flex items-center justify-center"
          aria-label="Close chat"
        >
          Close
        </button>
      </div>

      {/* Chat content: full height minus header */}
      <div className="flex-1 overflow-hidden p-4">
        <ChatInterface />
      </div>
    </div>
  )
}
