"use client";

import { createContext, useContext, type ReactNode } from "react";
import {
  useGuidedStudy,
  type UseGuidedStudyReturn,
} from "@/hooks/use-guided-study";

// Context
const GuidedStudyContext = createContext<UseGuidedStudyReturn | null>(null);

// Provider
interface GuidedStudyProviderProps {
  children: ReactNode;
}

export function GuidedStudyProvider({ children }: GuidedStudyProviderProps) {
  const guidedStudy = useGuidedStudy();

  return (
    <GuidedStudyContext.Provider value={guidedStudy}>
      {children}
    </GuidedStudyContext.Provider>
  );
}

// Hook to use the context
export function useGuidedStudyContext() {
  const context = useContext(GuidedStudyContext);

  if (!context) {
    throw new Error(
      "useGuidedStudyContext must be used within a GuidedStudyProvider",
    );
  }

  return context;
}

// Optional hook that doesn't throw (for conditional usage)
export function useGuidedStudyContextOptional() {
  return useContext(GuidedStudyContext);
}
