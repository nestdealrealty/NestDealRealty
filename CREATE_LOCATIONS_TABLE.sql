CREATE TABLE IF NOT EXISTS locations_dictionary (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    city TEXT NOT NULL,
    area TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    UNIQUE(city, area)
);

ALTER TABLE locations_dictionary ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on locations_dictionary" ON locations_dictionary FOR SELECT USING (true);
CREATE POLICY "Allow insert on locations_dictionary" ON locations_dictionary FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update on locations_dictionary" ON locations_dictionary FOR UPDATE USING (true);
CREATE POLICY "Allow delete on locations_dictionary" ON locations_dictionary FOR DELETE USING (true);

INSERT INTO locations_dictionary (city, area)
SELECT DISTINCT city, locality 
FROM projects 
WHERE city IS NOT NULL AND locality IS NOT NULL AND trim(city) != '' AND trim(locality) != ''
ON CONFLICT (city, area) DO NOTHING;

INSERT INTO locations_dictionary (city, area)
SELECT DISTINCT city, locality 
FROM properties 
WHERE city IS NOT NULL AND locality IS NOT NULL AND trim(city) != '' AND trim(locality) != ''
ON CONFLICT (city, area) DO NOTHING;
