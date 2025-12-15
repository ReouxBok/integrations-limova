import { useState } from "react";
import { Loader2, GitMerge, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { Feedback, useFeedbacks, useUpdateFeedback } from "@/hooks/useFeedbacks";
import CriticalityBadge from "./CriticalityBadge";
import { format } from "date-fns";

interface MergeFeedbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentFeedback: Feedback;
  onMergeComplete?: () => void;
}

const MergeFeedbackDialog = ({ open, onOpenChange, currentFeedback, onMergeComplete }: MergeFeedbackDialogProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data: allFeedbacks } = useFeedbacks({ includeMerged: true });
  const updateFeedback = useUpdateFeedback();

  // Filter out current feedback and already merged feedbacks
  const availableFeedbacks = allFeedbacks?.filter(f => 
    f.id !== currentFeedback.id && 
    !f.merged_into_id &&
    (f.description.toLowerCase().includes(search.toLowerCase()) ||
     f.client_email.toLowerCase().includes(search.toLowerCase()) ||
     f.agent?.name?.toLowerCase().includes(search.toLowerCase()))
  ) || [];

  const handleMerge = async () => {
    if (!selectedId) return;

    try {
      // Merge current feedback into the selected one
      await updateFeedback.mutateAsync({
        id: currentFeedback.id,
        merged_into_id: selectedId,
      });

      toast({
        title: t("Feedbacks fusionnés", "Feedbacks merged"),
        description: t(
          "Ce feedback a été lié au feedback principal",
          "This feedback has been linked to the main feedback"
        ),
      });

      onOpenChange(false);
      onMergeComplete?.();
    } catch {
      toast({
        title: t("Erreur", "Error"),
        description: t("Impossible de fusionner les feedbacks", "Unable to merge feedbacks"),
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GitMerge className="w-5 h-5" />
            {t("Fusionner avec un autre feedback", "Merge with another feedback")}
          </DialogTitle>
          <DialogDescription>
            {t(
              "Sélectionnez le feedback principal auquel lier celui-ci. L'historique des deux feedbacks sera conservé.",
              "Select the main feedback to link this one to. Both feedbacks' history will be preserved."
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={t("Rechercher un feedback...", "Search for a feedback...")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <ScrollArea className="h-[300px] border rounded-lg">
            {availableFeedbacks.length > 0 ? (
              <div className="p-2 space-y-2">
                {availableFeedbacks.map((feedback) => (
                  <button
                    key={feedback.id}
                    onClick={() => setSelectedId(feedback.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      selectedId === feedback.id
                        ? "border-primary bg-primary/10"
                        : "border-border hover:bg-muted"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <CriticalityBadge level={feedback.criticality} />
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(feedback.date), "dd/MM/yyyy")}
                      </span>
                    </div>
                    <p className="text-sm font-medium truncate">
                      {feedback.agent?.name || (feedback.is_global ? "Problème global" : "—")}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {feedback.description.slice(0, 100)}...
                    </p>
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                {t("Aucun feedback disponible", "No feedback available")}
              </div>
            )}
          </ScrollArea>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("Annuler", "Cancel")}
          </Button>
          <Button onClick={handleMerge} disabled={!selectedId || updateFeedback.isPending}>
            {updateFeedback.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            <GitMerge className="w-4 h-4 mr-2" />
            {t("Fusionner", "Merge")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MergeFeedbackDialog;
