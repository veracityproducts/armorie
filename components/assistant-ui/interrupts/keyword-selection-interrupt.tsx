"use client";

import { useState } from "react";
import { BookOpen, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface KeywordSelectionInterruptProps {
  verse: string;
  reference: string;
  keywords: string[];
  onSubmit: (selectedKeywords: string[]) => void;
}

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
        onClick && "cursor-pointer hover:scale-[1.02]",
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
            isSelected ? "text-secondary-700" : "text-secondary-600"
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
    <div className="w-full p-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col gap-4">
          {/* Verse card */}
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

          {/* Keywords grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {keywords.map((keyword) => (
              <KeywordChip
                key={keyword}
                keyword={keyword}
                isSelected={selected.has(keyword)}
                onClick={() => toggleKeyword(keyword)}
              />
            ))}
          </div>

          {/* Action bar */}
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
                  "px-6"
                )}
              >
                Study Selected ({selected.size})
              </Button>
            </div>
          </ThemedCard>
        </div>
      </div>
    </div>
  );
}
