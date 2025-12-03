import { interrupt } from "@langchain/langgraph";
import type { VerseStudyState } from "../state";

/**
 * INTERRUPT NODE: Wait for user to select which keywords to study
 *
 * This node pauses the graph and sends data to the frontend.
 * The frontend displays the verse card + keyword grid.
 * User selects keywords and calls addResult({ selectedKeywords }).
 * Graph resumes with the selected keywords.
 */
export async function selectKeywordsNode(
  state: VerseStudyState
): Promise<Partial<VerseStudyState>> {
  // Interrupt and wait for user selection
  const userSelection = interrupt({
    type: "keyword_selection",
    verse: state.verse,
    reference: state.reference,
    keywords: state.keywords,
    prompt: "Select keywords to study deeper",
  });

  // userSelection comes from Command(resume: { selectedKeywords: [...] })
  const selectedKeywords = (userSelection as { selectedKeywords: string[] })
    .selectedKeywords;

  return {
    selectedKeywords,
  };
}
