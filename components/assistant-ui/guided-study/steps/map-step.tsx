"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  BookOpen,
  RotateCcw,
  Save,
  ChevronDown,
  ChevronUp,
  Map,
  Clock,
  Users,
  Scroll,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGuidedStudyContext } from "../guided-study-context";
import { GuidanceCard } from "../guidance-tooltip";
import { ThemedCard } from "@/components/ui/themed-card";
import { cn } from "@/lib/utils";

interface MapStepProps {
  onSave?: () => void;
  onStartNew: () => void;
}

export function MapStep({ onSave, onStartNew }: MapStepProps) {
  const { selectedVerse, studies, historicalContext } = useGuidedStudyContext();
  const [expandedStudy, setExpandedStudy] = useState<string | null>(
    studies[0]?.keyword || null,
  );
  const [showGuidance, setShowGuidance] = useState(true);
  const [showHistory, setShowHistory] = useState(false);

  const toggleStudy = (keyword: string) => {
    setExpandedStudy(expandedStudy === keyword ? null : keyword);
    if (showGuidance) setShowGuidance(false);
  };

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {showGuidance && studies.length > 0 && (
          <GuidanceCard
            icon={Map}
            variant="tip"
            title="Your Verse Map is ready"
            description="This is your personal study guide. Tap each keyword to explore its meaning, original language roots, and connections to other scriptures. Take your time — let these truths sink deep."
            onDismiss={() => setShowGuidance(false)}
          />
        )}
      </AnimatePresence>

      {/* Verse header */}
      <motion.div layout>
        <ThemedCard variant="primary">
          <div className="flex items-center gap-3">
            <BookOpen className="size-5 text-primary-600 shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-primary-600">
                {selectedVerse?.reference}
              </p>
              <p className="text-sm text-muted-foreground italic line-clamp-1">
                "{selectedVerse?.text}"
              </p>
            </div>
          </div>
        </ThemedCard>
      </motion.div>

      {/* Historical Context */}
      {historicalContext && (
        <motion.div layout className="space-y-2">
          <button
            type="button"
            onClick={() => setShowHistory(!showHistory)}
            className={cn(
              "w-full flex items-center justify-between p-3 border rounded-lg text-left transition-all",
              showHistory
                ? "border-accent-300 bg-accent-50/50"
                : "border-border hover:border-primary-300",
            )}
          >
            <div className="flex items-center gap-2">
              <Clock className="size-4 text-accent-600" />
              <span className="font-medium text-foreground">
                Historical Context
              </span>
            </div>
            {showHistory ? (
              <ChevronUp className="size-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="size-4 text-muted-foreground" />
            )}
          </button>

          <AnimatePresence>
            {showHistory && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="p-3 border border-accent-200 rounded-lg bg-accent-50/30 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <Clock className="size-3 text-accent-600" />
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Period
                        </span>
                      </div>
                      <p className="text-sm text-foreground">
                        {historicalContext.period}
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <Scroll className="size-3 text-accent-600" />
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Author
                        </span>
                      </div>
                      <p className="text-sm text-foreground">
                        {historicalContext.author}
                      </p>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <Users className="size-3 text-accent-600" />
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Original Audience
                      </span>
                    </div>
                    <p className="text-sm text-foreground">
                      {historicalContext.audience}
                    </p>
                  </div>

                  {historicalContext.events.length > 0 && (
                    <div>
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Key Events
                      </span>
                      <ul className="mt-1 space-y-1">
                        {historicalContext.events.map((event, i) => (
                          <li
                            key={i}
                            className="text-sm text-foreground flex items-start gap-2"
                          >
                            <span className="text-accent-500 mt-1.5">•</span>
                            {event}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div>
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Cultural Notes
                    </span>
                    <p className="text-sm text-foreground mt-1">
                      {historicalContext.culturalNotes}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Studies */}
      <motion.div layout className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">
            Keyword Studies
          </span>
          <span className="text-xs text-muted-foreground">
            {studies.length} keywords
          </span>
        </div>

        <div className="space-y-2">
          {studies.map((study, i) => (
            <motion.div
              key={study.keyword}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={cn(
                "border rounded-lg transition-all overflow-hidden",
                expandedStudy === study.keyword
                  ? "border-accent-300 bg-accent-50/50"
                  : "border-border hover:border-primary-300",
              )}
            >
              <button
                type="button"
                onClick={() => toggleStudy(study.keyword)}
                className="w-full flex items-center justify-between p-3 text-left"
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">
                    {study.keyword}
                  </span>
                  {study.greekHebrew && (
                    <span className="text-xs text-muted-foreground italic">
                      ({study.greekHebrew})
                    </span>
                  )}
                </div>
                {expandedStudy === study.keyword ? (
                  <ChevronUp className="size-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="size-4 text-muted-foreground" />
                )}
              </button>

              <AnimatePresence>
                {expandedStudy === study.keyword && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-3 pb-3 space-y-3 border-t border-border/50 pt-3">
                      <div>
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Meaning
                        </span>
                        <p className="text-sm text-foreground mt-1">
                          {study.meaning}
                        </p>
                      </div>

                      <div>
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Significance
                        </span>
                        <p className="text-sm text-foreground mt-1">
                          {study.significance}
                        </p>
                      </div>

                      {study.references.length > 0 && (
                        <div>
                          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            Related Verses
                          </span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {study.references.map((ref) => (
                              <span
                                key={ref}
                                className="text-xs px-2 py-0.5 bg-primary-100 text-primary-700 rounded"
                              >
                                {ref}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div layout className="flex gap-2">
        <Button
          variant="outline"
          onClick={onStartNew}
          className="flex-1 border-primary-300 text-primary-700 hover:bg-primary-50"
        >
          <RotateCcw className="size-4 mr-2" />
          Start New
        </Button>
        {onSave && (
          <Button
            onClick={onSave}
            className="flex-1 bg-accent-500 text-white hover:bg-accent-600"
          >
            <Save className="size-4 mr-2" />
            Save Study
          </Button>
        )}
      </motion.div>
    </div>
  );
}
