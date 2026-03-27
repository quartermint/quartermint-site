import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { join } from 'path'

describe('InvestHeading Component', () => {
  const filePath = join(process.cwd(), 'components/invest-heading.tsx')

  it('exports InvestHeading', () => {
    const content = readFileSync(filePath, 'utf8')
    expect(content).toContain('export function InvestHeading')
  })

  it('uses useState(false) pattern (not suppressHydrationWarning)', () => {
    const content = readFileSync(filePath, 'utf8')
    expect(content).toContain('useState(false)')
    expect(content).not.toContain('suppressHydrationWarning')
  })

  it('reads sessionStorage.getItem("qm_journey_contact")', () => {
    const content = readFileSync(filePath, 'utf8')
    expect(content).toContain("sessionStorage.getItem('qm_journey_contact')")
  })

  it('contains default heading: "The Infrastructure Behind the Work"', () => {
    const content = readFileSync(filePath, 'utf8')
    expect(content).toContain('The Infrastructure Behind the Work')
  })

  it('contains journey variant heading: "You\'ve seen the work. Here\'s where it\'s going."', () => {
    const content = readFileSync(filePath, 'utf8')
    expect(content).toContain(
      "You've seen the work. Here's where it's going."
    )
  })
})

describe('ScrollContextProvider sets qm_journey_contact flag', () => {
  it('scroll-context-provider.tsx contains qm_journey_contact', () => {
    const filePath = join(
      process.cwd(),
      'components/scroll-context-provider.tsx'
    )
    const content = readFileSync(filePath, 'utf8')
    expect(content).toContain('qm_journey_contact')
  })
})

describe('KeyboardShortcutsModal Component', () => {
  const filePath = join(
    process.cwd(),
    'components/keyboard-shortcuts-modal.tsx'
  )

  it('exports KeyboardShortcutsModal', () => {
    const content = readFileSync(filePath, 'utf8')
    expect(content).toContain('export function KeyboardShortcutsModal')
  })

  it('contains role="dialog" and aria-modal="true"', () => {
    const content = readFileSync(filePath, 'utf8')
    expect(content).toContain('role="dialog"')
    expect(content).toContain('aria-modal="true"')
  })

  it('contains ? key handler', () => {
    const content = readFileSync(filePath, 'utf8')
    expect(content).toContain("e.key === '?'")
  })

  it('checks for INPUT/TEXTAREA tag name to avoid triggering in inputs', () => {
    const content = readFileSync(filePath, 'utf8')
    expect(content).toMatch(/INPUT.*TEXTAREA|TEXTAREA.*INPUT/)
  })

  it('contains / key handler for chat focus', () => {
    const content = readFileSync(filePath, 'utf8')
    expect(content).toContain("e.key === '/'")
    expect(content).toContain('Type your message')
  })
})

describe('ConversationExportPanel Component', () => {
  const filePath = join(
    process.cwd(),
    'components/chat/conversation-export-panel.tsx'
  )

  it('exports ConversationExportPanel', () => {
    const content = readFileSync(filePath, 'utf8')
    expect(content).toContain('export function ConversationExportPanel')
  })

  it('contains /api/export endpoint call', () => {
    const content = readFileSync(filePath, 'utf8')
    expect(content).toContain('/api/export')
  })

  it('contains navigator.clipboard.writeText for clipboard fallback', () => {
    const content = readFileSync(filePath, 'utf8')
    expect(content).toContain('navigator.clipboard.writeText')
  })

  it('contains role="region" with aria-label', () => {
    const content = readFileSync(filePath, 'utf8')
    expect(content).toContain('role="region"')
    expect(content).toContain('aria-label="Export conversation"')
  })

  it('contains success and error states', () => {
    const content = readFileSync(filePath, 'utf8')
    expect(content).toContain('Sent! Check your inbox.')
    expect(content).toContain("Couldn&apos;t send.")
    expect(content).toContain('Copy conversation')
  })
})
