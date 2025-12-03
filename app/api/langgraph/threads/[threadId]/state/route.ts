import { NextRequest, NextResponse } from "next/server";
import { threadStates } from "@/lib/langgraph/thread-store";

/**
 * GET /api/langgraph/threads/:threadId/state - Get thread state
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ threadId: string }> },
) {
  try {
    const { threadId } = await params;
    const state = threadStates.get(threadId);

    if (!state) {
      // Return empty state for new threads
      return NextResponse.json({
        values: { messages: [] },
        tasks: [],
      });
    }

    return NextResponse.json(state);
  } catch (error) {
    console.error("Error getting thread state:", error);
    return NextResponse.json(
      { error: "Failed to get thread state" },
      { status: 500 },
    );
  }
}
