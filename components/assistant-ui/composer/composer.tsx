"use client";

import type { FC } from "react";
import { ComposerPrimitive, ThreadPrimitive } from "@assistant-ui/react";
import { motion } from "motion/react";
import { ArrowUpIcon, Square, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TooltipIconButton } from "@/components/assistant-ui/tooltip-icon-button";

export type ComposerProps = {
  placeholder?: string;
};

export const Composer: FC<ComposerProps> = ({
  placeholder = "Send a message...",
}) => {
  return (
    <ComposerPrimitive.Root className="relative flex w-full flex-col">
      <ComposerPrimitive.AttachmentDropzone className="flex items-center w-full rounded-2xl border-2 border-primary-300 ring-[3px] ring-primary-200/40 bg-card/90 backdrop-blur-sm shadow-lg shadow-primary-200/30 outline-none transition-all duration-300 has-[textarea:focus-visible]:border-secondary-400 has-[textarea:focus-visible]:ring-[4px] has-[textarea:focus-visible]:ring-secondary-300/40 has-[textarea:focus-visible]:shadow-xl has-[textarea:focus-visible]:shadow-secondary-200/30 data-[dragging=true]:border-ring data-[dragging=true]:border-dashed data-[dragging=true]:bg-accent/50 px-4">
        <Search className="size-5 text-muted-foreground/50 mr-2 flex-shrink-0" />
        <ComposerPrimitive.Input
          placeholder={placeholder}
          className="flex-1 min-h-12 max-h-24 w-full resize-none bg-transparent py-3 text-base outline-none placeholder:text-muted-foreground/60 focus-visible:ring-0"
          rows={1}
          autoFocus
          aria-label="Message input"
        />

        <div className="flex items-center gap-2 pl-2">
          <ThreadPrimitive.If running={false}>
            <ComposerPrimitive.Send asChild>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <TooltipIconButton
                  tooltip="Send"
                  side="bottom"
                  type="submit"
                  variant="default"
                  size="icon"
                  className="size-9 rounded-full bg-secondary-500 hover:bg-secondary-600 text-white shadow-md"
                  aria-label="Send"
                >
                  <ArrowUpIcon className="size-4" />
                </TooltipIconButton>
              </motion.div>
            </ComposerPrimitive.Send>
          </ThreadPrimitive.If>

          <ThreadPrimitive.If running>
            <ComposerPrimitive.Cancel asChild>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
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
      </ComposerPrimitive.AttachmentDropzone>
    </ComposerPrimitive.Root>
  );
};
