"use client";

import type { FC } from "react";
import { ThreadPrimitive } from "@assistant-ui/react";
import { motion, AnimatePresence } from "motion/react";
import { BookOpen, Hash, Sparkles } from "lucide-react";
import type { TopicSuggestion } from "@/lib/bible-data";

export type AutocompleteSuggestionsProps = {
  show: boolean;
  verses: readonly string[];
  topics: readonly TopicSuggestion[];
};

export const AutocompleteSuggestions: FC<AutocompleteSuggestionsProps> = ({
  show,
  verses,
  topics,
}) => {
  const hasResults = verses.length > 0 || topics.length > 0;

  return (
    <AnimatePresence>
      {show && hasResults && (
        <motion.div
          initial={{ opacity: 0, y: -8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.98 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="absolute top-full left-0 right-0 mt-2 bg-card/95 backdrop-blur-xl border border-border rounded-2xl shadow-xl shadow-primary-200/10 overflow-hidden z-40"
        >
          <div className="p-2 max-h-80 overflow-y-auto">
            {/* Verses Section */}
            {verses.length > 0 && (
              <VerseSuggestions verses={verses} />
            )}

            {/* Topics Section */}
            {topics.length > 0 && (
              <TopicSuggestions topics={topics} versesCount={verses.length} />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

type VerseSuggestionsProps = {
  verses: readonly string[];
};

const VerseSuggestions: FC<VerseSuggestionsProps> = ({ verses }) => (
  <div className="mb-2">
    <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70 flex items-center gap-1.5">
      <BookOpen className="size-3" />
      Scripture
    </div>
    {verses.map((verse, index) => {
      const [reference, preview] = verse.includes(" - ")
        ? verse.split(" - ")
        : [verse, ""];
      return (
        <ThreadPrimitive.Suggestion
          key={verse}
          prompt={reference}
          send
          asChild
        >
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.02 }}
            whileHover={{ scale: 1.01 }}
            className="w-full text-left px-3 py-2.5 rounded-xl text-sm text-foreground hover:bg-primary-100/60 transition-all duration-150 flex items-start gap-3 group"
          >
            <span className="mt-0.5 text-secondary-500 group-hover:text-secondary-600 transition-colors">
              <BookOpen className="size-4" />
            </span>
            <div className="flex-1 min-w-0">
              <span className="font-medium text-foreground">{reference}</span>
              {preview && (
                <span className="block text-xs text-muted-foreground/70 truncate mt-0.5">
                  {preview}
                </span>
              )}
            </div>
          </motion.button>
        </ThreadPrimitive.Suggestion>
      );
    })}
  </div>
);

type TopicSuggestionsProps = {
  topics: readonly TopicSuggestion[];
  versesCount: number;
};

const TopicSuggestions: FC<TopicSuggestionsProps> = ({ topics, versesCount }) => (
  <div>
    {versesCount > 0 && (
      <div className="mx-3 my-2 border-t border-border/50" />
    )}
    <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70 flex items-center gap-1.5">
      <Hash className="size-3" />
      Topics
    </div>
    {topics.map((item, index) => (
      <ThreadPrimitive.Suggestion
        key={item.topic}
        prompt={item.topic}
        send
        asChild
      >
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: (versesCount + index) * 0.02 }}
          whileHover={{ scale: 1.01 }}
          className="w-full text-left px-3 py-2.5 rounded-xl text-sm text-foreground hover:bg-secondary-100/50 transition-all duration-150 flex items-start gap-3 group"
        >
          <span className="mt-0.5 text-accent-500 group-hover:text-accent-600 transition-colors">
            <Sparkles className="size-4" />
          </span>
          <div className="flex-1 min-w-0">
            <span className="font-medium text-foreground capitalize">{item.topic}</span>
            <span className="block text-xs text-muted-foreground/70 truncate mt-0.5">
              {item.description}
            </span>
          </div>
        </motion.button>
      </ThreadPrimitive.Suggestion>
    ))}
  </div>
);
