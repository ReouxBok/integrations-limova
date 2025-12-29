import { supabase } from '@/integrations/supabase/client';

export interface PipedreamApp {
  slug: string;
  name: string;
  url?: string;
}

export interface PipedreamAction {
  name: string;
  description: string;
  githubUrl: string;
}

export interface PipedreamAppDetails {
  slug: string;
  name: string;
  description: string;
  category: string;
  actions: PipedreamAction[];
  sourceUrl: string;
}

export interface PipedreamResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export const pipedreamApi = {
  // Search for apps by name
  async searchApps(query: string): Promise<PipedreamResponse<PipedreamApp[]>> {
    if (!query || query.length < 2) {
      return { success: true, data: [] };
    }

    const { data, error } = await supabase.functions.invoke('pipedream-search', {
      body: { query },
    });

    if (error) {
      console.error('Search error:', error);
      return { success: false, error: error.message };
    }
    
    return data;
  },

  // Get app details with actions
  async getAppDetails(slug: string): Promise<PipedreamResponse<PipedreamAppDetails>> {
    if (!slug) {
      return { success: false, error: 'App slug is required' };
    }

    const { data, error } = await supabase.functions.invoke('pipedream-app-details', {
      body: { slug },
    });

    if (error) {
      console.error('Get details error:', error);
      return { success: false, error: error.message };
    }
    
    return data;
  },
};
