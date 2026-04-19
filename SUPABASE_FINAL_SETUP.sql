-- NEST DEAL REALTY - MASTER DATABASE SETUP
-- This script creates all necessary tables and security policies.
-- Run this in your Supabase SQL Editor.

-- 1. EXTENSIONS (Required for UUIDs)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. PROPERTIES TABLE (Resale Properties)
CREATE TABLE IF NOT EXISTS properties (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    user_email TEXT,
    project_name TEXT,
    property_type TEXT,
    looking_to TEXT,
    city TEXT,
    locality TEXT,
    built_up_area NUMERIC,
    cost NUMERIC,
    bhk TEXT,
    furnishing TEXT,
    images TEXT[],
    description TEXT,
    status TEXT DEFAULT 'pending', -- pending, approved, rejected
    contact_name TEXT,
    contact_phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. PROJECTS TABLE (New Launches & Under Construction)
CREATE TABLE IF NOT EXISTS projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    user_email TEXT,
    name TEXT NOT NULL,
    developer TEXT NOT NULL,
    locality TEXT NOT NULL,
    city TEXT NOT NULL,
    property_type TEXT,
    construction_status TEXT,
    launch_date DATE,
    possession_date DATE,
    rera_id TEXT,
    rera_link TEXT,
    total_plot_area TEXT,
    total_units INTEGER,
    total_towers INTEGER,
    private_terrace_size TEXT, -- Added for Penthouse/Terrace options
    towers JSONB DEFAULT '[]',
    configurations JSONB DEFAULT '[]',
    amenities JSONB DEFAULT '[]',
    landmarks JSONB DEFAULT '[]',
    images JSONB DEFAULT '[]',
    brochure_url TEXT,
    video_url TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. HOME SLIDESHOW TABLE
CREATE TABLE IF NOT EXISTS home_slides (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    image_url TEXT NOT NULL,
    title TEXT,
    price TEXT,
    tag TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. VALUATIONS TABLE
CREATE TABLE IF NOT EXISTS valuations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT,
    email TEXT,
    phone TEXT,
    city TEXT,
    address TEXT,
    message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. LEADS TABLE
CREATE TABLE IF NOT EXISTS leads (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    property_id UUID REFERENCES properties(id),
    project_id UUID REFERENCES projects(id),
    name TEXT,
    email TEXT,
    phone TEXT,
    whatsapp TEXT,
    message TEXT,
    type TEXT DEFAULT 'inquiry', -- 'inquiry', 'brochure'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE home_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE valuations ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- 8. SECURITY POLICIES

-- Projects Policies
DROP POLICY IF EXISTS "Public can view approved projects" ON projects;
DROP POLICY IF EXISTS "Users can insert their own projects" ON projects;
DROP POLICY IF EXISTS "Admin can do everything projects" ON projects;
CREATE POLICY "Public can view approved projects" ON projects FOR SELECT USING (status = 'approved');
CREATE POLICY "Users can insert their own projects" ON projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admin can do everything projects" ON projects FOR ALL USING (auth.jwt() ->> 'email' = 'minecraftxbox1389@gmail.com');

-- Properties Policies
DROP POLICY IF EXISTS "Public can view approved properties" ON properties;
DROP POLICY IF EXISTS "Users can insert their own properties" ON properties;
DROP POLICY IF EXISTS "Admin can do everything properties" ON properties;
CREATE POLICY "Public can view approved properties" ON properties FOR SELECT USING (status = 'approved');
CREATE POLICY "Users can insert their own properties" ON properties FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admin can do everything properties" ON properties FOR ALL USING (auth.jwt() ->> 'email' = 'minecraftxbox1389@gmail.com');

-- Slides Policies
DROP POLICY IF EXISTS "Public can view slides" ON home_slides;
DROP POLICY IF EXISTS "Admin can manage slides" ON home_slides;
CREATE POLICY "Public can view slides" ON home_slides FOR SELECT USING (true);
CREATE POLICY "Admin can manage slides" ON home_slides FOR ALL USING (auth.jwt() ->> 'email' = 'minecraftxbox1389@gmail.com');

-- Admin bypass for other tables
DROP POLICY IF EXISTS "Admin can view all valuations" ON valuations;
DROP POLICY IF EXISTS "Admin can view all leads" ON leads;

CREATE POLICY "Admin can view all valuations" ON valuations FOR SELECT USING (auth.jwt() ->> 'email' = 'minecraftxbox1389@gmail.com');
CREATE POLICY "Public can submit leads" ON leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can view all leads" ON leads FOR SELECT USING (auth.jwt() ->> 'email' = 'minecraftxbox1389@gmail.com');
CREATE POLICY "Admin can delete leads" ON leads FOR DELETE USING (auth.jwt() ->> 'email' = 'minecraftxbox1389@gmail.com');

-- 9. NOTIFY CACHE REFRESH
NOTIFY pgrst, 'reload schema';
