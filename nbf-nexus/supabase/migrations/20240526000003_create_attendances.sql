-- Attendance table linked to specific schedule slots
CREATE TABLE attendances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    schedule_id UUID UNIQUE NOT NULL REFERENCES schedules(id) ON DELETE CASCADE,
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    check_in_at TIMESTAMPTZ,
    check_out_at TIMESTAMPTZ,
    check_in_method TEXT CHECK (check_in_method IN ('QR_CODE', 'GEO', 'MANUAL_ADMIN')),
    check_out_method TEXT CHECK (check_out_method IN ('QR_CODE', 'GEO', 'MANUAL_ADMIN')),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE attendances ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Admins can manage all attendances"
ON attendances FOR ALL 
TO authenticated 
USING (auth.jwt() ->> 'user_role' = 'admin');

CREATE POLICY "Trainees can view their own attendances"
ON attendances FOR SELECT 
TO authenticated 
USING (auth.uid() = profile_id);

-- Note: In a production Supabase environment, you would run:
-- alter publication supabase_realtime add table attendances;
-- via the SQL Editor or as a separate script.

-- Trigger for updated_at
CREATE TRIGGER set_attendances_updated_at
BEFORE UPDATE ON attendances
FOR EACH ROW
EXECUTE FUNCTION handle_updated_at();

-- Indexes for performance
CREATE INDEX idx_attendances_profile_id ON attendances(profile_id);
CREATE INDEX idx_attendances_schedule_id ON attendances(schedule_id);
