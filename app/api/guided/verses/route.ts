import { NextResponse } from "next/server";
import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";

const VerseSchema = z.object({
  reference: z.string().describe("The verse reference (e.g., 'Psalm 23:1')"),
  text: z.string().describe("The full verse text"),
  book: z.string().describe("The book name"),
  chapter: z.number().describe("The chapter number"),
  verse: z.number().describe("The verse number"),
});

const VersesResponseSchema = z.object({
  verses: z.array(VerseSchema).describe("Array of relevant verses"),
});

export async function POST(request: Request) {
  try {
    const { topic, translation = "NIV" } = await request.json();

    if (!topic || typeof topic !== "string") {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    const result = await generateObject({
      model: openai("gpt-4o-mini"),
      schema: VersesResponseSchema,
      prompt: `You are a Bible study assistant. Find 3-5 Bible verses that are most relevant to the topic, feeling, or theme: "${topic}".

For each verse:
1. Choose verses that directly address or relate to the topic
2. Include a mix of Old and New Testament if appropriate
3. Use the ${translation} translation for verse text
4. Prioritize well-known, impactful verses

Return verses that would be meaningful for someone seeking guidance on "${topic}".`,
    });

    return NextResponse.json(result.object);
  } catch (error) {
    console.error("[guided/verses] Error:", error);
    return NextResponse.json(
      { error: "Failed to find verses" },
      { status: 500 },
    );
  }
}
