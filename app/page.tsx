import { getLatestCommit } from '@/lib/github'
import { SectionWrapper } from '@/components/section-wrapper'
import { HeroSection } from '@/components/hero-section'
import { FeaturedSystems } from '@/components/featured-systems'
import { ChatPlaceholder } from '@/components/chat-placeholder'
import { OriginStory } from '@/components/origin-story'
import { SystemsShelf } from '@/components/systems-shelf'
import { ContactInvestor } from '@/components/contact-investor'

export const revalidate = 3600

export default async function Home() {
  const signal = await getLatestCommit()

  return (
    <>
      {/* 1. Hero -- bg (white), no entrance animation */}
      <SectionWrapper bg="bg" label="Hero" noAnimation>
        <HeroSection signal={signal} />
      </SectionWrapper>

      {/* 2. Featured Systems -- surface (mint) */}
      <SectionWrapper bg="surface" label="Featured Systems" id="featured-systems">
        <FeaturedSystems />
      </SectionWrapper>

      {/* 3. Chat -- bg (white) */}
      <SectionWrapper bg="bg" label="Chat" id="chat-section">
        <ChatPlaceholder />
      </SectionWrapper>

      {/* 4. Origin Story -- surface (mint) */}
      <SectionWrapper bg="surface" label="Origin Story">
        <OriginStory />
      </SectionWrapper>

      {/* 5. Systems Shelf -- bg (white) */}
      <SectionWrapper bg="bg" label="Systems Shelf">
        <SystemsShelf />
      </SectionWrapper>

      {/* 6. Contact + Investor -- surface (mint) */}
      <SectionWrapper bg="surface" label="Contact">
        <ContactInvestor />
      </SectionWrapper>
    </>
  )
}
