-- Add metadata JSONB column to products table to store complex PDP data
ALTER TABLE products ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- Create Storage Bucket for product images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Set up Storage Policies for product-images bucket

-- Allow public read access to product images
CREATE POLICY "Public read product images"
ON storage.objects FOR SELECT
USING ( bucket_id = 'product-images' );

-- Allow admins to insert product images
CREATE POLICY "Admin insert product images"
ON storage.objects FOR INSERT
WITH CHECK ( 
  bucket_id = 'product-images' 
  AND (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
);

-- Allow admins to update product images
CREATE POLICY "Admin update product images"
ON storage.objects FOR UPDATE
USING ( 
  bucket_id = 'product-images' 
  AND (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
);

-- Allow admins to delete product images
CREATE POLICY "Admin delete product images"
ON storage.objects FOR DELETE
USING ( 
  bucket_id = 'product-images' 
  AND (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
);
