import { NextRequest, NextResponse } from "next/server";

/**
 * LangGraph API Proxy
 *
 * For production: Proxies requests to LangGraph Cloud
 * For development: Can proxy to local LangGraph Studio
 *
 * This route handles all LangGraph SDK operations:
 * - threads.create()
 * - threads.getState()
 * - runs.stream()
 */

function getCorsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "*",
  };
}

async function handleRequest(req: NextRequest, method: string) {
  try {
    const path = req.nextUrl.pathname.replace(/^\/?api\/langgraph\/?/, "");
    const url = new URL(req.url);
    const searchParams = new URLSearchParams(url.search);

    // Clean up Next.js specific params
    searchParams.delete("_path");
    searchParams.delete("nxtP_path");

    const queryString = searchParams.toString()
      ? `?${searchParams.toString()}`
      : "";

    const langGraphUrl = process.env["LANGGRAPH_API_URL"];
    if (!langGraphUrl) {
      return NextResponse.json(
        { error: "LANGGRAPH_API_URL not configured" },
        { status: 500 }
      );
    }

    const options: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(process.env["LANGCHAIN_API_KEY"] && {
          "x-api-key": process.env["LANGCHAIN_API_KEY"],
        }),
      },
    };

    if (["POST", "PUT", "PATCH"].includes(method)) {
      options.body = await req.text();
    }

    const res = await fetch(`${langGraphUrl}/${path}${queryString}`, options);

    // Handle streaming responses
    if (res.headers.get("content-type")?.includes("text/event-stream")) {
      return new NextResponse(res.body, {
        status: res.status,
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
          ...getCorsHeaders(),
        },
      });
    }

    return new NextResponse(res.body, {
      status: res.status,
      statusText: res.statusText,
      headers: {
        ...Object.fromEntries(res.headers.entries()),
        ...getCorsHeaders(),
      },
    });
  } catch (e: unknown) {
    const error = e as Error;
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export const GET = (req: NextRequest) => handleRequest(req, "GET");
export const POST = (req: NextRequest) => handleRequest(req, "POST");
export const PUT = (req: NextRequest) => handleRequest(req, "PUT");
export const PATCH = (req: NextRequest) => handleRequest(req, "PATCH");
export const DELETE = (req: NextRequest) => handleRequest(req, "DELETE");

export const OPTIONS = () => {
  return new NextResponse(null, {
    status: 204,
    headers: getCorsHeaders(),
  });
};
