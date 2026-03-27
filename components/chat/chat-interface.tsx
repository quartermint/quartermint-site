'use client'

import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { useState, useRef, useEffect, useMemo } from 'react'
import { MessageBubble } from './message-bubble'
import { StarterChips } from './starter-chips'
import { TypingIndicator } from './typing-indicator'
import { ChatErrorState } from './chat-error-state'
import { ChatRateLimitState } from './chat-rate-limit-state'
import { useScrollContext } from '@/components/scroll-context-provider'
import { getScrollChips } from '@/lib/chat/scroll-context'
import { ReturningVisitorGreeting } from './returning-visitor-greeting'
import { ConversationExportPanel } from './conversation-export-panel'

export function ChatInterface() {
  const [sessionId] = useState(() => crypto.randomUUID())
  const [input, setInput] = useState('')
  const [rateLimitType, setRateLimitType] = useState<'session' | 'ip' | null>(
    null
  )
  const [returningVisitorChips, setReturningVisitorChips] = useState<
    string[] | null
  >(null)
  const [exportOpen, setExportOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { currentSection } = useScrollContext()
  const dynamicChips = getScrollChips(currentSection)

  // AI SDK v6: transport-based architecture replaces api/body props
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: '/api/chat',
        body: { sessionId, scrollContext: currentSection },
      }),
    [sessionId, currentSection]
  )

  const { messages, sendMessage, status, error } = useChat({
    transport,
    onError: (err) => {
      // The AI SDK v6 onError receives the raw Error from the fetch.
      // Our API route returns JSON: { error: string, type: ChatErrorType }
      // The error.message contains the response body text for non-streaming errors.
      // Parse it to extract the `type` field for rate limit distinction.
      try {
        const parsed = JSON.parse(err.message)
        if (parsed.type === 'rate_limit') {
          // Distinguish session vs IP by checking the error message content.
          // Session limit message: "Great questions..."
          // IP limit message: "You've been busy..."
          const limitType = parsed.error?.includes('Great questions')
            ? 'session'
            : 'ip'
          setRateLimitType(limitType)
        }
        // type === 'unavailable' falls through to general error state
      } catch {
        // If JSON parse fails, it's a non-structured error -- general error state
        // rateLimitType stays null, error state renders ChatErrorState
      }
    },
  })

  const isStreaming = status === 'streaming' || status === 'submitted'
  const hasMessages = messages.some((m) => m.role === 'user')

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Return focus to input when streaming completes
  useEffect(() => {
    if (status === 'ready') {
      inputRef.current?.focus()
    }
  }, [status])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isStreaming) return
    sendMessage({ text: input })
    setInput('')
  }

  const handleChipClick = (question: string) => {
    sendMessage({ text: question })
  }

  const isRateLimited = rateLimitType !== null
  const userMessageCount = messages.filter((m) => m.role === 'user').length

  return (
    <div
      className="relative mx-auto max-w-[720px] min-h-[200px] bg-bg rounded-[8px] shadow-[0_2px_8px_rgba(0,0,0,0.06)] p-4 sm:p-6"
      role="complementary"
      aria-label="Chat with Ryan"
    >
      {/* Envelope icon: export conversation via email (after 3 user messages) */}
      {userMessageCount >= 3 && (
        <button
          onClick={() => setExportOpen((prev) => !prev)}
          aria-label="Export conversation via email"
          className="absolute top-4 right-4 p-3 text-text-muted hover:text-text transition-colors duration-150 motion-reduce:transition-none"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="2" y="4" width="16" height="12" rx="2" />
            <path d="M2 4l8 6 8-6" />
          </svg>
        </button>
      )}

      {/* Conversation export panel */}
      <ConversationExportPanel
        messages={messages.map((m) => ({
          role: m.role as 'user' | 'assistant',
          content:
            m.parts
              ?.filter((p) => p.type === 'text')
              .map((p) => ('text' in p ? p.text : ''))
              .join('') || '',
        }))}
        sessionId={sessionId}
        isOpen={exportOpen}
        onClose={() => setExportOpen(false)}
      />

      {/* Idle state: heading + returning visitor greeting + starter chips */}
      {!hasMessages && (
        <>
          <h2 className="font-display text-[24px] leading-[1.2] text-text text-center">
            Ask me anything about what I&apos;m building
          </h2>
          <ReturningVisitorGreeting
            onChipsReady={setReturningVisitorChips}
          />
          <div className="mt-4">
            <StarterChips
              onSelect={handleChipClick}
              chips={returningVisitorChips ?? dynamicChips}
            />
          </div>
          <div className="h-6" />
        </>
      )}

      {/* Active state: scrollable message area */}
      {hasMessages && (
        <div
          className="max-h-[400px] sm:max-h-[500px] lg:max-h-[calc(600px-120px)] overflow-y-auto mb-6"
          role="log"
          aria-live="polite"
        >
          {messages.map((m, index) => {
            // Determine gap: 16px between different roles, 8px between same role
            const prevMessage = index > 0 ? messages[index - 1] : null
            const gapClass =
              index === 0
                ? ''
                : prevMessage && prevMessage.role === m.role
                  ? 'mt-2'
                  : 'mt-4'

            return (
              <div key={m.id} className={gapClass}>
                <MessageBubble message={m} />
              </div>
            )
          })}

          {isStreaming && (
            <div className="mt-4">
              <TypingIndicator />
            </div>
          )}

          {error && !isRateLimited && (
            <div className="mt-4">
              <ChatErrorState error={error} />
            </div>
          )}

          {isRateLimited && (
            <div className="mt-4">
              <ChatRateLimitState type={rateLimitType} />
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      )}

      {/* Input form (always visible unless rate limited) */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            isRateLimited ? 'Message limit reached' : 'Ask me anything...'
          }
          aria-label="Type your message"
          disabled={isStreaming || isRateLimited}
          className={`flex-1 h-[48px] bg-bg border rounded-[8px] px-4 font-body text-[16px] text-text placeholder:text-text-muted focus:border-accent focus:outline-none ${
            isRateLimited
              ? 'border-text-faint/40 text-text-faint cursor-not-allowed'
              : 'border-text-faint'
          }`}
        />
        <button
          type="submit"
          disabled={!input.trim() || isStreaming || isRateLimited}
          aria-label="Send message"
          className="bg-text text-bg font-body text-[14px] font-semibold rounded-[6px] min-w-[44px] min-h-[44px] px-4 disabled:opacity-40 transition-opacity"
        >
          Send
        </button>
      </form>

      {/* Privacy notice */}
      <p className="mt-2 font-body text-[14px] leading-[1.4] text-text-faint">
        Messages are logged.{' '}
        <a href="/privacy" className="underline">
          Privacy policy
        </a>
      </p>
    </div>
  )
}
