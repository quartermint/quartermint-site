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
    name: 'Relay',
    slug: 'relay',
    oneLiner: 'AI proxy trained on how you think so your team can move without you',
    problem:
      "You're the person everyone needs before a decision gets made. Your team stalls when you're not in the room. On a campaign, that means missed deadlines, duplicated work, and the person with the answer stuck in a meeting about something else.",
    solution:
      "Relay ingests how you communicate, your decision patterns, your operational instinct, and carries it forward so your team can move without waiting for you. It's your judgment, available at 2am when the war room needs an answer.",
    techBadge: 'TypeScript',
    isPublic: false,
    githubUrl: null,
    status: 'active',
    featured: true,
  },
  {
    name: 'Campaign Finance Dashboard',
    slug: 'campaign-finance-dashboard',
    oneLiner: 'Automated treasury operations for political organizations',
    problem:
      "PAC treasurers reconciling bank data against FEC reports by hand. Transactions in one system, compliance deadlines in another, balance monitoring in a third. By filing day, it's a scramble to make the numbers match.",
    solution:
      'Automated treasury scraping, transaction tracking, and real-time balance monitoring for a state PAC. One dashboard, always current, audit-ready by default.',
    techBadge: 'TypeScript',
    isPublic: false,
    githubUrl: null,
    status: 'active',
    featured: true,
  },
  {
    name: 'LifeVault',
    slug: 'lifevault',
    oneLiner: 'A decade of operational history, searchable in seconds',
    problem:
      "You wrote an email three years ago with the exact language you need for today's filing. You know it exists. Good luck finding it across ten years of inboxes, documents, and message threads.",
    solution:
      "LifeVault unifies a decade of email, documents, and operational records into one searchable surface. The past becomes a tool instead of an archive.",
    techBadge: 'Go',
    isPublic: false,
    githubUrl: null,
    status: 'active',
    featured: true,
  },
  {
    name: 'whatamivotingon',
    slug: 'whatamivotingon',
    oneLiner: 'Non-partisan ballot measure analyzer with plain-English explanations',
    problem:
      "Ballot measures are written in legalese that references existing statute by section number. A 'yes' vote might mean the opposite of what the title suggests. Even informed voters struggle to parse what they're actually voting for.",
    solution:
      "Parses changes to statute text, shows before/after diffs of what the law would actually change, with plain English explanations. Non-partisan. No editorial. Just clarity.",
    techBadge: 'TypeScript',
    isPublic: false,
    githubUrl: null,
    status: 'active',
    featured: true,
  },
]

export const featuredSystems = systems.filter((s) => s.featured)
export const shelfSystems: System[] = []
