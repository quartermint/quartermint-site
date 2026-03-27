'use client'

export function TypingIndicator() {
  return (
    <div className="mr-auto flex items-center gap-2" role="status" aria-label="Thinking...">
      <style>{`
        @keyframes typingDot {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>
      <div className="flex items-center gap-1">
        <span
          className="w-2 h-2 rounded-full bg-accent"
          style={{ animation: 'typingDot 600ms infinite', animationDelay: '0ms' }}
        />
        <span
          className="w-2 h-2 rounded-full bg-accent"
          style={{ animation: 'typingDot 600ms infinite', animationDelay: '200ms' }}
        />
        <span
          className="w-2 h-2 rounded-full bg-accent"
          style={{ animation: 'typingDot 600ms infinite', animationDelay: '400ms' }}
        />
      </div>
      <span className="font-body text-[14px] text-text-faint">Thinking...</span>
    </div>
  )
}
