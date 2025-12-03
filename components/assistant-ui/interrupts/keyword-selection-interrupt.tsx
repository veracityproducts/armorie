"use client";

import { useState } from "react";
import { BookOpen, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { ThemedCard } from "@/components/ui/themed-card";
import { cn } from "@/lib/utils";

interface KeywordSelectionInterruptProps {
  verse: string;
  reference: string;
  keywords: string[];
  onSubmit: (selectedKeywords: string[]) => void;
}

function KeywordChip({
  keyword,
  isSelected,
  onClick,
}: {
  keyword: string;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <ThemedCard
      variant="secondary"
      isSelected={isSelected}
      onClick={onClick}
      className="min-w-[120px]"
    >
      <div className="flex flex-col items-center justify-center py-2 relative">
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

        <p
          className={cn(
            "text-lg font-bold text-center",
            isSelected ? "text-secondary-700" : "text-secondary-600",
          )}
        >
          {keyword}
        </p>
        <p className="text-[10px] text-secondary-400 mt-1">
          tap to {isSelected ? "deselect" : "select"}
        </p>
      </div>
    </ThemedCard>
  );
}

export function KeywordSelectionInterrupt({
  verse,
  reference,
  keywords,
  onSubmit,
}: KeywordSelectionInterruptProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggleKeyword = (keyword: string) => {
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="w-full"
    >
      <div className="max-w-[var(--thread-max-width)] mx-auto">
        <div className="flex flex-col gap-4">
          {/* Verse card */}
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

          {/* Keywords grid */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4"
          >
            {keywords.map((keyword, index) => (
              <motion.div
                key={keyword}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + index * 0.05 }}
              >
                <KeywordChip
                  keyword={keyword}
                  isSelected={selected.has(keyword)}
                  onClick={() => toggleKeyword(keyword)}
                />
              </motion.div>
            ))}
          </motion.div>

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
                    Select keywords to study deeper
                  </span>
                </div>
                <Button
                  onClick={handleSubmit}
                  disabled={selected.size === 0}
                  className={cn(
                    "bg-secondary-500 text-white hover:bg-secondary-600",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    "transition-all duration-200",
                    "px-6",
                  )}
                >
                  Study Selected ({selected.size})
                </Button>
              </div>
            </ThemedCard>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
