export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      agents: {
        Row: {
          avatar_url: string | null
          created_at: string
          description_en: string
          description_fr: string
          id: string
          name: string
          tutorial_count: number | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          description_en: string
          description_fr: string
          id?: string
          name: string
          tutorial_count?: number | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          description_en?: string
          description_fr?: string
          id?: string
          name?: string
          tutorial_count?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      content_requests: {
        Row: {
          admin_response: string | null
          agent_id: string | null
          created_at: string
          description: string
          email: string
          first_name: string
          id: string
          is_general: boolean | null
          last_name: string
          notified_at: string | null
          phone: string | null
          status: Database["public"]["Enums"]["content_request_status"] | null
          updated_at: string
        }
        Insert: {
          admin_response?: string | null
          agent_id?: string | null
          created_at?: string
          description: string
          email: string
          first_name: string
          id?: string
          is_general?: boolean | null
          last_name: string
          notified_at?: string | null
          phone?: string | null
          status?: Database["public"]["Enums"]["content_request_status"] | null
          updated_at?: string
        }
        Update: {
          admin_response?: string | null
          agent_id?: string | null
          created_at?: string
          description?: string
          email?: string
          first_name?: string
          id?: string
          is_general?: boolean | null
          last_name?: string
          notified_at?: string | null
          phone?: string | null
          status?: Database["public"]["Enums"]["content_request_status"] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_requests_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      feedbacks: {
        Row: {
          admin_notes: string | null
          agent_id: string | null
          assigned_developer: string | null
          bug_type: Database["public"]["Enums"]["bug_type"] | null
          client_email: string
          client_sector: string | null
          company_size: Database["public"]["Enums"]["company_size"] | null
          created_at: string | null
          created_by: string | null
          criticality: Database["public"]["Enums"]["criticality_level"]
          date: string
          description: string
          feedback_category:
            | Database["public"]["Enums"]["feedback_category"]
            | null
          follow_up_notes: string | null
          hubspot_link: string | null
          id: string
          is_global: boolean | null
          is_mandatory: boolean | null
          jam_link: string | null
          merged_into_id: string | null
          priority: Database["public"]["Enums"]["priority_level"] | null
          resolved_at: string | null
          resolved_by: string | null
          secondary_jam_link: string | null
          status: Database["public"]["Enums"]["feedback_status"] | null
          team_member_id: string | null
          updated_at: string | null
        }
        Insert: {
          admin_notes?: string | null
          agent_id?: string | null
          assigned_developer?: string | null
          bug_type?: Database["public"]["Enums"]["bug_type"] | null
          client_email: string
          client_sector?: string | null
          company_size?: Database["public"]["Enums"]["company_size"] | null
          created_at?: string | null
          created_by?: string | null
          criticality: Database["public"]["Enums"]["criticality_level"]
          date?: string
          description: string
          feedback_category?:
            | Database["public"]["Enums"]["feedback_category"]
            | null
          follow_up_notes?: string | null
          hubspot_link?: string | null
          id?: string
          is_global?: boolean | null
          is_mandatory?: boolean | null
          jam_link?: string | null
          merged_into_id?: string | null
          priority?: Database["public"]["Enums"]["priority_level"] | null
          resolved_at?: string | null
          resolved_by?: string | null
          secondary_jam_link?: string | null
          status?: Database["public"]["Enums"]["feedback_status"] | null
          team_member_id?: string | null
          updated_at?: string | null
        }
        Update: {
          admin_notes?: string | null
          agent_id?: string | null
          assigned_developer?: string | null
          bug_type?: Database["public"]["Enums"]["bug_type"] | null
          client_email?: string
          client_sector?: string | null
          company_size?: Database["public"]["Enums"]["company_size"] | null
          created_at?: string | null
          created_by?: string | null
          criticality?: Database["public"]["Enums"]["criticality_level"]
          date?: string
          description?: string
          feedback_category?:
            | Database["public"]["Enums"]["feedback_category"]
            | null
          follow_up_notes?: string | null
          hubspot_link?: string | null
          id?: string
          is_global?: boolean | null
          is_mandatory?: boolean | null
          jam_link?: string | null
          merged_into_id?: string | null
          priority?: Database["public"]["Enums"]["priority_level"] | null
          resolved_at?: string | null
          resolved_by?: string | null
          secondary_jam_link?: string | null
          status?: Database["public"]["Enums"]["feedback_status"] | null
          team_member_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "feedbacks_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feedbacks_merged_into_id_fkey"
            columns: ["merged_into_id"]
            isOneToOne: false
            referencedRelation: "feedbacks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feedbacks_team_member_id_fkey"
            columns: ["team_member_id"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      team_members: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          is_manager: boolean | null
          name: string
          team: Database["public"]["Enums"]["team_type"]
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          is_manager?: boolean | null
          name: string
          team: Database["public"]["Enums"]["team_type"]
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          is_manager?: boolean | null
          name?: string
          team?: Database["public"]["Enums"]["team_type"]
          updated_at?: string | null
        }
        Relationships: []
      }
      tutorials: {
        Row: {
          agent_id: string | null
          arcade_embed_url: string | null
          content_type: Database["public"]["Enums"]["content_type"]
          content_url: string | null
          created_at: string
          description_en: string | null
          description_fr: string | null
          duration: string | null
          id: string
          is_published: boolean | null
          text_content_en: string | null
          text_content_fr: string | null
          title_en: string
          title_fr: string
          updated_at: string
          view_count: number
        }
        Insert: {
          agent_id?: string | null
          arcade_embed_url?: string | null
          content_type?: Database["public"]["Enums"]["content_type"]
          content_url?: string | null
          created_at?: string
          description_en?: string | null
          description_fr?: string | null
          duration?: string | null
          id?: string
          is_published?: boolean | null
          text_content_en?: string | null
          text_content_fr?: string | null
          title_en: string
          title_fr: string
          updated_at?: string
          view_count?: number
        }
        Update: {
          agent_id?: string | null
          arcade_embed_url?: string | null
          content_type?: Database["public"]["Enums"]["content_type"]
          content_url?: string | null
          created_at?: string
          description_en?: string | null
          description_fr?: string | null
          duration?: string | null
          id?: string
          is_published?: boolean | null
          text_content_en?: string | null
          text_content_fr?: string | null
          title_en?: string
          title_fr?: string
          updated_at?: string
          view_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "tutorials_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      increment_tutorial_view: {
        Args: { tutorial_id: string }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "user"
      bug_type: "backend" | "frontend" | "ai" | "prompt" | "mixed" | "other"
      company_size: "1-10" | "11-50" | "51-200" | "201-500" | "500+" | "unknown"
      content_request_status: "pending" | "approved" | "rejected" | "published"
      content_type: "video" | "text" | "document" | "image"
      criticality_level: "critical" | "medium" | "low"
      feedback_category: "bug" | "feature" | "bug_prod"
      feedback_status: "new" | "in_progress" | "testing" | "resolved" | "closed"
      priority_level: "urgent" | "high" | "medium" | "low"
      team_type: "sav" | "onboarding" | "founders" | "sales"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
      bug_type: ["backend", "frontend", "ai", "prompt", "mixed", "other"],
      company_size: ["1-10", "11-50", "51-200", "201-500", "500+", "unknown"],
      content_request_status: ["pending", "approved", "rejected", "published"],
      content_type: ["video", "text", "document", "image"],
      criticality_level: ["critical", "medium", "low"],
      feedback_category: ["bug", "feature", "bug_prod"],
      feedback_status: ["new", "in_progress", "testing", "resolved", "closed"],
      priority_level: ["urgent", "high", "medium", "low"],
      team_type: ["sav", "onboarding", "founders", "sales"],
    },
  },
} as const
