-- Add Latitude and Longitude to Projects
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS latitude NUMERIC,
ADD COLUMN IF NOT EXISTS longitude NUMERIC;

-- Optional: Add some sample data if needed, but we'll assume the user will fill this via admin panel
