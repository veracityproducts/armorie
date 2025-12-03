/**
 * Thread state structure matching LangGraph SDK format
 */
export interface ThreadStateResponse {
  // biome-ignore lint/suspicious/noExplicitAny: LangGraph state values are dynamic
  values: Record<string, any>;
  tasks: Array<{
    id: string;
    name: string;
    interrupts?: Array<{
      type: string;
      [key: string]: unknown;
    }>;
  }>;
  checkpoint?: {
    thread_id: string;
    checkpoint_id: string;
  };
}

/**
 * In-memory thread state storage
 *
 * NOTE: This is for development/demo purposes.
 * For production, use Redis, Postgres, or another persistent store.
 */
export const threadStates = new Map<string, ThreadStateResponse>();

/**
 * Get or initialize thread state
 */
export function getThreadState(threadId: string): ThreadStateResponse {
  if (!threadStates.has(threadId)) {
    threadStates.set(threadId, {
      values: { messages: [] },
      tasks: [],
    });
  }
  return threadStates.get(threadId)!;
}

/**
 * Update thread state
 */
export function updateThreadState(
  threadId: string,
  // biome-ignore lint/suspicious/noExplicitAny: LangGraph state values are dynamic
  values: Record<string, any>,
): ThreadStateResponse {
  const current = getThreadState(threadId);
  const updated = {
    ...current,
    values: {
      ...current.values,
      ...values,
    },
  };
  threadStates.set(threadId, updated);
  return updated;
}

/**
 * Set interrupt on thread
 */
export function setThreadInterrupt(
  threadId: string,
  interrupt: { type: string; [key: string]: unknown },
): void {
  const state = getThreadState(threadId);
  state.tasks = [
    {
      id: `task-${Date.now()}`,
      name: interrupt.type,
      interrupts: [interrupt],
    },
  ];
  threadStates.set(threadId, state);
}

/**
 * Clear interrupt from thread
 */
export function clearThreadInterrupt(threadId: string): void {
  const state = getThreadState(threadId);
  state.tasks = [];
  threadStates.set(threadId, state);
}
