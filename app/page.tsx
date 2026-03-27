import { getLatestCommit } from '@/lib/github'
import { SectionWrapper } from '@/components/section-wrapper'
import { HeroSection } from '@/components/hero-section'
import { FeaturedSystems } from '@/components/featured-systems'
import { ChatPlaceholder } from '@/components/chat-placeholder'

export const revalidate = 3600

export default async function Home() {
  const signal = await getLatestCommit()

  return (
    <>
      {/* 1. Hero -- white, no entrance animation (above the fold) */}
      <SectionWrapper bg="bg" label="Hero" noAnimation>
        <HeroSection signal={signal} />
      </SectionWrapper>

      {/* 2. Featured Systems -- mint */}
      <SectionWrapper bg="surface" label="Featured Systems" id="featured-systems">
        <FeaturedSystems />
      </SectionWrapper>

      {/* 3. Chat Placeholder -- white */}
      <SectionWrapper bg="bg" label="Chat" id="chat-section">
        <ChatPlaceholder />
      </SectionWrapper>

      {/* Remaining sections (Origin, Shelf, Contact, Footer) wired in Plan 02-03 */}
    </>
  )
}
