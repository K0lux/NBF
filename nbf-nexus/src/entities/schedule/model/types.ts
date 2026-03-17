import { Trainee } from "@/entities/trainee/model/types";

export type ScheduleStatus = 'PLANNED' | 'CONFIRMED' | 'CANCELLED_BY_ADMIN' | 'CANCELLED_BY_USER';

export interface Schedule {
  id: string;
  profile_id: string;
  scheduled_date: string; // ISO Date string (YYYY-MM-DD)
  status: ScheduleStatus;
  created_at: string;
}

export interface ScheduleWithTrainee extends Schedule {
  profile: Pick<Trainee, 'id' | 'full_name' | 'email' | 'specialty'>;
}
