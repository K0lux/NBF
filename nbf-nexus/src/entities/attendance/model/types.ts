export type AttendanceMethod = 'QR_CODE' | 'GEO' | 'MANUAL_ADMIN';

export interface Attendance {
  id: string;
  schedule_id: string;
  profile_id: string;
  check_in_at: string | null;
  check_out_at: string | null;
  check_in_method: AttendanceMethod | null;
  check_out_method: AttendanceMethod | null;
  check_in_lat: number | null;
  check_in_long: number | null;
  check_out_lat: number | null;
  check_out_long: number | null;
  updated_at: string;
}

export interface AttendanceTokenPayload {
  scheduleId: string;
  profileId: string;
  exp: number;
}
