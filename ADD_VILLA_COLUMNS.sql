-- SQL Script to add Villa-specific columns to the projects table
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS pincode TEXT,
ADD COLUMN IF NOT EXISTS available_from TEXT,
ADD COLUMN IF NOT EXISTS property_age TEXT,
ADD COLUMN IF NOT EXISTS furnishing_status TEXT DEFAULT 'Unfurnished',
ADD COLUMN IF NOT EXISTS flooring_type TEXT,
ADD COLUMN IF NOT EXISTS wall_finish TEXT,
ADD COLUMN IF NOT EXISTS facing TEXT,
ADD COLUMN IF NOT EXISTS corner_property TEXT DEFAULT 'No',
ADD COLUMN IF NOT EXISTS tour_360_url TEXT;

-- Verify columns
COMMENT ON COLUMN projects.address IS 'Complete site address for Villa projects';
COMMENT ON COLUMN projects.pincode IS 'Area pincode';
COMMENT ON COLUMN projects.tour_360_url IS 'Matterport or other 360 tour link';
