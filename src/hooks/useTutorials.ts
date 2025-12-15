import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';

type ContentType = Database['public']['Enums']['content_type'];

export interface Tutorial {
  id: string;
  agent_id: string | null;
  title_fr: string;
  title_en: string;
  description_fr: string | null;
  description_en: string | null;
  content_type: ContentType;
  duration: string | null;
  content_url: string | null;
  arcade_embed_url: string | null;
  text_content_fr: string | null;
  text_content_en: string | null;
  is_published: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
  agents?: {
    name: string;
    avatar_url: string | null;
  };
}

export const useTutorials = (publishedOnly = true) => {
  return useQuery({
    queryKey: ['tutorials', publishedOnly],
    queryFn: async () => {
      let query = supabase
        .from('tutorials')
        .select('*, agents(name, avatar_url)')
        .order('created_at', { ascending: false });
      
      if (publishedOnly) {
        query = query.eq('is_published', true);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as Tutorial[];
    },
  });
};

export const useTutorialsByAgent = (agentId: string, publishedOnly = true) => {
  return useQuery({
    queryKey: ['tutorials', 'agent', agentId, publishedOnly],
    queryFn: async () => {
      let query = supabase
        .from('tutorials')
        .select('*, agents(name, avatar_url)')
        .eq('agent_id', agentId)
        .order('created_at', { ascending: false });
      
      if (publishedOnly) {
        query = query.eq('is_published', true);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as Tutorial[];
    },
    enabled: !!agentId,
  });
};

export const useTutorial = (id: string) => {
  return useQuery({
    queryKey: ['tutorials', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tutorials')
        .select('*, agents(name, avatar_url)')
        .eq('id', id)
        .maybeSingle();
      
      if (error) throw error;
      return data as Tutorial | null;
    },
    enabled: !!id,
  });
};

export const useCreateTutorial = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (tutorial: Omit<Tutorial, 'id' | 'created_at' | 'updated_at' | 'agents'>) => {
      const { data, error } = await supabase
        .from('tutorials')
        .insert(tutorial)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tutorials'] });
      queryClient.invalidateQueries({ queryKey: ['agents'] });
      toast({ title: 'Tutoriel créé avec succès' });
    },
    onError: (error) => {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    },
  });
};

export const useUpdateTutorial = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...tutorial }: Partial<Tutorial> & { id: string }) => {
      const { data, error } = await supabase
        .from('tutorials')
        .update(tutorial)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tutorials'] });
      toast({ title: 'Tutoriel mis à jour avec succès' });
    },
    onError: (error) => {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    },
  });
};

export const useDeleteTutorial = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('tutorials')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tutorials'] });
      queryClient.invalidateQueries({ queryKey: ['agents'] });
      toast({ title: 'Tutoriel supprimé avec succès' });
    },
    onError: (error) => {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    },
  });
};

export const useIncrementTutorialView = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.rpc('increment_tutorial_view', { tutorial_id: id });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tutorials'] });
    },
  });
};
