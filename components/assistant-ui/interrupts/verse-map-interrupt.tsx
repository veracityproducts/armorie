"use client";

import { useState } from "react";
import { BookOpen, Sparkles, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { ThemedCard } from "@/components/ui/themed-card";

interface KeywordStudy {
  keyword: string;
  greekHebrew: string;
  meaning: string;
  references: string[];
  significance: string;
  userNotes?: string;
}

interface VerseMapInterruptProps {
  verse: string;
  reference: string;
  studies: KeywordStudy[];
  onGoDeeper: (editedStudies?: KeywordStudy[]) => void;
}

// Overlay study card that covers the grid area
function StudyOverlay({
  study,
  onClose,
  onUpdateNotes,
}: {
  study: KeywordStudy;
  onClose: () => void;
  onUpdateNotes: (notes: string) => void;
}) {
  const [notes, setNotes] = useState(study.userNotes || "");

  const handleNotesBlur = () => {
    onUpdateNotes(notes);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="absolute inset-0 z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <ThemedCard variant="secondary" isSelected className="h-full">
        <div className="flex flex-col h-full overflow-auto">
          {/* Header with close button */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold text-secondary-700">
                {study.keyword}
              </h3>
              {study.greekHebrew && (
                <p className="text-base text-secondary-500 italic mt-1">
                  {study.greekHebrew}
                </p>
              )}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="p-1.5 rounded-full hover:bg-secondary-100 transition-colors"
            >
              <X className="size-5 text-secondary-500" />
            </button>
          </div>

          {/* Study content */}
          <div className="space-y-4 flex-1">
            {study.meaning && (
              <div>
                <h4 className="text-sm font-semibold text-secondary-700 uppercase tracking-wide mb-1">
                  Meaning
                </h4>
                <p className="text-foreground leading-relaxed">
                  {study.meaning}
                </p>
              </div>
            )}

            {study.references && study.references.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-secondary-700 uppercase tracking-wide mb-1">
                  See Also
                </h4>
                <div className="flex flex-wrap gap-2">
                  {study.references.map((ref) => (
                    <span
                      key={ref}
                      className="px-2 py-1 bg-secondary-100 text-secondary-700 rounded-md text-sm"
                    >
                      {ref}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {study.significance && (
              <div>
                <h4 className="text-sm font-semibold text-secondary-700 uppercase tracking-wide mb-1">
                  Significance
                </h4>
                <p className="text-foreground leading-relaxed">
                  {study.significance}
                </p>
              </div>
            )}

            {/* User Notes section */}
            <div>
              <h4 className="text-sm font-semibold text-secondary-700 uppercase tracking-wide mb-1">
                Your Notes
              </h4>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                onBlur={handleNotesBlur}
                placeholder="Add your personal notes, reflections, or insights..."
                className="w-full p-3 text-sm border border-secondary-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-secondary-300 transition-shadow bg-secondary-50/50 min-h-[80px]"
                rows={3}
              />
            </div>
          </div>

          {/* Footer hint */}
          <p className="text-xs text-secondary-400 text-center mt-4">
            tap anywhere outside or press × to close
          </p>
        </div>
      </ThemedCard>
    </motion.div>
  );
}

// Preview card for the grid
function StudyCardPreview({
  study,
  onClick,
  delay = 0,
}: {
  study: KeywordStudy;
  onClick: () => void;
  delay?: number;
}) {
  // Truncate meaning for preview
  const meaningPreview = study.meaning
    ? study.meaning.length > 60
      ? study.meaning.slice(0, 60).trim() + "..."
      : study.meaning
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.2 }}
    >
      <ThemedCard variant="secondary" className="h-full" onClick={onClick}>
        <div className="flex flex-col h-full min-h-[120px]">
          {/* Header with keyword */}
          <div>
            <h3 className="text-xl font-bold text-secondary-600">
              {study.keyword}
            </h3>
            <p className="text-sm text-secondary-500 italic">
              {study.greekHebrew}
            </p>
          </div>

          {/* Brief preview */}
          {meaningPreview && (
            <p className="text-xs text-secondary-600 mt-2 leading-relaxed flex-1">
              {meaningPreview}
            </p>
          )}

          {/* Notes indicator */}
          {study.userNotes && (
            <p className="text-[10px] text-secondary-500 mt-1">Has notes</p>
          )}

          {/* Tap hint */}
          <p className="text-[10px] text-secondary-400 mt-auto pt-2">
            tap to view full study
          </p>
        </div>
      </ThemedCard>
    </motion.div>
  );
}

export function VerseMapInterrupt({
  verse,
  reference,
  studies,
  onGoDeeper,
}: VerseMapInterruptProps) {
  const [editedStudies, setEditedStudies] = useState<KeywordStudy[]>(studies);
  const [openStudyKeyword, setOpenStudyKeyword] = useState<string | null>(null);

  const handleUpdateNotes = (keyword: string, notes: string) => {
    setEditedStudies((prev) =>
      prev.map((s) => (s.keyword === keyword ? { ...s, userNotes: notes } : s)),
    );
  };

  const currentStudy = openStudyKeyword
    ? editedStudies.find((s) => s.keyword === openStudyKeyword)
    : null;

  const hasEdits = JSON.stringify(editedStudies) !== JSON.stringify(studies);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="w-full min-h-[400px]"
    >
      <div className="max-w-[var(--thread-max-width)] mx-auto">
        {/* Wrapper that establishes positioning context for overlay */}
        <div className="relative">
          <div className="flex flex-col gap-4">
            {/* Verse header */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <ThemedCard variant="primary">
                <div className="flex items-center gap-4 text-left">
                  <BookOpen className="size-8 text-primary-600 shrink-0" />
                  <div>
                    <blockquote className="text-base italic text-foreground leading-relaxed">
                      "{verse}"
                    </blockquote>
                    <p className="text-sm font-semibold text-primary-600 mt-2">
                      {reference}
                    </p>
                  </div>
                </div>
              </ThemedCard>
            </motion.div>

            {/* Study cards grid - 2x2 */}
            <div className="grid grid-cols-2 gap-4">
              {editedStudies.map((study, index) => (
                <StudyCardPreview
                  key={study.keyword}
                  study={study}
                  onClick={() => setOpenStudyKeyword(study.keyword)}
                  delay={0.2 + index * 0.05}
                />
              ))}
            </div>

            {/* Action bar */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <ThemedCard variant="accent">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="size-5 text-accent-600" />
                    <span className="text-sm text-accent-700">
                      {editedStudies.length} keywords studied
                      {hasEdits && (
                        <span className="ml-2 text-secondary-500">
                          (edited)
                        </span>
                      )}
                    </span>
                  </div>
                  <Button
                    onClick={() =>
                      onGoDeeper(hasEdits ? editedStudies : undefined)
                    }
                    className="bg-secondary-500 text-white hover:bg-secondary-600 transition-all duration-200 px-6"
                  >
                    Go Deeper
                  </Button>
                </div>
              </ThemedCard>
            </motion.div>
          </div>

          {/* Overlay for expanded study - covers the grid area, not full page */}
          <AnimatePresence>
            {currentStudy && (
              <StudyOverlay
                study={currentStudy}
                onClose={() => setOpenStudyKeyword(null)}
                onUpdateNotes={(notes) =>
                  handleUpdateNotes(currentStudy.keyword, notes)
                }
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
