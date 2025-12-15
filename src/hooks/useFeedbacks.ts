import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TeamType, TeamMember } from "./useTeamMembers";
import { Agent } from "./useAgents";

export type CriticalityLevel = "critical" | "medium" | "low";
export type FeedbackStatus = "new" | "in_progress" | "testing" | "resolved" | "closed";
export type CompanySize = "1-10" | "11-50" | "51-200" | "201-500" | "500+" | "unknown";
export type PriorityLevel = "urgent" | "high" | "medium" | "low";
export type BugType = "backend" | "frontend" | "ai" | "prompt" | "mixed" | "other";
export type FeedbackCategory = "bug" | "feature" | "bug_prod";

export interface Feedback {
  id: string;
  date: string;
  team_member_id: string | null;
  agent_id: string | null;
  is_global: boolean;
  criticality: CriticalityLevel;
  priority: PriorityLevel | null;
  description: string;
  client_email: string;
  client_sector: string | null;
  company_size: CompanySize;
  hubspot_link: string | null;
  status: FeedbackStatus;
  admin_notes: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  merged_into_id: string | null;
  resolved_at: string | null;
  resolved_by: string | null;
  jam_link: string | null;
  secondary_jam_link: string | null;
  assigned_developer: string | null;
  bug_type: BugType | null;
  feedback_category: FeedbackCategory | null;
  is_mandatory: boolean;
  follow_up_notes: string | null;
  team_member?: TeamMember;
  agent?: Agent;
  merged_feedbacks?: Feedback[];
}

export interface FeedbackFilters {
  team?: TeamType;
  criticality?: CriticalityLevel;
  status?: FeedbackStatus;
  teamMemberId?: string;
  agentId?: string;
  isGlobal?: boolean;
  dateFrom?: string;
  dateTo?: string;
  feedbackCategory?: FeedbackCategory;
  bugType?: BugType;
  assignedDeveloper?: string;
  isMandatory?: boolean;
}

export interface CreateFeedbackInput {
  date: string;
  team_member_id: string;
  criticality: CriticalityLevel;
  description: string;
  client_email: string;
  client_sector?: string;
  company_size?: CompanySize;
  hubspot_link?: string;
  agent_id?: string;
  is_global?: boolean;
  jam_link?: string;
  secondary_jam_link?: string;
  bug_type?: BugType;
  feedback_category?: FeedbackCategory;
  is_mandatory?: boolean;
}

export const useFeedbacks = (filters?: FeedbackFilters & { includeMerged?: boolean }) => {
  return useQuery({
    queryKey: ["feedbacks", filters],
    queryFn: async () => {
      let query = supabase
        .from("feedbacks")
        .select(`
          *,
          team_member:team_members(*),
          agent:agents(*)
        `)
        .order("date", { ascending: false })
        .order("created_at", { ascending: false });

      // By default, exclude merged feedbacks from the list
      if (!filters?.includeMerged) {
        query = query.is("merged_into_id", null);
      }

      if (filters?.criticality) {
        query = query.eq("criticality", filters.criticality);
      }
      if (filters?.status) {
        query = query.eq("status", filters.status);
      }
      if (filters?.teamMemberId) {
        query = query.eq("team_member_id", filters.teamMemberId);
      }
      if (filters?.dateFrom) {
        query = query.gte("date", filters.dateFrom);
      }
      if (filters?.dateTo) {
        query = query.lte("date", filters.dateTo);
      }
      if (filters?.feedbackCategory) {
        query = query.eq("feedback_category", filters.feedbackCategory);
      }
      if (filters?.bugType) {
        query = query.eq("bug_type", filters.bugType);
      }
      if (filters?.assignedDeveloper) {
        query = query.eq("assigned_developer", filters.assignedDeveloper);
      }
      if (filters?.isMandatory) {
        query = query.eq("is_mandatory", true);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Filter by team if needed (since it's a joined field)
      let result = data as Feedback[];
      if (filters?.team) {
        result = result.filter(f => f.team_member?.team === filters.team);
      }

      return result;
    },
  });
};

export const useFeedback = (id: string) => {
  return useQuery({
    queryKey: ["feedback", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("feedbacks")
        .select(`
          *,
          team_member:team_members(*),
          agent:agents(*)
        `)
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      return data as Feedback | null;
    },
    enabled: !!id,
  });
};

export const useCreateFeedback = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateFeedbackInput) => {
      console.log("useCreateFeedback: Starting mutation with input:", input);
      
      // Get user if authenticated (optional)
      const { data: { user } } = await supabase.auth.getUser();
      
      const insertData = {
        ...input,
        created_by: user?.id || null,
      };
      
      console.log("useCreateFeedback: Inserting data:", insertData);
      
      const { data, error } = await supabase
        .from("feedbacks")
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error("useCreateFeedback: Supabase error:", error);
        throw error;
      }
      
      console.log("useCreateFeedback: Successfully created:", data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feedbacks"] });
      queryClient.invalidateQueries({ queryKey: ["feedback-stats"] });
    },
  });
};

export const useUpdateFeedback = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Feedback> & { id: string }) => {
      const { data, error } = await supabase
        .from("feedbacks")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["feedbacks"] });
      queryClient.invalidateQueries({ queryKey: ["feedback", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["feedback-stats"] });
    },
  });
};

export const useDeleteFeedback = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("feedbacks")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feedbacks"] });
      queryClient.invalidateQueries({ queryKey: ["feedback-stats"] });
    },
  });
};
