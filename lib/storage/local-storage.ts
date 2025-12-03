import type { VerseStudy, StudyCollection } from "./types";

const STORAGE_KEY_PREFIX = "armorie_studies_";

/**
 * Get the storage key for a specific user
 */
function getStorageKey(userId: string): string {
  return `${STORAGE_KEY_PREFIX}${userId}`;
}

/**
 * Check if localStorage is available (client-side only)
 */
function isStorageAvailable(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const test = "__storage_test__";
    window.localStorage.setItem(test, test);
    window.localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get the study collection for a user
 */
export function getStudyCollection(userId: string): StudyCollection | null {
  if (!isStorageAvailable()) return null;

  const key = getStorageKey(userId);
  const data = window.localStorage.getItem(key);

  if (!data) return null;

  try {
    return JSON.parse(data) as StudyCollection;
  } catch {
    return null;
  }
}

/**
 * Save the study collection for a user
 */
export function saveStudyCollection(collection: StudyCollection): boolean {
  if (!isStorageAvailable()) return false;

  const key = getStorageKey(collection.userId);

  try {
    window.localStorage.setItem(key, JSON.stringify(collection));
    return true;
  } catch {
    // Storage quota exceeded or other error
    return false;
  }
}

/**
 * Get all studies for a user
 */
export function getStudies(userId: string): VerseStudy[] {
  const collection = getStudyCollection(userId);
  return collection?.studies ?? [];
}

/**
 * Get a single study by ID
 */
export function getStudy(userId: string, studyId: string): VerseStudy | null {
  const studies = getStudies(userId);
  return studies.find((s) => s.id === studyId) ?? null;
}

/**
 * Save a new study or update an existing one
 */
export function saveStudy(userId: string, study: VerseStudy): boolean {
  const collection = getStudyCollection(userId) ?? {
    userId,
    studies: [],
  };

  const existingIndex = collection.studies.findIndex((s) => s.id === study.id);

  if (existingIndex >= 0) {
    // Update existing study
    collection.studies[existingIndex] = {
      ...study,
      updatedAt: new Date().toISOString(),
    };
  } else {
    // Add new study
    collection.studies.push({
      ...study,
      createdAt: study.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  return saveStudyCollection(collection);
}

/**
 * Delete a study by ID
 */
export function deleteStudy(userId: string, studyId: string): boolean {
  const collection = getStudyCollection(userId);
  if (!collection) return false;

  collection.studies = collection.studies.filter((s) => s.id !== studyId);
  return saveStudyCollection(collection);
}

/**
 * Search studies by reference or verse content
 */
export function searchStudies(userId: string, query: string): VerseStudy[] {
  const studies = getStudies(userId);
  const lowerQuery = query.toLowerCase();

  return studies.filter(
    (study) =>
      study.reference.toLowerCase().includes(lowerQuery) ||
      study.verse.toLowerCase().includes(lowerQuery) ||
      study.studies.some(
        (s) =>
          s.keyword.toLowerCase().includes(lowerQuery) ||
          s.meaning.toLowerCase().includes(lowerQuery)
      )
  );
}

/**
 * Get studies sorted by most recently updated
 */
export function getRecentStudies(
  userId: string,
  limit: number = 10
): VerseStudy[] {
  const studies = getStudies(userId);

  return studies
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
    .slice(0, limit);
}

/**
 * Clear all studies for a user
 */
export function clearStudies(userId: string): boolean {
  if (!isStorageAvailable()) return false;

  const key = getStorageKey(userId);

  try {
    window.localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

/**
 * Export all studies as JSON (for backup or sync)
 */
export function exportStudies(userId: string): string | null {
  const collection = getStudyCollection(userId);
  if (!collection) return null;

  return JSON.stringify(collection, null, 2);
}

/**
 * Import studies from JSON (for restore or sync)
 */
export function importStudies(userId: string, json: string): boolean {
  try {
    const imported = JSON.parse(json) as StudyCollection;

    // Ensure the userId matches
    imported.userId = userId;

    return saveStudyCollection(imported);
  } catch {
    return false;
  }
}

/**
 * Get storage usage stats
 */
export function getStorageStats(userId: string): {
  studyCount: number;
  storageUsed: number;
} | null {
  if (!isStorageAvailable()) return null;

  const key = getStorageKey(userId);
  const data = window.localStorage.getItem(key);

  if (!data) {
    return { studyCount: 0, storageUsed: 0 };
  }

  const collection = JSON.parse(data) as StudyCollection;

  return {
    studyCount: collection.studies.length,
    storageUsed: new Blob([data]).size,
  };
}
