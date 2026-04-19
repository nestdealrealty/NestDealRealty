-- Create Projects Table for "Under Construction" or "New" projects
CREATE TABLE IF NOT EXISTS projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    user_email TEXT,
    
    -- Basic Details
    name TEXT NOT NULL,
    developer TEXT NOT NULL,
    locality TEXT NOT NULL,
    city TEXT NOT NULL,
    property_type TEXT, -- Flat, Villa, etc.
    construction_status TEXT, -- New Launch, Under Construction, Ready
    
    -- Timeline
    launch_date DATE,
    possession_date DATE,
    
    -- RERA
    rera_id TEXT,
    rera_link TEXT,
    
    -- Scale
    total_plot_area TEXT,
    total_units INTEGER,
    total_towers INTEGER,
    
    -- JSON Data for complex nested structures
    towers JSONB DEFAULT '[]', -- Tower details
    configurations JSONB DEFAULT '[]', -- BHK configurations, areas, prices
    amenities JSONB DEFAULT '[]',
    landmarks JSONB DEFAULT '[]',
    
    -- Media
    images JSONB DEFAULT '[]', -- Categorized images
    brochure_url TEXT,
    video_url TEXT,
    
    -- Admin
    status TEXT DEFAULT 'pending', -- pending, approved, rejected
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Cleanup existing policies to avoid "already exists" errors
DROP POLICY IF EXISTS "Public can view approved projects" ON projects;
DROP POLICY IF EXISTS "Users can view their own projects" ON projects;
DROP POLICY IF EXISTS "Users can insert their own projects" ON projects;
DROP POLICY IF EXISTS "Users can update their own projects" ON projects;
DROP POLICY IF EXISTS "Admin can do everything" ON projects;

-- Create Policies
CREATE POLICY "Public can view approved projects" ON projects FOR SELECT USING (status = 'approved');
CREATE POLICY "Users can view their own projects" ON projects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own projects" ON projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own projects" ON projects FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admin can do everything" ON projects FOR ALL USING (auth.jwt() ->> 'email' = 'minecraftxbox1389@gmail.com');
