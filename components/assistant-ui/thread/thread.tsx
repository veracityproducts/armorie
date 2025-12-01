import type { FC } from "react";
import { ThreadPrimitive } from "@assistant-ui/react";
import { ThreadWelcome, type ThreadWelcomeProps } from "./thread-welcome";
import { ThreadScrollToBottom } from "./thread-scroll-to-bottom";
import { UserMessage } from "./user-message";
import { AssistantMessage } from "./assistant-message";
import {
  Composer,
  type ComposerProps,
} from "@/components/assistant-ui/composer";
import { EditComposer } from "@/components/assistant-ui/composer";

export type ThreadProps = {
  welcome?: ThreadWelcomeProps;
  composer?: ComposerProps;
};

export const Thread: FC<ThreadProps> = ({ welcome, composer }) => {
  return (
    <ThreadPrimitive.Root
      className="aui-root aui-thread-root @container flex h-full flex-col bg-background relative"
      style={{
        ["--thread-max-width" as string]: "44rem",
      }}
    >
      {/* Subtle accent glow */}
      <div
        className="absolute inset-0 z-0"
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
      <ThreadPrimitive.Viewport
        turnAnchor="top"
        className="aui-thread-viewport relative flex flex-1 flex-col overflow-x-auto overflow-y-scroll scroll-smooth px-4 pt-4 z-10"
      >
        <ThreadPrimitive.If empty>
          <ThreadWelcome {...welcome} />
        </ThreadPrimitive.If>

        <ThreadPrimitive.Messages
          components={{
            UserMessage,
            EditComposer,
            AssistantMessage,
          }}
        />

        <ThreadPrimitive.ViewportFooter className="aui-thread-viewport-footer sticky bottom-0 mx-auto mt-4 flex w-full max-w-(--thread-max-width) flex-col gap-4 overflow-visible rounded-t-3xl bg-background pb-4 md:pb-6">
          <ThreadScrollToBottom />
          <Composer {...composer} />
        </ThreadPrimitive.ViewportFooter>
      </ThreadPrimitive.Viewport>
    </ThreadPrimitive.Root>
  );
};
