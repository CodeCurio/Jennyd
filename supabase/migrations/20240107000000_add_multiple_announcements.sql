-- Add announcements JSONB column to site_settings
ALTER TABLE site_settings
ADD COLUMN IF NOT EXISTS announcements JSONB DEFAULT '[]'::jsonb;

-- Reload PostgREST schema cache
NOTIFY pgrst, 'reload schema';
