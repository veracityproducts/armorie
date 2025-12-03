import { ChatOpenAI } from "@langchain/openai";
import type { VerseStudyState, KeywordStudy } from "../state";

/**
 * Generate detailed keyword studies for each selected keyword
 * Includes Greek/Hebrew, meaning, cross-references, and significance
 */
export async function generateStudiesNode(
  state: VerseStudyState
): Promise<Partial<VerseStudyState>> {
  const llm = new ChatOpenAI({
    model: "gpt-4o",
    temperature: 0.3,
  });

  // Generate studies for all selected keywords in parallel
  const studyPromises = state.selectedKeywords.map(async (keyword) => {
    const response = await llm.invoke([
      {
        role: "system",
        content: `You are a Bible scholar. Generate a detailed keyword study.

Return JSON with exactly these fields:
- keyword: The word being studied
- greekHebrew: The original Greek or Hebrew word with transliteration (e.g., "יהוה (YHWH)" or "ἀγάπη (agape)")
- meaning: A clear, concise definition/meaning of the word in context
- references: Array of 2-3 other Scripture references where this word appears with similar meaning
- significance: How this word contributes to the theological meaning of the verse (2-3 sentences)

Be accurate and scholarly but accessible.`,
      },
      {
        role: "user",
        content: `Keyword: "${keyword}"
From verse: "${state.verse}" (${state.reference})`,
      },
    ]);

    const content = response.content as string;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error(`Failed to parse study for keyword: ${keyword}`);
    }

    return JSON.parse(jsonMatch[0]) as KeywordStudy;
  });

  const studies = await Promise.all(studyPromises);

  return {
    studies,
  };
}
