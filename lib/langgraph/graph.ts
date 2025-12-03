import { StateGraph, START, END, MemorySaver } from "@langchain/langgraph";
import { VerseStudyAnnotation } from "./state";
import {
  parseVerseNode,
  extractKeywordsNode,
  selectKeywordsNode,
  generateStudiesNode,
  presentVerseMapNode,
  fetchHistoryNode,
  presentHistoricalContextNode,
  promptReflectionNode,
  summarizeInsightsNode,
} from "./nodes";

/**
 * Verse Study Workflow Graph
 *
 * Flow:
 * START
 *   → parseVerse (extract verse + reference from user query)
 *   → extractKeywords (AI generates all significant keywords)
 *   → selectKeywords (INTERRUPT: user selects which keywords to study)
 *   → generateStudies (AI generates studies for selected)
 *   → presentVerseMap (INTERRUPT: Artifact #1 - expandable/editable cards + "Go Deeper" button)
 *   → fetchHistory (fetch historical context of the VERSE)
 *   → presentHistoricalContext (INTERRUPT: Artifact #2 - historical context display)
 *   → promptReflection (INTERRUPT: user enters reflection - kept for future)
 *   → summarizeInsights (AI summarizes everything)
 *   → END
 */
const workflow = new StateGraph(VerseStudyAnnotation)
  // Add all nodes
  .addNode("parseVerse", parseVerseNode)
  .addNode("extractKeywords", extractKeywordsNode)
  .addNode("selectKeywords", selectKeywordsNode)
  .addNode("generateStudies", generateStudiesNode)
  .addNode("presentVerseMap", presentVerseMapNode)
  .addNode("fetchHistory", fetchHistoryNode)
  .addNode("presentHistoricalContext", presentHistoricalContextNode)
  .addNode("promptReflection", promptReflectionNode)
  .addNode("summarizeInsights", summarizeInsightsNode)

  // Wire edges - deterministic flow
  .addEdge(START, "parseVerse")
  .addEdge("parseVerse", "extractKeywords")
  .addEdge("extractKeywords", "selectKeywords")
  .addEdge("selectKeywords", "generateStudies")
  .addEdge("generateStudies", "presentVerseMap")
  .addEdge("presentVerseMap", "fetchHistory")
  .addEdge("fetchHistory", "presentHistoricalContext")
  .addEdge("presentHistoricalContext", "promptReflection")
  .addEdge("promptReflection", "summarizeInsights")
  .addEdge("summarizeInsights", END);

// Compile with checkpointer for state persistence across interrupts
export const verseStudyGraph = workflow.compile({
  checkpointer: new MemorySaver(),
});

// Export type for use in API routes
export type VerseStudyGraph = typeof verseStudyGraph;
