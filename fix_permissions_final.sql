-- Create the home_slides table --
-- 1. Create table if not exists
CREATE TABLE IF NOT EXISTS home_slides (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    image_url TEXT NOT NULL,
    title TEXT,
    price TEXT,
    tag TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Enable Row Level Security
ALTER TABLE home_slides ENABLE ROW LEVEL SECURITY;

-- 3. DROP ALL EXISTING POLICIES TO AVOID CONFLICTS
DROP POLICY IF EXISTS "Public can view home slides" ON home_slides;
DROP POLICY IF EXISTS "Admin can insert home slides" ON home_slides;
DROP POLICY IF EXISTS "Admin can update home slides" ON home_slides;
DROP POLICY IF EXISTS "Admin can delete home slides" ON home_slides;

-- 4. Re-create policies
-- Public Read
CREATE POLICY "Public can view home slides" ON home_slides FOR SELECT USING (true);

-- Admin Write (Update email if needed)
CREATE POLICY "Admin can insert home slides" ON home_slides FOR INSERT WITH CHECK (auth.jwt() ->> 'email' = 'minecraftxbox1389@gmail.com');
CREATE POLICY "Admin can update home slides" ON home_slides FOR UPDATE USING (auth.jwt() ->> 'email' = 'minecraftxbox1389@gmail.com');
CREATE POLICY "Admin can delete home slides" ON home_slides FOR DELETE USING (auth.jwt() ->> 'email' = 'minecraftxbox1389@gmail.com');


-- STORAGE POLICIES --
-- 5. Drop existing Storage Policies to avoid "already exists" error
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
DROP POLICY IF EXISTS "Admin Delete" ON storage.objects;

-- 6. Create Storage Policies
-- Allow PUBLIC READ access (so everyone sees images)
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'property-images' );

-- Allow AUTHENTICATED USERS to UPLOAD
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'property-images' AND
  auth.role() = 'authenticated'
);

-- Allow Admin to DELETE (Optional)
CREATE POLICY "Admin Delete"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'property-images' AND
  auth.jwt() ->> 'email' = 'minecraftxbox1389@gmail.com'
);
