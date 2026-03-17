import { supabase } from '@/shared/api/supabase';
import { Attendance, AttendanceMethod } from '../model/types';

export const attendanceApi = {
  async checkIn(
    scheduleId: string, 
    profileId: string, 
    method: AttendanceMethod, 
    coords?: { lat: number; long: number }
  ): Promise<Attendance> {
    const { data, error } = await supabase
      .from('attendances')
      .upsert({
        schedule_id: scheduleId,
        profile_id: profileId,
        check_in_at: new Date().toISOString(),
        check_in_method: method,
        check_in_lat: coords?.lat,
        check_in_long: coords?.long,
      })
      .select()
      .single();

    if (error) {
      console.error('Error checking in:', error);
      throw new Error('Failed to check in');
    }

    return data as Attendance;
  },

  async checkOut(
    attendanceId: string, 
    method: AttendanceMethod,
    coords?: { lat: number; long: number }
  ): Promise<Attendance> {
    const { data, error } = await supabase
      .from('attendances')
      .update({
        check_out_at: new Date().toISOString(),
        check_out_method: method,
        check_out_lat: coords?.lat,
        check_out_long: coords?.long,
      })
      .eq('id', attendanceId)
      .select()
      .single();

    if (error) {
      console.error('Error checking out:', error);
      throw new Error('Failed to check out');
    }

    return data as Attendance;
  },

  async getAttendanceByScheduleId(scheduleId: string): Promise<Attendance | null> {
    const { data, error } = await supabase
      .from('attendances')
      .select('*')
      .eq('schedule_id', scheduleId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching attendance:', error);
      throw new Error('Failed to fetch attendance');
    }

    return data as Attendance | null;
  },

  async getAttendanceByProfileId(profileId: string): Promise<Attendance[]> {
    const { data, error } = await supabase
      .from('attendances')
      .select('*')
      .eq('profile_id', profileId)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching attendances for profile:', error);
      throw new Error('Failed to fetch profile attendances');
    }

    return data as Attendance[];
  },

  async getAttendanceHistoryByProfileId(profileId: string): Promise<(Attendance & { schedule: { scheduled_date: string } })[]> {
    const { data, error } = await supabase
      .from('attendances')
      .select(`
        *,
        schedule:schedules(scheduled_date)
      `)
      .eq('profile_id', profileId)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching attendance history:', error);
      throw new Error('Failed to fetch attendance history');
    }

    return data as any;
  },

  async getTodayAttendances(): Promise<(Attendance & { profile: { full_name: string; specialty: string }; schedule: { scheduled_date: string } })[]> {
    const today = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('attendances')
      .select(`
        *,
        profile:profiles(full_name, specialty),
        schedule:schedules(scheduled_date)
      `)
      .eq('schedule.scheduled_date', today);

    if (error) {
      console.error('Error fetching today\'s attendances:', error);
      throw new Error('Failed to fetch today\'s attendances');
    }

    return data as any;
  },

  async getFilteredAttendances(filters: {
    startDate?: string;
    endDate?: string;
    profileId?: string;
    specialty?: string;
  }): Promise<(Attendance & { 
    profile: { full_name: string; specialty: string }; 
    schedule: { scheduled_date: string } 
  })[]> {
    let query = supabase
      .from('attendances')
      .select(`
        *,
        profile:profiles!inner(full_name, specialty),
        schedule:schedules!inner(scheduled_date)
      `);

    if (filters.startDate) {
      query = query.gte('schedule.scheduled_date', filters.startDate);
    }
    if (filters.endDate) {
      query = query.lte('schedule.scheduled_date', filters.endDate);
    }
    if (filters.profileId) {
      query = query.eq('profile_id', filters.profileId);
    }
    if (filters.specialty) {
      query = query.eq('profile.specialty', filters.specialty);
    }

    const { data, error } = await query.order('check_in_at', { ascending: false });

    if (error) {
      console.error('Error fetching filtered attendances:', error);
      throw new Error('Failed to fetch filtered attendances');
    }

    return data as any;
  },
};
