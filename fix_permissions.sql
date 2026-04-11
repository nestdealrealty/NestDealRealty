-- Create the home_slides table if it doesn't exist
CREATE TABLE IF NOT EXISTS home_slides (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    image_url TEXT NOT NULL,
    title TEXT,
    price TEXT,
    tag TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE home_slides ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts if re-running
DROP POLICY IF EXISTS "Public can view home slides" ON home_slides;
DROP POLICY IF EXISTS "Admin can insert home slides" ON home_slides;
DROP POLICY IF EXISTS "Admin can update home slides" ON home_slides;
DROP POLICY IF EXISTS "Admin can delete home slides" ON home_slides;
DROP POLICY IF EXISTS "Public can upload images" ON storage.objects;

-- Create policy for public read access
CREATE POLICY "Public can view home slides" ON home_slides
    FOR SELECT USING (true);

-- Create policies for admin write access (create, update, delete)
CREATE POLICY "Admin can insert home slides" ON home_slides
    FOR INSERT WITH CHECK (auth.jwt() ->> 'email' = 'minecraftxbox1389@gmail.com');

CREATE POLICY "Admin can update home slides" ON home_slides
    FOR UPDATE USING (auth.jwt() ->> 'email' = 'minecraftxbox1389@gmail.com');

CREATE POLICY "Admin can delete home slides" ON home_slides
    FOR DELETE USING (auth.jwt() ->> 'email' = 'minecraftxbox1389@gmail.com');

-- --- STORAGE POLICIES ---
-- Ensure the storage bucket exists (this usually needs to be done in UI, but we can set policies)
-- Assuming bucket 'property-images' exists.

-- Allow PUBLIC read access to storage (so images can be seen)
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'property-images' );

-- Allow AUTHENTICATED users (like Admin) to Upload
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'property-images' AND
  auth.role() = 'authenticated'
);

-- Allow Admin to Delete (optional, good for cleanup)
CREATE POLICY "Admin Delete"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'property-images' AND
  auth.jwt() ->> 'email' = 'minecraftxbox1389@gmail.com'
);
