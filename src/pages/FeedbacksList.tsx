import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Download, Filter } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MainLayout from "@/components/layout/MainLayout";
import FeedbackCard from "@/components/feedbacks/FeedbackCard";
import AIMergeSuggestionsPanel from "@/components/feedbacks/AIMergeSuggestionsPanel";
import { useFeedbacks, FeedbackFilters, CriticalityLevel, FeedbackStatus, FeedbackCategory, BugType } from "@/hooks/useFeedbacks";
import { useTeamMembers, TeamType } from "@/hooks/useTeamMembers";
import { useLanguage } from "@/contexts/LanguageContext";

interface FeedbacksListProps {
  defaultTeam?: TeamType;
  title?: string;
}

const FeedbacksList = ({ defaultTeam, title }: FeedbacksListProps) => {
  const { t } = useLanguage();
  const [filters, setFilters] = useState<FeedbackFilters>({
    team: defaultTeam,
  });

  const { data: feedbacks, isLoading } = useFeedbacks(filters);
  const { data: teamMembers } = useTeamMembers(filters.team);

  const pageTitle = title || t("Tous les feedbacks", "All Feedbacks");

  const handleExportCSV = () => {
    if (!feedbacks?.length) return;

    const headers = ["Date", "Agent", "Équipe", "Criticité", "Statut", "Email Client", "Secteur", "Description"];
    const rows = feedbacks.map(f => [
      f.date,
      f.team_member?.name || "",
      f.team_member?.team || "",
      f.criticality,
      f.status,
      f.client_email,
      f.client_sector || "",
      f.description.replace(/"/g, '""'),
    ]);

    const csv = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `feedbacks-${format(new Date(), "yyyy-MM-dd")}.csv`;
    link.click();
  };

  return (
    <MainLayout title={pageTitle}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">{pageTitle}</h2>
          <p className="text-muted-foreground">
            {feedbacks?.length || 0} {t("feedback(s)", "feedback(s)")}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExportCSV} disabled={!feedbacks?.length}>
            <Download className="w-4 h-4 mr-2" />
            CSV
          </Button>
          <Button asChild size="sm">
            <Link to="/feedback/new">
              <Plus className="w-4 h-4 mr-2" />
              {t("Nouveau", "New")}
            </Link>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6 p-4 bg-muted/50 rounded-lg">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Filter className="w-4 h-4" />
          {t("Filtres:", "Filters:")}
        </div>

        {!defaultTeam && (
          <Select
            value={filters.team || "all"}
            onValueChange={(value) => setFilters(prev => ({ 
              ...prev, 
              team: value === "all" ? undefined : value as TeamType,
              teamMemberId: undefined,
            }))}
          >
            <SelectTrigger className="w-[140px] h-9">
              <SelectValue placeholder={t("Équipe", "Team")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("Toutes", "All")}</SelectItem>
              <SelectItem value="founders">Founders</SelectItem>
              <SelectItem value="sales">Sales</SelectItem>
              <SelectItem value="sav">SAV</SelectItem>
              <SelectItem value="onboarding">Onboarding</SelectItem>
            </SelectContent>
          </Select>
        )}

        <Select
          value={filters.teamMemberId || "all"}
          onValueChange={(value) => setFilters(prev => ({ 
            ...prev, 
            teamMemberId: value === "all" ? undefined : value,
          }))}
        >
          <SelectTrigger className="w-[150px] h-9">
            <SelectValue placeholder={t("Collaborateur", "Team Member")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("Tous", "All")}</SelectItem>
            {teamMembers?.map((member) => (
              <SelectItem key={member.id} value={member.id}>
                {member.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.criticality || "all"}
          onValueChange={(value) => setFilters(prev => ({ 
            ...prev, 
            criticality: value === "all" ? undefined : value as CriticalityLevel,
          }))}
        >
          <SelectTrigger className="w-[140px] h-9">
            <SelectValue placeholder={t("Criticité", "Criticality")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("Toutes", "All")}</SelectItem>
            <SelectItem value="critical">🔴 {t("Critique", "Critical")}</SelectItem>
            <SelectItem value="medium">🟡 {t("Moyenne", "Medium")}</SelectItem>
            <SelectItem value="low">🟢 {t("Basse", "Low")}</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.status || "all"}
          onValueChange={(value) => setFilters(prev => ({ 
            ...prev, 
            status: value === "all" ? undefined : value as FeedbackStatus,
          }))}
        >
          <SelectTrigger className="w-[140px] h-9">
            <SelectValue placeholder={t("Statut", "Status")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("Tous", "All")}</SelectItem>
            <SelectItem value="new">{t("Nouveau", "New")}</SelectItem>
            <SelectItem value="in_progress">{t("En cours", "In Progress")}</SelectItem>
            <SelectItem value="testing">{t("À tester", "Testing")}</SelectItem>
            <SelectItem value="resolved">{t("Résolu", "Resolved")}</SelectItem>
            <SelectItem value="closed">{t("Fermé", "Closed")}</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.feedbackCategory || "all"}
          onValueChange={(value) => setFilters(prev => ({ 
            ...prev, 
            feedbackCategory: value === "all" ? undefined : value as FeedbackCategory,
          }))}
        >
          <SelectTrigger className="w-[130px] h-9">
            <SelectValue placeholder={t("Catégorie", "Category")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("Toutes", "All")}</SelectItem>
            <SelectItem value="bug">🐛 Bug</SelectItem>
            <SelectItem value="feature">✨ Feature</SelectItem>
            <SelectItem value="bug_prod">🔥 Bug Prod</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.bugType || "all"}
          onValueChange={(value) => setFilters(prev => ({ 
            ...prev, 
            bugType: value === "all" ? undefined : value as BugType,
          }))}
        >
          <SelectTrigger className="w-[130px] h-9">
            <SelectValue placeholder={t("Type", "Type")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("Tous", "All")}</SelectItem>
            <SelectItem value="backend">Backend</SelectItem>
            <SelectItem value="frontend">Frontend</SelectItem>
            <SelectItem value="ai">AI</SelectItem>
            <SelectItem value="prompt">Prompt</SelectItem>
            <SelectItem value="mixed">{t("Mixte", "Mixed")}</SelectItem>
            <SelectItem value="other">{t("Autre", "Other")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* AI Merge Suggestions */}
      <AIMergeSuggestionsPanel />

      {/* Feedbacks List */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      ) : feedbacks && feedbacks.length > 0 ? (
        <div className="space-y-4">
          {feedbacks.map((feedback, index) => (
            <FeedbackCard key={feedback.id} feedback={feedback} index={index} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-muted rounded-xl">
          <p className="text-muted-foreground mb-4">
            {t("Aucun feedback trouvé", "No feedbacks found")}
          </p>
          <Button asChild>
            <Link to="/feedback/new">
              {t("Créer un feedback", "Create a feedback")}
            </Link>
          </Button>
        </div>
      )}
    </MainLayout>
  );
};

export default FeedbacksList;
