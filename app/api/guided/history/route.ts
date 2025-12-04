import { NextResponse } from "next/server";
import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";

const HistoricalContextSchema = z.object({
  period: z
    .string()
    .describe(
      "The approximate time period when written (e.g., '~1000 BC', '~55 AD')",
    ),
  author: z
    .string()
    .describe("The traditional author and any relevant background"),
  audience: z.string().describe("Who the text was originally written to/for"),
  events: z
    .array(z.string())
    .describe("2-3 relevant historical events or circumstances"),
  culturalNotes: z
    .string()
    .describe(
      "Cultural context that helps understand the verse (2-3 sentences)",
    ),
});

export async function POST(request: Request) {
  try {
    const { verse, reference } = await request.json();

    if (!verse || typeof verse !== "string") {
      return NextResponse.json(
        { error: "Verse text is required" },
        { status: 400 },
      );
    }

    const result = await generateObject({
      model: openai("gpt-4o"),
      schema: HistoricalContextSchema,
      prompt: `You are a Bible historian. Provide historical context for the given verse.

Verse: "${verse}" (${reference || "unknown reference"})

Provide accurate historical context that helps readers understand:
- When and by whom this was written
- The original audience and their circumstances  
- Key historical events that shaped this text
- Cultural context that enriches understanding

Be historically accurate while remaining accessible to general readers.`,
    });

    return NextResponse.json(result.object);
  } catch (error) {
    console.error("[guided/history] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch historical context" },
      { status: 500 },
    );
  }
}
