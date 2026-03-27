import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { systems } from '@/lib/systems'

export function generateStaticParams() {
  return systems.map((system) => ({ slug: system.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const system = systems.find((s) => s.slug === slug)
  if (!system) return {}
  return {
    title: `${system.name} -- Ryan Stern`,
    description: system.oneLiner,
    openGraph: {
      title: `${system.name} -- Ryan Stern`,
      description: system.oneLiner,
      url: `https://quartermint.com/systems/${slug}`,
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: `${system.name} -- Ryan Stern`,
      description: system.oneLiner,
    },
    alternates: {
      canonical: `https://quartermint.com/systems/${slug}`,
    },
  }
}

export default async function SystemPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const system = systems.find((s) => s.slug === slug)
  if (!system) notFound()

  return (
    <div className="max-w-[var(--spacing-invest-max)] mx-auto px-4 sm:px-6 lg:px-8 py-[var(--spacing-section-mobile)] lg:py-[var(--spacing-section-desktop)]">
      <Link
        href="/#systems-shelf"
        className="font-body text-[14px] text-text-muted hover:text-text transition-colors"
      >
        &larr; Back to systems
      </Link>

      <h1 className="font-display text-[32px] lg:text-[40px] leading-[1.2] text-text mt-6 mb-2">
        {system.name}
      </h1>

      <p className="font-body text-[18px] leading-[1.5] text-text-muted mb-8">
        {system.oneLiner}
      </p>

      <div className="flex items-center gap-3 mb-8">
        <span className="font-body text-[13px] px-3 py-1 bg-surface rounded-[4px] text-text">
          {system.techBadge}
        </span>
        {system.isPublic && (
          <span className="font-body text-[13px] text-text-faint">
            Open Source
          </span>
        )}
        <span className="font-body text-[13px] text-text-faint capitalize">
          {system.status}
        </span>
      </div>

      {system.problem && (
        <>
          <h2 className="font-display text-[20px] leading-[1.3] text-text mt-8 mb-3">
            The Problem
          </h2>
          <p className="font-body text-[16px] leading-[1.7] text-text-muted">
            {system.problem}
          </p>
        </>
      )}

      {system.solution && (
        <>
          <h2 className="font-display text-[20px] leading-[1.3] text-text mt-8 mb-3">
            The Solution
          </h2>
          <p className="font-body text-[16px] leading-[1.7] text-text-muted">
            {system.solution}
          </p>
        </>
      )}

      {system.githubUrl && (
        <a
          href={system.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 min-h-[44px] min-w-[44px] px-6 mt-8 bg-accent text-text font-body text-[14px] font-semibold rounded-[6px]"
        >
          View on GitHub &rarr;
        </a>
      )}
    </div>
  )
}
