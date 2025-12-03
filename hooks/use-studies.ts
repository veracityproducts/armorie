"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { VerseStudy } from "@/lib/storage/types";
import {
  getStudies,
  getStudy,
  saveStudy,
  deleteStudy,
  searchStudies,
  getRecentStudies,
  clearStudies,
  getStorageStats,
} from "@/lib/storage/local-storage";

interface UseStudiesReturn {
  studies: VerseStudy[];
  isLoading: boolean;
  error: string | null;
  userId: string | null;
  save: (study: VerseStudy) => boolean;
  remove: (studyId: string) => boolean;
  find: (studyId: string) => VerseStudy | null;
  search: (query: string) => VerseStudy[];
  recent: (limit?: number) => VerseStudy[];
  clear: () => boolean;
  stats: () => { studyCount: number; storageUsed: number } | null;
  refresh: () => void;
}

export function useStudies(): UseStudiesReturn {
  const [studies, setStudies] = useState<VerseStudy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const supabase = createClient();

  const loadStudies = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setUserId(null);
        setStudies([]);
        setIsLoading(false);
        return;
      }

      setUserId(user.id);
      const userStudies = getStudies(user.id);
      setStudies(userStudies);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load studies");
    } finally {
      setIsLoading(false);
    }
  }, [supabase.auth]);

  useEffect(() => {
    loadStudies();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      loadStudies();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [loadStudies, supabase.auth]);

  const save = useCallback(
    (study: VerseStudy): boolean => {
      if (!userId) return false;
      const success = saveStudy(userId, study);
      if (success) {
        setStudies(getStudies(userId));
      }
      return success;
    },
    [userId]
  );

  const remove = useCallback(
    (studyId: string): boolean => {
      if (!userId) return false;
      const success = deleteStudy(userId, studyId);
      if (success) {
        setStudies(getStudies(userId));
      }
      return success;
    },
    [userId]
  );

  const find = useCallback(
    (studyId: string): VerseStudy | null => {
      if (!userId) return null;
      return getStudy(userId, studyId);
    },
    [userId]
  );

  const search = useCallback(
    (query: string): VerseStudy[] => {
      if (!userId) return [];
      return searchStudies(userId, query);
    },
    [userId]
  );

  const recent = useCallback(
    (limit: number = 10): VerseStudy[] => {
      if (!userId) return [];
      return getRecentStudies(userId, limit);
    },
    [userId]
  );

  const clear = useCallback((): boolean => {
    if (!userId) return false;
    const success = clearStudies(userId);
    if (success) {
      setStudies([]);
    }
    return success;
  }, [userId]);

  const stats = useCallback((): {
    studyCount: number;
    storageUsed: number;
  } | null => {
    if (!userId) return null;
    return getStorageStats(userId);
  }, [userId]);

  return {
    studies,
    isLoading,
    error,
    userId,
    save,
    remove,
    find,
    search,
    recent,
    clear,
    stats,
    refresh: loadStudies,
  };
}
