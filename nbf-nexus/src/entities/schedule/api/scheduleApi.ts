import { Schedule, ScheduleWithTrainee } from '../model/types';

export const scheduleApi = {
  async getSchedulesByMonth(year: number, month: number): Promise<ScheduleWithTrainee[]> {
    const response = await fetch(`/api/schedules?year=${year}&month=${month}`)
    if (!response.ok) {
      const message = await response.text()
      console.error('Error fetching schedules:', message);
      throw new Error('Failed to fetch schedules');
    }

    return (await response.json()) as unknown as ScheduleWithTrainee[];
  },

  async createScheduleEntry(profileId: string, date: string): Promise<Schedule> {
    const response = await fetch('/api/schedules', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profileId, date }),
    })
    if (!response.ok) {
      const message = await response.text()
      console.error('Error creating schedule entry:', message);
      throw new Error('Failed to create schedule entry');
    }

    return (await response.json()) as Schedule;
  },

  async deleteScheduleEntry(scheduleId: string): Promise<void> {
    const response = await fetch(`/api/schedules/${scheduleId}`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      const message = await response.text()
      console.error('Error deleting schedule entry:', message);
      throw new Error('Failed to delete schedule entry');
    }
  },
};
