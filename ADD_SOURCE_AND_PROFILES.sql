-- 1. Create Profiles Table if it doesn't exist
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    full_name TEXT,
    phone TEXT,
    email TEXT,
    enroll_code TEXT UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Add Source Details columns to properties
ALTER TABLE properties ADD COLUMN IF NOT EXISTS source_name TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS source_number TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS source_email TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS source_enroll_code TEXT;

-- 3. Add Source Details columns to projects
ALTER TABLE projects ADD COLUMN IF NOT EXISTS source_name TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS source_number TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS source_email TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS source_enroll_code TEXT;

-- 4. Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 5. Policies for profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Admin can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admin can update all profiles" ON profiles;

CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admin can view all profiles" ON profiles FOR SELECT USING (auth.jwt() ->> 'email' = 'minecraftxbox1389@gmail.com');
CREATE POLICY "Admin can update all profiles" ON profiles FOR UPDATE USING (auth.jwt() ->> 'email' = 'minecraftxbox1389@gmail.com');
CREATE POLICY "Admin can insert profiles" ON profiles FOR INSERT WITH CHECK (auth.jwt() ->> 'email' = 'minecraftxbox1389@gmail.com');
CREATE POLICY "Public can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- 6. Trigger to create profile on signup (optional, but good practice)
-- Note: Already handles in React code usually, but SQL is safer.
