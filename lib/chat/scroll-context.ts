/**
 * Section-to-context mappings for scroll-aware chat.
 *
 * Maps IntersectionObserver section IDs to:
 * - Prompt context labels (injected into system prompt at request time)
 * - Smart starter chip suggestions (displayed in chat UI)
 */

/** All tracked section IDs on the main page */
export const SECTION_IDS = [
  'hero-section',
  'featured-systems',
  'chat-section',
  'origin-story',
  'contact-section',
] as const

/** Section context mapping: label for system prompt, chips for starter suggestions */
export const SECTION_CONTEXT_MAP: Record<
  string,
  { label: string; chips: [string, string] }
> = {
  'hero-section': {
    label: 'the hero introduction',
    chips: ['How would you fix our campaign ops?', 'What have you built for PACs?'],
  },
  'featured-systems': {
    label: 'the featured tools: Relay, Campaign Finance Dashboard, LifeVault, and whatamivotingon',
    chips: ['Tell me about the PAC dashboard', 'How does Relay help teams?'],
  },
  'chat-section': {
    label: '',
    chips: [
      'What are you building?',
      'How would you approach our operations challenge?',
    ],
  },
  'origin-story': {
    label: 'the origin story about building infrastructure',
    chips: ["What's your campaign experience?", 'Why did you start building?'],
  },
  'contact-section': {
    label: 'the contact section',
    chips: ['How do we start working together?', 'What does an engagement look like?'],
  },
}

/** Static default chips -- campaign/advocacy focused */
export const STATIC_DEFAULT_CHIPS = [
  'How would you fix our campaign ops?',
  'What have you built for PACs?',
  "What's your campaign experience?",
]

/**
 * Get 3 starter chips based on scroll context.
 * Returns 2 context-specific + 1 default for known sections,
 * or static defaults when no meaningful context is available.
 */
export function getScrollChips(section: string | null): string[] {
  if (
    section === null ||
    section === 'chat-section' ||
    !(section in SECTION_CONTEXT_MAP)
  ) {
    return [...STATIC_DEFAULT_CHIPS]
  }

  const entry = SECTION_CONTEXT_MAP[section]
  return [...entry.chips, STATIC_DEFAULT_CHIPS[0]]
}

/**
 * Get system prompt context injection for a scroll section.
 * Returns a string to append to the system prompt, or empty string
 * when no injection is appropriate.
 */
export function getSectionPromptContext(section: string | null): string {
  if (section === null || !(section in SECTION_CONTEXT_MAP)) {
    return ''
  }

  const { label } = SECTION_CONTEXT_MAP[section]
  if (!label) {
    return ''
  }

  return `\n\n[CURRENT SECTION]\nThe visitor is currently viewing ${label}. If relevant to their question, you can reference what they're looking at. Do not force it -- only mention if naturally relevant.\n[/CURRENT SECTION]`
}
