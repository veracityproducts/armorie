"use client";

import {
  useLangGraphInterruptState,
  useLangGraphSendCommand,
} from "@assistant-ui/react-langgraph";
import { KeywordSelectionInterrupt } from "./keyword-selection-interrupt";
import { VerseMapInterrupt } from "./verse-map-interrupt";
import { HistoricalContextInterrupt } from "./historical-context-interrupt";

interface KeywordStudy {
  keyword: string;
  greekHebrew: string;
  meaning: string;
  references: string[];
  significance: string;
}

interface HistoricalContext {
  period: string;
  author: string;
  audience: string;
  events: string[];
  culturalNotes: string;
}

// Interrupt payload types from our LangGraph nodes
type KeywordSelectionPayload = {
  type: "keyword_selection";
  verse: string;
  reference: string;
  keywords: string[];
  prompt: string;
};

type VerseMapPayload = {
  type: "verse_map";
  artifact: {
    verse: string;
    reference: string;
    studies: KeywordStudy[];
  };
  actions: Array<{ id: string; label: string; description: string }>;
  prompt: string;
};

type HistoricalContextPayload = {
  type: "historical_context";
  artifact: {
    verse: string;
    reference: string;
    studies: KeywordStudy[];
    historicalContext: HistoricalContext;
  };
  actions: Array<{ id: string; label: string; description: string }>;
  prompt: string;
};

type InterruptPayload =
  | KeywordSelectionPayload
  | VerseMapPayload
  | HistoricalContextPayload;

export function InterruptHandler() {
  // Use the official hook to access interrupt state from LangGraph runtime
  // The interrupt state has a `value` field containing our custom payload
  const interruptState = useLangGraphInterruptState();
  const sendCommand = useLangGraphSendCommand();

  // Extract the interrupt payload from the value field
  const interrupt = interruptState?.value as InterruptPayload | undefined;

  if (!interrupt) {
    return null;
  }

  const handleResume = async (resumeData: Record<string, unknown>) => {
    // Send resume command back to the graph
    // The resume data must be JSON serializable
    await sendCommand({ resume: JSON.stringify(resumeData) });
  };

  // Render the appropriate interrupt UI based on type
  switch (interrupt.type) {
    case "keyword_selection":
      return (
        <KeywordSelectionInterrupt
          verse={interrupt.verse}
          reference={interrupt.reference}
          keywords={interrupt.keywords}
          onSubmit={(selectedKeywords) => {
            handleResume({ selectedKeywords });
          }}
        />
      );

    case "verse_map":
      return (
        <VerseMapInterrupt
          verse={interrupt.artifact.verse}
          reference={interrupt.artifact.reference}
          studies={interrupt.artifact.studies}
          onGoDeeper={(editedStudies) => {
            handleResume({
              action: "go_deeper",
              editedStudies,
            });
          }}
        />
      );

    case "historical_context":
      return (
        <HistoricalContextInterrupt
          verse={interrupt.artifact.verse}
          reference={interrupt.artifact.reference}
          studies={interrupt.artifact.studies}
          historicalContext={interrupt.artifact.historicalContext}
          onContinue={(editedContext) => {
            handleResume({
              action: "continue",
              editedContext,
            });
          }}
        />
      );

    default:
      // Unknown interrupt type
      return (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800">
            Unknown interrupt type: {(interrupt as { type: string }).type}
          </p>
        </div>
      );
  }
}
