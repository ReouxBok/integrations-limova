import { Link } from "react-router-dom";
import { format } from "date-fns";
import { fr, enUS } from "date-fns/locale";
import { Calendar, Mail, Building2, ExternalLink, User } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Feedback } from "@/hooks/useFeedbacks";
import { CriticalityBadge } from "./CriticalityBadge";
import { StatusBadge } from "./StatusBadge";
import { useLanguage } from "@/contexts/LanguageContext";

interface FeedbackCardProps {
  feedback: Feedback;
  index?: number;
}

export const FeedbackCard = ({ feedback, index = 0 }: FeedbackCardProps) => {
  const { language } = useLanguage();
  const locale = language === "fr" ? fr : enUS;

  return (
    <Link to={`/feedbacks/${feedback.id}`}>
      <Card 
        className="card-hover cursor-pointer border-border/50 hover:border-accent/30 transition-all"
        style={{ animationDelay: `${index * 0.05}s` }}
      >
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {feedback.description.substring(0, 60)}
                {feedback.description.length > 60 ? "..." : ""}
              </p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <CriticalityBadge level={feedback.criticality} />
              <StatusBadge status={feedback.status} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {format(new Date(feedback.date), "dd MMM yyyy", { locale })}
            </div>
            
            {feedback.team_member && (
              <div className="flex items-center gap-1.5">
                <User className="w-4 h-4" />
                <span>{feedback.team_member.name}</span>
                <span className="text-xs px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground uppercase">
                  {feedback.team_member.team}
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Mail className="w-4 h-4" />
              <span className="truncate max-w-[150px]">{feedback.client_email}</span>
            </div>
            
            {feedback.client_sector && (
              <div className="flex items-center gap-1.5">
                <Building2 className="w-4 h-4" />
                <span>{feedback.client_sector}</span>
              </div>
            )}

            {feedback.hubspot_link && (
              <div className="flex items-center gap-1.5 text-accent">
                <ExternalLink className="w-4 h-4" />
                <span>HubSpot</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default FeedbackCard;
