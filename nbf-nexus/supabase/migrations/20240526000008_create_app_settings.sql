CREATE TABLE IF NOT EXISTS app_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  workspace_latitude DOUBLE PRECISION NOT NULL DEFAULT 33.5731,
  workspace_longitude DOUBLE PRECISION NOT NULL DEFAULT -7.5898,
  geofence_radius_meters INTEGER NOT NULL DEFAULT 200,
  require_geolocation_on_site BOOLEAN NOT NULL DEFAULT true,
  allow_hybrid_if_assigned BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT app_settings_single_row CHECK (id = 1)
);

INSERT INTO app_settings (id)
VALUES (1)
ON CONFLICT (id) DO NOTHING;

CREATE TRIGGER set_app_settings_updated_at
BEFORE UPDATE ON app_settings
FOR EACH ROW
EXECUTE FUNCTION handle_updated_at();
