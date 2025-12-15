import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type TeamType = "sav" | "onboarding" | "founders" | "sales";

export interface TeamMember {
  id: string;
  name: string;
  team: TeamType;
  is_manager: boolean;
  is_active: boolean;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export const useTeamMembers = (team?: TeamType) => {
  return useQuery({
    queryKey: ["team-members", team],
    queryFn: async () => {
      let query = supabase
        .from("team_members")
        .select("*")
        .eq("is_active", true);

      if (team) {
        // When team is selected: sort by manager first, then alphabetically
        query = query
          .eq("team", team)
          .order("is_manager", { ascending: false })
          .order("name");
      } else {
        // When no team selected: sort by team first, then manager, then alphabetically
        query = query
          .order("team")
          .order("is_manager", { ascending: false })
          .order("name");
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as TeamMember[];
    },
  });
};

export const useTeamMember = (id: string) => {
  return useQuery({
    queryKey: ["team-member", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("team_members")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      return data as TeamMember | null;
    },
    enabled: !!id,
  });
};
