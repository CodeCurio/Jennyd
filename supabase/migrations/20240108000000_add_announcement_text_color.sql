-- Add announcement_bar_text_color column to site_settings
ALTER TABLE site_settings
ADD COLUMN IF NOT EXISTS announcement_bar_text_color TEXT DEFAULT '#ffffff';

-- Reload PostgREST schema cache
NOTIFY pgrst, 'reload schema';
