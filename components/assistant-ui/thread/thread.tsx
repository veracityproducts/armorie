"use client";

import type { FC } from "react";
import { ThreadPrimitive } from "@assistant-ui/react";
import Image from "next/image";
import { ThreadWelcome, type ThreadWelcomeProps } from "./thread-welcome";
import { ThreadScrollToBottom } from "./thread-scroll-to-bottom";
import { UserMessage } from "./user-message";
import { AssistantMessage } from "./assistant-message";
import {
  Composer,
  HeroComposer,
  type ComposerProps,
} from "@/components/assistant-ui/composer";
import { EditComposer } from "@/components/assistant-ui/composer";
import { InterruptHandler } from "@/components/assistant-ui/interrupts";
import { ThinkingIndicator } from "@/components/assistant-ui/thinking-indicator";
import {
  GuidedStudyToolbar,
  useGuidedStudyContextOptional,
} from "@/components/assistant-ui/guided-study";
import type {
  Verse,
  KeywordStudy,
  HistoricalContext,
} from "@/hooks/use-guided-study";

export type ThreadProps = {
  welcome?: ThreadWelcomeProps;
  composer?: ComposerProps;
};

// API functions for guided study
const findVerses = async (topic: string): Promise<Verse[]> => {
  const response = await fetch("/api/guided/verses", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topic }),
  });

  if (!response.ok) {
    throw new Error("Failed to find verses");
  }

  const data = await response.json();
  return data.verses;
};

const extractKeywords = async (verse: Verse): Promise<string[]> => {
  const response = await fetch("/api/guided/keywords", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ verse: verse.text, reference: verse.reference }),
  });

  if (!response.ok) {
    throw new Error("Failed to extract keywords");
  }

  const data = await response.json();
  return data.keywords;
};

const generateStudies = async (
  verse: Verse,
  keywords: string[],
): Promise<KeywordStudy[]> => {
  const response = await fetch("/api/guided/studies", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      verse: verse.text,
      reference: verse.reference,
      keywords,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to generate studies");
  }

  const data = await response.json();
  return data.studies;
};

const fetchHistory = async (verse: Verse): Promise<HistoricalContext> => {
  const response = await fetch("/api/guided/history", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      verse: verse.text,
      reference: verse.reference,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch historical context");
  }

  return response.json();
};

export const Thread: FC<ThreadProps> = ({ welcome, composer }) => {
  const guidedStudy = useGuidedStudyContextOptional();

  return (
    <ThreadPrimitive.Root
      className="aui-root aui-thread-root @container flex h-full flex-col bg-background relative"
      style={{
        ["--thread-max-width" as string]: "52rem",
      }}
    >
      {/* Subtle accent glow */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage: `
            radial-gradient(
              circle at top right,
              oklch(0.84 0.038 245 / 0.25),
              transparent 70%
            )
          `,
          filter: "blur(80px)",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Empty state with centered hero composer */}
      <ThreadPrimitive.If empty>
        {/* Subtle background image - misty landscape */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src="/background.webp"
            alt=""
            fill
            priority
            className="object-cover object-center opacity-80"
            sizes="100vw"
          />
          {/* Gradient overlay - fade bottom for UI clarity */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
        </div>
        <div className="flex-1 flex flex-col items-center justify-center pb-8 px-4 relative z-10">
          {/* Show welcome and composer when NOT in guided mode */}
          {!guidedStudy?.isActive && (
            <>
              <ThreadWelcome {...welcome} />
              <div className="w-full max-w-(--thread-max-width) mt-8">
                <HeroComposer />
              </div>
            </>
          )}

          {/* Show guided study toolbar when in guided mode */}
          {guidedStudy?.isActive && (
            <div className="w-full max-w-(--thread-max-width)">
              <GuidedStudyToolbar
                onFindVerses={findVerses}
                onExtractKeywords={extractKeywords}
                onGenerateStudies={generateStudies}
                onFetchHistory={fetchHistory}
                onSaveStudy={() => {
                  // TODO: Implement save functionality
                  console.log("Save study");
                }}
              />
            </div>
          )}
        </div>
      </ThreadPrimitive.If>

      {/* Messages state - scrollable viewport */}
      <ThreadPrimitive.If empty={false}>
        <ThreadPrimitive.Viewport className="aui-thread-viewport flex-1 overflow-y-auto scroll-smooth px-4 pt-4 z-10">
          <ThreadPrimitive.Messages
            components={{
              UserMessage,
              EditComposer,
              AssistantMessage,
            }}
          />

          {/* Interrupt UI - appears directly after messages */}
          <div className="mx-auto w-full max-w-(--thread-max-width) py-2">
            <InterruptHandler />
          </div>

          {/* Thinking indicator - shows when AI is processing, below artifacts */}
          <ThreadPrimitive.If running>
            <div className="mx-auto w-full max-w-(--thread-max-width) py-4">
              <ThinkingIndicator message="Thinking..." variant="dots" />
            </div>
          </ThreadPrimitive.If>
        </ThreadPrimitive.Viewport>

        {/* Fixed composer at bottom */}
        <div className="shrink-0 mx-auto w-full max-w-(--thread-max-width) px-4 pb-4 pt-2 bg-background">
          <ThreadScrollToBottom />
          <Composer {...composer} />
        </div>
      </ThreadPrimitive.If>
    </ThreadPrimitive.Root>
  );
};
