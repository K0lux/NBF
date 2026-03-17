-- Fix: Convert profile_id and related foreign keys from UUID to TEXT to support Clerk User IDs (which are strings).

-- 0. Drop policies that depend on the columns being altered
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;

DROP POLICY IF EXISTS "Admins can view and manage all schedules" ON schedules;
DROP POLICY IF EXISTS "Trainees can view their own schedule" ON schedules;

DROP POLICY IF EXISTS "Admins can manage all attendances" ON attendances;
DROP POLICY IF EXISTS "Trainees can view their own attendances" ON attendances;

-- 1. Drop existing foreign key constraints that depend on profiles.id (UUID)
ALTER TABLE schedules DROP CONSTRAINT IF EXISTS schedules_profile_id_fkey;
ALTER TABLE attendances DROP CONSTRAINT IF EXISTS attendances_profile_id_fkey;

-- 2. Change columns from UUID to TEXT
-- Note: Using USING id::TEXT to ensure the data is converted if any exists
ALTER TABLE profiles ALTER COLUMN id TYPE TEXT USING id::TEXT;
ALTER TABLE schedules ALTER COLUMN profile_id TYPE TEXT USING profile_id::TEXT;
ALTER TABLE attendances ALTER COLUMN profile_id TYPE TEXT USING profile_id::TEXT;

-- 3. Restore foreign key constraints
ALTER TABLE schedules 
ADD CONSTRAINT schedules_profile_id_fkey 
FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE attendances 
ADD CONSTRAINT attendances_profile_id_fkey 
FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- 4. Recreate RLS policies with TEXT comparison support
-- profiles
CREATE POLICY "Admins can view all profiles" 
ON profiles FOR SELECT 
TO authenticated 
USING (auth.jwt() ->> 'user_role' = 'admin');

CREATE POLICY "Users can view their own profile" 
ON profiles FOR SELECT 
TO authenticated 
USING (auth.uid()::TEXT = id);

CREATE POLICY "Admins can update all profiles" 
ON profiles FOR UPDATE 
TO authenticated 
USING (auth.jwt() ->> 'user_role' = 'admin');

-- schedules
CREATE POLICY "Admins can view and manage all schedules"
ON schedules FOR ALL 
TO authenticated 
USING (auth.jwt() ->> 'user_role' = 'admin');

CREATE POLICY "Trainees can view their own schedule"
ON schedules FOR SELECT 
TO authenticated 
USING (auth.uid()::TEXT = profile_id);

-- attendances
CREATE POLICY "Admins can manage all attendances"
ON attendances FOR ALL 
TO authenticated 
USING (auth.jwt() ->> 'user_role' = 'admin');

CREATE POLICY "Trainees can view their own attendances"
ON attendances FOR SELECT 
TO authenticated 
USING (auth.uid()::TEXT = profile_id);
