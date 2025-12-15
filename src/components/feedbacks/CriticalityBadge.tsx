import { Badge } from "@/components/ui/badge";
import { CriticalityLevel } from "@/hooks/useFeedbacks";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

interface CriticalityBadgeProps {
  level: CriticalityLevel;
  className?: string;
}

const criticalityConfig: Record<CriticalityLevel, { label: { fr: string; en: string }; className: string }> = {
  critical: {
    label: { fr: "Critique", en: "Critical" },
    className: "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30",
  },
  medium: {
    label: { fr: "Moyenne", en: "Medium" },
    className: "bg-yellow-500/15 text-yellow-600 dark:text-yellow-400 border-yellow-500/30",
  },
  low: {
    label: { fr: "Basse", en: "Low" },
    className: "bg-green-500/15 text-green-600 dark:text-green-400 border-green-500/30",
  },
};

export const CriticalityBadge = ({ level, className }: CriticalityBadgeProps) => {
  const { t } = useLanguage();
  const config = criticalityConfig[level];

  return (
    <Badge variant="outline" className={cn(config.className, className)}>
      {t(config.label.fr, config.label.en)}
    </Badge>
  );
};

export default CriticalityBadge;
