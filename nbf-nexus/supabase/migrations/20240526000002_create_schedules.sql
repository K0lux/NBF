-- Scheduling table linking profiles to dates
CREATE TABLE schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    scheduled_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'PLANNED' CHECK (status IN ('PLANNED', 'CONFIRMED', 'CANCELLED_BY_ADMIN', 'CANCELLED_BY_USER')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    -- Constraint: One trainee per day
    UNIQUE(profile_id, scheduled_date)
);

-- Row-Level Security (RLS)
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view and manage all schedules"
ON schedules FOR ALL 
TO authenticated 
USING (auth.jwt() ->> 'user_role' = 'admin');

CREATE POLICY "Trainees can view their own schedule"
ON schedules FOR SELECT 
TO authenticated 
USING (auth.uid() = profile_id);

-- Index for performance
CREATE INDEX idx_schedules_profile_id ON schedules(profile_id);
CREATE INDEX idx_schedules_scheduled_date ON schedules(scheduled_date);
