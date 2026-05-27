/**
 * Section-to-context mappings for scroll-aware chat on quartermint.com v2.
 *
 * Maps IntersectionObserver section IDs to:
 * - Prompt context labels (injected into system prompt at request time)
 * - Smart starter chip suggestions (displayed in chat UI)
 */

/** All tracked section IDs on the main page */
export const SECTION_IDS = [
  'hero-section',
  'what-is-quartermint',
  'product-proof',
  'distribution',
  'chat-section',
] as const

/** Section context mapping: label for system prompt, chips for starter suggestions */
export const SECTION_CONTEXT_MAP: Record<
  string,
  { label: string; chips: [string, string] }
> = {
  'hero-section': {
    label: 'the hero with the entity-geometry proof strip',
    chips: [
      'What does Quartermint do?',
      'Why entity-geometry as a brand?',
    ],
  },
  'what-is-quartermint': {
    label: 'the product summary covering multi-entity treasury and FEC compliance',
    chips: [
      'How does multi-entity treasury work?',
      'What FEC reports are tracked?',
    ],
  },
  'product-proof': {
    label: 'the unified treasury dashboard mockup',
    chips: [
      'Walk me through the dashboard',
      'How do approvals flow across entities?',
    ],
  },
  'distribution': {
    label: 'the distribution section about validation customers and bank partnerships',
    chips: [
      'Who is using Quartermint today?',
      'How does the Amalgamated partnership work?',
    ],
  },
  'chat-section': {
    label: '',
    chips: [
      'What is the YC pitch in one line?',
      'How is Quartermint different from Mercury or NGP VAN?',
    ],
  },
}

/** Static default chips */
export const STATIC_DEFAULT_CHIPS = [
  'What does Quartermint do?',
  'Who is it for?',
  'How does the FEC compliance layer work?',
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
 */
export function getSectionPromptContext(section: string | null): string {
  if (section === null || !(section in SECTION_CONTEXT_MAP)) {
    return ''
  }

  const { label } = SECTION_CONTEXT_MAP[section]
  if (!label) {
    return ''
  }

  return `\n\n[CURRENT SECTION]\nThe visitor is currently viewing ${label}. If relevant to their question, reference what they are looking at. Do not force it; only mention if naturally relevant.\n[/CURRENT SECTION]`
}
