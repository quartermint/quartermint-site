import { getLatestCommit } from '@/lib/github'
import { SectionWrapper } from '@/components/section-wrapper'
import { ScrollContextProvider } from '@/components/scroll-context-provider'
import { HeroSection } from '@/components/hero-section'
import { FeaturedSystems } from '@/components/featured-systems'
import { ChatSection } from '@/components/chat/chat-section'
import { OriginStory } from '@/components/origin-story'
import { SystemsShelf } from '@/components/systems-shelf'
import { ContactInvestor } from '@/components/contact-investor'

export const revalidate = 3600

export default async function Home() {
  const signal = await getLatestCommit()

  return (
    <ScrollContextProvider>
      {/* 1. Hero -- bg (white), no entrance animation */}
      <SectionWrapper bg="bg" label="Hero" noAnimation id="hero-section">
        <HeroSection signal={signal} />
      </SectionWrapper>

      {/* 2. Featured Systems -- surface (mint) */}
      <SectionWrapper bg="surface" label="Featured Systems" id="featured-systems">
        <FeaturedSystems />
      </SectionWrapper>

      {/* 3. Chat -- bg (white) */}
      <SectionWrapper bg="bg" label="Chat" id="chat-section">
        <ChatSection />
      </SectionWrapper>

      {/* 4. Origin Story -- surface (mint) */}
      <SectionWrapper bg="surface" label="Origin Story" id="origin-story">
        <OriginStory />
      </SectionWrapper>

      {/* 5. Systems Shelf -- bg (white) */}
      <SectionWrapper bg="bg" label="Systems Shelf" id="systems-shelf">
        <SystemsShelf />
      </SectionWrapper>

      {/* 6. Contact + Investor -- surface (mint) */}
      <SectionWrapper bg="surface" label="Contact" id="contact-section">
        <ContactInvestor />
      </SectionWrapper>
    </ScrollContextProvider>
  )
}
