-- Table for trainee profiles, synchronized with Clerk
CREATE TABLE profiles (
    id UUID PRIMARY KEY, -- Same as Clerk User ID
    clerk_id TEXT UNIQUE NOT NULL,
    full_name TEXT,
    email TEXT UNIQUE NOT NULL,
    specialty TEXT CHECK (specialty IN ('DEV', 'AI', 'NET_SEC')),
    intern_type TEXT NOT NULL DEFAULT 'ON_SITE' CHECK (intern_type IN ('ON_SITE', 'REMOTE', 'HYBRID')),
    start_date DATE DEFAULT CURRENT_DATE,
    end_date DATE,
    role TEXT NOT NULL DEFAULT 'trainee' CHECK (role IN ('admin', 'trainee')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Row-Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all profiles" 
ON profiles FOR SELECT 
TO authenticated 
USING (auth.jwt() ->> 'user_role' = 'admin');

CREATE POLICY "Users can view their own profile" 
ON profiles FOR SELECT 
TO authenticated 
USING (auth.uid() = id);

CREATE POLICY "Admins can update all profiles" 
ON profiles FOR UPDATE 
TO authenticated 
USING (auth.jwt() ->> 'user_role' = 'admin');

-- Function to handle updated_at
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION handle_updated_at();
