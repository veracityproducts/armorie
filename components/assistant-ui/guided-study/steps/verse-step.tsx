"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BookOpen, ChevronRight, ScrollText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGuidedStudyContext } from "../guided-study-context";
import { GuidanceCard } from "../guidance-tooltip";
import { cn } from "@/lib/utils";
import type { Verse } from "@/hooks/use-guided-study";

interface VerseStepProps {
  onStudyVerse: (verse: Verse) => Promise<void>;
}

export function VerseStep({ onStudyVerse }: VerseStepProps) {
  const {
    topic,
    suggestedVerses,
    selectedVerse,
    selectVerse,
    isLoading,
    canProceedFromVerse,
  } = useGuidedStudyContext();
  const [showGuidance, setShowGuidance] = useState(true);

  const handleSubmit = async () => {
    if (!canProceedFromVerse || !selectedVerse) return;
    await onStudyVerse(selectedVerse);
  };

  const handleSelectVerse = (verse: Verse) => {
    selectVerse(verse);
    if (showGuidance) setShowGuidance(false);
  };

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {showGuidance && suggestedVerses.length > 0 && (
          <GuidanceCard
            icon={ScrollText}
            variant="info"
            title="Choose a verse that resonates"
            description="Each verse offers a unique window into this theme. Select the one that speaks most to where you are right now — there's no wrong choice."
            onDismiss={() => setShowGuidance(false)}
          />
        )}
      </AnimatePresence>

      <motion.div layout className="text-sm text-muted-foreground">
        Verses about{" "}
        <span className="font-medium text-foreground">{topic}</span>
      </motion.div>

      <motion.div layout className="space-y-2">
        {suggestedVerses.map((verse, i) => (
          <motion.button
            key={verse.reference}
            type="button"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => handleSelectVerse(verse)}
            className={cn(
              "w-full flex items-start gap-3 p-3 border rounded-lg text-left transition-all",
              selectedVerse?.reference === verse.reference
                ? "border-accent-400 bg-accent-50 ring-2 ring-accent-200"
                : "border-border hover:bg-primary-50 hover:border-primary-300",
            )}
          >
            <div
              className={cn(
                "shrink-0 size-5 rounded-full border-2 flex items-center justify-center mt-0.5",
                selectedVerse?.reference === verse.reference
                  ? "border-accent-500 bg-accent-500"
                  : "border-muted-foreground/30",
              )}
            >
              {selectedVerse?.reference === verse.reference && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="size-2 rounded-full bg-white"
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <BookOpen className="size-4 text-primary-600 shrink-0" />
                <span className="font-medium text-foreground">
                  {verse.reference}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                "{verse.text}"
              </p>
            </div>
          </motion.button>
        ))}
      </motion.div>

      {suggestedVerses.length === 0 && !isLoading && (
        <div className="text-center py-8 text-muted-foreground">
          No verses found. Try a different topic.
        </div>
      )}

      <Button
        onClick={handleSubmit}
        disabled={!canProceedFromVerse || isLoading}
        className="w-full bg-accent-500 text-white hover:bg-accent-600"
      >
        {isLoading ? (
          "Extracting keywords..."
        ) : (
          <>
            Study This Verse
            <ChevronRight className="size-4 ml-2" />
          </>
        )}
      </Button>
    </div>
  );
}
