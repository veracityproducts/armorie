import { interrupt } from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";
import type { VerseStudyState } from "../state";

/**
 * INTERRUPT NODE: Generate reflection prompt and wait for user's response
 *
 * First generates a personalized reflection question based on the study.
 * Then interrupts to collect the user's reflection.
 */
export async function promptReflectionNode(
  state: VerseStudyState
): Promise<Partial<VerseStudyState>> {
  const llm = new ChatOpenAI({
    model: "gpt-4o",
    temperature: 0.7,
  });

  // Generate a reflection prompt based on the study so far
  const promptResponse = await llm.invoke([
    {
      role: "system",
      content: `You are a spiritual guide. Based on the verse study provided, create a thoughtful, personal reflection question.

The question should:
- Connect the verse's meaning to daily life
- Be open-ended and introspective
- Draw on the keyword studies and historical context
- Be warm and inviting, not preachy

Return just the question text, no JSON.`,
    },
    {
      role: "user",
      content: `Verse: "${state.verse}" (${state.reference})

Keywords studied: ${state.selectedKeywords.join(", ")}

Historical period: ${state.historicalContext?.period}
Cultural context: ${state.historicalContext?.culturalNotes}`,
    },
  ]);

  const reflectionPrompt = promptResponse.content as string;

  // Interrupt and wait for user's reflection
  const userInput = interrupt({
    type: "reflection_prompt",
    verse: state.verse,
    reference: state.reference,
    studies: state.studies,
    historicalContext: state.historicalContext,
    prompt: reflectionPrompt,
  });

  const userReflection = (userInput as { reflection: string }).reflection;

  return {
    reflectionPrompt,
    userReflection,
  };
}
