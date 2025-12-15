import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { GitMerge, Eye, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CriticalityBadge from "./CriticalityBadge";
import { useLanguage } from "@/contexts/LanguageContext";
import { Feedback } from "@/hooks/useFeedbacks";

interface MergeSuggestionCardProps {
  feedback1: Feedback;
  feedback2: Feedback;
  score: number;
  reason: string;
  onReview: () => void;
  onDismiss: () => void;
}

const MergeSuggestionCard = ({
  feedback1,
  feedback2,
  score,
  reason,
  onReview,
  onDismiss,
}: MergeSuggestionCardProps) => {
  const { t } = useLanguage();

  const FeedbackPreview = ({ feedback }: { feedback: Feedback }) => (
    <div className="flex-1 p-3 bg-background rounded-lg border">
      <div className="flex items-center gap-2 mb-2">
        <CriticalityBadge level={feedback.criticality} />
        <span className="text-xs text-muted-foreground">
          {format(new Date(feedback.date), "dd MMM yyyy", { locale: fr })}
        </span>
      </div>
      <p className="text-sm line-clamp-2 mb-2">{feedback.description}</p>
      <div className="flex flex-wrap gap-1">
        {feedback.agent?.name && (
          <Badge variant="outline" className="text-xs">
            {feedback.agent.name}
          </Badge>
        )}
        {feedback.is_global && (
          <Badge variant="secondary" className="text-xs">
            🌐 Global
          </Badge>
        )}
        {feedback.bug_type && (
          <Badge variant="outline" className="text-xs">
            {feedback.bug_type}
          </Badge>
        )}
      </div>
    </div>
  );

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="font-medium text-sm">
              {t("Suggestion de fusion", "Merge Suggestion")}
            </span>
            <Badge 
              variant="secondary" 
              className={`${
                score >= 90 ? "bg-green-500/20 text-green-700 dark:text-green-300" :
                score >= 80 ? "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300" :
                "bg-orange-500/20 text-orange-700 dark:text-orange-300"
              }`}
            >
              {score}% {t("similarité", "similarity")}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={onDismiss}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <p className="text-sm text-muted-foreground mb-3 italic">
          "{reason}"
        </p>

        <div className="flex gap-3 mb-4">
          <FeedbackPreview feedback={feedback1} />
          <div className="flex items-center">
            <GitMerge className="w-5 h-5 text-muted-foreground" />
          </div>
          <FeedbackPreview feedback={feedback2} />
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onDismiss}>
            <X className="w-4 h-4 mr-1" />
            {t("Ignorer", "Dismiss")}
          </Button>
          <Button size="sm" onClick={onReview}>
            <Eye className="w-4 h-4 mr-1" />
            {t("Examiner", "Review")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MergeSuggestionCard;
