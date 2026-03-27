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
  'systems-shelf',
  'contact-section',
] as const

/** Section context mapping: label for system prompt, chips for starter suggestions */
export const SECTION_CONTEXT_MAP: Record<
  string,
  { label: string; chips: [string, string] }
> = {
  'hero-section': {
    label: 'the hero introduction',
    chips: ['What are you building?', 'How does LifeVault work?'],
  },
  'featured-systems': {
    label: 'the featured systems: LifeVault, Relay, OpenEFB, and v2cf',
    chips: ['Tell me more about LifeVault', 'How does Relay work?'],
  },
  'chat-section': {
    label: '',
    chips: [
      'What are you building?',
      "What's the information routing thesis?",
    ],
  },
  'origin-story': {
    label: 'the origin story about building infrastructure',
    chips: ['What made you start building?', 'Tell me about your background'],
  },
  'systems-shelf': {
    label: 'the full systems shelf',
    chips: [
      'Which of these systems are open source?',
      'What does skygate do?',
    ],
  },
  'contact-section': {
    label: 'the contact and investor section',
    chips: ['How can I work with you?', "What's the best way to connect?"],
  },
}

/** Static default chips -- same as Phase 3 StarterChips defaults */
export const STATIC_DEFAULT_CHIPS = [
  'What are you building?',
  'How does LifeVault work?',
  "What's the information routing thesis?",
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
