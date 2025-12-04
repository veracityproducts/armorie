"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { HelpCircle, X, Lightbulb, BookOpen, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type GuidanceVariant = "info" | "tip" | "learn";

interface GuidanceTooltipProps {
  title: string;
  content: string | React.ReactNode;
  variant?: GuidanceVariant;
  /** If true, shows inline instead of as a popover */
  inline?: boolean;
  /** Custom trigger element */
  trigger?: React.ReactNode;
  className?: string;
}

const variantConfig: Record<
  GuidanceVariant,
  { icon: typeof HelpCircle; colors: string; bg: string }
> = {
  info: {
    icon: HelpCircle,
    colors: "text-primary-600",
    bg: "bg-primary-50 border-primary-200",
  },
  tip: {
    icon: Lightbulb,
    colors: "text-accent-600",
    bg: "bg-accent-50 border-accent-200",
  },
  learn: {
    icon: BookOpen,
    colors: "text-primary-700",
    bg: "bg-primary-100 border-primary-300",
  },
};

export function GuidanceTooltip({
  title,
  content,
  variant = "info",
  inline = false,
  trigger,
  className,
}: GuidanceTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const config = variantConfig[variant];
  const Icon = config.icon;

  if (inline) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={cn("rounded-lg border p-3", config.bg, className)}
      >
        <div className="flex items-start gap-2">
          <Icon className={cn("size-4 mt-0.5 shrink-0", config.colors)} />
          <div className="space-y-1 min-w-0">
            <p className={cn("text-sm font-medium", config.colors)}>{title}</p>
            <div className="text-sm text-muted-foreground">{content}</div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className={cn("relative inline-flex", className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "inline-flex items-center gap-1 text-sm transition-colors",
          config.colors,
          "hover:opacity-80",
        )}
      >
        {trigger || (
          <>
            <Icon className="size-4" />
            <span className="underline underline-offset-2 decoration-dotted">
              {title}
            </span>
          </>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ type: "spring", bounce: 0.2, duration: 0.3 }}
            className={cn(
              "absolute z-50 top-full left-0 mt-2 w-72 rounded-xl border shadow-lg",
              config.bg,
            )}
          >
            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Icon className={cn("size-5", config.colors)} />
                  <h4 className={cn("font-medium", config.colors)}>{title}</h4>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="size-4" />
                </button>
              </div>
              <div className="mt-3 text-sm text-foreground/80">{content}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Animated guidance card that appears inline with rich content
 */
interface GuidanceCardProps {
  title: string;
  description: string;
  icon?: typeof Sparkles;
  variant?: GuidanceVariant;
  action?: {
    label: string;
    onClick: () => void;
  };
  onDismiss?: () => void;
  className?: string;
}

export function GuidanceCard({
  title,
  description,
  icon: CustomIcon,
  variant = "tip",
  action,
  onDismiss,
  className,
}: GuidanceCardProps) {
  const config = variantConfig[variant];
  const Icon = CustomIcon || config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
      className={cn("overflow-hidden", className)}
    >
      <div className={cn("rounded-xl border p-4", config.bg)}>
        <div className="flex items-start gap-3">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: "spring", bounce: 0.4 }}
            className={cn(
              "shrink-0 size-10 rounded-full flex items-center justify-center",
              variant === "tip"
                ? "bg-accent-100"
                : variant === "learn"
                  ? "bg-primary-200"
                  : "bg-primary-100",
            )}
          >
            <Icon className={cn("size-5", config.colors)} />
          </motion.div>

          <div className="flex-1 min-w-0">
            <motion.h4
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className={cn("font-semibold", config.colors)}
            >
              {title}
            </motion.h4>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-sm text-muted-foreground mt-1"
            >
              {description}
            </motion.p>

            {(action || onDismiss) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-2 mt-3"
              >
                {action && (
                  <Button
                    size="sm"
                    onClick={action.onClick}
                    className={cn(
                      "h-8",
                      variant === "tip"
                        ? "bg-accent-500 hover:bg-accent-600"
                        : variant === "learn"
                          ? "bg-primary-600 hover:bg-primary-700"
                          : "bg-primary-500 hover:bg-primary-600",
                    )}
                  >
                    {action.label}
                  </Button>
                )}
                {onDismiss && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={onDismiss}
                    className="h-8 text-muted-foreground"
                  >
                    Got it
                  </Button>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
