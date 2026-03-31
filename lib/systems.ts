export interface SystemDetail {
  heading: string
  body: string
}

export interface System {
  name: string
  slug: string
  url: string | null
  oneLiner: string
  problem: string
  solution: string
  techBadge: 'Go' | 'Swift' | 'TypeScript' | 'Python' | 'Raspberry Pi' | 'Go + Swift'
  isPublic: boolean
  githubUrl: string | null
  status: 'active' | 'paused'
  featured: boolean
  detail: SystemDetail[] | null
}

export const systems: System[] = [
  // ── Featured Systems (4) ──────────────────────────────────────────────
  {
    name: 'whatamivotingon.com',
    slug: 'whatamivotingon',
    url: 'https://whatamivotingon.com',
    oneLiner: 'Non-partisan ballot measure analyzer with plain-English explanations',
    problem:
      "Ballot measures are written in legalese that references existing statute by section number. A 'yes' vote might mean the opposite of what the title suggests. Even informed voters struggle to parse what they're actually voting for.",
    solution:
      'Parses changes to statute text, shows before/after diffs of what the law would actually change, with plain English explanations. Non-partisan. No editorial. Just clarity.',
    techBadge: 'TypeScript',
    isPublic: false,
    githubUrl: null,
    status: 'active',
    featured: true,
    detail: null,
  },
  {
    name: 'Campaign Finance Dashboard',
    slug: 'campaign-finance-dashboard',
    url: '/systems/campaign-finance-dashboard',
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
    detail: [
      {
        heading: 'What It Does',
        body: "Connects directly to your bank's treasury portal, pulls transactions and balances daily, and presents everything in one dashboard. No more toggling between your bank, your spreadsheet, and your compliance calendar. Transactions are categorized, balances are tracked in real time, and when filing day comes, the numbers are already reconciled.",
      },
      {
        heading: 'Who It\'s For',
        body: 'PAC treasurers, campaign finance directors, and compliance officers at political organizations who are currently managing treasury operations across multiple disconnected systems. If you\'re reconciling bank data against FEC or state reports by hand, this replaces that process.',
      },
      {
        heading: 'How We Build It',
        body: "Every political organization's financial infrastructure is different. Different banks, different reporting requirements, different compliance calendars. We're working with design partners right now to build custom implementations for each organization. You tell us what's breaking in your treasury workflow, and we build the dashboard around your actual operations. Not a generic product you have to adapt to. A tool built for how your team actually works.",
      },
      {
        heading: 'Work With Us',
        body: "We're actively looking for PACs, campaigns, and political organizations to partner with on custom builds. If your treasury operations involve manual reconciliation, spreadsheet tracking, or compliance scrambles before filing deadlines, we should talk.",
      },
    ],
  },
  {
    name: 'LifeVault',
    slug: 'lifevault',
    url: '/systems/lifevault',
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
    detail: [
      {
        heading: 'What It Does',
        body: "LifeVault ingests your entire operational history: email, documents, messages, photos, files from cloud storage. It indexes everything with full-text search, so finding a specific email from three years ago takes seconds, not hours of scrolling through Gmail. Your past becomes a searchable resource instead of an inaccessible archive.",
      },
      {
        heading: 'Why It Matters for Operations',
        body: "In political operations, institutional knowledge walks out the door every cycle. The person who knew where that template was, who had the vendor contact, who remembered the exact language from the last filing. LifeVault makes that knowledge permanent and searchable. The organization's memory doesn't leave when people do.",
      },
      {
        heading: 'How We Build It',
        body: "LifeVault is built to be customized for each organization's data sources and search needs. We're working with design partners to build implementations tailored to specific operational workflows. Your email provider, your document storage, your communication tools. We connect to what you actually use and make it all searchable from one place.",
      },
      {
        heading: 'Work With Us',
        body: "If your organization has years of operational history scattered across inboxes, drives, and message threads that nobody can find when they need it, we should talk about building a LifeVault implementation for your team.",
      },
    ],
  },
  {
    name: 'Relay',
    slug: 'relay',
    url: '/systems/relay',
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
    detail: [
      {
        heading: 'What It Does',
        body: "Relay learns how you communicate, how you make decisions, and what your operational instincts are. It ingests your messages, your meeting patterns, your responses to common questions. Then it acts as your proxy, so when your team needs a decision at 2am and you're not available, they can ask Relay and get an answer that sounds like you, thinks like you, and carries your judgment forward.",
      },
      {
        heading: 'Why It Matters for Teams',
        body: "Every campaign and organization has a bottleneck person. The one who has to be in every meeting, sign off on every decision, answer every question before the team can move. Relay removes that bottleneck without removing the person's judgment. Your team moves faster because they can access your operational instinct on demand, without waiting for you to get out of a meeting.",
      },
      {
        heading: 'How We Build It',
        body: "Relay is trained on your actual communication. Your emails, your Slack messages, your meeting notes, your decision patterns. Every implementation is unique to the person it represents. We're working with design partners to build Relay instances for key decision-makers in political organizations, campaigns, and advocacy groups. The AI is only as good as the person it represents, and that takes careful calibration.",
      },
      {
        heading: 'Work With Us',
        body: "If you're the person your team can't move without, and you're tired of being the bottleneck, we should talk about building a Relay for you. We're looking for design partners who want to be the first to have their operational judgment available 24/7.",
      },
    ],
  },
]

export const featuredSystems = systems.filter((s) => s.featured)
export const shelfSystems: System[] = []
