"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface ThinkingIndicatorProps {
  message?: string;
  variant?: "dots" | "shimmer" | "pulse";
  className?: string;
}

export function ThinkingIndicator({
  message = "Thinking",
  variant = "dots",
  className,
}: ThinkingIndicatorProps) {
  if (variant === "shimmer") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={cn(
          "flex items-center gap-2 px-4 py-3 rounded-xl bg-primary-100/50",
          className,
        )}
      >
        <div className="shimmer h-4 w-32 rounded bg-primary-200" />
      </motion.div>
    );
  }

  if (variant === "pulse") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={cn(
          "flex items-center gap-3 px-4 py-3 rounded-xl bg-primary-100/50",
          className,
        )}
      >
        <div className="size-2 rounded-full bg-primary-400 animate-pulse" />
        <span className="text-sm text-primary-700">{message}</span>
      </motion.div>
    );
  }

  // Default: dots variant
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-xl bg-primary-100/50",
        className,
      )}
    >
      <div className="flex items-center gap-1">
        <span className="thinking-dot size-1.5 rounded-full bg-primary-500" />
        <span className="thinking-dot size-1.5 rounded-full bg-primary-500" />
        <span className="thinking-dot size-1.5 rounded-full bg-primary-500" />
      </div>
      <span className="text-sm text-primary-700">{message}</span>
    </motion.div>
  );
}

/**
 * Node-specific thinking indicators for the verse study flow
 */
export function VerseStudyThinking({ node }: { node: string }) {
  const messages: Record<string, string> = {
    parseVerse: "Finding your verse...",
    extractKeywords: "Discovering key words...",
    generateStudies: "Researching keywords...",
    fetchHistory: "Exploring historical context...",
    summarizeInsights: "Gathering insights...",
  };

  return (
    <ThinkingIndicator
      message={messages[node] || "Thinking..."}
      variant="dots"
    />
  );
}
