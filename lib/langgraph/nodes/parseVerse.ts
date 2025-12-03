import { ChatOpenAI } from "@langchain/openai";
import type { VerseStudyState } from "../state";

/**
 * Parse the user's query to extract verse text and reference
 * Handles formats like:
 * - "Study Psalm 23:1"
 * - "What does John 3:16 mean?"
 * - Direct verse text
 */
export async function parseVerseNode(
  state: VerseStudyState
): Promise<Partial<VerseStudyState>> {
  const llm = new ChatOpenAI({
    model: "gpt-4o",
    temperature: 0,
  });

  const response = await llm.invoke([
    {
      role: "system",
      content: `You are a Bible verse parser. Extract the verse reference and full verse text from the user's query.

Return JSON with exactly these fields:
- reference: The verse reference (e.g., "Psalm 23:1", "John 3:16")
- verse: The complete verse text

If the user only provides a reference, look up the verse text from your knowledge.
If unclear, make your best interpretation.`,
    },
    {
      role: "user",
      content: state.userQuery,
    },
  ]);

  const content = response.content as string;

  // Parse JSON from response
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Failed to parse verse from response");
  }

  const parsed = JSON.parse(jsonMatch[0]);

  return {
    verse: parsed.verse,
    reference: parsed.reference,
  };
}
