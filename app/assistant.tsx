"use client";

import { useEffect, useState, useRef } from "react";
import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { useLangGraphRuntime } from "@assistant-ui/react-langgraph";
import { Thread } from "@/components/assistant-ui/thread";
import { ArmorieSidebar } from "@/components/assistant-ui/armorie-sidebar";
import { GuidedStudyProvider } from "@/components/assistant-ui/guided-study";
import { createThread, getThreadState, sendMessage } from "@/lib/chatApi";

export const Assistant = () => {
  const [threadId, setThreadId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const initRef = useRef(false);

  // Create initial thread on mount
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    createThread()
      .then(({ thread_id }) => {
        console.log("[Assistant] Initial thread created:", thread_id);
        setThreadId(thread_id);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("[Assistant] Failed to create thread:", error);
        // Still show the UI even if thread creation fails
        setIsLoading(false);
      });
  }, []);

  const runtime = useLangGraphRuntime({
    stream: async (messages, { command }) => {
      // Use current threadId or create new one
      let tid = threadId;
      if (!tid) {
        const { thread_id } = await createThread();
        tid = thread_id;
        setThreadId(tid);
      }

      console.log("[Assistant] Sending to thread:", tid);
      return sendMessage({
        threadId: tid,
        messages,
        config: { command },
      });
    },
    create: async () => {
      const { thread_id } = await createThread();
      console.log("[Assistant] New thread created:", thread_id);
      setThreadId(thread_id);
      return { externalId: thread_id };
    },
    load: async (externalId) => {
      console.log("[Assistant] Loading thread:", externalId);
      const state = await getThreadState(externalId);
      return {
        messages: state.values.messages || [],
        interrupts: state.tasks?.[0]?.interrupts,
      };
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center bg-background">
        <div className="flex items-center gap-2 text-muted-foreground">
          <div className="size-2 rounded-full bg-primary-400 animate-pulse" />
          <span>Preparing your study space...</span>
        </div>
      </div>
    );
  }

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <GuidedStudyProvider>
        <div className="flex h-full gap-2">
          <ArmorieSidebar />
          <div className="flex-1 bg-card rounded-lg mr-2 my-2 overflow-hidden">
            <Thread />
          </div>
        </div>
      </GuidedStudyProvider>
    </AssistantRuntimeProvider>
  );
};
