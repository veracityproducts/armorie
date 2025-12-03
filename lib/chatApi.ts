import { Client, type ThreadState } from "@langchain/langgraph-sdk";
import type {
  LangChainMessage,
  LangGraphSendMessageConfig,
} from "@assistant-ui/react-langgraph";

/**
 * Create a LangGraph client pointing to our local API
 */
const createClient = () => {
  // Use full URL for client-side, the SDK needs an absolute URL
  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : "http://localhost:3000";
  return new Client({ apiUrl: `${baseUrl}/api/langgraph` });
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
  threadId: string,
): Promise<ThreadState<{ messages: LangChainMessage[] }>> => {
  const client = createClient();
  return client.threads.getState(threadId);
};

/**
 * Send a message to the verse study graph
 */
export const sendMessage = (params: {
  threadId: string;
  messages: LangChainMessage[];
  config?: LangGraphSendMessageConfig;
}) => {
  const client = createClient();

  // Get the last user message for userQuery
  const lastMessage = params.messages[params.messages.length - 1];
  const userQuery =
    lastMessage && typeof lastMessage === "object" && "content" in lastMessage
      ? lastMessage.content
      : "";

  return client.runs.stream(params.threadId, "verse-study", {
    input: {
      messages: params.messages,
      userQuery,
    },
    streamMode: "messages",
    command: params.config?.command,
  });
};
