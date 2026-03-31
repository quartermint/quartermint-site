'use client'

import { useState } from 'react'

interface ConversationExportPanelProps {
  messages: { role: 'user' | 'assistant'; content: string }[]
  sessionId: string
  isOpen: boolean
  onClose: () => void
}

export function ConversationExportPanel({
  messages,
  sessionId,
  isOpen,
  onClose,
}: ConversationExportPanelProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<
    'idle' | 'sending' | 'success' | 'error'
  >('idle')
  const [copied, setCopied] = useState(false)

  const isValidEmail = email.includes('@') && email.includes('.')

  const formatConversation = () =>
    messages
      .map((m) => `${m.role === 'user' ? 'You' : 'Ryan'}: ${m.content}`)
      .join('\n\n')

  const handleSend = async () => {
    if (!isValidEmail || status === 'sending') return
    setStatus('sending')

    try {
      const res = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, messages, sessionId }),
      })

      if (!res.ok) {
        setStatus('error')
        return
      }

      setStatus('success')
      setTimeout(() => {
        onClose()
        // Reset state after close animation
        setTimeout(() => {
          setStatus('idle')
          setEmail('')
        }, 200)
      }, 3000)
    } catch {
      setStatus('error')
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formatConversation())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard API may fail in some contexts
    }
  }

  return (
    <div
      role="region"
      aria-label="Export conversation"
      className="overflow-hidden border-t border-text-faint/30 bg-bg transition-[height,opacity] duration-200 ease-in-out motion-reduce:transition-none"
      style={{
        height: isOpen ? '48px' : '0px',
        opacity: isOpen ? 1 : 0,
      }}
    >
      <div className="flex items-center gap-2 px-4 h-[48px]">
        {status === 'idle' || status === 'sending' ? (
          <>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              aria-label="Email address for export"
              className="flex-1 h-[36px] bg-bg border border-text-faint rounded-[6px] px-3 font-body text-[14px] text-text placeholder:text-text-faint focus:border-accent focus:outline-none"
            />
            <button
              onClick={handleSend}
              disabled={!isValidEmail || status === 'sending'}
              className="min-w-[64px] min-h-[36px] bg-accent text-on-accent font-body text-[14px] font-semibold rounded-[6px] disabled:opacity-40 transition-opacity"
            >
              {status === 'sending' ? '...' : 'Send'}
            </button>
          </>
        ) : status === 'success' ? (
          <p
            role="status"
            aria-live="polite"
            className="font-body text-[14px] text-text"
          >
            Sent! Check your inbox.
          </p>
        ) : (
          <div className="flex items-center gap-2" role="alert">
            <p className="font-body text-[14px] text-text-muted">
              Couldn&apos;t send.
            </p>
            <button
              onClick={handleCopy}
              className="min-h-[36px] px-3 bg-surface text-text font-body text-[14px] font-semibold rounded-[6px]"
            >
              {copied ? 'Copied!' : 'Copy conversation'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
