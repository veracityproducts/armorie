"use client";

import { makeAssistantToolUI } from "@assistant-ui/react";
import { VerseMapGrid } from "./verse-map/verse-map-grid";

interface KeywordStudy {
  keyword: string;
  greekHebrew: string;
  meaning: string;
  references: string[];
  significance: string;
}

type AnalyzeVerseArgs = {
  verse: string;
  reference: string;
  keywords: string[];
  studies?: KeywordStudy[];
};

type AnalyzeVerseResult = {
  selectedKeywords: string[];
};

export const VerseAnalysisToolUI = makeAssistantToolUI<
  AnalyzeVerseArgs,
  AnalyzeVerseResult
>({
  toolName: "analyze_verse",
  render: ({ args, result, status, addResult }) => {
    const handleSubmit = (selectedKeywords: string[]) => {
      addResult({ selectedKeywords });
    };

    // Loading state while AI is generating args
    if (status.type === "running" && !args.keywords) {
      return (
        <div className="flex items-center gap-2 rounded-lg border border-border bg-card p-4">
          <div className="size-4 animate-pulse rounded-full bg-primary-300" />
          <span className="text-muted-foreground">Analyzing verse...</span>
        </div>
      );
    }

    // Convert studies array to Record for the grid component
    const studiesRecord = args.studies?.reduce(
      (acc, study) => {
        acc[study.keyword] = study;
        return acc;
      },
      {} as Record<string, KeywordStudy>
    );

    // Determine if this is the "completed" state (has studies or has result)
    const isComplete = !!result?.selectedKeywords || !!args.studies;

    return (
      <VerseMapGrid
        verse={args.verse}
        reference={args.reference}
        keywords={args.keywords || []}
        keywordStudies={studiesRecord}
        onSubmit={handleSubmit}
        isComplete={isComplete}
        selectedKeywords={result?.selectedKeywords}
      />
    );
  },
});
