import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";

// In-memory thread storage (use Redis/DB in production)
const threads = new Map<
  string,
  { created_at: string; metadata: Record<string, unknown> }
>();

/**
 * POST /api/langgraph/threads - Create a new thread
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const threadId = randomUUID();

    console.log("[threads] Creating thread:", threadId);

    threads.set(threadId, {
      created_at: new Date().toISOString(),
      metadata: body.metadata || {},
    });

    const response = {
      thread_id: threadId,
      created_at: threads.get(threadId)?.created_at,
      metadata: threads.get(threadId)?.metadata,
    };

    console.log("[threads] Response:", response);

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error creating thread:", error);
    return NextResponse.json(
      { error: "Failed to create thread" },
      { status: 500 },
    );
  }
}

/**
 * GET /api/langgraph/threads - List threads (optional)
 */
export async function GET() {
  const threadList = Array.from(threads.entries()).map(([id, data]) => ({
    thread_id: id,
    ...data,
  }));

  return NextResponse.json(threadList);
}
