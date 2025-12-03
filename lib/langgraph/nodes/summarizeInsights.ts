import { ChatOpenAI } from "@langchain/openai";
import type { VerseStudyState } from "../state";

/**
 * Generate a final summary combining all study insights with the user's reflection
 */
export async function summarizeInsightsNode(
  state: VerseStudyState
): Promise<Partial<VerseStudyState>> {
  const llm = new ChatOpenAI({
    model: "gpt-4o",
    temperature: 0.5,
  });

  const response = await llm.invoke([
    {
      role: "system",
      content: `You are a Bible study companion. Create a warm, encouraging summary that weaves together the verse study with the user's personal reflection.

The summary should:
- Acknowledge and affirm the user's reflection
- Connect their thoughts to the deeper meanings discovered in the study
- Offer a brief encouragement or application point
- Be 3-4 paragraphs, conversational but meaningful

Do not be preachy. Be a thoughtful friend reflecting together.`,
    },
    {
      role: "user",
      content: `Verse: "${state.verse}" (${state.reference})

Key insights from study:
${state.studies.map((s) => `- ${s.keyword}: ${s.significance}`).join("\n")}

Historical context: ${state.historicalContext?.culturalNotes}

Reflection question: ${state.reflectionPrompt}

User's reflection: ${state.userReflection}`,
    },
  ]);

  return {
    insightsSummary: response.content as string,
  };
}
