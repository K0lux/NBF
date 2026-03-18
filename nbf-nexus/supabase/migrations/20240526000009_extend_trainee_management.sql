ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS is_archived BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS access_level TEXT NOT NULL DEFAULT 'trainee',
ADD COLUMN IF NOT EXISTS admin_notes TEXT;

CREATE TABLE IF NOT EXISTS trainee_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_trainee_groups_updated_at
BEFORE UPDATE ON trainee_groups
FOR EACH ROW
EXECUTE FUNCTION handle_updated_at();

CREATE TABLE IF NOT EXISTS trainee_group_members (
  group_id UUID NOT NULL REFERENCES trainee_groups(id) ON DELETE CASCADE,
  profile_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  added_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (group_id, profile_id)
);

CREATE INDEX IF NOT EXISTS idx_trainee_group_members_profile_id
ON trainee_group_members(profile_id);

CREATE TABLE IF NOT EXISTS message_broadcasts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scope TEXT NOT NULL CHECK (scope IN ('individual', 'group', 'bulk')),
  channels JSONB NOT NULL DEFAULT '[]'::jsonb,
  subject TEXT,
  body TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'sent', 'failed')),
  created_by TEXT REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS message_recipients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  broadcast_id UUID NOT NULL REFERENCES message_broadcasts(id) ON DELETE CASCADE,
  profile_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  channel TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'sent', 'failed')),
  error_message TEXT,
  sent_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_message_recipients_broadcast_id
ON message_recipients(broadcast_id);
