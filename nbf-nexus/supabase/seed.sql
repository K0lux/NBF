-- Seed Profiles
INSERT INTO profiles (id, clerk_id, full_name, email, specialty, intern_type, role)
VALUES 
('user_admin_001', 'user_admin_001', 'System Administrator', 'admin@nbf.nexus', 'DEV', 'ON_SITE', 'admin'),
('user_trainee_001', 'user_trainee_001', 'Alice Trainee', 'alice@nbf.nexus', 'AI', 'ON_SITE', 'trainee'),
('user_trainee_002', 'user_trainee_002', 'Bob Trainee', 'bob@nbf.nexus', 'DEV', 'REMOTE', 'trainee'),
('user_trainee_003', 'user_trainee_003', 'Charlie Trainee', 'charlie@nbf.nexus', 'NET_SEC', 'HYBRID', 'trainee');

-- Seed Schedules
INSERT INTO schedules (profile_id, scheduled_date, status)
VALUES 
('user_trainee_001', CURRENT_DATE, 'PLANNED'),
('user_trainee_001', CURRENT_DATE + INTERVAL '1 day', 'PLANNED'),
('user_trainee_002', CURRENT_DATE, 'PLANNED'),
('user_trainee_003', CURRENT_DATE, 'PLANNED');

-- Seed Attendances (for today)
INSERT INTO attendances (schedule_id, profile_id, check_in_at, check_in_method)
SELECT id, profile_id, NOW(), 'QR_CODE'
FROM schedules
WHERE scheduled_date = CURRENT_DATE AND profile_id = 'user_trainee_001';
