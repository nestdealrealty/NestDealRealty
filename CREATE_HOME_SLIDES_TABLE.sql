-- Table for Homepage Hero Slideshow
CREATE TABLE IF NOT EXISTS home_slides (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    image_url TEXT NOT NULL,
    title TEXT,
    price TEXT,
    tag TEXT,
    developer TEXT,
    builder TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE home_slides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on home_slides" ON home_slides FOR SELECT USING (true);
CREATE POLICY "Allow all on home_slides" ON home_slides FOR ALL USING (true);

-- Insert some default slides if empty
INSERT INTO home_slides (image_url, title, price, tag)
VALUES 
('https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1920', 'The Planet, Ahmedabad', '₹75L - 1.2Cr', 'Premium Flat'),
('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1920', 'Empire Skye, Gandhinagar', '₹1.5Cr - 3.2Cr', 'Luxury Villa'),
('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1920', 'Venus Group, Shela', '₹82L - 1.5Cr', '3/4 BHK Flat');
