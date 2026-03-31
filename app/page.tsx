import { getLatestCommit } from '@/lib/github'
import { SectionWrapper } from '@/components/section-wrapper'
import { ScrollContextProvider } from '@/components/scroll-context-provider'
import { HeroSection } from '@/components/hero-section'
import { FeaturedSystems } from '@/components/featured-systems'
import { ChatSection } from '@/components/chat/chat-section'
import { OriginStory } from '@/components/origin-story'
import { ContactInvestor } from '@/components/contact-investor'
import { KeyboardShortcutsModal } from '@/components/keyboard-shortcuts-modal'

export const revalidate = 3600

export default async function Home() {
  const signal = await getLatestCommit()

  return (
    <ScrollContextProvider>
      {/* 1. Hero -- bg (white), no entrance animation */}
      <SectionWrapper bg="bg" label="Hero" noAnimation id="hero-section">
        <HeroSection signal={signal} />
      </SectionWrapper>

      {/* 2. Chat -- surface (mint) */}
      <SectionWrapper bg="surface" label="Chat" id="chat-section">
        <ChatSection />
      </SectionWrapper>

      {/* 3. Origin Story -- bg (white) */}
      <SectionWrapper bg="bg" label="Origin Story" id="origin-story">
        <OriginStory />
      </SectionWrapper>

      {/* 4. Featured Systems -- surface (mint) */}
      <SectionWrapper bg="surface" label="Featured Systems" id="featured-systems">
        <FeaturedSystems />
      </SectionWrapper>

      {/* 5. Contact -- bg (white) */}
      <SectionWrapper bg="bg" label="Contact" id="contact-section">
        <ContactInvestor />
      </SectionWrapper>

      {/* Keyboard shortcuts modal -- ? key toggle, manages own state */}
      <KeyboardShortcutsModal />
    </ScrollContextProvider>
  )
}
