import { generateText } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import { getVisitorState, upsertVisitorState, VISITOR_TTL } from './visitor'

/**
 * Extract the main topic from a conversation via Claude Haiku and store it.
 *
 * Fire-and-forget: silently fails on any error (D-05).
 * Topics are stored FIFO, max 5, in visitor.topics[].
 * Uses claude-haiku-4-5 (cheapest Anthropic model) for cost efficiency.
 */
export async function extractAndStoreTopic(
  visitorId: string,
  conversationText: string
): Promise<void> {
  try {
    const { text } = await generateText({
      model: anthropic('claude-haiku-4-5'),
      prompt: `Summarize the main topic of this conversation in 3-5 words. Return ONLY the topic, nothing else.\n\n${conversationText}`,
      maxOutputTokens: 20,
    })

    const existing = await getVisitorState(visitorId)
    const currentTopics = existing?.topics ?? []
    const updatedTopics = [text.trim(), ...currentTopics].slice(0, 5)

    await upsertVisitorState(visitorId, { topics: updatedTopics })
  } catch (error) {
    // Fire-and-forget: failure is silent (D-05)
    console.error('Topic extraction failed:', error)
  }
}
