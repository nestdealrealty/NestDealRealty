-- Add missing contact columns to the properties table
-- Run this in your Supabase SQL Editor

ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS contact_name TEXT,
ADD COLUMN IF NOT EXISTS contact_phone TEXT;

-- Refresh the PostgREST schema cache to ensure the new columns are recognized immediately
NOTIFY pgrst, 'reload schema';
