import { Client, type ThreadState } from "@langchain/langgraph-sdk";
import type {
  LangChainMessage,
  LangGraphSendMessageConfig,
} from "@assistant-ui/react-langgraph";

/**
 * Create a LangGraph client
 * Uses the local API proxy in development
 */
const createClient = () => {
  const apiUrl =
    process.env["NEXT_PUBLIC_LANGGRAPH_API_URL"] || "/api/langgraph";
  return new Client({ apiUrl });
};

/**
 * Create a new thread for conversation
 */
export const createThread = async () => {
  const client = createClient();
  return client.threads.create();
};

/**
 * Get the current state of a thread
 */
export const getThreadState = async (
  threadId: string
): Promise<ThreadState<{ messages: LangChainMessage[] }>> => {
  const client = createClient();
  return client.threads.getState(threadId);
};

/**
 * Send a message to the verse study graph
 */
export const sendMessage = async (params: {
  threadId: string;
  messages: LangChainMessage[];
  config?: LangGraphSendMessageConfig;
}) => {
  const client = createClient();
  const assistantId =
    process.env["NEXT_PUBLIC_LANGGRAPH_ASSISTANT_ID"] || "verse-study";

  // Get the last user message for userQuery
  const lastMessage = params.messages[params.messages.length - 1];
  const userQuery =
    lastMessage && typeof lastMessage === "object" && "content" in lastMessage
      ? lastMessage.content
      : "";

  return client.runs.stream(params.threadId, assistantId, {
    input: {
      messages: params.messages,
      userQuery,
    },
    streamMode: "messages",
    ...params.config,
  });
};

/**
 * Resume a suspended thread with user input
 */
export const resumeThread = async (params: {
  threadId: string;
  resumeData: Record<string, unknown>;
}) => {
  const client = createClient();
  const assistantId =
    process.env["NEXT_PUBLIC_LANGGRAPH_ASSISTANT_ID"] || "verse-study";

  return client.runs.stream(params.threadId, assistantId, {
    command: {
      resume: params.resumeData,
    },
    streamMode: "messages",
  });
};
