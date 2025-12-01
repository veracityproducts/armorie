"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { BookOpen, Sparkles, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface KeywordStudy {
  keyword: string;
  greekHebrew?: string;
  meaning?: string;
  references?: string[];
  significance?: string;
}

interface VerseMapGridProps {
  verse: string;
  reference: string;
  keywords: string[];
  keywordStudies?: Record<string, KeywordStudy>;
  onSubmit: (selectedKeywords: string[]) => void;
  isComplete?: boolean;
  selectedKeywords?: string[];
}

// Themed card wrapper that applies our color system
function ThemedCard({
  children,
  variant = "primary",
  className,
  isSelected = false,
  onClick,
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "accent";
  className?: string;
  isSelected?: boolean;
  onClick?: () => void;
}) {
  const variantStyles = {
    primary: {
      outer: "bg-primary-200 ring-primary-300",
      middle: "bg-primary-100",
      inner: "bg-white ring-primary-200",
    },
    secondary: {
      outer: isSelected
        ? "bg-secondary-300 ring-secondary-400"
        : "bg-secondary-200 ring-secondary-300",
      middle: isSelected ? "bg-secondary-200" : "bg-secondary-100",
      inner: "bg-white ring-secondary-200",
    },
    accent: {
      outer: "bg-accent-200 ring-accent-300",
      middle: "bg-accent-100",
      inner: "bg-white ring-accent-200",
    },
  };

  const styles = variantStyles[variant];

  return (
    <div
      onClick={onClick}
      className={cn(
        "grid grid-cols-1 rounded-2xl",
        "shadow-[inset_0_0_2px_1px_rgba(0,0,0,0.05)]",
        "ring-1",
        styles.outer,
        "transition-all duration-300 ease-in-out",
        onClick && "cursor-pointer",
        className
      )}
    >
      <div
        className={cn(
          "grid grid-cols-1 rounded-2xl p-1.5 shadow-md",
          styles.middle
        )}
      >
        <div
          className={cn(
            "rounded-xl p-4 shadow-lg ring-1",
            styles.inner,
            "h-full"
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

// Keyword card with optional meaning preview
function KeywordCard({
  keyword,
  isSelected,
  hasStudy,
  onSelect,
  onOpenStudy,
  disabled,
  greekHebrew,
  meaning,
}: {
  keyword: string;
  isSelected: boolean;
  hasStudy: boolean;
  onSelect: () => void;
  onOpenStudy: () => void;
  disabled?: boolean;
  greekHebrew?: string;
  meaning?: string;
}) {
  // Truncate meaning to first sentence or ~50 chars for preview
  const meaningPreview = meaning
    ? meaning.length > 60
      ? meaning.slice(0, 60).trim() + "..."
      : meaning
    : null;

  return (
    <ThemedCard
      variant="secondary"
      isSelected={isSelected}
      className="h-full"
      onClick={() => {
        if (hasStudy) {
          onOpenStudy();
        } else if (!disabled) {
          onSelect();
        }
      }}
    >
      <div className="flex flex-col h-full min-h-[120px] relative">
        {/* Selection indicator */}
        {isSelected && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute top-0 right-0"
          >
            <div className="size-5 rounded-full bg-secondary-500 flex items-center justify-center">
              <svg
                className="size-3 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </motion.div>
        )}

        {/* Main content area */}
        <div className="flex-1 flex flex-col justify-center">
          {/* Keyword text */}
          <p
            className={cn(
              "text-xl font-bold",
              isSelected ? "text-secondary-700" : "text-secondary-600"
            )}
          >
            {keyword}
          </p>

          {/* Greek/Hebrew */}
          {greekHebrew && (
            <p className="text-sm text-secondary-500 mt-1 italic">
              {greekHebrew}
            </p>
          )}

          {/* Meaning preview */}
          {meaningPreview && (
            <p className="text-xs text-secondary-600 mt-2 leading-relaxed">
              {meaningPreview}
            </p>
          )}
        </div>

        {/* Hint text at bottom */}
        <p className="text-[10px] text-secondary-400 mt-auto pt-2">
          {hasStudy ? "tap to view full study" : `tap to ${isSelected ? "deselect" : "select"}`}
        </p>
      </div>
    </ThemedCard>
  );
}

// Overlay study card that covers the grid
function StudyOverlay({
  study,
  onClose,
}: {
  study: KeywordStudy;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="absolute inset-0 z-50"
      onClick={(e) => {
        // Close when clicking the backdrop (not the card content)
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <ThemedCard variant="secondary" isSelected className="h-full">
        <div className="flex flex-col h-full p-2 overflow-auto">
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

export function VerseMapGrid({
  verse,
  reference,
  keywords,
  keywordStudies,
  onSubmit,
  isComplete = false,
  selectedKeywords: completedKeywords,
}: VerseMapGridProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [openStudy, setOpenStudy] = useState<string | null>(null);
  const hasAutoOpened = useRef(false);

  // Auto-open the first study when studies arrive (only once)
  useEffect(() => {
    if (keywordStudies && !hasAutoOpened.current) {
      const studyKeys = Object.keys(keywordStudies);
      if (studyKeys.length > 0) {
        setOpenStudy(studyKeys[0]);
        hasAutoOpened.current = true;
      }
    }
  }, [keywordStudies]);

  const toggleKeyword = (keyword: string) => {
    if (isComplete) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(keyword)) {
        next.delete(keyword);
      } else {
        next.add(keyword);
      }
      return next;
    });
  };

  const handleSubmit = () => {
    onSubmit(Array.from(selected));
  };

  // Get the 4 keywords (or pad with empty if less)
  const kw = keywords.slice(0, 4);
  while (kw.length < 4) kw.push("");

  const currentStudy = openStudy ? keywordStudies?.[openStudy] : null;

  return (
    <div className="w-full min-h-[400px] p-4">
      {/* Container for grid + overlay */}
      <div className="max-w-2xl mx-auto">
        {/* Wrapper that establishes positioning context */}
        <div className="relative">
          {/* Vertical stack: Verse → Keywords 2x2 → Action bar */}
          <div className="flex flex-col gap-4">
            {/* Verse card at top - full width */}
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

            {/* Keywords in 2x2 grid */}
            <div className="grid grid-cols-2 gap-4">
              {kw[0] && (
                <KeywordCard
                  keyword={kw[0]}
                  isSelected={
                    isComplete
                      ? completedKeywords?.includes(kw[0]) ?? false
                      : selected.has(kw[0])
                  }
                  hasStudy={!!keywordStudies?.[kw[0]]}
                  onSelect={() => toggleKeyword(kw[0])}
                  onOpenStudy={() => setOpenStudy(kw[0])}
                  disabled={isComplete}
                  greekHebrew={keywordStudies?.[kw[0]]?.greekHebrew}
                  meaning={keywordStudies?.[kw[0]]?.meaning}
                />
              )}
              {kw[1] && (
                <KeywordCard
                  keyword={kw[1]}
                  isSelected={
                    isComplete
                      ? completedKeywords?.includes(kw[1]) ?? false
                      : selected.has(kw[1])
                  }
                  hasStudy={!!keywordStudies?.[kw[1]]}
                  onSelect={() => toggleKeyword(kw[1])}
                  onOpenStudy={() => setOpenStudy(kw[1])}
                  disabled={isComplete}
                  greekHebrew={keywordStudies?.[kw[1]]?.greekHebrew}
                  meaning={keywordStudies?.[kw[1]]?.meaning}
                />
              )}
              {kw[2] && (
                <KeywordCard
                  keyword={kw[2]}
                  isSelected={
                    isComplete
                      ? completedKeywords?.includes(kw[2]) ?? false
                      : selected.has(kw[2])
                  }
                  hasStudy={!!keywordStudies?.[kw[2]]}
                  onSelect={() => toggleKeyword(kw[2])}
                  onOpenStudy={() => setOpenStudy(kw[2])}
                  disabled={isComplete}
                  greekHebrew={keywordStudies?.[kw[2]]?.greekHebrew}
                  meaning={keywordStudies?.[kw[2]]?.meaning}
                />
              )}
              {kw[3] && (
                <KeywordCard
                  keyword={kw[3]}
                  isSelected={
                    isComplete
                      ? completedKeywords?.includes(kw[3]) ?? false
                      : selected.has(kw[3])
                  }
                  hasStudy={!!keywordStudies?.[kw[3]]}
                  onSelect={() => toggleKeyword(kw[3])}
                  onOpenStudy={() => setOpenStudy(kw[3])}
                  disabled={isComplete}
                  greekHebrew={keywordStudies?.[kw[3]]?.greekHebrew}
                  meaning={keywordStudies?.[kw[3]]?.meaning}
                />
              )}
            </div>

            {/* Action bar at bottom */}
            <ThemedCard variant="accent">
              <div className="flex items-center justify-center">
                {isComplete ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-3 text-accent-600"
                  >
                    <Sparkles className="size-5" />
                    <span className="text-lg font-medium">
                      Studying {completedKeywords?.length} keywords
                    </span>
                  </motion.div>
                ) : (
                  <div className="flex items-center gap-4">
                    <p className="text-sm text-accent-600">
                      Select keywords to study deeper
                    </p>
                    <Button
                      onClick={handleSubmit}
                      disabled={selected.size === 0}
                      size="lg"
                      className={cn(
                        "bg-secondary-500 text-white hover:bg-secondary-600",
                        "disabled:opacity-50 disabled:cursor-not-allowed",
                        "px-8"
                      )}
                    >
                      Study Selected ({selected.size})
                    </Button>
                  </div>
                )}
              </div>
            </ThemedCard>
          </div>

          {/* Overlay for expanded study - covers the entire grid */}
          <AnimatePresence>
            {currentStudy && (
              <StudyOverlay
                study={currentStudy}
                onClose={() => setOpenStudy(null)}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
