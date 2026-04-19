-- FIX LEADS TABLE AND PERMISSIONS
-- Run this in your Supabase SQL Editor

-- 1. Ensure columns exist and are nullable
ALTER TABLE leads ADD COLUMN IF NOT EXISTS project_id UUID REFERENCES projects(id);
ALTER TABLE leads ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'inquiry';
ALTER TABLE leads ALTER COLUMN email DROP NOT NULL; -- Allow leads without email
ALTER TABLE leads ALTER COLUMN whatsapp DROP NOT NULL;
ALTER TABLE leads ALTER COLUMN message DROP NOT NULL;

-- 2. Drop existing restrictive policies
DROP POLICY IF EXISTS "Enable insert for everyone" ON leads;
DROP POLICY IF EXISTS "Public can submit leads" ON leads;
DROP POLICY IF EXISTS "Admin can view all leads" ON leads;

-- 3. Enable RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- 4. Create Public Insert Policy (This is what fixes the "Something went wrong" error)
CREATE POLICY "Public can submit leads" 
ON leads FOR INSERT 
WITH CHECK (true);

-- 5. Create Admin View Policy
CREATE POLICY "Admin can view all leads" 
ON leads FOR SELECT 
USING (auth.jwt() ->> 'email' = 'minecraftxbox1389@gmail.com');

-- 6. Refresh schema
NOTIFY pgrst, 'reload schema';
