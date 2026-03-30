// lib/chat/profile-types.ts

export interface ProfileFrontmatter {
  title?: string
  name?: string
  type?: string
  role?: string
  period?: string
  status?: string
  emphasis?: 'high' | 'medium' | 'low' | 'avoid'
  demonstrates_skills?: string[]
  narrative_weight?: number
  stories?: Story[]
  [key: string]: unknown
}

export interface Story {
  title: string
  demonstrates: string[]
  narrative: string
}

export interface ProfileFile {
  path: string
  frontmatter: ProfileFrontmatter
  content: string
}

export interface AudienceProfile {
  name: string
  values: string[]
  identity_lead: string
  identity_support: string
  emphasis_overrides: Record<string, string>
  content: string
}

export interface LoadedProfile {
  identity: ProfileFile
  preferences: ProfileFile
  personality: ProfileFile[]
  experiences: ProfileFile[]
  audience: AudienceProfile | null
}
