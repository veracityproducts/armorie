import type { FC } from "react";
import { ThreadSuggestions, type SuggestionItem } from "./thread-suggestions";

export type { SuggestionItem };

export type ThreadWelcomeProps = {
  heading?: string;
  subheading?: string;
  suggestions?: SuggestionItem[];
};

const defaultSuggestions: SuggestionItem[] = [
  {
    title: "What's the weather",
    label: "in San Francisco?",
    action: "What's the weather in San Francisco?",
  },
  {
    title: "Explain React hooks",
    label: "like useState and useEffect",
    action: "Explain React hooks like useState and useEffect",
  },
  {
    title: "Write a SQL query",
    label: "to find top customers",
    action: "Write a SQL query to find top customers",
  },
  {
    title: "Create a meal plan",
    label: "for healthy weight loss",
    action: "Create a meal plan for healthy weight loss",
  },
];

export const ThreadWelcome: FC<ThreadWelcomeProps> = ({
  heading = "Hello there!",
  subheading = "How can I help you today?",
  suggestions = defaultSuggestions,
}) => {
  return (
    <div className="aui-thread-welcome-root mx-auto my-auto flex w-full max-w-(--thread-max-width) grow flex-col">
      <div className="aui-thread-welcome-center flex w-full grow flex-col items-center justify-center">
        <div className="aui-thread-welcome-message flex size-full flex-col justify-center px-8">
          <div className="aui-thread-welcome-message-inner fade-in slide-in-from-bottom-2 animate-in font-semibold text-2xl duration-300 ease-out">
            {heading}
          </div>
          <div className="aui-thread-welcome-message-inner fade-in slide-in-from-bottom-2 animate-in text-2xl text-muted-foreground/65 delay-100 duration-300 ease-out">
            {subheading}
          </div>
        </div>
      </div>
      <ThreadSuggestions suggestions={suggestions} />
    </div>
  );
};
