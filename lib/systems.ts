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
        body: "Connects to your bank's treasury portal and regulatory reporting bodies, pulls transactions and balances, and translates the information across all the tracking needs. Expense entry to compliance filing in one surface. The numbers reconcile themselves instead of you reconciling them on filing day.",
      },
      {
        heading: 'Who It\'s For',
        body: 'PAC managers, treasurers, and compliance officers who are currently toggling between their bank portal, a spreadsheet, and whatever reporting system the state requires. If the data lives in three places and you\'re the human glue holding it together, this replaces that.',
      },
      {
        heading: 'How It Works',
        body: "Every organization's financial infrastructure is different. Different banks, different state reporting requirements, different compliance calendars. The dashboard is built around your actual operations, not a template you have to adapt to.",
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
        body: "Ingests email, documents, messages, photos, and cloud storage into one searchable surface. Finding a specific email from three years ago takes seconds instead of scrolling through Gmail hoping you remember the right keyword.",
      },
      {
        heading: 'Why It Matters',
        body: "Institutional knowledge walks out the door every cycle. The person who knew where the template was, who had the vendor contact, who remembered the exact language from the last filing. LifeVault makes that knowledge permanent and searchable. The organization's memory doesn't depend on who's still around.",
      },
      {
        heading: 'How It Works',
        body: "Connects to your actual data sources: your email provider, document storage, communication tools. Everything indexed with full-text search from one place. Each implementation is tailored to the specific workflows and systems already in use.",
      },
    ],
  },
  {
    name: 'Prism',
    slug: 'prism',
    url: '/systems/prism',
    oneLiner: 'Identity discovery engine for undocumented careers',
    problem:
      "Most of the world's expertise has no resume. Family farmers, military veterans, tradespeople, small business owners. People with 15 years of real operational experience in industries that don't produce documentation. They know what they can do, but they can't say it in a new world's language.",
    solution:
      "Prism runs a structured interview, discovers what you actually know, and translates your operational experience into language that hiring managers, investors, and partners understand. Your identity, seen through someone else's eyes.",
    techBadge: 'TypeScript',
    isPublic: false,
    githubUrl: null,
    status: 'active',
    featured: true,
    detail: [
      {
        heading: 'What It Does',
        body: "Prism runs a structured conversational interview that maps real experience into a structured identity profile. It finds the patterns in what someone has done, names the skills they didn't know they had, and translates operational knowledge into language that hiring managers, investors, and partners actually understand.",
      },
      {
        heading: 'Why It Matters',
        body: "The resume is a broken format for anyone whose career didn't follow a traditional path. A decade running a family farm means supply chain expertise, financial planning skills, and crisis management instincts, but no document that says so. Prism bridges that gap.",
      },
      {
        heading: 'How It Works',
        body: "Each implementation starts with a real person and a real deadline. The interview pipeline adapts to industry background, and the synthesis engine produces identity artifacts tailored to where someone is going, not just where they've been.",
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
        body: "Relay ingests how you communicate, how you make decisions, and what your operational instincts are. Messages, meeting patterns, responses to common questions. It acts as your proxy so when the team needs a decision at 2am and you're unavailable, they get an answer that carries your judgment forward.",
      },
      {
        heading: 'Why It Matters',
        body: "Every campaign has a bottleneck person. The one who has to be in every meeting, sign off on every decision, answer every question before the team can move. Relay removes that bottleneck without removing the person's judgment. The team accesses your operational instinct on demand instead of waiting for you to get out of a meeting.",
      },
      {
        heading: 'How It Works',
        body: "Trained on actual communication: emails, Slack messages, meeting notes, decision patterns. Every implementation is unique to the person it represents. The AI is only as good as the person behind it, and that takes careful calibration.",
      },
    ],
  },
  {
    name: 'Open-EZ',
    slug: 'open-ez',
    url: '/systems/open-ez',
    oneLiner: 'Plans-as-Code parametric design for the Long-EZ aircraft',
    problem:
      "Legacy homebuilt aircraft plans are fragmented across scanned PDFs and unverified CAD files. Dimensions get transcribed by hand. Scaling errors lead to structural failure. Builders spend months reconciling documents that should be a single source of truth.",
    solution:
      "Open-EZ treats the aircraft's physical definition as executable Python code. Dimensions are derived algorithmically, manufacturing artifacts are generated automatically, and every change is version-controlled and aerodynamically validated.",
    techBadge: 'Python',
    isPublic: true,
    githubUrl: 'https://github.com/quartermint/open-ez',
    status: 'active',
    featured: true,
    detail: [
      {
        heading: 'What It Does',
        body: "Open-EZ is a parametric design environment for the Rutan Long-EZ (Model 61). The aircraft geometry is defined in Python using CadQuery, validated against NASA's OpenVSP for aerodynamic stability, and exported directly to CNC G-code and 3D-printable assembly jigs. Change a parameter and the entire aircraft updates: geometry, toolpaths, and compliance documentation.",
      },
      {
        heading: 'Why Plans-as-Code',
        body: "Static drawings can't catch errors until someone builds the wrong part. Code catches them at generation time. Every dimension traces back to a single algorithmic source of truth. Version control means every change is reviewable. The safety default is the Roncz R1145MS rain canard. The system won't let you build a canard that loses lift in wet conditions.",
      },
      {
        heading: 'Open Source',
        body: "Open-EZ is open source under Apache 2.0. The homebuilt aircraft community has been sharing plans for decades. We're making them executable. Contributions welcome from builders, aerodynamicists, and anyone who thinks aircraft plans should be code, not PDFs.",
      },
    ],
  },
]

export const featuredSystems = systems.filter((s) => s.featured)
export const shelfSystems: System[] = []
