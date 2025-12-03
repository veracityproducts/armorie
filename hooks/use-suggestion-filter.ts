import { useMemo } from "react";
import { VERSE_SUGGESTIONS, TOPIC_SUGGESTIONS, type TopicSuggestion } from "@/lib/bible-data";

export type SuggestionFilterResult = {
  verses: readonly string[];
  topics: readonly TopicSuggestion[];
  hasResults: boolean;
};

export function useSuggestionFilter(query: string): SuggestionFilterResult {
  return useMemo(() => {
    if (query.length < 1) {
      return { verses: [], topics: [], hasResults: false };
    }

    const normalizedQuery = query.toLowerCase();

    const verses = VERSE_SUGGESTIONS
      .filter((v) => v.toLowerCase().includes(normalizedQuery))
      .slice(0, 4);

    const topics = TOPIC_SUGGESTIONS
      .filter(
        (t) =>
          t.topic.toLowerCase().includes(normalizedQuery) ||
          t.description.toLowerCase().includes(normalizedQuery)
      )
      .slice(0, 3);

    return {
      verses,
      topics,
      hasResults: verses.length > 0 || topics.length > 0,
    };
  }, [query]);
}
