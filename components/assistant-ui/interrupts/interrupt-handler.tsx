"use client";

import {
  useLangGraphInterruptState,
  useLangGraphSendCommand,
} from "@assistant-ui/react-langgraph";
import { AnimatePresence, motion } from "motion/react";
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

// Animation variants for smooth interrupt transitions
const interruptVariants = {
  initial: { opacity: 0, y: 20, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -10, scale: 0.98 },
};

const interruptTransition = {
  type: "spring" as const,
  stiffness: 300,
  damping: 30,
};

export function InterruptHandler() {
  // Use the official hook to access interrupt state from LangGraph runtime
  // The interrupt state has a `value` field containing our custom payload
  const interruptState = useLangGraphInterruptState();
  const sendCommand = useLangGraphSendCommand();

  // Extract the interrupt payload from the value field
  const interrupt = interruptState?.value as InterruptPayload | undefined;

  const handleResume = async (resumeData: Record<string, unknown>) => {
    // Send resume command back to the graph
    // The command.resume must be a string per the type definition
    await sendCommand({ resume: JSON.stringify(resumeData) });
  };

  // Render content based on interrupt type
  const renderInterruptContent = () => {
    if (!interrupt) return null;

    switch (interrupt.type) {
      case "keyword_selection":
        return (
          <motion.div
            key="keyword_selection"
            variants={interruptVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={interruptTransition}
          >
            <KeywordSelectionInterrupt
              verse={interrupt.verse}
              reference={interrupt.reference}
              keywords={interrupt.keywords}
              onSubmit={(selectedKeywords) => {
                handleResume({ selectedKeywords });
              }}
            />
          </motion.div>
        );

      case "verse_map":
        return (
          <motion.div
            key="verse_map"
            variants={interruptVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={interruptTransition}
          >
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
          </motion.div>
        );

      case "historical_context":
        return (
          <motion.div
            key="historical_context"
            variants={interruptVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={interruptTransition}
          >
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
          </motion.div>
        );

      default:
        return (
          <motion.div
            key="unknown"
            variants={interruptVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={interruptTransition}
            className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
          >
            <p className="text-yellow-800">
              Unknown interrupt type: {(interrupt as { type: string }).type}
            </p>
          </motion.div>
        );
    }
  };

  return (
    <AnimatePresence mode="wait">{renderInterruptContent()}</AnimatePresence>
  );
}
