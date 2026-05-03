-- SQL Script to add price_range column to projects table
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS price_range TEXT;

-- Verify column
COMMENT ON COLUMN projects.price_range IS 'Overall price range for the project (e.g. 75 Lacs - 1.25 Cr)';
