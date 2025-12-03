"use client";

import { useState, useCallback, type FC } from "react";
import { ComposerPrimitive, ThreadPrimitive } from "@assistant-ui/react";
import { motion } from "motion/react";
import { ArrowUpIcon, Square, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TooltipIconButton } from "@/components/assistant-ui/tooltip-icon-button";
import { TranslationDropdown } from "./translation-dropdown";
import { GuidedToggle } from "./guided-toggle";
import { AutocompleteSuggestions } from "./autocomplete-suggestions";
import { QuickActions } from "./quick-actions";
import { useSuggestionFilter } from "@/hooks/use-suggestion-filter";

export type HeroComposerProps = {
  placeholder?: string;
  onTranslationChange?: (translation: string) => void;
  onGuidedChange?: (guided: boolean) => void;
  defaultTranslation?: string;
  defaultGuided?: boolean;
};

export const HeroComposer: FC<HeroComposerProps> = ({
  placeholder = "Search for a verse, topic, or feeling...",
  onTranslationChange,
  onGuidedChange,
  defaultTranslation = "NIV",
  defaultGuided = false,
}) => {
  const [translation, setTranslation] = useState(defaultTranslation);
  const [guided, setGuided] = useState(defaultGuided);
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const { verses, topics } = useSuggestionFilter(inputValue);

  const handleTranslationChange = useCallback(
    (value: string) => {
      setTranslation(value);
      onTranslationChange?.(value);
    },
    [onTranslationChange]
  );

  const handleGuidedChange = useCallback(
    (checked: boolean) => {
      setGuided(checked);
      onGuidedChange?.(checked);
    },
    [onGuidedChange]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-2xl mx-auto"
    >
      <ComposerPrimitive.Root className="relative flex w-full flex-col">
        <div className="relative">
          <motion.div
            whileFocus={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
            className="relative"
          >
            <ComposerPrimitive.AttachmentDropzone className="flex flex-col w-full rounded-2xl border-2 border-primary-300 ring-[3px] ring-primary-200/40 bg-card/90 backdrop-blur-sm shadow-lg shadow-primary-200/30 outline-none transition-all duration-300 has-[textarea:focus-visible]:border-secondary-400 has-[textarea:focus-visible]:ring-[4px] has-[textarea:focus-visible]:ring-secondary-300/40 has-[textarea:focus-visible]:shadow-xl has-[textarea:focus-visible]:shadow-secondary-200/30 data-[dragging=true]:border-ring data-[dragging=true]:border-dashed data-[dragging=true]:bg-accent/50 overflow-hidden">
              {/* Input row */}
              <div className="flex items-center px-4">
                <Search className="size-5 text-muted-foreground/50 mr-2 flex-shrink-0" />
                <ComposerPrimitive.Input
                  placeholder={placeholder}
                  className="flex-1 min-h-12 max-h-24 w-full resize-none bg-transparent py-3 text-base outline-none placeholder:text-muted-foreground/60 focus-visible:ring-0"
                  rows={1}
                  autoFocus
                  aria-label="Message input"
                  onChange={(e) => {
                    setInputValue(e.target.value);
                    setShowSuggestions(e.target.value.length >= 1);
                  }}
                  onFocus={() => setShowSuggestions(inputValue.length >= 1)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                />

                <div className="flex items-center gap-2 pl-2">
                  <ThreadPrimitive.If running={false}>
                    <ComposerPrimitive.Send asChild>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <TooltipIconButton
                          tooltip="Search"
                          side="bottom"
                          type="submit"
                          variant="default"
                          size="icon"
                          className="size-9 rounded-full bg-secondary-500 hover:bg-secondary-600 text-white shadow-md"
                          aria-label="Search"
                        >
                          <ArrowUpIcon className="size-4" />
                        </TooltipIconButton>
                      </motion.div>
                    </ComposerPrimitive.Send>
                  </ThreadPrimitive.If>

                  <ThreadPrimitive.If running>
                    <ComposerPrimitive.Cancel asChild>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          type="button"
                          variant="default"
                          size="icon"
                          className="size-9 rounded-full bg-secondary-500 hover:bg-secondary-600"
                          aria-label="Stop"
                        >
                          <Square className="size-3 fill-white" />
                        </Button>
                      </motion.div>
                    </ComposerPrimitive.Cancel>
                  </ThreadPrimitive.If>
                </div>
              </div>

              {/* Footer row */}
              <div className="flex items-center gap-2 px-3 py-2 bg-primary-50/50">
                <TranslationDropdown
                  value={translation}
                  onChange={handleTranslationChange}
                />
                <GuidedToggle
                  checked={guided}
                  onCheckedChange={handleGuidedChange}
                />
              </div>
            </ComposerPrimitive.AttachmentDropzone>
          </motion.div>

          <AutocompleteSuggestions
            show={showSuggestions}
            verses={verses}
            topics={topics}
          />
        </div>

        <QuickActions />
      </ComposerPrimitive.Root>
    </motion.div>
  );
};
