import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Feedback } from "./useFeedbacks";

export interface MergeSuggestion {
  feedback1: Feedback;
  feedback2: Feedback;
  score: number;
  reason: string;
}

export interface MergeSuggestionsResponse {
  suggestions: MergeSuggestion[];
  error?: string;
}

export const useMergeSuggestions = () => {
  const [suggestions, setSuggestions] = useState<MergeSuggestion[]>([]);
  const [dismissedPairs, setDismissedPairs] = useState<Set<string>>(new Set());
  const queryClient = useQueryClient();

  const { mutate: analyze, isPending: isAnalyzing, error } = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke<MergeSuggestionsResponse>(
        "analyze-merge-suggestions"
      );

      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      
      return data?.suggestions || [];
    },
    onSuccess: (newSuggestions) => {
      // Filter out dismissed pairs
      const filtered = newSuggestions.filter(
        (s) => !dismissedPairs.has(getPairKey(s.feedback1.id, s.feedback2.id))
      );
      setSuggestions(filtered);
    },
  });

  const getPairKey = (id1: string, id2: string) => {
    return [id1, id2].sort().join("-");
  };

  const dismissSuggestion = (feedback1Id: string, feedback2Id: string) => {
    const key = getPairKey(feedback1Id, feedback2Id);
    setDismissedPairs((prev) => new Set([...prev, key]));
    setSuggestions((prev) =>
      prev.filter((s) => getPairKey(s.feedback1.id, s.feedback2.id) !== key)
    );
  };

  const removeSuggestion = (feedback1Id: string, feedback2Id: string) => {
    setSuggestions((prev) =>
      prev.filter(
        (s) =>
          !(s.feedback1.id === feedback1Id && s.feedback2.id === feedback2Id) &&
          !(s.feedback1.id === feedback2Id && s.feedback2.id === feedback1Id)
      )
    );
  };

  const clearSuggestions = () => {
    setSuggestions([]);
  };

  return {
    suggestions,
    isAnalyzing,
    error,
    analyze,
    dismissSuggestion,
    removeSuggestion,
    clearSuggestions,
  };
};
