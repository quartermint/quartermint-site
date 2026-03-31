'use client'

import { useState } from 'react'
import { SendMessageModal } from '@/components/send-message-modal'
import { trackEvent } from '@/lib/tracking'

export function ContactInvestor() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <div className="max-w-[600px]">
      <h2 className="font-display text-[20px] leading-[1.3] text-text mb-4">
        Let&apos;s talk about the movement you&apos;re building
      </h2>
      <p className="font-body text-[16px] leading-[1.7] text-text-muted mb-6">
        If you&apos;re running a campaign, managing a PAC, or building an
        advocacy organization, I&apos;d like to hear what&apos;s breaking.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <a
          href="https://calendar.app.google/kQD52ja6x24rATbM8"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] px-6 bg-accent text-text font-body text-[14px] font-semibold rounded-[6px] w-fit"
          onClick={() => trackEvent('book_click', 'contact_section')}
        >
          Book a time
        </a>
        <button
          type="button"
          onClick={() => { setModalOpen(true); trackEvent('message_click', 'contact_section') }}
          className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] px-6 bg-surface text-text font-body text-[14px] rounded-[6px] border border-text-faint/20 w-fit"
        >
          Send a message
        </button>
      </div>
      <div className="mt-6">
        <span className="font-body text-[14px] text-text-faint block mb-3">
          Or follow the work
        </span>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/quartermint"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-faint hover:text-text relative inline-flex items-center justify-center min-h-[44px] min-w-[44px]"
            aria-label="quartermint on GitHub"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
          </a>
          <a
            href="https://x.com/ryanstern"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-faint hover:text-text relative inline-flex items-center justify-center min-h-[44px] min-w-[44px]"
            aria-label="Ryan Stern on X"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
          <a
            href="https://linkedin.com/in/ryanstern"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-faint hover:text-text relative inline-flex items-center justify-center min-h-[44px] min-w-[44px]"
            aria-label="Ryan Stern on LinkedIn"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </a>
        </div>
      </div>

      <SendMessageModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
