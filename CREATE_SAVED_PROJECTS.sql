-- SQL Script to create saved_projects table
CREATE TABLE IF NOT EXISTS saved_projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, project_id)
);

-- Enable RLS
ALTER TABLE saved_projects ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own saved projects" 
ON saved_projects FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can save projects" 
ON saved_projects FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unsave projects" 
ON saved_projects FOR DELETE 
USING (auth.uid() = user_id);
