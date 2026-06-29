-- 1. Create a custom type for review status if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'review_status') THEN
    CREATE TYPE review_status AS ENUM ('pending', 'approved', 'rejected');
  END IF;
END $$;

-- 2. Alter the existing reviews table
ALTER TABLE reviews
  -- Drop the NOT NULL constraint on user_id to allow guest reviews (if it had one)
  ALTER COLUMN user_id DROP NOT NULL,
  
  -- Add new columns for guest information
  ADD COLUMN IF NOT EXISTS author_name TEXT,
  ADD COLUMN IF NOT EXISTS author_email TEXT,
  
  -- Add new column for status with default 'pending'
  ADD COLUMN IF NOT EXISTS status review_status DEFAULT 'pending',
  
  -- Add new column for storing array of media URLs (images/videos)
  ADD COLUMN IF NOT EXISTS media_urls TEXT[] DEFAULT '{}';

-- 3. Update existing reviews to be 'approved' by default so they don't disappear
UPDATE reviews SET status = 'approved' WHERE status = 'pending';

-- 4. Create the 'review-media' storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('review-media', 'review-media', true)
ON CONFLICT (id) DO NOTHING;

-- 5. Setup Storage Policies for the new bucket
-- Allow public access to read review media
DROP POLICY IF EXISTS "Review Media Public Access" ON storage.objects;
CREATE POLICY "Review Media Public Access" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'review-media');

-- Allow anyone (including guests) to upload to the review-media bucket
DROP POLICY IF EXISTS "Review Media Public Upload" ON storage.objects;
CREATE POLICY "Review Media Public Upload" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'review-media');
