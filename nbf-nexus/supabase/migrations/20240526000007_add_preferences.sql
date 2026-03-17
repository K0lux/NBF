-- Add language and preferences to profiles
ALTER TABLE profiles 
ADD COLUMN language TEXT NOT NULL DEFAULT 'fr' CHECK (language IN ('en', 'fr')),
ADD COLUMN preferences JSONB NOT NULL DEFAULT '{"notifications": true, "theme": "system"}'::jsonb;
