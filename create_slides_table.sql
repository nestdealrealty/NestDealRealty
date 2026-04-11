-- Create the home_slides table
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

-- Create policy for public read access
CREATE POLICY "Public can view home slides" ON home_slides
    FOR SELECT USING (true);

-- Create policy for admin write access (create, update, delete)
-- Assuming admin has email 'minecraftxbox1389@gmail.com' via auth.uid() check or similar
-- For simplicity in this context, we'll use a check against the auth.users table or just allow authenticated users for now if role management isn't strictly defined in DB
-- A more robust way is checking against a roles table or specific user ID.
-- Here we will allow all authenticated users to insert/update/delete for now as per previous pattern, or restrict to specific email if possible in application logic.
-- Ideally:
-- CREATE POLICY "Admin can manage home slides" ON home_slides
--   FOR ALL USING (auth.jwt() ->> 'email' = 'minecraftxbox1389@gmail.com');

CREATE POLICY "Admin can insert home slides" ON home_slides
    FOR INSERT WITH CHECK (auth.jwt() ->> 'email' = 'minecraftxbox1389@gmail.com');

CREATE POLICY "Admin can update home slides" ON home_slides
    FOR UPDATE USING (auth.jwt() ->> 'email' = 'minecraftxbox1389@gmail.com');

CREATE POLICY "Admin can delete home slides" ON home_slides
    FOR DELETE USING (auth.jwt() ->> 'email' = 'minecraftxbox1389@gmail.com');

-- Insert default slides
INSERT INTO home_slides (image_url, title, price, tag) VALUES
('https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1920', 'The Planet, Ahmedabad', '₹75L - 1.2Cr', 'Premium Flat'),
('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1920', 'Empire Skye, Gandhinagar', '₹1.5Cr - 3.2Cr', 'Luxury Villa'),
('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1920', 'Venus Group, Shela', '₹82L - 1.5Cr', '3/4 BHK Flat');
