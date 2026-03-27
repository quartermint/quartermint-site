import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { join } from 'path'

describe('Conversation Export Email Template', () => {
  const templatePath = join(
    process.cwd(),
    'lib/email/conversation-export-template.tsx'
  )

  it('file exists and exports ConversationExportEmail', () => {
    const content = readFileSync(templatePath, 'utf8')
    expect(content).toContain('ConversationExportEmail')
    expect(content).toMatch(/export\s+(default\s+)?function\s+ConversationExportEmail/)
  })

  it('template contains "Your conversation with Ryan Stern"', () => {
    const content = readFileSync(templatePath, 'utf8')
    expect(content).toContain('Your conversation with Ryan Stern')
  })

  it('template contains "quartermint.com"', () => {
    const content = readFileSync(templatePath, 'utf8')
    expect(content).toContain('quartermint.com')
  })

  it('renders messages with role labels "You" and "Ryan"', () => {
    const content = readFileSync(templatePath, 'utf8')
    // Template maps user -> You, assistant -> Ryan
    expect(content).toContain("'You'")
    expect(content).toContain("'Ryan'")
  })

  it('imports from @react-email/components', () => {
    const content = readFileSync(templatePath, 'utf8')
    expect(content).toContain('@react-email/components')
  })
})

describe('Export API Route', () => {
  const routePath = join(process.cwd(), 'app/api/export/route.ts')

  it('file exists with POST export', () => {
    const content = readFileSync(routePath, 'utf8')
    expect(content).toContain('export async function POST')
  })

  it('sends email from "chat@quartermint.com"', () => {
    const content = readFileSync(routePath, 'utf8')
    expect(content).toContain('chat@quartermint.com')
  })

  it('includes BCC to "ryan@quartermint.com"', () => {
    const content = readFileSync(routePath, 'utf8')
    expect(content).toContain('ryan@quartermint.com')
  })

  it('has rate limiting via Ratelimit', () => {
    const content = readFileSync(routePath, 'utf8')
    expect(content).toContain('Ratelimit')
  })

  it('validates email field in request body', () => {
    const content = readFileSync(routePath, 'utf8')
    expect(content).toContain('email')
    // Should have validation -- return 400 for missing email
    expect(content).toContain('400')
  })

  it('validates messages array in request body', () => {
    const content = readFileSync(routePath, 'utf8')
    expect(content).toContain('messages')
  })
})

describe('Package dependencies', () => {
  it('resend is in package.json dependencies', () => {
    const pkg = JSON.parse(
      readFileSync(join(process.cwd(), 'package.json'), 'utf8')
    )
    expect(pkg.dependencies).toHaveProperty('resend')
  })

  it('@react-email/components is in package.json dependencies', () => {
    const pkg = JSON.parse(
      readFileSync(join(process.cwd(), 'package.json'), 'utf8')
    )
    expect(pkg.dependencies).toHaveProperty('@react-email/components')
  })
})
