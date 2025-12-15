import { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { GitMerge, ArrowRight, ExternalLink } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import CriticalityBadge from "./CriticalityBadge";
import StatusBadge from "./StatusBadge";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUpdateFeedback, Feedback } from "@/hooks/useFeedbacks";
import { toast } from "sonner";
import { Link } from "react-router-dom";

interface ReviewMergeSuggestionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feedback1: Feedback;
  feedback2: Feedback;
  score: number;
  reason: string;
  onMergeComplete?: () => void;
}

const ReviewMergeSuggestionDialog = ({
  open,
  onOpenChange,
  feedback1,
  feedback2,
  score,
  reason,
  onMergeComplete,
}: ReviewMergeSuggestionDialogProps) => {
  const { t } = useLanguage();
  const [primaryId, setPrimaryId] = useState<string>(feedback1.id);
  const updateFeedback = useUpdateFeedback();

  const handleMerge = async () => {
    const secondaryId = primaryId === feedback1.id ? feedback2.id : feedback1.id;

    try {
      await updateFeedback.mutateAsync({
        id: secondaryId,
        merged_into_id: primaryId,
      });

      toast.success(t("Feedbacks fusionnés avec succès", "Feedbacks merged successfully"));
      onOpenChange(false);
      onMergeComplete?.();
    } catch (error) {
      console.error("Error merging feedbacks:", error);
      toast.error(t("Erreur lors de la fusion", "Error merging feedbacks"));
    }
  };

  const FeedbackDetails = ({ feedback, isPrimary }: { feedback: Feedback; isPrimary: boolean }) => (
    <div className={`flex-1 p-4 rounded-lg border ${isPrimary ? "border-primary bg-primary/5" : "bg-muted/30"}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <RadioGroupItem value={feedback.id} id={feedback.id} />
          <Label htmlFor={feedback.id} className="font-medium cursor-pointer">
            {isPrimary ? t("Ticket principal", "Primary ticket") : t("Sera fusionné", "Will be merged")}
          </Label>
        </div>
        <Link to={`/feedback/${feedback.id}`} target="_blank">
          <Button variant="ghost" size="sm">
            <ExternalLink className="w-4 h-4" />
          </Button>
        </Link>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          <CriticalityBadge level={feedback.criticality} />
          <StatusBadge status={feedback.status} />
          {feedback.feedback_category && (
            <Badge variant="outline">
              {feedback.feedback_category === "bug" ? "🐛" : 
               feedback.feedback_category === "feature" ? "✨" : "🔥"} {feedback.feedback_category}
            </Badge>
          )}
        </div>

        <div className="text-sm">
          <span className="text-muted-foreground">{t("Date:", "Date:")}</span>{" "}
          {format(new Date(feedback.date), "dd MMMM yyyy", { locale: fr })}
        </div>

        <div className="text-sm">
          <span className="text-muted-foreground">{t("Client:", "Client:")}</span>{" "}
          {feedback.client_email}
        </div>

        {feedback.agent?.name && (
          <div className="text-sm">
            <span className="text-muted-foreground">{t("Agent:", "Agent:")}</span>{" "}
            {feedback.agent.name}
          </div>
        )}

        {feedback.is_global && (
          <Badge variant="secondary">🌐 {t("Problème global", "Global issue")}</Badge>
        )}

        {feedback.bug_type && (
          <div className="text-sm">
            <span className="text-muted-foreground">{t("Type:", "Type:")}</span>{" "}
            {feedback.bug_type}
          </div>
        )}

        <div className="mt-3">
          <span className="text-sm text-muted-foreground block mb-1">
            {t("Description:", "Description:")}
          </span>
          <p className="text-sm bg-background p-3 rounded border">
            {feedback.description}
          </p>
        </div>

        {feedback.admin_notes && (
          <div className="mt-2">
            <span className="text-sm text-muted-foreground block mb-1">
              {t("Notes admin:", "Admin notes:")}
            </span>
            <p className="text-sm bg-yellow-500/10 p-3 rounded border border-yellow-500/20">
              {feedback.admin_notes}
            </p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GitMerge className="w-5 h-5" />
            {t("Examiner la suggestion de fusion", "Review merge suggestion")}
          </DialogTitle>
          <DialogDescription>
            <span className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-primary/20">
                {score}% {t("similarité", "similarity")}
              </Badge>
              <span className="italic">"{reason}"</span>
            </span>
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <RadioGroup value={primaryId} onValueChange={setPrimaryId}>
            <div className="flex gap-4 p-1">
              <FeedbackDetails 
                feedback={feedback1} 
                isPrimary={primaryId === feedback1.id} 
              />
              <div className="flex items-center">
                <ArrowRight className="w-6 h-6 text-muted-foreground" />
              </div>
              <FeedbackDetails 
                feedback={feedback2} 
                isPrimary={primaryId === feedback2.id} 
              />
            </div>
          </RadioGroup>
        </ScrollArea>

        <div className="bg-muted/50 p-3 rounded-lg text-sm">
          <p className="text-muted-foreground">
            {t(
              "Le ticket non sélectionné sera marqué comme fusionné dans le ticket principal. Son historique sera conservé et accessible.",
              "The unselected ticket will be marked as merged into the primary ticket. Its history will be preserved and accessible."
            )}
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("Annuler", "Cancel")}
          </Button>
          <Button onClick={handleMerge} disabled={updateFeedback.isPending}>
            <GitMerge className="w-4 h-4 mr-2" />
            {updateFeedback.isPending 
              ? t("Fusion en cours...", "Merging...") 
              : t("Fusionner", "Merge")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewMergeSuggestionDialog;
