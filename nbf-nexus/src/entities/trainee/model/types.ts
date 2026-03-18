export type Specialty = 'DEV' | 'AI' | 'NET_SEC';
export type InternType = 'ON_SITE' | 'REMOTE' | 'HYBRID';
export type UserRole = 'admin' | 'trainee';

export interface Trainee {
  id: string;
  clerk_id: string;
  full_name: string | null;
  email: string;
  specialty: Specialty | null;
  intern_type: InternType;
  start_date: string | null;
  end_date: string | null;
  role: UserRole;
  access_level?: string;
  is_archived?: boolean;
  archived_at?: string | null;
  admin_notes?: string | null;
  created_at: string;
  updated_at: string;
}
