"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Sparkles, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGuidedStudyContext } from "../guided-study-context";
import { GuidanceCard } from "../guidance-tooltip";

const QUICK_TOPICS = [
  { label: "Peace", color: "primary" },
  { label: "Hope", color: "accent" },
  { label: "Faith", color: "primary" },
  { label: "Comfort", color: "accent" },
  { label: "Strength", color: "primary" },
  { label: "Love", color: "accent" },
] as const;

interface TopicStepProps {
  onFindVerses: (topic: string) => Promise<void>;
}

export function TopicStep({ onFindVerses }: TopicStepProps) {
  const { topic, setTopic, isLoading, canProceedFromTopic } =
    useGuidedStudyContext();
  const [inputValue, setInputValue] = useState(topic || "");
  const [showGuidance, setShowGuidance] = useState(true);

  const handleInputChange = (value: string) => {
    setInputValue(value);
    setTopic(value);
    if (value.length > 0 && showGuidance) {
      setShowGuidance(false);
    }
  };

  const handleQuickTopic = (topicLabel: string) => {
    setInputValue(topicLabel.toLowerCase());
    setTopic(topicLabel.toLowerCase());
    setShowGuidance(false);
  };

  const handleSubmit = async () => {
    if (!canProceedFromTopic) return;
    await onFindVerses(inputValue);
  };

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {showGuidance && (
          <GuidanceCard
            icon={Compass}
            variant="tip"
            title="Start with what's on your heart"
            description="Enter a feeling, theme, or life situation. We'll find Bible verses that speak to your journey and guide you through studying them deeply."
            onDismiss={() => setShowGuidance(false)}
          />
        )}
      </AnimatePresence>

      <motion.div layout className="space-y-2">
        <label
          htmlFor="topic-search"
          className="text-sm font-medium text-foreground"
        >
          What would you like to study?
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            id="topic-search"
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="Enter a topic, feeling, or theme..."
            className="pl-10 bg-background border-border"
            onKeyDown={(e) => {
              if (e.key === "Enter" && canProceedFromTopic) {
                handleSubmit();
              }
            }}
          />
        </div>
      </motion.div>

      <motion.div layout className="space-y-2">
        <span className="text-sm text-muted-foreground">Quick topics</span>
        <div className="flex flex-wrap gap-2">
          {QUICK_TOPICS.map((t, i) => (
            <motion.div
              key={t.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
            >
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickTopic(t.label)}
                className={
                  t.color === "primary"
                    ? "bg-primary-100 text-primary-700 border-primary-300 hover:bg-primary-200"
                    : "bg-accent-100 text-accent-700 border-accent-300 hover:bg-accent-200"
                }
              >
                {t.label}
              </Button>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <Button
        onClick={handleSubmit}
        disabled={!canProceedFromTopic || isLoading}
        className="w-full bg-accent-500 text-white hover:bg-accent-600"
      >
        {isLoading ? (
          <>
            <Sparkles className="size-4 mr-2 animate-pulse" />
            Finding verses...
          </>
        ) : (
          <>
            <Search className="size-4 mr-2" />
            Find Verses
          </>
        )}
      </Button>
    </div>
  );
}
