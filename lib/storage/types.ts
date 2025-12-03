// Types for study persistence

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

export interface VerseStudy {
  id: string;
  verse: string;
  reference: string;
  studies: KeywordStudy[];
  historicalContext?: HistoricalContext;
  reflection?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudyCollection {
  userId: string;
  studies: VerseStudy[];
  lastSyncedAt?: string;
}
