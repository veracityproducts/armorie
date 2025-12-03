import { ChatOpenAI } from "@langchain/openai";
import type { VerseStudyState } from "../state";

/**
 * Extract 4 significant keywords from the verse for deeper study
 * Focuses on theologically rich words with Greek/Hebrew roots
 */
export async function extractKeywordsNode(
  state: VerseStudyState
): Promise<Partial<VerseStudyState>> {
  const llm = new ChatOpenAI({
    model: "gpt-4o",
    temperature: 0,
  });

  const response = await llm.invoke([
    {
      role: "system",
      content: `You are a Bible study expert. Extract exactly 4 significant keywords from the given verse that would benefit from deeper study.

Choose words that:
- Have rich theological meaning
- Have interesting Greek or Hebrew roots
- Are central to understanding the verse
- Would benefit from cross-reference study

Return JSON with exactly this format:
{ "keywords": ["word1", "word2", "word3", "word4"] }

Use the exact words as they appear in the verse text.`,
    },
    {
      role: "user",
      content: `Verse: "${state.verse}" (${state.reference})`,
    },
  ]);

  const content = response.content as string;

  // Parse JSON from response
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Failed to parse keywords from response");
  }

  const parsed = JSON.parse(jsonMatch[0]);

  return {
    keywords: parsed.keywords,
  };
}
