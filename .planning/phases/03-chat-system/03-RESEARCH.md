# Phase 3: Chat System - Research

**Researched:** 2026-03-26
**Domain:** AI SDK v6 streaming chat, Upstash rate limiting, Next.js 16 route handlers, persona system prompt engineering
**Confidence:** HIGH

## Summary

Phase 3 builds an embedded AI chat with streaming responses, a persona system prompt informed by identityvault biographical data, three-tier rate limiting (cookie session + IP hard cap + budget alert), and all required interaction states. The core technical challenge is building on AI SDK v6 from scratch (not porting Stripped's v3 patterns), integrating Upstash Redis for rate limiting and conversation logging, and curating ~2K tokens of identity data into an effective persona prompt.

The Vercel Hobby plan blocker from STATE.md is **resolved**: Fluid Compute is enabled by default on all new Vercel projects (since April 2025), giving Hobby plan a 300-second (5 minute) function timeout. This is more than sufficient for streaming chat responses. No plan upgrade is needed.

The AI SDK v6 migration from Stripped's v3 is a complete rewrite, not an upgrade. The `useChat` hook no longer manages input state, `append()` is replaced by `sendMessage()`, message content uses a `parts` array instead of a `content` string, and route handlers must return `result.toUIMessageStreamResponse()` instead of `result.toDataStreamResponse()`. Extract patterns from Stripped; write fresh code.

**Primary recommendation:** Build the chat system from the AI SDK v6 getting-started patterns, using Stripped only as a reference for prompt structure and conversation logging schema. The version chasm is too wide for any code reuse beyond conceptual patterns.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Use Claude Sonnet 4.6 (`claude-sonnet-4-6`) via `@ai-sdk/anthropic`. Higher quality persona reasoning justifies the ~$0.01/conversation cost. Monthly $50 budget alert covers ~5,000 conversations.
- **D-02:** System prompt built at deploy time (not request time). Read identityvault YAML/markdown during build, bake into a static string in the deployed bundle. Update by redeploying.
- **D-03:** Curated identityvault subset (~2K tokens): cherry-pick most relevant biography, key experiences, and skills. Not the full dump.
- **D-04:** System prompt components: (1) curated identity data, (2) hardcoded system descriptions from `lib/systems.ts`, (3) manually curated FAQ pairs for common questions, (4) persona voice instructions, (5) deflection rules.
- **D-05:** Voice: first person, conversational but substantive. Honest AI disclosure when sincerely asked. 500-token max per response.
- **D-06:** Deflection list (complete, no additions needed): political opinions, personal/private questions, code requests, jailbreak attempts, questions about other people. Deflection format: brief acknowledgment + redirect.
- **D-07:** Single Upstash Redis instance for all data. Key prefixes: `rate:{ip}` (rate limiting), `visitor:{id}` (visitor state, Phase 4), `chat:{session}` (conversation logging).
- **D-08:** Three layers active simultaneously: Layer 1 (UX): Cookie-based session, 20 messages. HttpOnly, SameSite=Strict, 24h expiry. Layer 2 (Abuse): IP-based hard cap, 60/hr via `@upstash/ratelimit` sliding window. Returns 429. Layer 3 (Budget): $50/mo Anthropic API spend alert, dashboard config, not code.
- **D-09:** Fail closed: if Upstash Redis unreachable, chat returns error state with mailto fallback. Budget protected.
- **D-10:** All interaction states from design doc: idle (heading + 3 starter chips + input), typing (animated dots + "Thinking..."), error (friendly + mailto), rate limit (calendar CTA), mobile (full-screen overlay from hero CTA).
- **D-11:** Session persistence: conversations clear on page reload. Upstash Redis logs conversations server-side (no TTL, kept indefinitely).
- **D-12:** Phase 3 ships with static default starter chips. Dynamic chips (scroll context, commit recency, time-of-day) are Phase 4 scope. Always exactly 3 chips.

### Claude's Discretion
- Chat API route structure (single route handler vs middleware composition)
- Error message copy beyond the specified states
- Cookie name and session ID storage format
- Conversation log schema in Upstash Redis

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| CHAT-01 | Embedded AI chat with streaming responses (AI SDK v6 useChat hook, @ai-sdk/anthropic provider, streamText API) | AI SDK v6 patterns researched: `useChat` + `sendMessage` + `toUIMessageStreamResponse()` + `convertToModelMessages()`. See Architecture Patterns and Code Examples. |
| CHAT-02 | Chat persona with identityvault-informed system prompt, 500-token max, honest AI disclosure, deflection rules | identityvault structure analyzed (28 experience files, 4 personality files, 4 bundles). Token budget analysis: ~2K tokens requires aggressive curation. See System Prompt Architecture pattern. |
| CHAT-03 | Three-layer rate limiting: cookie (20/session), IP (60/hr via Upstash), $50/mo budget alert | Upstash ratelimit sliding window API confirmed. Cookie management via Next.js `cookies()` async API. Budget alert is dashboard-only. See Rate Limiting Architecture pattern. |
| CHAT-04 | Privacy notice below chat input linking to /privacy | Pure UI element; no research dependency. Phase 2 creates /privacy route. |
| CHAT-05 | Chat interaction states: idle, typing, error, rate limit, mobile overlay | AI SDK v6 `status` field provides: 'submitted', 'streaming', 'ready', 'error'. Map to required states. See Interaction States pattern. |
| CHAT-06 | Chat container styling (box-shadow, border-radius, max-width, heading) | Pure CSS; design doc specifies exact values. No research dependency. |
| ENG-01 | Smart starter chips (static defaults only in Phase 3, exactly 3 chips) | Stripped pattern: `STARTER_QUESTIONS` array + `sendMessage()` on click. Disappear after first message sent. |
</phase_requirements>

## Standard Stack

### Core (Phase 3 specific -- installed during this phase)

| Library | Version | Purpose | Verified |
|---------|---------|---------|----------|
| `ai` | 6.0.138 | Core AI SDK: `streamText`, `convertToModelMessages`, `UIMessage` | npm registry 2026-03-26 |
| `@ai-sdk/anthropic` | 3.0.64 | Anthropic provider: `anthropic('claude-sonnet-4-6')` | npm registry 2026-03-26 |
| `@ai-sdk/react` | 3.0.140 | React hooks: `useChat`, `sendMessage`, streaming status | npm registry 2026-03-26 |
| `@upstash/redis` | 1.37.0 | HTTP-based Redis client for conversation logging | npm registry 2026-03-26 |
| `@upstash/ratelimit` | 2.0.8 | Serverless rate limiting with sliding window algorithm | npm registry 2026-03-26 |
| `react-markdown` | 10.1.0 | Render chat AI responses as markdown | npm registry 2026-03-26 |
| `remark-gfm` | 4.0.1 | GitHub-flavored markdown in chat responses | npm registry 2026-03-26 |

### Pre-existing (installed in Phase 1)

| Library | Version | Purpose |
|---------|---------|---------|
| `next` | 16.2.x | App Router, route handlers, `cookies()` async API |
| `react` | 19.x | UI rendering, hooks |
| `typescript` | ~5.7 | Type safety |
| `tailwindcss` | 4.2.x | Styling via `@theme` CSS custom properties |

### Installation

```bash
npm install ai@^6.0 @ai-sdk/anthropic@^3.0 @ai-sdk/react@^3.0 @upstash/redis@^1.37 @upstash/ratelimit@^2.0 react-markdown@^10.1 remark-gfm@^4.0
```

## Architecture Patterns

### Recommended Project Structure (Phase 3 additions)

```
app/
  api/
    chat/
      route.ts           # Streaming chat endpoint (POST)
  (components)/          # Or components/ at root
    chat/
      chat-container.tsx  # Container with heading, shadow, max-width
      chat-interface.tsx  # Main chat logic (useChat, input, messages)
      chat-message.tsx    # Individual message bubble with react-markdown
      chat-input.tsx      # Input field + send button
      starter-chips.tsx   # Static 3-chip selector
      chat-overlay.tsx    # Mobile full-screen overlay
      chat-states.tsx     # Typing indicator, error, rate-limit states
lib/
  chat/
    system-prompt.ts     # Deploy-time prompt builder (reads identityvault at build)
    conversation-log.ts  # Upstash Redis conversation CRUD
    rate-limit.ts        # Three-tier rate limiting logic
    redis.ts             # Shared Upstash Redis client instance
    types.ts             # Chat-specific TypeScript interfaces
```

### Pattern 1: AI SDK v6 Route Handler (Streaming Chat)

**What:** A Next.js App Router route handler that receives messages, checks rate limits, calls Claude via streamText, logs conversations, and streams responses back.

**Critical difference from Stripped:** In AI SDK v6, `streamText` returns a result with `toUIMessageStreamResponse()` (not `toDataStreamResponse()`). The messages from the client are `UIMessage[]` and must be converted via `convertToModelMessages()` before passing to the model.

**Example:**
```typescript
// app/api/chat/route.ts
// Source: https://ai-sdk.dev/docs/getting-started/nextjs-app-router

import { streamText, UIMessage, convertToModelMessages } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { cookies, headers } from 'next/headers';
import { buildSystemPrompt } from '@/lib/chat/system-prompt';
import { checkAllRateLimits } from '@/lib/chat/rate-limit';
import { logConversation } from '@/lib/chat/conversation-log';

export const maxDuration = 60; // 60s is conservative; Hobby allows 300s with Fluid Compute

export async function POST(req: Request) {
  try {
    // Next.js 16: cookies() and headers() are async
    const cookieStore = await cookies();
    const headersList = await headers();

    const ip = headersList.get('x-forwarded-for')?.split(',')[0] || 'unknown';

    // Three-tier rate limit check (cookie + IP + fail-closed)
    const rateCheck = await checkAllRateLimits(ip, cookieStore);
    if (!rateCheck.allowed) {
      return new Response(
        JSON.stringify({ error: rateCheck.message }),
        { status: rateCheck.statusCode, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { messages, sessionId }: { messages: UIMessage[]; sessionId: string } = await req.json();

    const result = streamText({
      model: anthropic('claude-sonnet-4-6'),
      system: buildSystemPrompt(),
      messages: await convertToModelMessages(messages),
      maxOutputTokens: 500,
      onFinish: async ({ text }) => {
        await logConversation(sessionId, messages, text, ip);
      },
    });

    // Update cookie-based session counter
    cookieStore.set('qm_chat_count', String(rateCheck.newCount), {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 86400, // 24 hours
      path: '/',
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(
      JSON.stringify({
        error: "I'm temporarily offline. You can reach Ryan directly at ryan@quartermint.com.",
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
```

### Pattern 2: AI SDK v6 Client-Side Chat (useChat)

**What:** The client component using `useChat` from `@ai-sdk/react`. In v6, the hook no longer manages input state -- you must manage `input` with `useState` and call `sendMessage()` instead of `append()`.

**Critical v3 -> v6 changes:**
- `input`, `handleInputChange`, `handleSubmit` are REMOVED from useChat return
- Use `sendMessage({ text: input })` instead of `append({ role: 'user', content: text })`
- Messages use `parts` array, not `content` string
- `isLoading` is replaced by `status` field ('submitted' | 'streaming' | 'ready' | 'error')
- `error` is still available as a return value

**Example:**
```typescript
// components/chat/chat-interface.tsx
// Source: https://ai-sdk.dev/docs/reference/ai-sdk-ui/use-chat

'use client';

import { useChat } from '@ai-sdk/react';
import { useState, useRef, useEffect } from 'react';
import { ChatMessage } from './chat-message';
import { StarterChips } from './starter-chips';

export function ChatInterface() {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { messages, sendMessage, status, error } = useChat({
    api: '/api/chat',
    body: { sessionId: getOrCreateSessionId() },
  });

  const isStreaming = status === 'streaming' || status === 'submitted';
  const hasUserMessage = messages.some((m) => m.role === 'user');

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Return focus after streaming completes
  useEffect(() => {
    if (status === 'ready') {
      inputRef.current?.focus();
    }
  }, [status]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;
    sendMessage({ text: input });
    setInput('');
  };

  const handleChipClick = (question: string) => {
    sendMessage({ text: question });
  };

  return (
    <div>
      {/* Message list */}
      <div role="log" aria-live="polite">
        {messages.map((m) => (
          <ChatMessage key={m.id} message={m} />
        ))}
        {!hasUserMessage && status === 'ready' && (
          <StarterChips onSelect={handleChipClick} />
        )}
        {isStreaming && <TypingIndicator />}
        {error && <ErrorFallback error={error} />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input form */}
      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything..."
          aria-label="Type your message"
          disabled={isStreaming}
        />
        <button type="submit" disabled={isStreaming || !input.trim()}>
          Send
        </button>
      </form>
    </div>
  );
}
```

### Pattern 3: Message Rendering with Parts (v6)

**What:** In AI SDK v6, messages use a `parts` array instead of a `content` string. Each part has a `type` field ('text', 'tool-invocation', etc.). For this chat, only text parts are relevant.

**Example:**
```typescript
// components/chat/chat-message.tsx

import type { UIMessage } from 'ai';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export function ChatMessage({ message }: { message: UIMessage }) {
  return (
    <div className={message.role === 'user' ? 'user-message' : 'assistant-message'}>
      {message.parts.map((part, i) => {
        if (part.type === 'text') {
          return message.role === 'assistant' ? (
            <ReactMarkdown key={`${message.id}-${i}`} remarkPlugins={[remarkGfm]}>
              {part.text}
            </ReactMarkdown>
          ) : (
            <p key={`${message.id}-${i}`}>{part.text}</p>
          );
        }
        return null;
      })}
    </div>
  );
}
```

### Pattern 4: Rate Limiting Architecture (Three-Tier)

**What:** Three simultaneous rate limiting layers. Layer 1 uses an HttpOnly cookie for UX limits. Layer 2 uses `@upstash/ratelimit` sliding window for abuse prevention. Layer 3 is dashboard-only.

**Example:**
```typescript
// lib/chat/rate-limit.ts

import { Ratelimit } from '@upstash/ratelimit';
import { redis } from './redis';

// Layer 2: IP-based hard cap -- 60 requests per hour, sliding window
const ipLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(60, '1 h'),
  prefix: 'rate',
  analytics: true,
});

interface RateLimitResult {
  allowed: boolean;
  message: string;
  statusCode: number;
  newCount: number;
}

export async function checkAllRateLimits(
  ip: string,
  cookieStore: Awaited<ReturnType<typeof import('next/headers').cookies>>
): Promise<RateLimitResult> {
  // Layer 1: Cookie-based session limit (20 messages)
  const countStr = cookieStore.get('qm_chat_count')?.value;
  const currentCount = countStr ? parseInt(countStr, 10) : 0;

  if (currentCount >= 20) {
    return {
      allowed: false,
      message: "You've used your 20 messages for this session. Want to continue the conversation? Book a call.",
      statusCode: 429,
      newCount: currentCount,
    };
  }

  // Layer 2: IP-based hard cap via Upstash (fail-closed)
  try {
    const { success, remaining } = await ipLimiter.limit(ip);
    if (!success) {
      return {
        allowed: false,
        message: 'Rate limit exceeded. Please try again later.',
        statusCode: 429,
        newCount: currentCount,
      };
    }
  } catch (error) {
    // D-09: Fail closed -- Redis unreachable means deny
    console.error('Rate limit Redis error:', error);
    return {
      allowed: false,
      message: "Chat is temporarily unavailable. Reach out to ryan@quartermint.com.",
      statusCode: 503,
      newCount: currentCount,
    };
  }

  return {
    allowed: true,
    message: '',
    statusCode: 200,
    newCount: currentCount + 1,
  };
}
```

### Pattern 5: System Prompt Architecture (Deploy-Time Build)

**What:** System prompt is built at deploy time from curated identityvault data. The prompt builder reads markdown files from a local directory (copied into the project at build time or read from a sibling directory) and assembles a static string.

**Key constraint:** D-03 specifies ~2K tokens. The full identityvault is ~16,800 tokens across all experience files. Aggressive curation is required.

**Token budget breakdown for ~2K tokens (~1,500 words):**
- Identity core (~150 words): Core positioning + background arc from `identity.md`
- Throughline thesis (~100 words): Condensed from `personality/throughline.md`
- Key systems (~200 words): 4-5 most relevant systems from `lib/systems.ts` (already in codebase from Phase 1)
- Communication style (~100 words): Voice directives from `personality/tone.md`
- FAQ pairs (~200 words): 4-5 manually curated Q&A for common questions
- Deflection rules (~100 words): D-06 deflection categories
- Persona instructions (~150 words): AI disclosure, honesty rules, no em-dashes, response length cap
- Total: ~1,000 words / ~1,350 tokens for curated data + ~500 words / ~650 tokens for instructions = ~2,000 tokens

**Curated identityvault files to include:**
1. `identity.md` -- Core positioning, background arc (extract ~150 words)
2. `personality/throughline.md` -- The information routing thesis (extract ~100 words)
3. `personality/tone.md` -- Communication style directives (extract ~80 words)
4. `personality/edges.md` -- Honest weaknesses and boundaries (extract ~80 words)
5. `experiences/quartermint-builder.md` -- Technical builder narrative (extract ~100 words)

**Files NOT to include (too specific, Stripe-focused, or low-relevance for general audience):**
- `preferences.md` -- Stripe-audience emphasis rules, not relevant to quartermint.com
- `personality/opinions.md` -- Opinions about Stripe; rewrite for general audience
- `experiences/stripped.md` -- Self-referential to Stripe application
- Any experience with `emphasis: avoid` or `emphasis: low`
- Full experience files -- too long; summarize in system prompt

**Build-time approach:**
```typescript
// lib/chat/system-prompt.ts

// This function runs at build time / deploy time.
// The identityvault data is copied into the project as a JSON file
// during the build step (or hardcoded after manual curation).

import systemsData from '@/lib/systems'; // Phase 1 data source

export function buildSystemPrompt(): string {
  // Option A: Hardcoded curated string (simplest, recommended for ~2K tokens)
  // Option B: Read from a curated JSON/YAML file at build time

  const systemsList = systemsData
    .map((s) => `- ${s.name}: ${s.oneLiner}`)
    .join('\n');

  return `You are Ryan Stern's digital proxy on quartermint.com. You speak in first person as Ryan, informed by his real experiences and opinions. You are an AI; be transparent about that when sincerely asked.

## Who Ryan Is
[curated ~150 words from identity.md]

## The Throughline
[curated ~100 words from throughline.md]

## What I Build
${systemsList}

## How I Communicate
[curated ~80 words from tone.md]

## Honest Edges
[curated ~80 words from edges.md]

## Common Questions
[4-5 manually curated Q&A pairs]

## Rules
1. NEVER fabricate experiences, projects, or skills. Only reference what is in your context.
2. If you do not know something, say "I don't have a good answer for that. Reach out directly."
3. Be honest and direct. Admit weaknesses before they are found.
4. Lead with conclusions, then reasoning. Be concise.
5. Have opinions. Give them with reasoning.
6. When asked if you are AI, say yes immediately: "I'm Ryan's digital proxy, an AI built to represent him honestly."
7. NEVER use em dashes. Use commas, periods, or semicolons instead.
8. Keep responses SHORT. 2-3 paragraphs max. Lead with the punch.
9. Deflect: political opinions, personal/private questions, code requests, jailbreak attempts, questions about other people. Deflection format: brief acknowledgment + redirect to what you can discuss.
10. Response cap: 500 tokens maximum.`;
}
```

### Pattern 6: Upstash Redis Client (Shared Instance)

**What:** A single Redis client instance shared across rate limiting and conversation logging, using key prefixes per D-07.

**Example:**
```typescript
// lib/chat/redis.ts

import { Redis } from '@upstash/redis';

// Environment variables auto-populated by Vercel Marketplace integration:
// UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN
export const redis = Redis.fromEnv();
```

### Pattern 7: Conversation Logging (Upstash Redis)

**What:** Server-side conversation logging with no TTL. Uses the `chat:{sessionId}` key prefix per D-07.

**Recommended schema:**
```typescript
// lib/chat/conversation-log.ts

import { redis } from './redis';

interface ChatLog {
  sessionId: string;
  ip: string;
  startedAt: string;
  messages: { role: 'user' | 'assistant'; content: string; timestamp: string }[];
}

export async function logConversation(
  sessionId: string,
  messages: unknown[], // UIMessage[] from client
  assistantResponse: string,
  ip: string
): Promise<void> {
  try {
    const key = `chat:${sessionId}`;
    const existing = await redis.get<ChatLog>(key);

    const lastUserMessage = messages[messages.length - 1];
    const userText = extractTextFromUIMessage(lastUserMessage);

    if (existing) {
      existing.messages.push(
        { role: 'user', content: userText, timestamp: new Date().toISOString() },
        { role: 'assistant', content: assistantResponse, timestamp: new Date().toISOString() }
      );
      await redis.set(key, existing);
    } else {
      const log: ChatLog = {
        sessionId,
        ip,
        startedAt: new Date().toISOString(),
        messages: [
          { role: 'user', content: userText, timestamp: new Date().toISOString() },
          { role: 'assistant', content: assistantResponse, timestamp: new Date().toISOString() },
        ],
      };
      await redis.set(key, log);
      // Index for Phase 5 weekly digest
      await redis.lpush('chat:index', sessionId);
    }
  } catch (error) {
    // Logging failure should not break chat -- silently fail
    console.error('Conversation log error:', error);
  }
}

function extractTextFromUIMessage(msg: unknown): string {
  // UIMessage parts array: extract text parts
  if (msg && typeof msg === 'object' && 'parts' in msg) {
    const parts = (msg as { parts: { type: string; text?: string }[] }).parts;
    return parts
      .filter((p) => p.type === 'text')
      .map((p) => p.text || '')
      .join('');
  }
  // Fallback for simple message format
  if (msg && typeof msg === 'object' && 'content' in msg) {
    return String((msg as { content: string }).content);
  }
  return '';
}
```

### Pattern 8: Interaction States (Chat UI States)

**What:** Map AI SDK v6 `status` values to the 5 required interaction states from D-10.

| AI SDK v6 `status` | Required State | UI Behavior |
|---------------------|----------------|-------------|
| `'ready'` + no messages | Idle | Heading + 3 starter chips + input |
| `'ready'` + has messages | Active | Messages + input |
| `'submitted'` or `'streaming'` | Typing | Animated dots + "Thinking..." label |
| `'error'` | Error | Friendly fallback + mailto CTA |
| `'ready'` + rate limit error in response | Rate limit | CTA to book a call |
| (mobile context) | Mobile overlay | Full-screen overlay triggered by hero CTA |

**Rate limit detection:** The 429 response from the route handler will cause an `error` in the `useChat` hook. Parse the error message or status code to distinguish rate-limit errors from general errors.

### Anti-Patterns to Avoid

- **Do NOT port Stripped code line-by-line.** AI SDK v3 patterns (`input`, `handleInputChange`, `handleSubmit`, `append`, `content` string) are all removed or renamed in v6. Start fresh from v6 patterns.
- **Do NOT use `toDataStreamResponse()`.** This is the v4 method. v6 uses `toUIMessageStreamResponse()`.
- **Do NOT use `@vercel/kv`.** It is deprecated and unavailable for new projects. Use `@upstash/redis`.
- **Do NOT use `middleware.ts`.** Renamed to `proxy.ts` in Next.js 16. But for this phase, rate limiting happens inside the route handler, not in proxy.
- **Do NOT put rate limiting in proxy.ts.** Rate limiting requires Redis calls; proxy.ts should stay thin. Handle rate limiting inside the API route handler.
- **Do NOT dump the entire identityvault into the system prompt.** 28 experience files = ~16,800 tokens. The budget is ~2K tokens. Curate aggressively.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| IP rate limiting | Custom counter with Redis SET/GET | `@upstash/ratelimit` with `Ratelimit.slidingWindow(60, '1 h')` | Sliding window algorithm handles edge cases (window boundaries, atomic operations, race conditions). Custom implementations leak requests at window boundaries. |
| Streaming chat protocol | Custom SSE/WebSocket implementation | `streamText().toUIMessageStreamResponse()` + `useChat()` | AI SDK handles the streaming protocol, message lifecycle (start/delta/end events), reconnection, and error handling. Hand-rolling this is hundreds of lines of bug-prone code. |
| Chat message rendering | Custom markdown parser | `react-markdown` + `remark-gfm` | Safe rendering (no raw HTML injection), React component output, GFM table support. Markdown parsing has many edge cases. |
| Cookie management | Manual Set-Cookie headers | Next.js `cookies()` API | HttpOnly, SameSite, expiry all handled correctly. Avoids header serialization bugs. |
| Redis client | `ioredis` or raw HTTP calls | `@upstash/redis` with `Redis.fromEnv()` | HTTP-based/connectionless, works on serverless without connection pool management. Auto-reads Vercel Marketplace env vars. |

**Key insight:** The AI SDK v6 streaming protocol is the single biggest "don't hand-roll" item. It manages message lifecycle events (text-start, text-delta, text-end), unique message IDs, concurrent streaming, error recovery, and reconnection. This is not a simple SSE stream.

## Common Pitfalls

### Pitfall 1: Using AI SDK v3/v4 Patterns in v6
**What goes wrong:** Code uses `input`, `handleInputChange`, `handleSubmit`, `append()`, `content` string, or `toDataStreamResponse()`. These are all removed or renamed in v6.
**Why it happens:** Stripped uses v3 patterns. Training data and tutorials may reference older versions.
**How to avoid:** Use ONLY these v6 patterns: `sendMessage()`, `message.parts` array, `status` field, `toUIMessageStreamResponse()`, manual input state with `useState`.
**Warning signs:** TypeScript errors about missing properties, runtime "X is not a function" errors.

### Pitfall 2: Synchronous cookies()/headers() in Next.js 16
**What goes wrong:** Calling `cookies()` or `headers()` without `await` causes runtime errors.
**Why it happens:** Next.js 16 made these APIs async (they were sync in 14/15). Old patterns and training data show synchronous usage.
**How to avoid:** Always `const cookieStore = await cookies()` and `const headersList = await headers()` in route handlers.
**Warning signs:** "Cannot access Request information synchronously" error.

### Pitfall 3: toDataStreamResponse() Instead of toUIMessageStreamResponse()
**What goes wrong:** Streaming works but client-side `useChat` cannot parse the response correctly.
**Why it happens:** `toDataStreamResponse()` is the v4 method. v5+ requires `toUIMessageStreamResponse()` which uses a different protocol with lifecycle events (text-start/delta/end).
**How to avoid:** Always use `result.toUIMessageStreamResponse()` in the route handler.
**Warning signs:** Client receives raw chunks but messages don't render; status stays stuck on 'submitted'.

### Pitfall 4: Not Handling convertToModelMessages() as Async
**What goes wrong:** TypeScript error or runtime error when passing UI messages directly to streamText.
**Why it happens:** In AI SDK v6, `convertToModelMessages()` is async (to support async Tool.toModelOutput()). Forgetting `await` passes a Promise instead of messages.
**How to avoid:** Always `messages: await convertToModelMessages(messages)`.
**Warning signs:** Model receives empty or malformed messages.

### Pitfall 5: Fail-Open Rate Limiting
**What goes wrong:** Redis outage causes rate limiting to silently pass all requests, allowing unlimited API spend.
**Why it happens:** Try/catch around Redis calls defaults to "allow" on error.
**How to avoid:** Per D-09, fail CLOSED. Redis unreachable = chat unavailable with mailto fallback. The catch block MUST return an error response, not allow the request through.
**Warning signs:** Anthropic bill spikes during Redis maintenance.

### Pitfall 6: System Prompt Token Budget Blowout
**What goes wrong:** System prompt exceeds ~2K tokens, eating into the 500-token response budget and increasing per-request cost.
**Why it happens:** Including too much identityvault content. The full public bundle is ~2,900 tokens; all experiences are ~16,800 tokens.
**How to avoid:** Curate aggressively. Count tokens explicitly (1 token ~= 0.75 words). Keep the prompt under 1,500 words. Use the token budget breakdown in Pattern 5.
**Warning signs:** Responses feel truncated; API cost per conversation exceeds ~$0.01.

### Pitfall 7: Cookie Counter Race Condition
**What goes wrong:** Multiple rapid requests increment the cookie counter inconsistently, allowing more than 20 messages.
**Why it happens:** Cookie is read at request start, updated at response time. Two concurrent requests both read count=19 and both succeed.
**How to avoid:** This is an acceptable edge case for a UX-tier rate limit. Layer 2 (IP rate limiter) is the abuse-prevention backstop. The cookie limit is UX guidance, not security.
**Warning signs:** Users occasionally get 21-22 messages per session. This is fine.

### Pitfall 8: Missing Error State Distinction
**What goes wrong:** All errors show the same message, whether it's a rate limit, API error, or network failure.
**Why it happens:** AI SDK v6's `error` object doesn't distinguish 429 from 500. The error message from the route handler is the only signal.
**How to avoid:** Use structured error responses from the route handler: include a `type` field ('rate_limit', 'error', 'unavailable') alongside the `error` message. Parse this on the client to show the correct UI state.
**Warning signs:** Rate-limited users see "temporarily offline" instead of "book a call" CTA.

## Code Examples

### Complete useChat Configuration (v6)

```typescript
// Source: https://ai-sdk.dev/docs/reference/ai-sdk-ui/use-chat

const { messages, sendMessage, status, error, stop } = useChat({
  api: '/api/chat',           // Default endpoint
  body: { sessionId },         // Extra fields sent with every request
  onFinish: (message) => {     // Called when assistant response completes
    console.log('Response complete:', message.id);
  },
  onError: (error) => {        // Called on error
    console.error('Chat error:', error);
  },
});

// Status values: 'submitted' | 'streaming' | 'ready' | 'error'
// sendMessage signature:
sendMessage({ text: 'user input here' });
// For starter chips:
sendMessage({ text: 'What are you building?' });
```

### Upstash Ratelimit Sliding Window

```typescript
// Source: https://upstash.com/docs/redis/sdks/ratelimit-ts/gettingstarted

import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(60, '1 h'),  // 60 requests per 1 hour
  prefix: 'rate',                                 // Key prefix: rate:{identifier}
  analytics: true,                                // Enable analytics dashboard
});

// Usage:
const { success, limit, remaining, reset } = await ratelimit.limit(ipAddress);
// success: boolean -- whether request is allowed
// limit: number -- max requests in window
// remaining: number -- requests left
// reset: number -- timestamp when limit resets
```

### Cookie Management in Next.js 16 Route Handler

```typescript
// Source: https://nextjs.org/docs/app/api-reference/functions/cookies

import { cookies } from 'next/headers';

export async function POST(req: Request) {
  const cookieStore = await cookies(); // MUST await in Next.js 16

  // Read
  const count = parseInt(cookieStore.get('qm_chat_count')?.value || '0', 10);

  // Write (in route handlers, not server components)
  cookieStore.set('qm_chat_count', String(count + 1), {
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 86400,    // 24 hours in seconds
    path: '/',
    secure: process.env.NODE_ENV === 'production',
  });
}
```

### Mobile Overlay Pattern

```typescript
// components/chat/chat-overlay.tsx
'use client';

import { useEffect } from 'react';
import { ChatInterface } from './chat-interface';

interface ChatOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChatOverlay({ isOpen, onClose }: ChatOverlayProps) {
  // Prevent body scroll when overlay is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-white dark:bg-surface"
      role="dialog"
      aria-modal="true"
      aria-label="Chat with Ryan"
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="font-serif text-lg">Ask me anything</h2>
          <button onClick={onClose} aria-label="Close chat">
            {/* Close icon */}
          </button>
        </div>
        <div className="flex-1 overflow-hidden">
          <ChatInterface />
        </div>
      </div>
    </div>
  );
}
```

## State of the Art

| Old Approach (Stripped/v3) | Current Approach (v6) | When Changed | Impact |
|----------------------------|-----------------------|--------------|--------|
| `useChat` returns `input`, `handleInputChange`, `handleSubmit` | Manual input state + `sendMessage()` | AI SDK 5.0 | Must manage input with `useState`. No `handleSubmit` helper. |
| `append({ role: 'user', content: text })` | `sendMessage({ text: input })` | AI SDK 5.0 | Different function name and signature. |
| `message.content` (string) | `message.parts` (array of `{type, text}`) | AI SDK 5.0 | Iterate `parts` and check `part.type === 'text'` to render. |
| `isLoading` (boolean) | `status` ('submitted' / 'streaming' / 'ready' / 'error') | AI SDK 5.0 | More granular. Can distinguish "request sent" from "receiving chunks". |
| `result.toDataStreamResponse()` | `result.toUIMessageStreamResponse()` | AI SDK 5.0 | Different streaming protocol. Must match server and client. |
| `@vercel/kv` for Redis | `@upstash/redis` | 2025 | `@vercel/kv` deprecated, not available for new projects. |
| `middleware.ts` | `proxy.ts` | Next.js 16 | Renamed. Same functionality, Node.js runtime. |
| `cookies()` sync | `await cookies()` async | Next.js 16 | Must await. Sync call throws error. |
| `headers()` sync | `await headers()` async | Next.js 16 | Must await. Sync call throws error. |

## Vercel Plan Tier Resolution

**Blocker from STATE.md:** "Vercel plan tier (Hobby vs Pro) affects Phase 3 chat route timeout -- confirm before Phase 3 planning."

**Resolution:** Fluid Compute is enabled by default on all new Vercel projects since April 2025. Hobby plan with Fluid Compute:
- Default timeout: 300 seconds (5 minutes)
- Maximum configurable: 300 seconds (5 minutes)

A streaming chat response from Claude Sonnet 4.6 with 500-token max takes ~5-15 seconds. The 300-second timeout is 20-60x more than needed. **No plan upgrade required. Hobby plan is sufficient.**

Set `export const maxDuration = 60;` in the route handler as a conservative safety limit. This prevents runaway functions while being far below the 300s ceiling.

**Confidence: HIGH** -- Verified via [Vercel duration docs](https://vercel.com/docs/functions/configuring-functions/duration) and [Fluid Compute changelog](https://vercel.com/changelog/higher-defaults-and-limits-for-vercel-functions-running-fluid-compute).

## identityvault Content Curation Scope

**Blocker from STATE.md:** "identityvault content curation for system prompt needs scoping during Phase 3 planning."

**Resolution:** The identityvault at `~/identityvault/` contains:
- 28 experience files (~12,600 words / ~16,800 tokens total)
- 4 personality files (~1,363 words / ~1,800 tokens total)
- 1 identity file (~524 words / ~700 tokens)
- 1 preferences file (~407 words / ~540 tokens) -- Stripe-specific, not useful
- 4 pre-built bundles: public, professional, inner-circle, stripe-comms-2026

**For the ~2K token system prompt, curate from:**

| Source | What to Extract | Approx Words |
|--------|----------------|--------------|
| `identity.md` | Core positioning + background arc (first 3 paragraphs) | 150 |
| `personality/throughline.md` | Core insight + "how it connects" list | 100 |
| `personality/tone.md` | Communication style bullet list | 80 |
| `personality/edges.md` | Technical depth, career narrative, writing honesty | 80 |
| `lib/systems.ts` (Phase 1) | System names + one-liners (already in codebase) | 150 |
| Manual curation | FAQ pairs for common questions | 200 |
| Manual curation | Persona voice instructions + deflection rules | 250 |
| **Total** | | **~1,010 words (~1,350 tokens)** |

This leaves ~650 tokens of headroom within the 2K budget for formatting and structural markup.

**Approach:** Do NOT dynamically read identityvault at build time. Instead, manually curate the ~1,000 words of identity content into a static string within `lib/chat/system-prompt.ts`. This is simpler, faster to iterate, and avoids a build dependency on a sibling directory. The identityvault is the SOURCE; the system prompt is CURATED OUTPUT.

**Confidence: HIGH** -- Based on word counts of actual identityvault files.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Next.js 16 runtime | Assumed via Phase 1 | 22.x LTS | -- |
| npm | Package installation | Assumed via Phase 1 | -- | -- |
| ANTHROPIC_API_KEY | AI SDK Anthropic provider | Reuse from Stripped deployment | -- | Chat shows error state + mailto |
| Upstash Redis | Rate limiting + conversation logging | Requires Vercel Marketplace setup | -- | Must provision before chat works |
| Vercel project | Deployment target | Requires creation (Phase 2 creates this) | -- | -- |
| identityvault content | System prompt data | Available at ~/identityvault/ | -- | Manually curate content |

**Missing dependencies with no fallback:**
- **Upstash Redis** must be provisioned via Vercel Marketplace integration. This sets UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN automatically. Cannot be deferred; rate limiting and conversation logging both depend on it.
- **ANTHROPIC_API_KEY** must be set as a Vercel environment variable. Existing key from Stripped deployment can be reused.

**Missing dependencies with fallback:**
- None. All dependencies are required for Phase 3 functionality.

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Not yet installed (greenfield project, Phase 1 sets up scaffold) |
| Config file | None -- see Wave 0 |
| Quick run command | `npx vitest run --reporter=verbose` |
| Full suite command | `npx vitest run` |

**Recommendation:** Install `vitest` as the test framework. It works with Next.js 16 out of the box (Turbopack compatible), supports TypeScript natively, and is the standard for Vite/Next.js projects.

### Phase Requirements -> Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| CHAT-01 | Streaming chat response from AI SDK v6 | integration | `npx vitest run tests/chat/api-route.test.ts -t "streams response"` | Wave 0 |
| CHAT-02 | System prompt contains identity data, 500-token max configured | unit | `npx vitest run tests/chat/system-prompt.test.ts` | Wave 0 |
| CHAT-03a | Cookie session limit (20 msgs) | unit | `npx vitest run tests/chat/rate-limit.test.ts -t "cookie limit"` | Wave 0 |
| CHAT-03b | IP rate limit (60/hr) returns 429 | unit | `npx vitest run tests/chat/rate-limit.test.ts -t "ip limit"` | Wave 0 |
| CHAT-03c | Redis failure returns 503 (fail closed) | unit | `npx vitest run tests/chat/rate-limit.test.ts -t "fail closed"` | Wave 0 |
| CHAT-04 | Privacy notice renders with /privacy link | unit | `npx vitest run tests/chat/privacy-notice.test.ts` | Wave 0 |
| CHAT-05 | Chat states render correctly | unit | `npx vitest run tests/chat/chat-states.test.ts` | Wave 0 |
| CHAT-06 | Chat container has correct styling | manual-only | Visual inspection | -- |
| ENG-01 | 3 starter chips render, disappear after click | unit | `npx vitest run tests/chat/starter-chips.test.ts` | Wave 0 |

### Sampling Rate
- **Per task commit:** `npx vitest run --reporter=verbose`
- **Per wave merge:** `npx vitest run`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `vitest` + `@vitejs/plugin-react` + `jsdom` -- install as dev dependencies
- [ ] `vitest.config.ts` -- framework configuration
- [ ] `tests/chat/api-route.test.ts` -- chat API endpoint tests (mock Anthropic, mock Redis)
- [ ] `tests/chat/rate-limit.test.ts` -- three-tier rate limit tests
- [ ] `tests/chat/system-prompt.test.ts` -- prompt builder tests (token count, content presence)
- [ ] `tests/chat/starter-chips.test.ts` -- chip rendering and interaction
- [ ] `tests/chat/chat-states.test.ts` -- state rendering based on status
- [ ] `tests/chat/privacy-notice.test.ts` -- privacy notice rendering
- [ ] `tests/setup.ts` -- shared test setup (mock Redis client, mock Anthropic)

## Open Questions

1. **Upstash Redis provisioning timing**
   - What we know: Must be done via Vercel Marketplace for auto env var setup.
   - What's unclear: Whether Phase 2 creates the Vercel project or Phase 3. If Phase 2 creates it, Phase 3 just adds the Upstash integration.
   - Recommendation: Phase 3 Wave 0 should include "Add Upstash Redis via Vercel Marketplace" as a prerequisite task. This is a manual step (Vercel dashboard), not automatable.

2. **System prompt iteration workflow**
   - What we know: Prompt is hardcoded, updated by redeploying.
   - What's unclear: How fast the feedback loop is for prompt quality tuning.
   - Recommendation: Build the prompt as a single exportable string in `lib/chat/system-prompt.ts`. Include a `CHAT_MODEL` env var override (as Stripped does) for testing different models during development.

3. **Conversation log retention and cost**
   - What we know: D-11 says no TTL, keep indefinitely. Upstash Redis Hobby tier has a storage limit.
   - What's unclear: How quickly conversation logs will accumulate and whether free-tier Redis storage is sufficient.
   - Recommendation: Monitor storage usage. The weekly digest (Phase 5) can summarize and archive old conversations if storage becomes an issue. For v1 launch, no TTL is fine.

## Sources

### Primary (HIGH confidence)
- [AI SDK 6 Getting Started: Next.js App Router](https://ai-sdk.dev/docs/getting-started/nextjs-app-router) -- Route handler + useChat patterns for v6
- [AI SDK 6 useChat Reference](https://ai-sdk.dev/docs/reference/ai-sdk-ui/use-chat) -- Complete API: sendMessage, status, parts array, transport architecture
- [AI SDK 6 streamText Reference](https://ai-sdk.dev/docs/reference/ai-sdk-core/stream-text) -- streamText params, maxOutputTokens, onFinish, toUIMessageStreamResponse
- [AI SDK 5.x to 6.0 Migration Guide](https://ai-sdk.dev/docs/migration-guides/migration-guide-6-0) -- Breaking changes from v5 to v6
- [AI SDK 4.x to 5.0 Migration Guide](https://ai-sdk.dev/docs/migration-guides/migration-guide-5-0) -- useChat transport architecture, input removal, sendMessage, parts array, toUIMessageStreamResponse
- [@ai-sdk/anthropic Provider Docs](https://ai-sdk.dev/providers/ai-sdk-providers/anthropic) -- Provider initialization, model creation, providerOptions
- [Vercel Function Duration Configuration](https://vercel.com/docs/functions/configuring-functions/duration) -- Hobby: 300s max with Fluid Compute
- [Vercel Fluid Compute Changelog](https://vercel.com/changelog/higher-defaults-and-limits-for-vercel-functions-running-fluid-compute) -- Enabled by default, 300s default
- [Upstash Ratelimit Getting Started](https://upstash.com/docs/redis/sdks/ratelimit-ts/gettingstarted) -- slidingWindow, limit() return values
- [Upstash Ratelimit Algorithms](https://upstash.com/docs/redis/sdks/ratelimit-ts/algorithms) -- slidingWindow, fixedWindow, tokenBucket configuration
- [Upstash Redis TypeScript SDK](https://upstash.com/docs/redis/sdks/ts/getstarted) -- Redis.fromEnv(), get/set/lpush operations
- [Next.js 16 cookies() API](https://nextjs.org/docs/app/api-reference/functions/cookies) -- Async cookies(), HttpOnly, SameSite
- [Next.js 16 Route Handlers](https://nextjs.org/docs/app/getting-started/route-handlers) -- POST handler, request parsing
- [Next.js 16 proxy.ts](https://nextjs.org/docs/app/api-reference/file-conventions/proxy) -- Middleware renamed to proxy

### Secondary (MEDIUM confidence)
- npm registry version checks (2026-03-26) -- ai@6.0.138, @ai-sdk/anthropic@3.0.64, @ai-sdk/react@3.0.140, @upstash/redis@1.37.0, @upstash/ratelimit@2.0.8
- Stripped project source code (`~/stripped/`) -- Reference architecture (v3 era, patterns only)
- identityvault directory (`~/identityvault/`) -- Content structure and word counts

### Tertiary (LOW confidence)
- None. All findings verified against primary sources.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- all versions verified against npm registry and official docs
- Architecture: HIGH -- patterns sourced from official AI SDK v6 docs and Upstash docs
- AI SDK v3->v6 migration: HIGH -- both v4->v5 and v5->v6 migration guides reviewed; changes are cumulative and well-documented
- Rate limiting: HIGH -- Upstash ratelimit API verified with official getting-started guide
- System prompt: HIGH -- identityvault structure analyzed, word counts measured, token budget calculated from actual file contents
- Vercel timeout: HIGH -- Fluid Compute docs confirm 300s Hobby limit
- Pitfalls: HIGH -- sourced from migration guides and Next.js 16 breaking changes documentation

**Research date:** 2026-03-26
**Valid until:** 2026-04-26 (stable ecosystem, 30-day validity)
