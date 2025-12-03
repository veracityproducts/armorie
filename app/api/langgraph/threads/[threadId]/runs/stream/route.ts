import { NextRequest } from "next/server";
import { verseStudyGraph } from "@/lib/langgraph";
import {
  updateThreadState,
  setThreadInterrupt,
  clearThreadInterrupt,
  getThreadState,
} from "@/lib/langgraph/thread-store";
import { Command } from "@langchain/langgraph";
import {
  AIMessage,
  HumanMessage,
  type BaseMessage,
} from "@langchain/core/messages";

/**
 * POST /api/langgraph/threads/:threadId/runs/stream
 *
 * Executes the verse study graph and streams results back in LangGraph SDK format.
 * Handles both initial runs and resuming from interrupts.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ threadId: string }> },
) {
  const { threadId } = await params;

  try {
    const body = await req.json();
    const { input, command } = body;

    // Create a streaming response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Helper to send SSE events
          const sendEvent = (event: string, data: unknown) => {
            controller.enqueue(
              encoder.encode(
                `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`,
              ),
            );
          };

          // Get current state
          const currentState = getThreadState(threadId);

          // Build graph input or resume command
          let graphInput: Record<string, unknown> | Command;

          if (command?.resume) {
            // Resuming from an interrupt
            clearThreadInterrupt(threadId);
            // Parse the resume data - it's JSON stringified on the frontend
            const resumeData =
              typeof command.resume === "string"
                ? JSON.parse(command.resume)
                : command.resume;
            console.log("[stream] Resuming with data:", resumeData);
            graphInput = new Command({ resume: resumeData });
          } else if (input) {
            // New message
            const messages = input.messages || [];
            const userQuery = input.userQuery || "";

            // Convert incoming messages to LangChain format
            const langChainMessages = messages.map(
              (msg: { type?: string; role?: string; content: string }) => {
                const msgType = msg.type || msg.role;
                if (msgType === "human" || msgType === "user") {
                  return new HumanMessage(msg.content);
                }
                return new AIMessage(msg.content);
              },
            );

            graphInput = {
              messages: [
                ...((currentState.values.messages as BaseMessage[]) || []),
                ...langChainMessages,
              ],
              userQuery,
            };
          } else {
            throw new Error("No input or command provided");
          }

          // Config for graph execution
          const config = {
            configurable: { thread_id: threadId },
          };

          // Stream the graph execution using "updates" mode for interrupt detection
          // biome-ignore lint/suspicious/noExplicitAny: LangGraph types are complex
          const streamResult = await verseStudyGraph.stream(graphInput as any, {
            ...config,
            streamMode: "updates",
          });

          let lastAIContent = "";

          for await (const update of streamResult) {
            // update is { nodeName: nodeOutput }
            for (const [nodeName, nodeOutput] of Object.entries(update)) {
              console.log(
                `[${threadId}] Node completed: ${nodeName}`,
                nodeOutput,
              );

              // Check if this node produced messages
              const output = nodeOutput as Record<string, unknown>;
              if (output.messages) {
                const msgs = output.messages as BaseMessage[];
                for (const msg of msgs) {
                  if (msg._getType() === "ai") {
                    lastAIContent = msg.content as string;
                    sendEvent("messages/partial", [
                      {
                        type: "AIMessageChunk",
                        content: msg.content,
                        id: msg.id,
                      },
                    ]);
                  }
                }
              }
            }
          }

          // Get final state after streaming
          const finalSnapshot = await verseStudyGraph.getState(config);

          // Check if we hit an interrupt
          if (finalSnapshot.tasks && finalSnapshot.tasks.length > 0) {
            const task = finalSnapshot.tasks[0];
            if (task.interrupts && task.interrupts.length > 0) {
              const interruptData = task.interrupts[0];

              // Store interrupt state
              setThreadInterrupt(threadId, {
                type:
                  ((interruptData.value as Record<string, unknown>)
                    ?.type as string) || "unknown",
                ...(interruptData.value as Record<string, unknown>),
              });

              // Update stored state
              updateThreadState(threadId, finalSnapshot.values);

              // Send the interrupt data using 'updates' event format
              // The runtime expects __interrupt__ in the updates event
              sendEvent("updates", {
                __interrupt__: [
                  {
                    value: interruptData.value,
                    resumable: true,
                    when: "during",
                  },
                ],
              });

              sendEvent("messages/complete", []);
              controller.close();
              return;
            }
          }

          // No interrupt - update stored state and complete
          updateThreadState(threadId, finalSnapshot.values);

          sendEvent("messages/complete", [
            {
              type: "ai",
              content: lastAIContent,
            },
          ]);

          controller.close();
        } catch (error) {
          console.error("Stream error:", error);
          controller.enqueue(
            encoder.encode(
              `event: error\ndata: ${JSON.stringify({ error: String(error) })}\n\n`,
            ),
          );
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Error in stream endpoint:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process request" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
