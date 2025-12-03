import { ChatOpenAI } from "@langchain/openai";
import type { VerseStudyState, HistoricalContext } from "../state";

/**
 * Fetch historical context for the verse
 * When written, by whom, to whom, cultural context
 */
export async function fetchHistoryNode(
  state: VerseStudyState
): Promise<Partial<VerseStudyState>> {
  const llm = new ChatOpenAI({
    model: "gpt-4o",
    temperature: 0.3,
  });

  const response = await llm.invoke([
    {
      role: "system",
      content: `You are a Bible historian. Provide historical context for the given verse.

Return JSON with exactly these fields:
- period: The approximate time period when written (e.g., "~1000 BC", "~55 AD")
- author: The traditional author and any relevant background
- audience: Who the text was originally written to/for
- events: Array of 2-3 relevant historical events or circumstances
- culturalNotes: Cultural context that helps understand the verse (2-3 sentences)

Be historically accurate while remaining accessible.`,
    },
    {
      role: "user",
      content: `Verse: "${state.verse}" (${state.reference})`,
    },
  ]);

  const content = response.content as string;
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Failed to parse historical context");
  }

  const historicalContext = JSON.parse(jsonMatch[0]) as HistoricalContext;

  return {
    historicalContext,
  };
}
