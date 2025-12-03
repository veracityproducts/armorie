import { interrupt } from "@langchain/langgraph";
import type { VerseStudyState } from "../state";

/**
 * Present Artifact #1: Verse Map with expandable cards
 * Interrupts to display the studies and wait for "Go Deeper" action
 */
export async function presentVerseMapNode(
  state: VerseStudyState
): Promise<Partial<VerseStudyState>> {
  // Interrupt with verse map artifact data
  // Frontend will render expandable/editable cards
  const userAction = interrupt({
    type: "verse_map",
    artifact: {
      verse: state.verse,
      reference: state.reference,
      studies: state.studies,
    },
    actions: [
      {
        id: "go_deeper",
        label: "Go Deeper",
        description: "Explore the historical context of this verse",
      },
    ],
    prompt: "Review your verse study. Click 'Go Deeper' to explore historical context.",
  });

  // User clicked "Go Deeper" - continue to historical context
  // The resume payload can include any edits the user made to the studies
  const action = userAction as { action: string; editedStudies?: typeof state.studies };

  // If user edited studies, update them
  if (action.editedStudies) {
    return { studies: action.editedStudies };
  }

  return {};
}
