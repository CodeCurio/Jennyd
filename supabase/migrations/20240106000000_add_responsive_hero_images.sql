-- Add responsive image columns to hero_slides
ALTER TABLE hero_slides
ADD COLUMN IF NOT EXISTS tablet_image_url TEXT,
ADD COLUMN IF NOT EXISTS mobile_image_url TEXT;
