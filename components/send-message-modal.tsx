'use client'

import { useState, useRef, useEffect } from 'react'

interface SendMessageModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SendMessageModal({ isOpen, onClose }: SendMessageModalProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const nameRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      nameRef.current?.focus()
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim() || !message.trim()) return

    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), message: message.trim() }),
      })
      if (res.ok) {
        setStatus('sent')
        setTimeout(() => {
          onClose()
          setName('')
          setEmail('')
          setMessage('')
          setStatus('idle')
        }, 2000)
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-bg rounded-[8px] shadow-[0_4px_24px_rgba(0,0,0,0.12)] w-[90vw] max-w-[480px] p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-[20px] leading-[1.3] text-text">
            Send a message
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-text-muted hover:text-text p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M4 4l8 8M12 4l-8 8" />
            </svg>
          </button>
        </div>

        {status === 'sent' ? (
          <p className="font-body text-[16px] text-text text-center py-8">
            Message sent. I&apos;ll be in touch.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="contact-name" className="font-body text-[14px] text-text-muted block mb-1">
                Name
              </label>
              <input
                ref={nameRef}
                id="contact-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-[44px] bg-bg border border-text-faint rounded-[6px] px-4 font-body text-[16px] text-text placeholder:text-text-faint focus:border-accent focus:outline-none"
                placeholder="Optional"
              />
            </div>
            <div>
              <label htmlFor="contact-email" className="font-body text-[14px] text-text-muted block mb-1">
                Email <span className="text-text-faint">*</span>
              </label>
              <input
                id="contact-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-[44px] bg-bg border border-text-faint rounded-[6px] px-4 font-body text-[16px] text-text placeholder:text-text-faint focus:border-accent focus:outline-none"
                placeholder="you@organization.com"
              />
            </div>
            <div>
              <label htmlFor="contact-message" className="font-body text-[14px] text-text-muted block mb-1">
                Message <span className="text-text-faint">*</span>
              </label>
              <textarea
                id="contact-message"
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="w-full bg-bg border border-text-faint rounded-[6px] px-4 py-3 font-body text-[16px] text-text placeholder:text-text-faint focus:border-accent focus:outline-none resize-none"
                placeholder="What's breaking?"
              />
            </div>
            {status === 'error' && (
              <p className="font-body text-[14px] text-red-600">
                Something went wrong. Try again or email ryan@quartermint.com directly.
              </p>
            )}
            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full h-[44px] bg-text text-bg font-body text-[14px] font-semibold rounded-[6px] disabled:opacity-40 transition-opacity"
            >
              {status === 'sending' ? 'Sending...' : 'Send'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
