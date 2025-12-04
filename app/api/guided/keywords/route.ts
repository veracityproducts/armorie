import { NextResponse } from "next/server";
import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";

const KeywordsResponseSchema = z.object({
  keywords: z
    .array(z.string())
    .describe("Array of significant keywords from the verse"),
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
      model: openai("gpt-4o-mini"),
      schema: KeywordsResponseSchema,
      prompt: `You are a Bible study assistant analyzing the verse: "${verse}" (${reference || "unknown reference"}).

Extract 4-6 significant keywords or short phrases from this verse that would be meaningful to study in depth. Focus on:

1. Theologically significant words (names of God, salvation terms, covenant language)
2. Action words that convey important meaning
3. Words with rich Hebrew/Greek origins
4. Words that connect to broader biblical themes

Return the keywords in order of theological significance.`,
    });

    return NextResponse.json(result.object);
  } catch (error) {
    console.error("[guided/keywords] Error:", error);
    return NextResponse.json(
      { error: "Failed to extract keywords" },
      { status: 500 },
    );
  }
}
