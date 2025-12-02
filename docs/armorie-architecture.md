# Comprehensive Architectural Guide: Christian Faith-Based AI Chat Application

## Tech Stack Overview

**Core Technologies (All Production-Ready as of November 2025)**
- Next.js 16.0.1 with Turbopack (released October 2025)
- Tailwind CSS v4 (released January 2025, 5x faster builds)
- GPT-5 API (released August 2025, 400K context window)
- AI SDK v6 Beta (stable release expected end of 2025)
- Turborepo with Bun runtime
- Supabase for authentication and persistence
- assistant-ui for chat interface
- ai-sdk-tools for advanced features

---

## 1. Turborepo Monorepo Architecture

### Recommended Project Structure

```
christian-ai-chat/
├── apps/
│   ├── web/                          # Main Next.js application
│   │   ├── app/
│   │   │   ├── (public)/             # Public routes (landing, auth)
│   │   │   │   ├── page.tsx
│   │   │   │   └── login/
│   │   │   ├── (chat)/               # Protected chat routes
│   │   │   │   ├── chat/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── [sessionId]/
│   │   │   │   ├── bible-map/        # Bible verse mapping
│   │   │   │   └── debate/           # Apologetics coach
│   │   │   └── api/
│   │   │       ├── chat/
│   │   │       │   └── route.ts
│   │   │       └── artifacts/
│   │   │           └── route.ts
│   │   ├── modules/                  # Feature modules
│   │   │   ├── chat/
│   │   │   ├── artifacts/
│   │   │   ├── bible-mapping/
│   │   │   └── apologetics/
│   │   └── middleware.ts
│   │
│   └── storybook/                    # Component documentation (optional)
│
├── packages/
│   ├── ui/                           # Shared UI components
│   │   ├── src/
│   │   │   ├── components/           # shadcn components
│   │   │   │   ├── chat/
│   │   │   │   ├── artifacts/
│   │   │   │   └── bible/
│   │   │   └── hooks/
│   │   └── package.json
│   │
│   ├── ai-utils/                     # AI integration utilities
│   │   ├── src/
│   │   │   ├── providers/            # GPT-5 client
│   │   │   ├── streaming/            # Stream handlers
│   │   │   ├── prompts/              # System prompts
│   │   │   │   ├── bible-mapping.ts
│   │   │   │   └── apologetics.ts
│   │   │   ├── artifacts/            # Artifact generation
│   │   │   └── tools/                # AI tools/functions
│   │   └── package.json
│   │
│   ├── database/                     # Supabase client
│   │   ├── src/
│   │   │   ├── client.ts
│   │   │   ├── queries/
│   │   │   │   ├── messages.ts
│   │   │   │   ├── threads.ts
│   │   │   │   └── artifacts.ts
│   │   │   ├── mutations/
│   │   │   └── types.ts              # Generated types
│   │   └── package.json
│   │
│   ├── shared/                       # Shared types & utils
│   │   ├── src/
│   │   │   ├── types/
│   │   │   │   ├── chat.ts
│   │   │   │   ├── artifacts.ts
│   │   │   │   └── bible.ts
│   │   │   ├── utils/
│   │   │   └── validators/           # Zod schemas
│   │   └── package.json
│   │
│   └── config/                       # Shared configs
│       ├── biome/
│       ├── typescript/
│       └── tailwind/
│
├── turbo.json
├── package.json
├── bun.lockb
├── biome.json
└── .env.example
```

### Workspace Configuration

**Root package.json:**
```json
{
  "name": "christian-ai-chat",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "typecheck": "turbo run typecheck"
  },
  "devDependencies": {
    "turbo": "latest",
    "@biomejs/biome": "^2.0.0",
    "typescript": "^5.3.0"
  },
  "packageManager": "bun@1.0.0"
}
```

**Optimized turbo.json:**
```json
{
  "$schema": "https://turbo.build/schema.json",
  "ui": "tui",
  "globalDependencies": [
    "**/.env.*local",
    "tsconfig.json"
  ],
  "globalEnv": [
    "NODE_ENV",
    "NEXT_PUBLIC_*",
    "OPENAI_API_KEY",
    "SUPABASE_URL",
    "SUPABASE_ANON_KEY"
  ],
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [
        ".next/**",
        "!.next/cache/**",
        "dist/**"
      ]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^build"]
    },
    "typecheck": {
      "dependsOn": ["^build"],
      "outputs": []
    }
  }
}
```

### Package Organization Best Practices

**UI Package (packages/ui/package.json):**
```json
{
  "name": "@workspace/ui",
  "exports": {
    "./components/*": "./src/components/*.tsx",
    "./hooks/*": "./src/hooks/*.ts",
    "./lib/*": "./src/lib/*.ts"
  },
  "dependencies": {
    "react": "^19.0.0",
    "@radix-ui/react-*": "latest",
    "class-variance-authority": "^0.7.0"
  }
}
```

**AI Utils Package:**
```json
{
  "name": "@workspace/ai-utils",
  "exports": {
    "./providers/*": "./src/providers/*.ts",
    "./streaming/*": "./src/streaming/*.ts",
    "./prompts": "./src/prompts/index.ts",
    "./artifacts": "./src/artifacts/index.ts"
  },
  "dependencies": {
    "ai": "^6.0.0-beta",
    "@ai-sdk/openai": "^6.0.0-beta"
  }
}
```

---

## 2. AI SDK v6 Architecture Patterns

### Core Setup with GPT-5

**AI Client (packages/ai-utils/src/providers/openai.ts):**
```typescript
import { openai } from '@ai-sdk/openai'
import { streamText, generateText, tool } from 'ai'
import { z } from 'zod'

export const gpt5Model = openai('gpt-5')
export const gpt5MiniModel = openai('gpt-5-mini')

// Chat streaming function
export async function streamChatResponse(
  messages: Array<{ role: string; content: string }>,
  tools?: Record<string, any>
) {
  const result = streamText({
    model: gpt5Model,
    messages,
    tools,
    maxSteps: 5,
    temperature: 0.7,
  })
  
  return result
}
```

### Streaming Protocols

**API Route with Streaming (apps/web/app/api/chat/route.ts):**
```typescript
import { streamText } from 'ai'
import { openai } from '@ai-sdk/openai'
import { createClient } from '@workspace/database/client'

export const maxDuration = 30

export async function POST(req: Request) {
  const { messages } = await req.json()
  const supabase = await createClient()
  
  // Verify authentication
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const result = streamText({
    model: openai('gpt-5'),
    messages,
    system: 'You are a helpful Christian AI assistant...',
    tools: {
      searchScripture: bibleSearchTool,
      generateVerseMindMap: verseMapTool,
    },
  })
  
  return result.toUIMessageStreamResponse()
}
```

### Tool Calling Pattern for Bible Features

**Bible Search Tool (packages/ai-utils/src/tools/bible.ts):**
```typescript
import { tool } from 'ai'
import { z } from 'zod'

export const bibleSearchTool = tool({
  description: 'Search Bible verses by keyword or reference',
  inputSchema: z.object({
    query: z.string().describe('Search query or verse reference'),
    version: z.enum(['ESV', 'NIV', 'KJV']).default('ESV'),
  }),
  execute: async ({ query, version }) => {
    // Implement Bible API integration
    const verses = await searchBibleAPI(query, version)
    return {
      verses,
      reference: verses[0]?.reference,
      text: verses[0]?.text,
    }
  },
})

export const verseMapTool = tool({
  description: 'Generate a mind map for Bible verse with etymology',
  inputSchema: z.object({
    verse: z.string(),
    reference: z.string(),
  }),
  needsApproval: false,
  execute: async ({ verse, reference }) => {
    // Call GPT-5 to analyze verse structure
    const analysis = await analyzeVerseEtymology(verse)
    return {
      centerVerse: verse,
      keywords: analysis.keywords,
      etymology: analysis.etymology,
      connections: analysis.connections,
    }
  },
})
```

### Agent Pattern for Apologetics Coach

**Debate Agent (packages/ai-utils/src/agents/apologetics.ts):**
```typescript
import { ToolLoopAgent } from 'ai'
import { openai } from '@ai-sdk/openai'

export const apologeticsAgent = new ToolLoopAgent({
  model: openai('gpt-5'),
  instructions: `You are an apologetics debate coach. Take opposing positions 
    to help Christians practice defending their faith. Be respectful but 
    challenging. Cite sources and use logical reasoning.`,
  tools: {
    searchApologetics: apologeticsSearchTool,
    citeSources: sourcesCitationTool,
    takePosition: debatePositionTool,
  },
})
```

---

## 3. AI-SDK-Tools Integration

### State Management with Store

**Setup (apps/web/lib/ai-store.ts):**
```typescript
import { createStore } from '@ai-sdk-tools/store'

export const chatStore = createStore({
  initialState: {
    messages: [],
    isStreaming: false,
    currentArtifact: null,
  },
})

// Use in components without prop drilling
export function useChatStore() {
  return chatStore.useStore()
}
```

### Artifact Streaming

**Bible Verse Mapping Artifact (packages/ai-utils/src/artifacts/verse-map.ts):**
```typescript
import { defineArtifact } from '@ai-sdk-tools/artifacts'
import { z } from 'zod'

export const verseMapArtifact = defineArtifact({
  name: 'bible-verse-map',
  schema: z.object({
    verse: z.string(),
    reference: z.string(),
    mindMap: z.object({
      centerVerse: z.string(),
      keywords: z.array(z.object({
        word: z.string(),
        hebrew: z.string().optional(),
        greek: z.string().optional(),
        etymology: z.string(),
      })),
    }),
    historicalContext: z.object({
      author: z.string(),
      location: z.string(),
      timeperiod: z.string(),
      events: z.array(z.string()),
    }),
    applicationPrompts: z.array(z.object({
      question: z.string(),
      reflectionGuide: z.string(),
    })),
  }),
})

// Server action to generate artifact
'use server'
export async function generateVerseMap(verseReference: string) {
  const artifact = await verseMapArtifact.generate({
    model: openai('gpt-5'),
    prompt: `Generate a comprehensive Bible verse mapping for ${verseReference}`,
  })
  
  return artifact
}
```

### Memory Feature

**Chat Memory (packages/ai-utils/src/memory/chat-memory.ts):**
```typescript
import { createMemory } from '@ai-sdk-tools/memory'

export const chatMemory = createMemory({
  maxMessages: 50,
  summarizeAfter: 30,
  summarizer: async (messages) => {
    // Summarize conversation for long threads
    const summary = await generateText({
      model: openai('gpt-5-mini'),
      prompt: `Summarize this conversation: ${JSON.stringify(messages)}`,
    })
    return summary.text
  },
})
```

---

## 4. Assistant-UI Integration

### Setup with AI SDK v6

**Installation:**
```bash
bun add @assistant-ui/react @assistant-ui/react-ai-sdk
```

**Chat Interface (apps/web/modules/chat/components/chat-interface.tsx):**
```typescript
'use client'

import { useChat } from '@ai-sdk/react'
import { Thread } from '@assistant-ui/react'
import { makeAssistantToolUI } from '@assistant-ui/react-ai-sdk'

export function ChatInterface() {
  const { messages, input, setInput, sendMessage, isLoading } = useChat({
    api: '/api/chat',
  })
  
  return (
    <div className="flex flex-col h-screen">
      <Thread
        messages={messages}
        input={input}
        onInputChange={setInput}
        onSend={sendMessage}
        isLoading={isLoading}
        tools={{
          bible_search: BibleSearchUI,
          verse_map: VerseMapUI,
        }}
      />
    </div>
  )
}
```

### Custom Tool UI Components

**Bible Verse Map UI (apps/web/modules/bible-mapping/components/verse-map-ui.tsx):**
```typescript
import { ToolUI } from '@assistant-ui/react'

export const VerseMapUI: ToolUI = ({ toolInvocation }) => {
  const { input, output } = toolInvocation
  
  if (toolInvocation.state === 'input-available') {
    return (
      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-sm text-gray-600">
          Generating verse map for {input.reference}...
        </p>
      </div>
    )
  }
  
  if (toolInvocation.state === 'output-available') {
    return (
      <div className="space-y-6 p-6 border rounded-lg">
        {/* Mind Map Section */}
        <section>
          <h3 className="font-bold text-lg mb-4">Mind Map</h3>
          <VerseMindMap data={output.mindMap} />
        </section>
        
        {/* Historical Context Section */}
        <section>
          <h3 className="font-bold text-lg mb-4">Historical Context</h3>
          <HistoricalContext data={output.historicalContext} />
        </section>
        
        {/* Application Section */}
        <section>
          <h3 className="font-bold text-lg mb-4">Personal Reflection</h3>
          <ApplicationPrompts prompts={output.applicationPrompts} />
        </section>
      </div>
    )
  }
  
  return null
}
```

### Streaming with Assistant-UI

**Server Action (apps/web/app/actions/chat-actions.ts):**
```typescript
'use server'

import { streamUI } from 'ai/rsc'
import { openai } from '@ai-sdk/openai'
import { VerseMapComponent } from '@/components/artifacts/verse-map'

export async function submitChatMessage(message: string) {
  const result = await streamUI({
    model: openai('gpt-5'),
    prompt: message,
    text: ({ content }) => <p>{content}</p>,
    tools: {
      generateVerseMap: {
        description: 'Generate Bible verse mapping artifact',
        parameters: z.object({
          reference: z.string(),
        }),
        generate: async function* ({ reference }) {
          yield <LoadingSkeleton />
          
          const verseData = await generateVerseMapArtifact(reference)
          
          return <VerseMapComponent data={verseData} />
        },
      },
    },
  })
  
  return result.value
}
```

---

## 5. Next.js 16 App Router Architecture

### Folder Structure for Features

**Bible Verse Mapping Feature:**
```
apps/web/modules/bible-mapping/
├── components/
│   ├── verse-map-interface.tsx
│   ├── mind-map-diagram.tsx
│   ├── historical-context.tsx
│   ├── etymology-display.tsx
│   └── reflection-prompts.tsx
├── actions/
│   └── generate-verse-map.ts
├── hooks/
│   └── use-verse-map.ts
└── types.ts
```

**Apologetics Feature:**
```
apps/web/modules/apologetics/
├── components/
│   ├── debate-interface.tsx
│   ├── position-selector.tsx
│   └── argument-display.tsx
├── actions/
│   └── debate-coach.ts
└── types.ts
```

### Server Actions vs Route Handlers

**Server Action for Chat (Preferred):**
```typescript
// apps/web/app/actions/chat.ts
'use server'

import { revalidatePath } from 'next/cache'
import { streamText } from 'ai'
import { createClient } from '@workspace/database/client'

export async function sendChatMessage(
  threadId: string,
  content: string
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('Not authenticated')
  
  // Save user message
  await supabase.from('messages').insert({
    thread_id: threadId,
    user_id: user.id,
    role: 'user',
    content,
  })
  
  // Stream AI response
  const result = await streamText({
    model: openai('gpt-5'),
    messages: [{ role: 'user', content }],
  })
  
  // Save AI response
  const responseText = await result.text
  await supabase.from('messages').insert({
    thread_id: threadId,
    user_id: user.id,
    role: 'assistant',
    content: responseText,
  })
  
  revalidatePath(`/chat/${threadId}`)
  
  return responseText
}
```

**Route Handler for Streaming (When Needed):**
```typescript
// apps/web/app/api/chat/stream/route.ts
import { streamText } from 'ai'
import { openai } from '@ai-sdk/openai'

export const runtime = 'edge'
export const maxDuration = 30

export async function POST(req: Request) {
  const { messages } = await req.json()
  
  const result = streamText({
    model: openai('gpt-5'),
    messages,
  })
  
  return result.toUIMessageStreamResponse()
}
```

### RSC Streaming Patterns

**Page with Suspense (apps/web/app/chat/[sessionId]/page.tsx):**
```typescript
import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import ChatInterface from '@/modules/chat/components/chat-interface'
import MessageList from '@/modules/chat/components/message-list'
import { getChatSession } from '@/lib/db'

export default async function ChatSessionPage({ 
  params 
}: { 
  params: { sessionId: string } 
}) {
  const session = await getChatSession(params.sessionId)
  
  if (!session) notFound()
  
  return (
    <div className="flex flex-col h-screen">
      <Suspense fallback={<MessageSkeleton />}>
        <MessageList sessionId={params.sessionId} />
      </Suspense>
      <ChatInterface sessionId={params.sessionId} />
    </div>
  )
}
```

---

## 6. Supabase Authentication & Persistence

### Database Schema

**SQL Schema (packages/database/schema.sql):**
```sql
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgvector";

-- Profiles table
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username VARCHAR(24) UNIQUE,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Chat threads
CREATE TABLE public.chat_threads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT,
  type TEXT CHECK (type IN ('general', 'bible_mapping', 'apologetics')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  metadata JSONB DEFAULT '{}'::JSONB
);

-- Messages
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  thread_id UUID NOT NULL REFERENCES chat_threads(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  metadata JSONB DEFAULT '{}'::JSONB
);

-- Artifacts (verse maps, debate summaries)
CREATE TABLE public.artifacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('verse_map', 'debate_summary', 'reflection')),
  content JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Indexes
CREATE INDEX idx_chat_threads_user_id ON chat_threads(user_id);
CREATE INDEX idx_messages_thread_id ON messages(thread_id);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX idx_artifacts_message_id ON artifacts(message_id);

-- Row Level Security
ALTER TABLE chat_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE artifacts ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own threads"
  ON chat_threads FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own threads"
  ON chat_threads FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view messages in their threads"
  ON messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM chat_threads
      WHERE chat_threads.id = messages.thread_id
      AND chat_threads.user_id = auth.uid()
    )
  );
```

### Authentication Setup

**Middleware (apps/web/middleware.ts):**
```typescript
import { type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
```

**Server Client (packages/database/src/server-client.ts):**
```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {}
        },
      },
    }
  )
}
```

### Chat Persistence Patterns

**Query Functions (packages/database/src/queries/threads.ts):**
```typescript
import { SupabaseClient } from '@supabase/supabase-js'

export async function getUserThreads(
  client: SupabaseClient,
  userId: string
) {
  const { data, error } = await client
    .from('chat_threads')
    .select(`
      *,
      messages (
        id,
        content,
        created_at
      )
    `)
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })
  
  return { data, error }
}

export async function getThreadMessages(
  client: SupabaseClient,
  threadId: string,
  cursor?: string,
  limit = 50
) {
  let query = client
    .from('messages')
    .select('*')
    .eq('thread_id', threadId)
    .order('created_at', { ascending: false })
    .limit(limit)
  
  if (cursor) {
    query = query.lt('created_at', cursor)
  }
  
  const { data, error } = await query
  
  return {
    data: data?.reverse(),
    nextCursor: data?.[data.length - 1]?.created_at,
    error,
  }
}
```

### Real-Time Subscriptions

**Hook for Live Messages (apps/web/hooks/use-realtime-messages.ts):**
```typescript
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@workspace/database/client'

export function useRealtimeMessages(threadId: string) {
  const [messages, setMessages] = useState([])
  const supabase = createClient()
  
  useEffect(() => {
    const fetchMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('thread_id', threadId)
        .order('created_at', { ascending: true })
      
      setMessages(data || [])
    }
    
    fetchMessages()
    
    const channel = supabase
      .channel(`thread:${threadId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `thread_id=eq.${threadId}`,
        },
        (payload) => {
          setMessages(prev => [...prev, payload.new])
        }
      )
      .subscribe()
    
    return () => {
      supabase.removeChannel(channel)
    }
  }, [threadId])
  
  return messages
}
```

---

## 7. Artifact Generation Patterns

### Bible Verse Mapping Artifact

**Artifact Generator (packages/ai-utils/src/artifacts/verse-map-generator.ts):**
```typescript
import { generateObject } from 'ai'
import { openai } from '@ai-sdk/openai'
import { z } from 'zod'

const verseMapSchema = z.object({
  mindMap: z.object({
    centerVerse: z.string(),
    keywords: z.array(z.object({
      word: z.string(),
      hebrew: z.string().optional(),
      greek: z.string().optional(),
      etymology: z.string(),
      definition: z.string(),
    })),
  }),
  historicalContext: z.object({
    author: z.string(),
    writtenAt: z.string(),
    writtenWhen: z.string(),
    events: z.array(z.string()),
    culturalContext: z.string(),
  }),
  applicationPrompts: z.array(z.object({
    question: z.string(),
    reflectionGuide: z.string(),
    practicalApplication: z.string(),
  })),
})

export async function generateVerseMap(
  verseReference: string,
  verseText: string
) {
  const result = await generateObject({
    model: openai('gpt-5'),
    schema: verseMapSchema,
    prompt: `Generate a comprehensive Bible verse mapping for ${verseReference}: "${verseText}"
    
    Create:
    1. A mind map with 5-6 keywords from the verse, including Hebrew/Greek etymology
    2. Historical context (author, location, time, events)
    3. Personal application prompts with reflection guides`,
  })
  
  return result.object
}
```

### Multi-Section Document Generation

**Structured Streaming (apps/web/app/api/artifacts/verse-map/route.ts):**
```typescript
import { streamObject } from 'ai'
import { openai } from '@ai-sdk/openai'

export async function POST(req: Request) {
  const { reference, text } = await req.json()
  
  const result = streamObject({
    model: openai('gpt-5'),
    schema: verseMapSchema,
    prompt: `Generate verse mapping for ${reference}`,
    onFinish: async ({ object }) => {
      // Save artifact to database
      await saveArtifact({
        type: 'verse_map',
        content: object,
      })
    },
  })
  
  return result.toTextStreamResponse()
}
```

### Component Rendering

**Verse Map Component (apps/web/components/artifacts/verse-map.tsx):**
```typescript
import { Card, CardHeader, CardContent } from '@workspace/ui/components/card'
import { MindMapDiagram } from './mind-map-diagram'

interface VerseMapProps {
  data: {
    mindMap: any
    historicalContext: any
    applicationPrompts: any
  }
}

export function VerseMapComponent({ data }: VerseMapProps) {
  return (
    <div className="space-y-8">
      {/* Section 1: Mind Map */}
      <Card>
        <CardHeader>
          <h3 className="text-xl font-bold">Word Study Mind Map</h3>
        </CardHeader>
        <CardContent>
          <MindMapDiagram
            centerVerse={data.mindMap.centerVerse}
            keywords={data.mindMap.keywords}
          />
          
          <div className="mt-6 space-y-4">
            {data.mindMap.keywords.map((keyword, idx) => (
              <div key={idx} className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold">{keyword.word}</h4>
                {keyword.greek && (
                  <p className="text-sm text-gray-600">
                    Greek: {keyword.greek}
                  </p>
                )}
                {keyword.hebrew && (
                  <p className="text-sm text-gray-600">
                    Hebrew: {keyword.hebrew}
                  </p>
                )}
                <p className="mt-2">{keyword.etymology}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Section 2: Historical Context */}
      <Card>
        <CardHeader>
          <h3 className="text-xl font-bold">Historical Context</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <strong>Author:</strong> {data.historicalContext.author}
          </div>
          <div>
            <strong>Written at:</strong> {data.historicalContext.writtenAt}
          </div>
          <div>
            <strong>Time period:</strong> {data.historicalContext.writtenWhen}
          </div>
          <div>
            <strong>Key events:</strong>
            <ul className="list-disc list-inside mt-2">
              {data.historicalContext.events.map((event, idx) => (
                <li key={idx}>{event}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
      
      {/* Section 3: Application */}
      <Card>
        <CardHeader>
          <h3 className="text-xl font-bold">Personal Reflection</h3>
        </CardHeader>
        <CardContent className="space-y-6">
          {data.applicationPrompts.map((prompt, idx) => (
            <div key={idx} className="bg-blue-50 p-4 rounded-lg">
              <p className="font-semibold text-lg mb-2">{prompt.question}</p>
              <p className="text-sm text-gray-700 mb-3">
                {prompt.reflectionGuide}
              </p>
              <textarea
                className="w-full p-3 border rounded"
                placeholder="Write your reflection..."
                rows={4}
              />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
```

---

## 8. Modular Component Architecture

### Shadcn + Tailwind v4 Setup

**Tailwind v4 Configuration (apps/web/app/globals.css):**
```css
@import "tailwindcss";

@theme {
  --color-primary: #2563eb;
  --color-secondary: #7c3aed;
  --color-accent: #f59e0b;
  
  --font-sans: system-ui, sans-serif;
  --font-mono: 'Fira Code', monospace;
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

### Component Organization

**Feature-Based Structure:**
```
packages/ui/src/components/
├── chat/
│   ├── message-bubble.tsx
│   ├── message-list.tsx
│   ├── chat-input.tsx
│   └── typing-indicator.tsx
├── bible/
│   ├── verse-card.tsx
│   ├── verse-search.tsx
│   └── scripture-reference.tsx
├── artifacts/
│   ├── artifact-container.tsx
│   ├── mind-map-diagram.tsx
│   └── reflection-card.tsx
└── ui/
    ├── button.tsx
    ├── card.tsx
    ├── input.tsx
    └── skeleton.tsx
```

### Reusable Patterns

**Message Component (packages/ui/src/components/chat/message-bubble.tsx):**
```typescript
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@workspace/ui/lib/utils'

const messageBubbleVariants = cva(
  'rounded-lg p-4 max-w-2xl',
  {
    variants: {
      role: {
        user: 'bg-blue-500 text-white ml-auto',
        assistant: 'bg-gray-100 text-gray-900 mr-auto',
        system: 'bg-yellow-50 text-yellow-900 mx-auto text-center',
      },
      size: {
        sm: 'text-sm p-3',
        md: 'text-base p-4',
        lg: 'text-lg p-5',
      },
    },
    defaultVariants: {
      role: 'assistant',
      size: 'md',
    },
  }
)

interface MessageBubbleProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof messageBubbleVariants> {
  content: string
}

export function MessageBubble({
  role,
  size,
  content,
  className,
  ...props
}: MessageBubbleProps) {
  return (
    <div
      className={cn(messageBubbleVariants({ role, size }), className)}
      {...props}
    >
      <div className="prose prose-sm max-w-none">
        {content}
      </div>
    </div>
  )
}
```

---

## 9. Implementation Roadmap

### Phase 1: Foundation (Weeks 1-2)

1. **Setup Monorepo**
   - Initialize Turborepo with Bun
   - Configure Biome for linting
   - Set up shared TypeScript configs
   - Create package structure

2. **Authentication**
   - Set up Supabase project
   - Implement auth flow
   - Create database schema
   - Enable RLS policies

3. **Basic Chat**
   - Implement chat UI with assistant-ui
   - Set up AI SDK v6 integration
   - Create basic streaming endpoint
   - Test with GPT-5

### Phase 2: Core Features (Weeks 3-5)

4. **Bible Verse Mapping**
   - Implement verse search tool
   - Create etymology analysis
   - Build mind map visualization
   - Add historical context generation
   - Create reflection prompts

5. **Apologetics Coach**
   - Create debate agent
   - Implement position-taking
   - Add source citation
   - Build argument tracking

6. **Artifact System**
   - Set up artifact streaming
   - Create artifact components
   - Implement persistence
   - Add rendering logic

### Phase 3: Polish (Weeks 6-8)

7. **Optimization**
   - Add caching with ai-sdk-tools
   - Implement memory features
   - Optimize database queries
   - Add loading states

8. **Testing & Deployment**
   - Write unit tests
   - E2E testing
   - Deploy to Vercel
   - Configure Supabase production

---

## 10. Key Best Practices

### Architecture Guidelines

**Do:**
- ✅ Use Server Actions for mutations by default
- ✅ Stream all AI responses for better UX
- ✅ Implement proper error boundaries
- ✅ Use cursor-based pagination for messages
- ✅ Enable RLS on all Supabase tables
- ✅ Type everything with TypeScript and Zod
- ✅ Use workspace protocol for internal packages
- ✅ Implement optimistic updates
- ✅ Cache aggressively with Turborepo

**Don't:**
- ❌ Use `getSession()` in server code (use `getUser()`)
- ❌ Create circular dependencies between packages
- ❌ Fetch from Route Handlers in Server Components
- ❌ Over-nest Suspense boundaries
- ❌ Forget to revalidate after mutations
- ❌ Store API keys in client code
- ❌ Use barrel exports in packages
- ❌ Skip indexing database foreign keys

### Performance Considerations

**GPT-5 Optimization:**
- Use `gpt-5-mini` for simple tasks (5x cheaper)
- Implement streaming for perceived speed
- Monitor token usage (400K context window)
- Cache embeddings and common responses
- Set appropriate `maxSteps` for tool calling

**Database Performance:**
- Index all foreign keys and timestamp columns
- Use cursor-based pagination
- Implement soft deletes for data retention
- Archive old threads periodically
- Use `head: true` for count queries

**Build Performance:**
- Leverage Turborepo remote caching
- Use `--filter` for targeted builds
- Enable Turbopack in Next.js 16
- Optimize Tailwind v4 with new engine
- Minimize bundle size with tree shaking

---

## Reference Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Next.js 16 App Router (RSC + Client Components)    │  │
│  │  ┌────────────┐  ┌─────────────┐  ┌──────────────┐ │  │
│  │  │ Chat UI    │  │ Bible Map   │  │ Apologetics  │ │  │
│  │  │(assistant) │  │ (artifacts) │  │ (agent)      │ │  │
│  │  └────────────┘  └─────────────┘  └──────────────┘ │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                             │
                             │ Server Actions / API Routes
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                      AI Layer                                │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  AI SDK v6                                           │  │
│  │  ┌────────────┐  ┌─────────────┐  ┌──────────────┐ │  │
│  │  │ streamText │  │ Agent Loop  │  │ generateObj  │ │  │
│  │  └────────────┘  └─────────────┘  └──────────────┘ │  │
│  │         │                │                 │         │  │
│  │         └────────────────┴─────────────────┘         │  │
│  │                      │                                │  │
│  │                      ▼                                │  │
│  │            ┌──────────────────┐                      │  │
│  │            │  GPT-5 API       │                      │  │
│  │            │  (Response API)  │                      │  │
│  │            └──────────────────┘                      │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                             │
                             │ Persistence
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                   Data Layer                                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Supabase                                            │  │
│  │  ┌────────────┐  ┌─────────────┐  ┌──────────────┐ │  │
│  │  │ Auth       │  │ Postgres    │  │ Realtime     │ │  │
│  │  │ (OAuth)    │  │ (+ pgvector)│  │ (Websocket)  │ │  │
│  │  └────────────┘  └─────────────┘  └──────────────┘ │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## Getting Started Commands

```bash
# Initialize project
mkdir christian-ai-chat && cd christian-ai-chat
bunx create-turbo@latest

# Install dependencies
bun install
bun add ai@beta @ai-sdk/openai@beta @ai-sdk/react@beta
bun add @supabase/supabase-js @supabase/ssr
bun add @assistant-ui/react @assistant-ui/react-ai-sdk
bun add -d @biomejs/biome

# Generate Supabase types
bunx supabase gen types typescript --project-id YOUR_PROJECT_ID > packages/database/src/types.ts

# Development
bun run dev

# Build
bun run build

# Lint
bun run lint
```

## Conclusion

This architecture provides a production-ready foundation for your Christian faith-based AI chat application. The modular monorepo structure enables scalability, the AI SDK v6 integration offers flexibility across providers, and Supabase handles authentication and persistence robustly. The specialized features—Bible verse mapping with etymology and apologetics debate coaching—are implemented as distinct modules with artifact streaming for rich, interactive experiences.

**Next Steps:**
1. Set up the monorepo structure
2. Configure Supabase and implement authentication
3. Build the basic chat interface with assistant-ui
4. Implement Bible verse mapping as first artifact
5. Add apologetics coach agent
6. Polish and optimize for production

The stack you've chosen represents current best practices as of late 2025, with all components being production-ready and well-supported. The combination of Next.js 16's Turbopack, Tailwind v4's performance improvements, and GPT-5's capabilities will deliver an exceptional user experience.