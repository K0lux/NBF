import { supabase } from '@/shared/api/supabase';
import { Trainee } from '../model/types';

export const traineeApi = {
  async getTrainees(): Promise<Trainee[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('full_name', { ascending: true });

    if (error) {
      console.error('Error fetching trainees:', error);
      throw new Error('Failed to fetch trainees');
    }

    return data as Trainee[];
  },

  async updateTraineeMetadata(id: string, updates: Partial<Trainee>): Promise<Trainee> {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating trainee:', error);
      throw new Error('Failed to update trainee');
    }

    return data as Trainee;
  },

  async updateTraineeRole(id: string, role: 'admin' | 'trainee'): Promise<Trainee> {
    const { data, error } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating trainee role:', error);
      throw new Error('Failed to update trainee role');
    }

    return data as Trainee;
  },
};
