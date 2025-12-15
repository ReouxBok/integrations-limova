import { Link } from "react-router-dom";
import { Plus, AlertTriangle, CheckCircle, Clock, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import MainLayout from "@/components/layout/MainLayout";
import StatsCard from "@/components/dashboard/StatsCard";
import FeedbackCard from "@/components/feedbacks/FeedbackCard";
import FeedbackTimeChart from "@/components/charts/FeedbackTimeChart";
import FeedbacksByAgentChart from "@/components/charts/FeedbacksByAgentChart";
import CriticalityPieChart from "@/components/charts/CriticalityPieChart";
import TeamComparisonChart from "@/components/charts/TeamComparisonChart";
import { useFeedbacks } from "@/hooks/useFeedbacks";
import { useFeedbackStats } from "@/hooks/useFeedbackStats";
import { useLanguage } from "@/contexts/LanguageContext";

const Dashboard = () => {
  const { t } = useLanguage();
  const { data: feedbacks, isLoading: feedbacksLoading } = useFeedbacks();
  const { data: stats, isLoading: statsLoading } = useFeedbackStats();

  const recentFeedbacks = feedbacks?.slice(0, 5) || [];

  return (
    <MainLayout title={t("Tableau de bord", "Dashboard")}>
      {/* Header with CTA */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            {t("Vue d'ensemble", "Overview")}
          </h2>
          <p className="text-muted-foreground">
            {t("Suivez les retours clients en temps réel", "Track customer feedback in real-time")}
          </p>
        </div>
        <Button asChild size="lg" className="gap-2">
          <Link to="/feedback/new">
            <Plus className="w-5 h-5" />
            {t("Nouveau feedback", "New Feedback")}
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statsLoading ? (
          <>
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </>
        ) : (
          <>
            <StatsCard
              title={t("Total Feedbacks", "Total Feedbacks")}
              value={stats?.total || 0}
              icon={MessageSquare}
              trend={stats?.trend}
              trendLabel={t("vs semaine dernière", "vs last week")}
              index={0}
            />
            <StatsCard
              title={t("Critiques", "Critical")}
              value={stats?.byCriticality.critical || 0}
              icon={AlertTriangle}
              className="border-red-500/20"
              index={1}
            />
            <StatsCard
              title={t("En cours", "In Progress")}
              value={stats?.byStatus.in_progress || 0}
              icon={Clock}
              index={2}
            />
            <StatsCard
              title={t("Résolus", "Resolved")}
              value={stats?.byStatus.resolved || 0}
              icon={CheckCircle}
              index={3}
            />
          </>
        )}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <FeedbackTimeChart />
        <FeedbacksByAgentChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <CriticalityPieChart />
        <TeamComparisonChart />
      </div>

      {/* Recent Feedbacks */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-foreground">
            {t("Feedbacks récents", "Recent Feedbacks")}
          </h3>
          <Link
            to="/feedbacks"
            className="text-sm font-medium text-accent hover:text-accent/80 transition-colors"
          >
            {t("Voir tout", "View all")}
          </Link>
        </div>

        {feedbacksLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        ) : recentFeedbacks.length > 0 ? (
          <div className="space-y-4">
            {recentFeedbacks.map((feedback, index) => (
              <FeedbackCard key={feedback.id} feedback={feedback} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-muted rounded-xl">
            <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">
              {t("Aucun feedback pour le moment", "No feedbacks yet")}
            </p>
            <Button asChild>
              <Link to="/feedback/new">
                {t("Ajouter le premier feedback", "Add the first feedback")}
              </Link>
            </Button>
          </div>
        )}
      </section>
    </MainLayout>
  );
};

export default Dashboard;
