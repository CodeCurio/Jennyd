-- Create fragrance_notes table
CREATE TABLE fragrance_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-update updated_at trigger for fragrance_notes
CREATE TRIGGER update_fragrance_notes_updated_at 
BEFORE UPDATE ON fragrance_notes 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies
ALTER TABLE fragrance_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read fragrance_notes" 
ON fragrance_notes FOR SELECT USING (true);

CREATE POLICY "Admin write fragrance_notes" 
ON fragrance_notes FOR ALL USING (is_admin());
