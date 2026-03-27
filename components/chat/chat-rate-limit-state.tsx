'use client'

import { CALENDAR_BOOKING_URL } from '@/lib/chat/types'

interface ChatRateLimitStateProps {
  type: 'session' | 'ip'
}

export function ChatRateLimitState({ type }: ChatRateLimitStateProps) {
  const copy =
    type === 'session'
      ? 'Great questions. For a deeper conversation:'
      : "You've been busy. Let's continue over a call:"

  return (
    <div
      className="mr-auto max-w-[80%] bg-surface text-text rounded-[16px_16px_16px_4px] px-4 py-3"
      role="alert"
    >
      <p className="font-body text-[16px]">
        {copy}{' '}
        <a
          href={CALENDAR_BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-text underline font-body text-[16px] min-h-[44px] inline-flex items-center"
        >
          Book a call
        </a>
      </p>
    </div>
  )
}
