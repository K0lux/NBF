import { SupabaseClient } from '@supabase/supabase-js';
import { Request, RequestType, RequestStatus, RequestWithTrainee } from '../model/types';

export const requestApi = {
  async createRequest(
    supabase: SupabaseClient,
    profileId: string, 
    type: RequestType, 
    title: string, 
    description: string, 
    metadata: Record<string, any> = {}
  ): Promise<Request> {
    const { data, error } = await supabase
      .from('requests')
      .insert({
        profile_id: profileId,
        type,
        title,
        description,
        metadata,
      })
      .select()
      .single();

    if (error) {
      console.error('Error in requestApi:', error.message, error.details, error.hint);
      throw new Error(`Failed to process request: ${error.message}`);
    }

    return data as Request;
  },

  async getMyRequests(supabase: SupabaseClient, profileId: string): Promise<Request[]> {
    const { data, error } = await supabase
      .from('requests')
      .select('*')
      .eq('profile_id', profileId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error in requestApi:', error.message, error.details, error.hint);
      throw new Error(`Failed to process request: ${error.message}`);
    }

    return data as Request[];
  },

  async getAllRequests(supabase: SupabaseClient): Promise<RequestWithTrainee[]> {
    const { data, error } = await supabase
      .from('requests')
      .select(`
        *,
        profile:profiles(full_name, email)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error in requestApi:', error.message, error.details, error.hint);
      throw new Error(`Failed to process request: ${error.message}`);
    }

    return data as unknown as RequestWithTrainee[];
  },

  async updateRequestStatus(
    supabase: SupabaseClient,
    requestId: string, 
    status: RequestStatus, 
    adminComment?: string
  ): Promise<Request> {
    const { data, error } = await supabase
      .from('requests')
      .update({
        status,
        admin_comment: adminComment,
        updated_at: new Date().toISOString(),
      })
      .eq('id', requestId)
      .select()
      .single();

    if (error) {
      console.error('Error in requestApi:', error.message, error.details, error.hint);
      throw new Error(`Failed to process request: ${error.message}`);
    }

    return data as Request;
  },

  async updateAdminComment(
    supabase: SupabaseClient,
    requestId: string,
    adminComment: string
  ): Promise<Request> {
    const { data, error } = await supabase
      .from('requests')
      .update({
        admin_comment: adminComment,
        updated_at: new Date().toISOString(),
      })
      .eq('id', requestId)
      .select()
      .single();

    if (error) {
      console.error('Error in requestApi:', error.message, error.details, error.hint);
      throw new Error(`Failed to process request: ${error.message}`);
    }

    return data as Request;
  },
};
