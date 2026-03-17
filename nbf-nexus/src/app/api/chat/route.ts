import { streamText, tool } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { auth, currentUser } from '@clerk/nextjs/server';
import { ContextManager } from '@/shared/lib/ai/memory/contextManager';
import { KnowledgeEngine } from '@/shared/lib/ai/rag/knowledgeEngine';
import { env } from '@/shared/config/env';
import { z } from 'zod';

export const runtime = 'nodejs';

// 0. Configure the OpenAI Provider
const openai = createOpenAI({
  apiKey: env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const { userId } = await auth();
  const user = await currentUser();
  
  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { messages } = await req.json();
  const lastMessage = messages[messages.length - 1]?.content || "";

  // 1. Resolve Role and Context
  const role = user?.publicMetadata?.role === 'admin' ? 'admin' : 'trainee';
  const fullContext = await ContextManager.getUserContext({
    role,
    userId,
    fullName: `${user?.firstName} ${user?.lastName}`,
  });

  // 2. Perform RAG (Knowledge Retrieval)
  const knowledge = await KnowledgeEngine.queryKnowledge(lastMessage);

  // 3. Assemble System Prompt
  const systemPrompt = `
    ${fullContext}
    
    ## Relevant Knowledge Base Information
    ${knowledge.join('\n\n')}

    ## Instructions
    - Use the above context and knowledge to answer user queries.
    - Be concise and follow your role's tone.
    - If you discover important personal info, preferences, or task status that should be remembered, use the 'saveMemory' tool.
  `;

  // 4. Call LLM with Tool calling
  const result = await streamText({
    model: openai('gpt-4o'),
    system: systemPrompt,
    messages,
    maxSteps: 5,
    tools: {
      saveMemory: tool({
        description: 'Saves an important piece of information about the user for long-term memory.',
        parameters: z.object({
          info: z.string().describe('The piece of information or preference to remember.'),
        }),
        execute: async ({ info }) => {
          await ContextManager.saveUserMemory(userId, info);
          return { success: true, message: 'Memory saved successfully.' };
        },
      }),
    },
  });

  return result.toTextStreamResponse();
}
