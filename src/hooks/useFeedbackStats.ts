import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { subDays, format } from "date-fns";

export interface FeedbackStats {
  total: number;
  byStatus: Record<string, number>;
  byCriticality: Record<string, number>;
  byTeam: Record<string, number>;
  thisWeek: number;
  lastWeek: number;
  trend: number;
}

export interface FeedbackByDate {
  date: string;
  count: number;
  critical: number;
  medium: number;
  low: number;
}

export interface FeedbackByLimovaAgent {
  name: string;
  count: number;
  critical: number;
  medium: number;
  low: number;
  isGlobal: boolean;
}

export const useFeedbackStats = () => {
  return useQuery({
    queryKey: ["feedback-stats"],
    queryFn: async () => {
      const { data: feedbacks, error } = await supabase
        .from("feedbacks")
        .select(`
          *,
          team_member:team_members(*)
        `);

      if (error) throw error;

      const today = new Date();
      const weekAgo = subDays(today, 7);
      const twoWeeksAgo = subDays(today, 14);

      const stats: FeedbackStats = {
        total: feedbacks.length,
        byStatus: {},
        byCriticality: {},
        byTeam: { sav: 0, onboarding: 0 },
        thisWeek: 0,
        lastWeek: 0,
        trend: 0,
      };

      feedbacks.forEach((feedback: any) => {
        // By status
        stats.byStatus[feedback.status] = (stats.byStatus[feedback.status] || 0) + 1;
        
        // By criticality
        stats.byCriticality[feedback.criticality] = (stats.byCriticality[feedback.criticality] || 0) + 1;
        
        // By team
        if (feedback.team_member?.team) {
          stats.byTeam[feedback.team_member.team] = (stats.byTeam[feedback.team_member.team] || 0) + 1;
        }

        // This week vs last week
        const feedbackDate = new Date(feedback.created_at);
        if (feedbackDate >= weekAgo) {
          stats.thisWeek++;
        } else if (feedbackDate >= twoWeeksAgo && feedbackDate < weekAgo) {
          stats.lastWeek++;
        }
      });

      // Calculate trend
      if (stats.lastWeek > 0) {
        stats.trend = Math.round(((stats.thisWeek - stats.lastWeek) / stats.lastWeek) * 100);
      } else if (stats.thisWeek > 0) {
        stats.trend = 100;
      }

      return stats;
    },
  });
};

export const useFeedbacksByDate = (days: number = 30) => {
  return useQuery({
    queryKey: ["feedbacks-by-date", days],
    queryFn: async () => {
      const startDate = format(subDays(new Date(), days), "yyyy-MM-dd");
      
      const { data: feedbacks, error } = await supabase
        .from("feedbacks")
        .select("date, criticality")
        .gte("date", startDate)
        .order("date");

      if (error) throw error;

      // Group by date
      const byDate: Record<string, FeedbackByDate> = {};
      
      // Initialize all dates in range
      for (let i = days; i >= 0; i--) {
        const date = format(subDays(new Date(), i), "yyyy-MM-dd");
        byDate[date] = { date, count: 0, critical: 0, medium: 0, low: 0 };
      }

      feedbacks.forEach((feedback: any) => {
        if (byDate[feedback.date]) {
          byDate[feedback.date].count++;
          byDate[feedback.date][feedback.criticality as keyof Omit<FeedbackByDate, 'date' | 'count'>]++;
        }
      });

      return Object.values(byDate);
    },
  });
};

export const useFeedbacksByLimovaAgent = () => {
  return useQuery({
    queryKey: ["feedbacks-by-limova-agent"],
    queryFn: async () => {
      const { data: feedbacks, error } = await supabase
        .from("feedbacks")
        .select(`
          criticality,
          is_global,
          agent:agents(id, name)
        `);

      if (error) throw error;

      // Group by Limova agent
      const byAgent: Record<string, FeedbackByLimovaAgent> = {};
      
      // Initialize global category
      byAgent["global"] = {
        name: "Plateforme globale",
        count: 0,
        critical: 0,
        medium: 0,
        low: 0,
        isGlobal: true,
      };

      feedbacks.forEach((feedback: any) => {
        if (feedback.is_global) {
          byAgent["global"].count++;
          byAgent["global"][feedback.criticality as keyof Omit<FeedbackByLimovaAgent, 'name' | 'count' | 'isGlobal'>]++;
        } else if (feedback.agent) {
          const key = feedback.agent.id;
          if (!byAgent[key]) {
            byAgent[key] = {
              name: feedback.agent.name,
              count: 0,
              critical: 0,
              medium: 0,
              low: 0,
              isGlobal: false,
            };
          }
          byAgent[key].count++;
          byAgent[key][feedback.criticality as keyof Omit<FeedbackByLimovaAgent, 'name' | 'count' | 'isGlobal'>]++;
        }
      });

      // Filter out entries with 0 count and sort
      return Object.values(byAgent)
        .filter(a => a.count > 0)
        .sort((a, b) => b.count - a.count);
    },
  });
};
