-- Create the site_assets table for UI management
CREATE TABLE IF NOT EXISTS site_assets (
    id SERIAL PRIMARY KEY,
    asset_key TEXT UNIQUE NOT NULL, -- e.g. 'skyline_1', 'skyline_2', etc.
    image_url TEXT NOT NULL,
    label TEXT,
    city TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE site_assets ENABLE ROW LEVEL SECURITY;

-- Public Read access
CREATE POLICY "Public can view site assets" ON site_assets
    FOR SELECT USING (true);

-- Admin Write access
CREATE POLICY "Admin can manage site assets" ON site_assets
    FOR ALL USING (auth.jwt() ->> 'email' = 'minecraftxbox1389@gmail.com');

-- Seed with current default buildings
INSERT INTO site_assets (asset_key, image_url, label, city, metadata) VALUES
('skyline_1', '/building_left.png', 'SG Highway', 'Ahmedabad', '{"width": "12%", "height": "60%"}'),
('skyline_2', '/building_right.png', 'Sector 1-30', 'Gandhinagar', '{"width": "10%", "height": "50%"}'),
('skyline_3', '/building_center.png', 'Prahlad Nagar', 'Ahmedabad', '{"width": "18%", "height": "95%", "isCenter": true}'),
('skyline_4', '/building_right.png', 'Bodakdev', 'Ahmedabad', '{"width": "11%", "height": "58%", "mirror": true}'),
('skyline_5', '/building_left.png', 'Gift City', 'Gandhinagar', '{"width": "9%", "height": "45%", "mirror": true}');
