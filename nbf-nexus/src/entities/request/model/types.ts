export type RequestType = 'SCHEDULE_CHANGE' | 'PRESENTATION_SLOT';
export type RequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface Request {
  id: string;
  profile_id: string;
  type: RequestType;
  status: RequestStatus;
  title: string;
  description: string | null;
  metadata: Record<string, any>;
  admin_comment: string | null;
  created_at: string;
  updated_at: string;
}

export interface RequestWithTrainee extends Request {
  profile: {
    full_name: string | null;
    email: string;
  };
}
