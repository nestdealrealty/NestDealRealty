-- Table to store trending projects assigned to specific areas
CREATE TABLE IF NOT EXISTS area_trending_projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    area_id UUID NOT NULL REFERENCES locations_dictionary(id) ON DELETE CASCADE,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    slot_number INTEGER NOT NULL CHECK (slot_number >= 1 AND slot_number <= 10),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    UNIQUE(area_id, slot_number)
);

ALTER TABLE area_trending_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on area_trending_projects" ON area_trending_projects FOR SELECT USING (true);
CREATE POLICY "Allow all on area_trending_projects" ON area_trending_projects FOR ALL USING (true);
