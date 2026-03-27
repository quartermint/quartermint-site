'use client'

import { RYAN_EMAIL } from '@/lib/chat/types'

interface ChatErrorStateProps {
  error?: Error
}

export function ChatErrorState({ error }: ChatErrorStateProps) {
  return (
    <div className="py-4" role="alert">
      <p className="font-body text-[16px] text-text-muted">
        I&apos;m not available right now.{' '}
        <a
          href={`mailto:${RYAN_EMAIL}`}
          className="text-text underline"
        >
          Email Ryan directly
        </a>
      </p>
    </div>
  )
}
