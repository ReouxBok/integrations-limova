import { cn } from "@/lib/utils";

export type PriorityLevel = "urgent" | "high" | "medium" | "low";

interface PriorityBadgeProps {
  level: PriorityLevel | null;
  className?: string;
}

const priorityConfig: Record<PriorityLevel, { label: { fr: string; en: string }; className: string; icon: string }> = {
  urgent: {
    label: { fr: "Urgent", en: "Urgent" },
    className: "bg-red-500/20 text-red-500 border-red-500/30",
    icon: "🔥",
  },
  high: {
    label: { fr: "Haute", en: "High" },
    className: "bg-orange-500/20 text-orange-500 border-orange-500/30",
    icon: "⬆️",
  },
  medium: {
    label: { fr: "Moyenne", en: "Medium" },
    className: "bg-yellow-500/20 text-yellow-500 border-yellow-500/30",
    icon: "➡️",
  },
  low: {
    label: { fr: "Basse", en: "Low" },
    className: "bg-blue-500/20 text-blue-500 border-blue-500/30",
    icon: "⬇️",
  },
};

const PriorityBadge = ({ level, className }: PriorityBadgeProps) => {
  if (!level) return null;

  const config = priorityConfig[level];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border",
        config.className,
        className
      )}
    >
      {config.icon} {config.label.fr}
    </span>
  );
};

export default PriorityBadge;
