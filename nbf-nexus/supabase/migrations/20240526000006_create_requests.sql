-- Requests table for schedule changes and presentation slots
CREATE TABLE requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('SCHEDULE_CHANGE', 'PRESENTATION_SLOT')),
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
    title TEXT NOT NULL,
    description TEXT,
    -- For schedule changes, we might want to store metadata like the target date
    metadata JSONB DEFAULT '{}'::jsonb,
    admin_comment TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Admins can view and manage all requests"
ON requests FOR ALL 
TO authenticated 
USING (auth.jwt() ->> 'user_role' = 'admin');

CREATE POLICY "Users can view and create their own requests"
ON requests FOR SELECT 
TO authenticated 
USING (auth.uid()::TEXT = profile_id);

CREATE POLICY "Users can insert their own requests"
ON requests FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid()::TEXT = profile_id);

-- Trigger for updated_at
CREATE TRIGGER set_requests_updated_at
BEFORE UPDATE ON requests
FOR EACH ROW
EXECUTE FUNCTION handle_updated_at();

-- Note: No need to redefine handle_updated_at if it was defined in previous migrations.
