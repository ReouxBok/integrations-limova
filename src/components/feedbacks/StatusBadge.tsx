import { Badge } from "@/components/ui/badge";
import { FeedbackStatus } from "@/hooks/useFeedbacks";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

interface StatusBadgeProps {
  status: FeedbackStatus;
  className?: string;
}

const statusConfig: Record<FeedbackStatus, { label: { fr: string; en: string }; className: string }> = {
  new: {
    label: { fr: "Nouveau", en: "New" },
    className: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30",
  },
  in_progress: {
    label: { fr: "En cours", en: "In Progress" },
    className: "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30",
  },
  testing: {
    label: { fr: "À tester", en: "Testing" },
    className: "bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/30",
  },
  resolved: {
    label: { fr: "Résolu", en: "Resolved" },
    className: "bg-green-500/15 text-green-600 dark:text-green-400 border-green-500/30",
  },
  closed: {
    label: { fr: "Fermé", en: "Closed" },
    className: "bg-gray-500/15 text-gray-600 dark:text-gray-400 border-gray-500/30",
  },
};

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const { t } = useLanguage();
  const config = statusConfig[status];

  return (
    <Badge variant="outline" className={cn(config.className, className)}>
      {t(config.label.fr, config.label.en)}
    </Badge>
  );
};

export default StatusBadge;
