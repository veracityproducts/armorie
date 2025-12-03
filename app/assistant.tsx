"use client";

import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { useLangGraphRuntime } from "@assistant-ui/react-langgraph";
import { Thread } from "@/components/assistant-ui/thread";
import { ArmorieSidebar } from "@/components/assistant-ui/armorie-sidebar";
import { InterruptHandler } from "@/components/assistant-ui/interrupts";
import { createThread, getThreadState, sendMessage } from "@/lib/chatApi";

export const Assistant = () => {
  const runtime = useLangGraphRuntime({
    stream: async (messages, { initialize, ...config }) => {
      const { externalId } = await initialize();
      if (!externalId) throw new Error("Thread not found");
      return sendMessage({
        threadId: externalId,
        messages,
        config,
      });
    },
    create: async () => {
      const { thread_id } = await createThread();
      return { externalId: thread_id };
    },
    load: async (externalId) => {
      const state = await getThreadState(externalId);
      return {
        messages: state.values.messages,
        interrupts: state.tasks[0]?.interrupts,
      };
    },
  });

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <InterruptHandler />
      <div className="flex h-full gap-2">
        <ArmorieSidebar />
        <div className="flex-1 bg-card rounded-lg mr-2 my-2 overflow-hidden">
          <Thread />
        </div>
      </div>
    </AssistantRuntimeProvider>
  );
};
