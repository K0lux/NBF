import { supabase } from '@/shared/api/supabase';
import { Schedule, ScheduleWithTrainee } from '../model/types';

export const scheduleApi = {
  async getSchedulesByMonth(year: number, month: number): Promise<ScheduleWithTrainee[]> {
    // month is 0-indexed (0-11)
    const startDate = new Date(year, month, 1).toISOString().split('T')[0];
    const endDate = new Date(year, month + 1, 0).toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('schedules')
      .select(`
        *,
        profile:profiles(id, full_name, email, specialty)
      `)
      .gte('scheduled_date', startDate)
      .lte('scheduled_date', endDate)
      .order('scheduled_date', { ascending: true });

    if (error) {
      console.error('Error fetching schedules:', error);
      throw new Error('Failed to fetch schedules');
    }

    return data as unknown as ScheduleWithTrainee[];
  },

  async createScheduleEntry(profileId: string, date: string): Promise<Schedule> {
    const { data, error } = await supabase
      .from('schedules')
      .insert({
        profile_id: profileId,
        scheduled_date: date,
        status: 'PLANNED',
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating schedule entry:', error);
      throw new Error('Failed to create schedule entry');
    }

    return data as Schedule;
  },

  async deleteScheduleEntry(scheduleId: string): Promise<void> {
    const { error } = await supabase
      .from('schedules')
      .delete()
      .eq('id', scheduleId);

    if (error) {
      console.error('Error deleting schedule entry:', error);
      throw new Error('Failed to delete schedule entry');
    }
  },
};
