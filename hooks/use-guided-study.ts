"use client";

import { useReducer, useCallback } from "react";

// Types
export interface Verse {
  reference: string;
  text: string;
  book: string;
  chapter: number;
  verse: number;
}

export interface KeywordStudy {
  keyword: string;
  greekHebrew: string;
  meaning: string;
  references: string[];
  significance: string;
}

export interface HistoricalContext {
  period: string;
  author: string;
  audience: string;
  events: string[];
  culturalNotes: string;
}

export type GuidedStep = "topic" | "verse" | "keywords" | "map";

export interface GuidedStudyState {
  isActive: boolean;
  currentStep: GuidedStep;
  topic: string | null;
  suggestedVerses: Verse[];
  selectedVerse: Verse | null;
  suggestedKeywords: string[];
  selectedKeywords: string[];
  studies: KeywordStudy[];
  historicalContext: HistoricalContext | null;
  translation: string;
  isLoading: boolean;
  error: string | null;
}

// Actions
type GuidedStudyAction =
  | { type: "START_GUIDED"; translation: string }
  | { type: "SET_TOPIC"; topic: string }
  | { type: "SET_SUGGESTED_VERSES"; verses: Verse[] }
  | { type: "SELECT_VERSE"; verse: Verse }
  | { type: "SET_SUGGESTED_KEYWORDS"; keywords: string[] }
  | { type: "SELECT_KEYWORDS"; keywords: string[] }
  | { type: "SET_STUDIES"; studies: KeywordStudy[] }
  | { type: "SET_HISTORICAL_CONTEXT"; context: HistoricalContext }
  | { type: "GO_TO_STEP"; step: GuidedStep }
  | { type: "SET_LOADING"; isLoading: boolean }
  | { type: "SET_ERROR"; error: string | null }
  | { type: "RESET" }
  | { type: "DEACTIVATE" };

// Initial state
const initialState: GuidedStudyState = {
  isActive: false,
  currentStep: "topic",
  topic: null,
  suggestedVerses: [],
  selectedVerse: null,
  suggestedKeywords: [],
  selectedKeywords: [],
  studies: [],
  historicalContext: null,
  translation: "NIV",
  isLoading: false,
  error: null,
};

// Reducer
function guidedStudyReducer(
  state: GuidedStudyState,
  action: GuidedStudyAction,
): GuidedStudyState {
  switch (action.type) {
    case "START_GUIDED":
      return {
        ...initialState,
        isActive: true,
        translation: action.translation,
        currentStep: "topic",
      };

    case "SET_TOPIC":
      return {
        ...state,
        topic: action.topic,
        error: null,
      };

    case "SET_SUGGESTED_VERSES":
      return {
        ...state,
        suggestedVerses: action.verses,
        currentStep: "verse",
        isLoading: false,
      };

    case "SELECT_VERSE":
      return {
        ...state,
        selectedVerse: action.verse,
        error: null,
      };

    case "SET_SUGGESTED_KEYWORDS":
      return {
        ...state,
        suggestedKeywords: action.keywords,
        currentStep: "keywords",
        isLoading: false,
      };

    case "SELECT_KEYWORDS":
      return {
        ...state,
        selectedKeywords: action.keywords,
        error: null,
      };

    case "SET_STUDIES":
      return {
        ...state,
        studies: action.studies,
        currentStep: "map",
        isLoading: false,
      };

    case "SET_HISTORICAL_CONTEXT":
      return {
        ...state,
        historicalContext: action.context,
        isLoading: false,
      };

    case "GO_TO_STEP":
      return {
        ...state,
        currentStep: action.step,
      };

    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.isLoading,
      };

    case "SET_ERROR":
      return {
        ...state,
        error: action.error,
        isLoading: false,
      };

    case "RESET":
      return {
        ...initialState,
        isActive: true,
        translation: state.translation,
      };

    case "DEACTIVATE":
      return initialState;

    default:
      return state;
  }
}

// Hook
export function useGuidedStudy() {
  const [state, dispatch] = useReducer(guidedStudyReducer, initialState);

  // Actions
  const startGuided = useCallback((translation: string) => {
    dispatch({ type: "START_GUIDED", translation });
  }, []);

  const deactivate = useCallback(() => {
    dispatch({ type: "DEACTIVATE" });
  }, []);

  const setTopic = useCallback((topic: string) => {
    dispatch({ type: "SET_TOPIC", topic });
  }, []);

  const setSuggestedVerses = useCallback((verses: Verse[]) => {
    dispatch({ type: "SET_SUGGESTED_VERSES", verses });
  }, []);

  const selectVerse = useCallback((verse: Verse) => {
    dispatch({ type: "SELECT_VERSE", verse });
  }, []);

  const setSuggestedKeywords = useCallback((keywords: string[]) => {
    dispatch({ type: "SET_SUGGESTED_KEYWORDS", keywords });
  }, []);

  const selectKeywords = useCallback((keywords: string[]) => {
    dispatch({ type: "SELECT_KEYWORDS", keywords });
  }, []);

  const setStudies = useCallback((studies: KeywordStudy[]) => {
    dispatch({ type: "SET_STUDIES", studies });
  }, []);

  const setHistoricalContext = useCallback((context: HistoricalContext) => {
    dispatch({ type: "SET_HISTORICAL_CONTEXT", context });
  }, []);

  const goToStep = useCallback((step: GuidedStep) => {
    dispatch({ type: "GO_TO_STEP", step });
  }, []);

  const setLoading = useCallback((isLoading: boolean) => {
    dispatch({ type: "SET_LOADING", isLoading });
  }, []);

  const setError = useCallback((error: string | null) => {
    dispatch({ type: "SET_ERROR", error });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);

  // Computed values
  const canProceedFromTopic = state.topic !== null && state.topic.length > 0;
  const canProceedFromVerse = state.selectedVerse !== null;
  const canProceedFromKeywords = state.selectedKeywords.length > 0;
  const isComplete = state.currentStep === "map" && state.studies.length > 0;

  const stepIndex = ["topic", "verse", "keywords", "map"].indexOf(
    state.currentStep,
  );

  return {
    // State
    ...state,
    stepIndex,

    // Computed
    canProceedFromTopic,
    canProceedFromVerse,
    canProceedFromKeywords,
    isComplete,

    // Actions
    startGuided,
    deactivate,
    setTopic,
    setSuggestedVerses,
    selectVerse,
    setSuggestedKeywords,
    selectKeywords,
    setStudies,
    setHistoricalContext,
    goToStep,
    setLoading,
    setError,
    reset,
  };
}

export type UseGuidedStudyReturn = ReturnType<typeof useGuidedStudy>;
