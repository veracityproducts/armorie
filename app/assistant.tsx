"use client";

import { AssistantRuntimeProvider } from "@assistant-ui/react";
import {
  AssistantChatTransport,
  useChatRuntime,
} from "@assistant-ui/react-ai-sdk";
import { MessagesSquare } from "lucide-react";
import { Thread } from "@/components/assistant-ui/thread";
import {
  ThreadListSidebar,
  SidebarHeaderItem,
} from "@/components/assistant-ui/threadlist-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export const Assistant = () => {
  const runtime = useChatRuntime({
    transport: new AssistantChatTransport({
      api: "/api/chat",
    }),
  });

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <SidebarProvider>
        <ThreadListSidebar
          header={
            <SidebarHeaderItem
              icon={<MessagesSquare className="size-4" />}
              title="Armorie"
            />
          }
        />
        <SidebarInset>
          <Thread />
        </SidebarInset>
      </SidebarProvider>
    </AssistantRuntimeProvider>
  );
};
