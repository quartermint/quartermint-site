import { getRelativeTime, isStale } from './relative-time'

export interface CommitInfo {
  repo: string
  date: string
  relativeTime: string
}

export async function getLatestCommit(): Promise<CommitInfo | null> {
  const reposEnv = process.env.SIGNAL_REPOS
  if (!reposEnv || reposEnv.trim() === '') return null

  const repos = reposEnv.split(',').map((r) => r.trim()).filter(Boolean)
  if (repos.length === 0) return null

  try {
    const commits = await Promise.all(
      repos.map(async (repo) => {
        try {
          const res = await fetch(
            `https://api.github.com/repos/${repo}/commits?per_page=1`,
            { next: { revalidate: 3600 } }
          )
          if (!res.ok) return null
          const data = await res.json()
          if (!Array.isArray(data) || !data[0]) return null
          return {
            repo: repo.split('/')[1] ?? repo,
            date: data[0].commit.author.date as string,
          }
        } catch {
          return null
        }
      })
    )

    const valid = commits.filter(
      (c): c is { repo: string; date: string } => c !== null
    )
    if (valid.length === 0) {
      return getFallback()
    }

    const latest = valid.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )[0]

    // Check for staleness (>14 days)
    if (isStale(latest.date, 14)) {
      return getFallback() ?? {
        repo: latest.repo,
        date: latest.date,
        relativeTime: getRelativeTime(latest.date),
      }
    }

    return {
      repo: latest.repo,
      date: latest.date,
      relativeTime: getRelativeTime(latest.date),
    }
  } catch {
    return getFallback()
  }
}

function getFallback(): CommitInfo | null {
  const fallback = process.env.FALLBACK_SIGNAL
  if (fallback) {
    return { repo: 'fallback', date: '', relativeTime: fallback }
  }
  return null
}
