-- SQL Script to expand projects table for Phases and Plot Metrics
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS phases JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS total_phases INTEGER,
ADD COLUMN IF NOT EXISTS total_plots INTEGER,
ADD COLUMN IF NOT EXISTS villa_config JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS plot_config JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS min_price TEXT,
ADD COLUMN IF NOT EXISTS max_price TEXT;

-- Indexing for performance
CREATE INDEX IF NOT EXISTS idx_projects_property_type ON projects(property_type);
