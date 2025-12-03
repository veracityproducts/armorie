import { interrupt } from "@langchain/langgraph";
import type { VerseStudyState } from "../state";

/**
 * Present Artifact #2: Historical Context display
 * Interrupts to display the historical context and allow user questions/edits
 */
export async function presentHistoricalContextNode(
  state: VerseStudyState
): Promise<Partial<VerseStudyState>> {
  // Interrupt with historical context artifact data
  const userAction = interrupt({
    type: "historical_context",
    artifact: {
      verse: state.verse,
      reference: state.reference,
      studies: state.studies,
      historicalContext: state.historicalContext,
    },
    actions: [
      {
        id: "continue",
        label: "Continue",
        description: "Proceed to reflection",
      },
      {
        id: "ask_question",
        label: "Ask a Question",
        description: "Ask a follow-up question about this verse",
      },
    ],
    prompt: "Explore the historical context. You can edit your notes or ask questions.",
  });

  const action = userAction as {
    action: string;
    question?: string;
    editedContext?: typeof state.historicalContext;
  };

  // If user edited context, update it
  if (action.editedContext) {
    return { historicalContext: action.editedContext };
  }

  // For now, questions will be handled in a future iteration
  // The reflection node can incorporate any questions the user had

  return {};
}
