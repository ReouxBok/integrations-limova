import { useState } from "react";
import { Copy, Check, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { Feedback } from "@/hooks/useFeedbacks";

interface SlackMessageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feedback: Feedback;
}

const SlackMessageDialog = ({ open, onOpenChange, feedback }: SlackMessageDialogProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const agentName = feedback.agent?.name || (feedback.is_global ? "Plateforme globale" : "Non spécifié");
  const teamMemberName = feedback.team_member?.name || "Non assigné";
  const team = feedback.team_member?.team?.toUpperCase() || "";

  const slackMessage = `✅ *Bug résolu*

🤖 *Agent concerné:* ${agentName}
📝 *Description:* ${feedback.description.slice(0, 200)}${feedback.description.length > 200 ? "..." : ""}
👤 *Remonté par:* ${teamMemberName} (${team})
📅 *Date du feedback:* ${new Date(feedback.date).toLocaleDateString("fr-FR")}

Le problème a été résolu par la tech. Vous pouvez à nouveau utiliser cette fonctionnalité normalement.`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(slackMessage);
      setCopied(true);
      toast({
        title: t("Message copié !", "Message copied!"),
        description: t("Collez-le dans Slack", "Paste it in Slack"),
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: t("Erreur", "Error"),
        description: t("Impossible de copier", "Unable to copy"),
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            {t("Message Slack prêt", "Slack Message Ready")}
          </DialogTitle>
          <DialogDescription>
            {t(
              "Copiez ce message pour informer les équipes sur Slack",
              "Copy this message to inform the teams on Slack"
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Textarea
            value={slackMessage}
            readOnly
            className="min-h-[200px] font-mono text-sm"
          />

          <Button onClick={handleCopy} className="w-full" size="lg">
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                {t("Copié !", "Copied!")}
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" />
                {t("Copier le message", "Copy message")}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SlackMessageDialog;
