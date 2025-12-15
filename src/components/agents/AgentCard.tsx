import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export interface AgentCardData {
  id: string;
  name: string;
  description_fr: string;
  description_en: string;
  avatar_url: string | null;
  tutorial_count: number | null;
}

interface AgentCardProps {
  agent: AgentCardData;
  index: number;
}

const AgentCard = ({ agent, index }: AgentCardProps) => {
  const { language, t } = useLanguage();

  return (
    <div 
      className="group bg-card rounded-xl border border-border p-6 card-hover shadow-card animate-slide-up"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="flex items-start gap-4">
        {agent.avatar_url && (
          <img 
            src={agent.avatar_url} 
            alt={agent.name}
            className="w-14 h-14 rounded-full object-cover ring-2 ring-border"
          />
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground text-lg">{agent.name}</h3>
        </div>
      </div>

      <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
        {language === 'fr' ? agent.description_fr : agent.description_en}
      </p>

      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {agent.tutorial_count || 0} {t("tutoriel(s)", "tutorial(s)")}
          </span>
          <Link 
            to={`/agents/${agent.id}`}
            className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:text-accent/80 transition-colors group-hover:gap-2"
          >
            {t("Voir les tutoriels", "View tutorials")}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AgentCard;