import { openai } from "@ai-sdk/openai";
import {
  streamText,
  UIMessage,
  convertToModelMessages,
  tool,
} from "ai";
import { frontendTools } from "@assistant-ui/react-ai-sdk";
import { z } from "zod";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// Schema for keyword study
const keywordStudySchema = z.object({
  keyword: z.string().describe("The keyword being studied"),
  greekHebrew: z
    .string()
    .describe(
      "The Greek or Hebrew word with transliteration (e.g., 'ἀγαπάω (agapaō)')"
    ),
  meaning: z.string().describe("Brief meaning/definition of the word"),
  references: z
    .array(z.string())
    .describe(
      "2-3 Scripture references where this word appears (e.g., 'Matthew 22:37', 'Romans 8:28')"
    ),
  significance: z
    .string()
    .describe("Theological significance and how it relates to the verse"),
});

export async function POST(req: Request) {
  const {
    messages,
    system,
    tools,
  }: {
    messages: UIMessage[];
    system?: string;
    tools?: any;
  } = await req.json();

  const result = streamText({
    model: openai("gpt-4o"),
    system,
    messages: convertToModelMessages(messages),
    tools: {
      ...frontendTools(tools),
      // Single human tool for verse mapping - user selects keywords, then AI provides studies
      analyze_verse: tool({
        description: `Analyze a Bible verse for deeper study. This tool displays a verse with 4 keywords for the user to select.

When called initially (without studies), it shows the verse and keywords for user selection.
When called with studies, it displays the detailed keyword studies inside expandable cards.

Flow:
1. First call: Pass verse, reference, and 4 keywords. User selects which to study.
2. User returns their selectedKeywords in the result.
3. Second call: Pass the same verse, reference, keywords, PLUS the studies array for the selected keywords.`,
        inputSchema: z.object({
          verse: z.string().describe("The full Bible verse text"),
          reference: z
            .string()
            .describe("The verse reference (e.g., Psalm 23:1)"),
          keywords: z
            .array(z.string())
            .length(4)
            .describe("Four significant keywords from the verse for deeper study"),
          studies: z
            .array(keywordStudySchema)
            .optional()
            .describe("Keyword studies to display (pass on second call after user selects keywords)"),
        }),
        // No execute - human tool that waits for frontend addResult()
      }),
    },
  });

  return result.toUIMessageStreamResponse();
}
