export interface System {
  name: string
  slug: string
  oneLiner: string
  problem: string
  solution: string
  techBadge: 'Go' | 'Swift' | 'TypeScript' | 'Python' | 'Raspberry Pi' | 'Go + Swift'
  isPublic: boolean
  githubUrl: string | null
  status: 'active' | 'paused'
  featured: boolean
}

export const systems: System[] = [
  // ── Featured Systems (4) ──────────────────────────────────────────────
  {
    name: 'LifeVault',
    slug: 'lifevault',
    oneLiner: 'Unified personal archive with full-text search across a decade of digital life',
    problem:
      "You've searched your own email for something you know you wrote, and couldn't find it. Now imagine that across a decade of email, photos, documents, and messages.",
    solution: 'LifeVault unifies it all into one searchable surface. 894K files indexed.',
    techBadge: 'Go',
    isPublic: false,
    githubUrl: null,
    status: 'active',
    featured: true,
  },
  {
    name: 'Relay',
    slug: 'relay',
    oneLiner: 'AI proxy trained on how you think so your team can move without you',
    problem:
      "You've been the person everyone needs in the room before a decision gets made. What happens when you can't be in every room at once?",
    solution:
      "Relay is an AI trained on how you actually think -- your messages, your meetings, your patterns. It carries your operational instinct so your team can move without waiting for you.",
    techBadge: 'TypeScript',
    isPublic: false,
    githubUrl: null,
    status: 'active',
    featured: true,
  },
  {
    name: 'OpenEFB',
    slug: 'openefb',
    oneLiner: 'Open-source iPad VFR electronic flight bag with unified flight planning',
    problem:
      "Every VFR pilot flight-plans with a patchwork of apps that don't talk to each other. Weather here, charts there, NOTAMs somewhere else.",
    solution:
      'OpenEFB brings it together in one open-source iPad app. MapLibre maps, dual database, privacy-first. Public repo.',
    techBadge: 'Swift',
    isPublic: true,
    githubUrl: 'https://github.com/quartermint/openefb',
    status: 'active',
    featured: true,
  },
  {
    name: 'v2cf',
    slug: 'v2cf',
    oneLiner: 'One-command Next.js migration from Vercel to Cloudflare Workers',
    problem:
      "Your Next.js app runs on Vercel. You want it on Cloudflare. The migration guide says 'rewrite your middleware, your API routes, your edge functions, your caching strategy.'",
    solution:
      'v2cf does it in one command. AST-based code transformation. 395 tests. Analyze, transform, deploy, validate.',
    techBadge: 'TypeScript',
    isPublic: true,
    githubUrl: 'https://github.com/quartermint/v2cf',
    status: 'active',
    featured: true,
  },

  // ── Shelf Systems (9) ─────────────────────────────────────────────────
  {
    name: 'msgvault',
    slug: 'msgvault',
    oneLiner: 'Unified message archiver for Gmail, iMessage, Google Voice, Slack, and any communication tool you plug in',
    problem: '',
    solution: '',
    techBadge: 'Go',
    isPublic: true,
    githubUrl: 'https://github.com/vanboompow/msgvault',
    status: 'active',
    featured: false,
  },
  {
    name: 'pixvault',
    slug: 'pixvault',
    oneLiner: 'Photo and media vault with metadata extraction and deduplication',
    problem: '',
    solution: '',
    techBadge: 'Go',
    isPublic: false,
    githubUrl: null,
    status: 'active',
    featured: false,
  },
  {
    name: 'drivevault',
    slug: 'drivevault',
    oneLiner: 'Cloud and local backup archiver for Google Drive, OneDrive, Dropbox, and computer file systems',
    problem: '',
    solution: '',
    techBadge: 'Go',
    isPublic: false,
    githubUrl: null,
    status: 'active',
    featured: false,
  },
  {
    name: 'Mainline',
    slug: 'mainline',
    oneLiner: 'Team workspace where chat, agent, and files live in the same layer',
    problem: '',
    solution: '',
    techBadge: 'Go + Swift',
    isPublic: false,
    githubUrl: null,
    status: 'active',
    featured: false,
  },
  {
    name: 'Mission Control',
    slug: 'mission-control',
    oneLiner: 'Operational dashboard aggregating project status and deployment health',
    problem: '',
    solution: '',
    techBadge: 'TypeScript',
    isPublic: false,
    githubUrl: null,
    status: 'active',
    featured: false,
  },
  {
    name: 'Sovereign Flight Recorder',
    slug: 'sovereign-flight-recorder',
    oneLiner: 'General aviation black box — flight recording with privacy-first on-device processing',
    problem: '',
    solution: '',
    techBadge: 'Swift',
    isPublic: false,
    githubUrl: null,
    status: 'active',
    featured: false,
  },
  {
    name: 'foundry',
    slug: 'foundry',
    oneLiner: 'AI chatbot to physical print — conversational 3D printing pipeline',
    problem: '',
    solution: '',
    techBadge: 'Python',
    isPublic: true,
    githubUrl: 'https://github.com/quartermint/foundry',
    status: 'active',
    featured: false,
  },
  {
    name: 'skygate',
    slug: 'skygate',
    oneLiner: 'Starlink bandwidth management appliance for general aviation aircraft',
    problem: '',
    solution: '',
    techBadge: 'Raspberry Pi',
    isPublic: true,
    githubUrl: 'https://github.com/quartermint/skygate',
    status: 'active',
    featured: false,
  },
  {
    name: 'open-ez',
    slug: 'open-ez',
    oneLiner: 'Plans-as-Code parametric design system for Long-EZ aircraft',
    problem: '',
    solution: '',
    techBadge: 'Python',
    isPublic: true,
    githubUrl: 'https://github.com/quartermint/open-ez',
    status: 'active',
    featured: false,
  },
]

export const featuredSystems = systems.filter((s) => s.featured)
export const shelfSystems = systems.filter((s) => !s.featured)
