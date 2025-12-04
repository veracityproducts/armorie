"use client";

import { useMemo, useCallback } from "react";
import { Search, BookOpen, Sparkles, MapPin } from "lucide-react";
import ToolbarExpandable from "@/components/ui/toolbar-expandable";
import { useGuidedStudyContext } from "./guided-study-context";
import { TopicStep, VerseStep, KeywordStep, MapStep } from "./steps";
import type {
  Verse,
  KeywordStudy,
  HistoricalContext,
  GuidedStep,
} from "@/hooks/use-guided-study";

interface GuidedStudyToolbarProps {
  onFindVerses: (topic: string) => Promise<Verse[]>;
  onExtractKeywords: (verse: Verse) => Promise<string[]>;
  onGenerateStudies: (
    verse: Verse,
    keywords: string[],
  ) => Promise<KeywordStudy[]>;
  onFetchHistory: (verse: Verse) => Promise<HistoricalContext>;
  onSaveStudy?: () => void;
}

export function GuidedStudyToolbar({
  onFindVerses,
  onExtractKeywords,
  onGenerateStudies,
  onFetchHistory,
  onSaveStudy,
}: GuidedStudyToolbarProps) {
  const {
    isActive,
    currentStep,
    goToStep,
    setSuggestedVerses,
    setSuggestedKeywords,
    setStudies,
    setHistoricalContext,
    setLoading,
    setError,
    reset,
    selectedVerse,
  } = useGuidedStudyContext();

  // Handle finding verses for a topic
  const handleFindVerses = useCallback(
    async (topic: string) => {
      try {
        setLoading(true);
        setError(null);
        const verses = await onFindVerses(topic);
        setSuggestedVerses(verses);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to find verses");
      }
    },
    [onFindVerses, setSuggestedVerses, setLoading, setError],
  );

  // Handle studying a verse (extract keywords)
  const handleStudyVerse = useCallback(
    async (verse: Verse) => {
      try {
        setLoading(true);
        setError(null);
        const keywords = await onExtractKeywords(verse);
        setSuggestedKeywords(keywords);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to extract keywords",
        );
      }
    },
    [onExtractKeywords, setSuggestedKeywords, setLoading, setError],
  );

  // Handle generating studies (also fetches historical context in parallel)
  const handleGenerateStudies = useCallback(
    async (keywords: string[]) => {
      if (!selectedVerse) return;
      try {
        setLoading(true);
        setError(null);

        // Fetch studies and historical context in parallel
        const [studies, history] = await Promise.all([
          onGenerateStudies(selectedVerse, keywords),
          onFetchHistory(selectedVerse),
        ]);

        setStudies(studies);
        setHistoricalContext(history);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to generate studies",
        );
      }
    },
    [
      selectedVerse,
      onGenerateStudies,
      onFetchHistory,
      setStudies,
      setHistoricalContext,
      setLoading,
      setError,
    ],
  );

  // Handle starting a new study
  const handleStartNew = useCallback(() => {
    reset();
  }, [reset]);

  // Build steps for the toolbar
  const steps = useMemo(
    () => [
      {
        id: "topic" as const,
        title: "Choose Topic",
        description: "Enter a topic, feeling, or theme to explore",
        icon: Search,
        content: <TopicStep onFindVerses={handleFindVerses} />,
      },
      {
        id: "verse" as const,
        title: "Select Verse",
        description: "Choose a verse to study in depth",
        icon: BookOpen,
        content: <VerseStep onStudyVerse={handleStudyVerse} />,
      },
      {
        id: "keywords" as const,
        title: "Study Keywords",
        description: "Select keywords to explore their meaning",
        icon: Sparkles,
        content: <KeywordStep onGenerateStudies={handleGenerateStudies} />,
      },
      {
        id: "map" as const,
        title: "Verse Map",
        description: "",
        icon: MapPin,
        content: <MapStep onSave={onSaveStudy} onStartNew={handleStartNew} />,
      },
    ],
    [
      handleFindVerses,
      handleStudyVerse,
      handleGenerateStudies,
      handleStartNew,
      onSaveStudy,
    ],
  );

  // Handle step change from toolbar
  const handleActiveStepChange = useCallback(
    (stepId: string | null) => {
      if (stepId) {
        goToStep(stepId as GuidedStep);
      }
    },
    [goToStep],
  );

  if (!isActive) {
    return null;
  }

  return (
    <div className="w-full max-w-[52rem] mx-auto">
      <ToolbarExpandable
        steps={steps}
        badgeText="GUIDED STUDY"
        activeStep={currentStep}
        onActiveStepChange={handleActiveStepChange}
        expanded={true}
        variant="composer"
        className="max-w-full"
      />
    </div>
  );
}
