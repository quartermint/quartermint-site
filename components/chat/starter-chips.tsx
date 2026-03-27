'use client'

const STARTER_QUESTIONS = [
  'What are you building?',
  'How does LifeVault work?',
  "What's the information routing thesis?",
] as const

interface StarterChipsProps {
  onSelect: (question: string) => void
}

export function StarterChips({ onSelect }: StarterChipsProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {STARTER_QUESTIONS.map((question) => (
        <button
          key={question}
          type="button"
          onClick={() => onSelect(question)}
          className="bg-surface text-text-faint font-body text-[14px] rounded-[6px] py-2 px-4 min-h-[44px] inline-flex items-center cursor-pointer transition-colors duration-150 ease-in-out hover:text-text"
          aria-label={`Suggested question: ${question}`}
        >
          {question}
        </button>
      ))}
    </div>
  )
}
