import { useState } from "react";
import { Sparkles, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import MergeSuggestionCard from "./MergeSuggestionCard";
import ReviewMergeSuggestionDialog from "./ReviewMergeSuggestionDialog";
import { useMergeSuggestions, MergeSuggestion } from "@/hooks/useMergeSuggestions";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

const AIMergeSuggestionsPanel = () => {
  const { t } = useLanguage();
  const {
    suggestions,
    isAnalyzing,
    error,
    analyze,
    dismissSuggestion,
    removeSuggestion,
  } = useMergeSuggestions();

  const [isOpen, setIsOpen] = useState(true);
  const [reviewingSuggestion, setReviewingSuggestion] = useState<MergeSuggestion | null>(null);

  const handleAnalyze = () => {
    analyze(undefined, {
      onError: (err) => {
        console.error("Analysis error:", err);
        toast.error(
          t(
            "Erreur lors de l'analyse. Réessayez plus tard.",
            "Error during analysis. Please try again later."
          )
        );
      },
    });
  };

  const handleMergeComplete = () => {
    if (reviewingSuggestion) {
      removeSuggestion(
        reviewingSuggestion.feedback1.id,
        reviewingSuggestion.feedback2.id
      );
      setReviewingSuggestion(null);
    }
  };

  return (
    <>
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mb-6">
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border border-primary/20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-lg">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold flex items-center gap-2">
                {t("Suggestions IA de fusion", "AI Merge Suggestions")}
                {suggestions.length > 0 && (
                  <Badge variant="secondary">{suggestions.length}</Badge>
                )}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t(
                  "Analysez les feedbacks pour détecter les doublons potentiels",
                  "Analyze feedbacks to detect potential duplicates"
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              size="sm"
              variant={suggestions.length > 0 ? "outline" : "default"}
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  {t("Analyse...", "Analyzing...")}
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  {suggestions.length > 0
                    ? t("Réanalyser", "Re-analyze")
                    : t("Analyser", "Analyze")}
                </>
              )}
            </Button>

            {suggestions.length > 0 && (
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="icon">
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
            )}
          </div>
        </div>

        <CollapsibleContent>
          {suggestions.length > 0 && (
            <div className="mt-4 space-y-3">
              {suggestions.map((suggestion, index) => (
                <MergeSuggestionCard
                  key={`${suggestion.feedback1.id}-${suggestion.feedback2.id}`}
                  feedback1={suggestion.feedback1}
                  feedback2={suggestion.feedback2}
                  score={suggestion.score}
                  reason={suggestion.reason}
                  onReview={() => setReviewingSuggestion(suggestion)}
                  onDismiss={() =>
                    dismissSuggestion(suggestion.feedback1.id, suggestion.feedback2.id)
                  }
                />
              ))}
            </div>
          )}

          {error && (
            <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
              {t(
                "Une erreur est survenue lors de l'analyse.",
                "An error occurred during analysis."
              )}
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>

      {reviewingSuggestion && (
        <ReviewMergeSuggestionDialog
          open={!!reviewingSuggestion}
          onOpenChange={(open) => !open && setReviewingSuggestion(null)}
          feedback1={reviewingSuggestion.feedback1}
          feedback2={reviewingSuggestion.feedback2}
          score={reviewingSuggestion.score}
          reason={reviewingSuggestion.reason}
          onMergeComplete={handleMergeComplete}
        />
      )}
    </>
  );
};

export default AIMergeSuggestionsPanel;
