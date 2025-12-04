"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, ChevronRight, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGuidedStudyContext } from "../guided-study-context";
import { GuidanceCard } from "../guidance-tooltip";
import { cn } from "@/lib/utils";

interface KeywordStepProps {
  onGenerateStudies: (keywords: string[]) => Promise<void>;
}

export function KeywordStep({ onGenerateStudies }: KeywordStepProps) {
  const {
    selectedVerse,
    suggestedKeywords,
    selectedKeywords,
    selectKeywords,
    isLoading,
    canProceedFromKeywords,
  } = useGuidedStudyContext();
  const [showGuidance, setShowGuidance] = useState(true);

  const toggleKeyword = (keyword: string) => {
    if (selectedKeywords.includes(keyword)) {
      selectKeywords(selectedKeywords.filter((k) => k !== keyword));
    } else {
      if (selectedKeywords.length < 4) {
        selectKeywords([...selectedKeywords, keyword]);
        if (showGuidance) setShowGuidance(false);
      }
    }
  };

  const handleSubmit = async () => {
    if (!canProceedFromKeywords) return;
    await onGenerateStudies(selectedKeywords);
  };

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {showGuidance && suggestedKeywords.length > 0 && (
          <GuidanceCard
            icon={Key}
            variant="learn"
            title="What are keywords?"
            description="Keywords are words that unlock deeper meaning. In the original Hebrew and Greek, many words carry layers of significance lost in translation. By studying these key terms, you'll discover the richness God embedded in His Word."
            onDismiss={() => setShowGuidance(false)}
          />
        )}
      </AnimatePresence>

      <motion.div layout className="text-sm text-muted-foreground">
        Select keywords from{" "}
        <span className="font-medium text-foreground">
          {selectedVerse?.reference}
        </span>
      </motion.div>

      <motion.div
        layout
        className="p-3 bg-primary-50 border border-primary-200 rounded-lg"
      >
        <p className="text-sm text-foreground italic">
          "{selectedVerse?.text}"
        </p>
      </motion.div>

      <motion.div layout className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">
            Key words to study
          </span>
          <span className="text-xs text-muted-foreground">
            {selectedKeywords.length}/4 selected
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {suggestedKeywords.map((keyword, i) => {
            const isSelected = selectedKeywords.includes(keyword);
            return (
              <motion.button
                key={keyword}
                type="button"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => toggleKeyword(keyword)}
                disabled={!isSelected && selectedKeywords.length >= 4}
                className={cn(
                  "px-3 py-1.5 rounded-full text-sm font-medium transition-all",
                  isSelected
                    ? "bg-accent-500 text-white shadow-sm"
                    : "bg-primary-100 text-primary-700 border border-primary-300 hover:bg-primary-200",
                  !isSelected &&
                    selectedKeywords.length >= 4 &&
                    "opacity-50 cursor-not-allowed",
                )}
              >
                {keyword}
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {suggestedKeywords.length === 0 && !isLoading && (
        <div className="text-center py-4 text-muted-foreground">
          No keywords extracted. Try selecting a different verse.
        </div>
      )}

      <Button
        onClick={handleSubmit}
        disabled={!canProceedFromKeywords || isLoading}
        className="w-full bg-accent-500 text-white hover:bg-accent-600"
      >
        {isLoading ? (
          <>
            <Sparkles className="size-4 mr-2 animate-pulse" />
            Generating studies...
          </>
        ) : (
          <>
            <Sparkles className="size-4 mr-2" />
            Generate Studies
            <ChevronRight className="size-4 ml-2" />
          </>
        )}
      </Button>
    </div>
  );
}
