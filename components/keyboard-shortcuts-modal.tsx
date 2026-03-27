'use client'

import { useState, useEffect, useRef } from 'react'

const shortcuts = [
  { key: '?', description: 'Toggle this overlay' },
  { key: '/', description: 'Focus chat input' },
  { key: 'Esc', description: 'Close overlay' },
]

export function KeyboardShortcutsModal() {
  const [isOpen, setIsOpen] = useState(false)
  const previousFocusRef = useRef<Element | null>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger when typing in INPUT or TEXTAREA
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return

      if (e.key === '?') {
        e.preventDefault()
        setIsOpen((prev) => {
          if (!prev) {
            // Opening: save previous focus
            previousFocusRef.current = document.activeElement
          }
          return !prev
        })
      }

      if (e.key === 'Escape' && isOpen) {
        e.preventDefault()
        setIsOpen(false)
      }

      // / key focuses chat input when modal is not open
      if (e.key === '/' && !isOpen) {
        e.preventDefault()
        const chatInput = document.querySelector<HTMLInputElement>(
          '[aria-label="Type your message"]'
        )
        chatInput?.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  // Focus management: focus modal on open, restore on close
  useEffect(() => {
    if (isOpen) {
      modalRef.current?.focus()
    } else if (previousFocusRef.current) {
      ;(previousFocusRef.current as HTMLElement)?.focus?.()
      previousFocusRef.current = null
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-[8px] animate-[fadeIn_200ms_ease] motion-reduce:animate-none"
        style={{ zIndex: 69 }}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        ref={modalRef}
        role="dialog"
        aria-label="Keyboard shortcuts"
        aria-modal="true"
        tabIndex={-1}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[400px] w-[calc(100%-32px)] bg-bg rounded-[8px] shadow-[0_4px_24px_rgba(0,0,0,0.12)] p-4 lg:p-6 outline-none animate-[fadeIn_200ms_ease] motion-reduce:animate-none"
        style={{ zIndex: 70 }}
      >
        {/* Heading */}
        <h2 className="font-display text-[20px] font-normal leading-[1.3] text-text text-center">
          Keyboard Shortcuts
        </h2>

        {/* Shortcut rows */}
        <div className="mt-6 flex flex-col gap-2">
          {shortcuts.map((s) => (
            <div key={s.key} className="flex items-center gap-4">
              <span className="inline-flex items-center justify-center min-w-[32px] px-2 py-1 bg-surface text-text font-body text-[14px] font-semibold rounded-[4px] text-center">
                {s.key}
              </span>
              <span className="font-body text-[14px] text-text-muted">
                {s.description}
              </span>
            </div>
          ))}
        </div>

        {/* Dismiss hint */}
        <p className="mt-4 font-body text-[14px] text-text-faint text-center">
          Press ? to close
        </p>
      </div>
    </>
  )
}
