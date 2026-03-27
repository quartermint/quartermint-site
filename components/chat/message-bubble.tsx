'use client'

import type { UIMessage } from 'ai'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface MessageBubbleProps {
  message: UIMessage
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user'

  return (
    <div
      className={
        isUser
          ? 'ml-auto max-w-[80%] bg-text text-bg font-body text-[16px] font-normal leading-[1.7] px-4 py-3 rounded-[16px_16px_4px_16px]'
          : 'mr-auto max-w-[80%] bg-surface text-text font-body text-[16px] font-normal leading-[1.7] px-4 py-3 rounded-[16px_16px_16px_4px]'
      }
      aria-label={isUser ? 'Your message' : "Ryan's AI response"}
    >
      {message.parts.map((part, i) => {
        if (part.type === 'text') {
          return isUser ? (
            <p key={`${message.id}-${i}`}>{part.text}</p>
          ) : (
            <ReactMarkdown
              key={`${message.id}-${i}`}
              remarkPlugins={[remarkGfm]}
            >
              {part.text}
            </ReactMarkdown>
          )
        }
        return null
      })}
    </div>
  )
}
