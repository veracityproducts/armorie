"use client";

import type { FC } from "react";
import { ThreadPrimitive } from "@assistant-ui/react";
import { motion } from "motion/react";
import { Heart, Sparkles, Shield, Lightbulb } from "lucide-react";
import { QUICK_TOPICS, QUICK_VERSES } from "@/lib/bible-data";

const TOPIC_ICONS = {
  comfort: Heart,
  peace: Sparkles,
  strength: Shield,
  wisdom: Lightbulb,
} as const;

export const QuickActions: FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="mt-6 space-y-3"
    >
      {/* Primary Quick Actions - Topics */}
      <div className="flex flex-wrap justify-center gap-2">
        {QUICK_TOPICS.map((topic, index) => {
          const Icon = TOPIC_ICONS[topic];
          return (
            <ThreadPrimitive.Suggestion key={topic} prompt={topic} send asChild>
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.05, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 shadow-sm hover:shadow-md text-primary-700 bg-primary-100/80 hover:bg-primary-100"
              >
                <Icon className="size-3.5" />
                <span className="capitalize">{topic}</span>
              </motion.button>
            </ThreadPrimitive.Suggestion>
          );
        })}
      </div>

      {/* Secondary Quick Actions - Popular Verses */}
      <div className="flex flex-wrap justify-center gap-2">
        {QUICK_VERSES.map((verse, index) => (
          <ThreadPrimitive.Suggestion key={verse} prompt={verse} send asChild>
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 + index * 0.03 }}
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.98 }}
              className="px-3.5 py-1.5 text-xs font-medium text-accent-700 bg-accent-100/80 hover:bg-accent-100 rounded-full transition-all duration-200 border border-accent-200/60 shadow-sm hover:shadow"
            >
              {verse}
            </motion.button>
          </ThreadPrimitive.Suggestion>
        ))}
      </div>
    </motion.div>
  );
};
