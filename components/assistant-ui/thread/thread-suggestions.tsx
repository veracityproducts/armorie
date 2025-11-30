import type { FC } from "react";
import { ThreadPrimitive } from "@assistant-ui/react";
import { Button } from "@/components/ui/button";

export type SuggestionItem = {
  title: string;
  label: string;
  action: string;
};

export type ThreadSuggestionsProps = {
  suggestions: SuggestionItem[];
};

export const ThreadSuggestions: FC<ThreadSuggestionsProps> = ({
  suggestions,
}) => {
  return (
    <div className="aui-thread-welcome-suggestions grid w-full @md:grid-cols-2 gap-2 pb-4">
      {suggestions.map((suggestedAction, index) => (
        <ThreadSuggestionItem
          key={`suggested-action-${suggestedAction.title}-${index}`}
          suggestion={suggestedAction}
          index={index}
        />
      ))}
    </div>
  );
};

type ThreadSuggestionItemProps = {
  suggestion: SuggestionItem;
  index: number;
};

const ThreadSuggestionItem: FC<ThreadSuggestionItemProps> = ({
  suggestion,
  index,
}) => {
  return (
    <div
      className="aui-thread-welcome-suggestion-display fade-in slide-in-from-bottom-4 @md:nth-[n+3]:block nth-[n+3]:hidden animate-in fill-mode-both duration-300 ease-out"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <ThreadPrimitive.Suggestion prompt={suggestion.action} send asChild>
        <Button
          variant="ghost"
          className="aui-thread-welcome-suggestion h-auto w-full flex-1 @md:flex-col flex-wrap items-start justify-start gap-1 rounded-3xl border px-5 py-4 text-left text-sm dark:hover:bg-accent/60"
          aria-label={suggestion.action}
        >
          <span className="aui-thread-welcome-suggestion-text-1 font-medium">
            {suggestion.title}
          </span>
          <span className="aui-thread-welcome-suggestion-text-2 text-muted-foreground">
            {suggestion.label}
          </span>
        </Button>
      </ThreadPrimitive.Suggestion>
    </div>
  );
};
