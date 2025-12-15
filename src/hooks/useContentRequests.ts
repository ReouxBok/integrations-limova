import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';

type ContentRequestStatus = Database['public']['Enums']['content_request_status'];

export interface ContentRequest {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  description: string;
  agent_id: string | null;
  is_general: boolean;
  status: ContentRequestStatus;
  admin_response: string | null;
  notified_at: string | null;
  created_at: string;
  updated_at: string;
  agents?: {
    name: string;
  } | null;
}

export const useContentRequests = () => {
  return useQuery({
    queryKey: ['content-requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content_requests')
        .select('*, agents(name)')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as ContentRequest[];
    },
  });
};

export const useCreateContentRequest = () => {
  return useMutation({
    mutationFn: async (request: {
      first_name: string;
      last_name: string;
      email: string;
      phone?: string;
      description: string;
      agent_id?: string | null;
      is_general?: boolean;
    }) => {
      const { data, error } = await supabase
        .from('content_requests')
        .insert({
          first_name: request.first_name,
          last_name: request.last_name,
          email: request.email,
          phone: request.phone || null,
          description: request.description,
          agent_id: request.agent_id || null,
          is_general: request.is_general ?? (!request.agent_id),
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({ title: 'Demande envoyée', description: 'Nous vous contacterons dès que le contenu sera disponible.' });
    },
    onError: (error) => {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    },
  });
};

export const useUpdateContentRequestStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      id, 
      status, 
      admin_response,
      sendNotification = false 
    }: { 
      id: string; 
      status: ContentRequestStatus; 
      admin_response?: string;
      sendNotification?: boolean;
    }) => {
      const { data, error } = await supabase
        .from('content_requests')
        .update({ 
          status, 
          admin_response: admin_response || null,
          notified_at: sendNotification ? new Date().toISOString() : null 
        })
        .eq('id', id)
        .select('*, agents(name)')
        .single();
      
      if (error) throw error;
      
      // Send notification email if requested
      if (sendNotification && status === 'published') {
        const request = data as ContentRequest;
        await supabase.functions.invoke('send-content-notification', {
          body: {
            email: request.email,
            firstName: request.first_name,
            agentName: request.agents?.name || null,
            isGeneral: request.is_general,
          }
        });
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content-requests'] });
      toast({ title: 'Statut mis à jour' });
    },
    onError: (error) => {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    },
  });
};

export const useDeleteContentRequest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('content_requests')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content-requests'] });
      toast({ title: 'Demande supprimée' });
    },
    onError: (error) => {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    },
  });
};
