import { Annotation, MessagesAnnotation } from "@langchain/langgraph";

/**
 * Keyword study data structure
 */
export interface KeywordStudy {
  keyword: string;
  greekHebrew: string;
  meaning: string;
  references: string[];
  significance: string;
}

/**
 * Historical context for the verse
 */
export interface HistoricalContext {
  period: string;
  author: string;
  audience: string;
  events: string[];
  culturalNotes: string;
}

/**
 * State annotation for the verse study workflow
 *
 * Flow:
 * 1. parseVerse: Extract verse + reference from user query
 * 2. extractKeywords: AI generates 4 significant keywords
 * 3. selectKeywords: INTERRUPT - User selects which keywords to study
 * 4. generateStudies: AI generates studies for selected keywords
 * 5. fetchHistory: Fetch historical context
 * 6. promptReflection: INTERRUPT - User enters personal reflection
 * 7. summarizeInsights: AI summarizes study + reflection
 */
export const VerseStudyAnnotation = Annotation.Root({
  // Include messages for chat history
  ...MessagesAnnotation.spec,

  // Input from user
  userQuery: Annotation<string>({
    reducer: (_, next) => next,
    default: () => "",
  }),

  // Parsed verse data
  verse: Annotation<string>({
    reducer: (_, next) => next,
    default: () => "",
  }),
  reference: Annotation<string>({
    reducer: (_, next) => next,
    default: () => "",
  }),

  // Keyword extraction and selection
  keywords: Annotation<string[]>({
    reducer: (_, next) => next,
    default: () => [],
  }),
  selectedKeywords: Annotation<string[]>({
    reducer: (_, next) => next,
    default: () => [],
  }),

  // Generated studies for selected keywords
  studies: Annotation<KeywordStudy[]>({
    reducer: (_, next) => next,
    default: () => [],
  }),

  // Historical context
  historicalContext: Annotation<HistoricalContext | null>({
    reducer: (_, next) => next,
    default: () => null,
  }),

  // Reflection
  reflectionPrompt: Annotation<string>({
    reducer: (_, next) => next,
    default: () => "",
  }),
  userReflection: Annotation<string>({
    reducer: (_, next) => next,
    default: () => "",
  }),

  // Final summary
  insightsSummary: Annotation<string>({
    reducer: (_, next) => next,
    default: () => "",
  }),
});

export type VerseStudyState = typeof VerseStudyAnnotation.State;
