-- Table for Homepage Hero Slideshow
CREATE TABLE IF NOT EXISTS site_hero_slides (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    image_url TEXT NOT NULL,
    title TEXT,
    subtitle TEXT,
    link_url TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE site_hero_slides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on site_hero_slides" ON site_hero_slides FOR SELECT USING (true);
CREATE POLICY "Allow all on site_hero_slides" ON site_hero_slides FOR ALL USING (true);

-- Insert some default slides if empty
INSERT INTO site_hero_slides (image_url, title, subtitle, order_index)
VALUES 
('https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1920', 'The Planet, Ahmedabad', '₹75L - 1.2Cr', 0),
('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1920', 'Empire Skye, Gandhinagar', '₹1.5Cr - 3.2Cr', 1),
('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1920', 'Venus Group, Shela', '₹82L - 1.5Cr', 2);
