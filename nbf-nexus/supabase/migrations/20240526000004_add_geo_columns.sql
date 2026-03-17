-- Add geolocation columns to attendances table
ALTER TABLE attendances 
ADD COLUMN IF NOT EXISTS check_in_lat DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS check_in_long DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS check_out_lat DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS check_out_long DOUBLE PRECISION;

-- Note: We might also want to store the "authorized" location for the workspace
-- in a separate configuration table or as metadata on the schedules table.
