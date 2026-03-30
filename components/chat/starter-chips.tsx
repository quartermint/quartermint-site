'use client'

const STARTER_QUESTIONS = [
  'How would you fix our campaign ops?',
  'What have you built for PACs?',
  "What's your campaign experience?",
] as const

interface StarterChipsProps {
  onSelect: (question: string) => void
  /** Optional dynamic chips (returning visitor, scroll context, etc.) */
  chips?: string[]
}

export function StarterChips({ onSelect, chips }: StarterChipsProps) {
  const questions = [...new Set(chips ?? STARTER_QUESTIONS)]

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {questions.map((question) => (
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
