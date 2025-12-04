import { NextResponse } from "next/server";
import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";

const KeywordStudySchema = z.object({
  keyword: z.string().describe("The keyword being studied"),
  greekHebrew: z
    .string()
    .describe(
      "Original Greek or Hebrew word with transliteration, empty if not applicable",
    ),
  meaning: z
    .string()
    .describe("Deep explanation of the word's meaning in biblical context"),
  references: z
    .array(z.string())
    .describe("2-3 other Bible references where this word/concept appears"),
  significance: z
    .string()
    .describe("Why this word matters for understanding the verse and faith"),
});

const StudiesResponseSchema = z.object({
  studies: z.array(KeywordStudySchema),
});

export async function POST(request: Request) {
  try {
    const {
      verse,
      reference,
      keywords,
      translation = "NIV",
    } = await request.json();

    if (
      !verse ||
      !keywords ||
      !Array.isArray(keywords) ||
      keywords.length === 0
    ) {
      return NextResponse.json(
        { error: "Verse and keywords are required" },
        { status: 400 },
      );
    }

    const result = await generateObject({
      model: openai("gpt-4o"),
      schema: StudiesResponseSchema,
      prompt: `You are a scholarly Bible study assistant. Generate in-depth studies for each keyword from the verse:

"${verse}" (${reference || "unknown reference"})

Keywords to study: ${keywords.join(", ")}

For each keyword, provide:
1. **greekHebrew**: The original language word (Hebrew for OT, Greek for NT) with transliteration in parentheses. For example: "רָעָה (ra'ah)" or "ἀγάπη (agapē)". Leave empty if the word doesn't have a significant original language connection.

2. **meaning**: A rich 2-3 sentence explanation of the word's meaning in its biblical context. Include any cultural or historical background that enriches understanding.

3. **references**: 2-3 other Bible verses where this word or concept appears prominently. Use ${translation} format.

4. **significance**: A 2-3 sentence explanation of why this word matters for understanding the verse and for practical faith application.

Make each study substantive and educational, suitable for someone wanting to deepen their Bible understanding.`,
    });

    return NextResponse.json(result.object);
  } catch (error) {
    console.error("[guided/studies] Error:", error);
    return NextResponse.json(
      { error: "Failed to generate studies" },
      { status: 500 },
    );
  }
}
