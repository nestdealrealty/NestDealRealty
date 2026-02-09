-- Create a table to store favorite properties
create table saved_properties (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users not null,
  property_id uuid references properties(id), -- Changed to reference new properties table
  
  -- Ensure a user can only save a property once
  unique(user_id, property_id)
);

-- Enable Row Level Security (RLS)
alter table saved_properties enable row level security;

-- Policy to allow users to view their own saved properties
create policy "Users can view their own saved properties"
  on saved_properties for select
  using ( auth.uid() = user_id );

-- Policy to allow users to save properties (insert)
create policy "Users can save properties"
  on saved_properties for insert
  with check ( auth.uid() = user_id );

-- Policy to allow users to remove saved properties (delete)
create policy "Users can remove saved properties"
  on saved_properties for delete
  using ( auth.uid() = user_id );

-- ==========================================
-- PROPERTIES TABLE (RENTS, SELL, PG)
-- ==========================================

create type property_status as enum ('pending', 'approved', 'rejected');
create type listing_type as enum ('rent', 'sell', 'pg');

create table properties (
    id uuid default uuid_generate_v4() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    user_id uuid references auth.users, -- Ideally not null, but for guest submissions might differ
    user_email text, -- For admin reference
    
    -- Status
    status property_status default 'pending',
    
    -- Core Fields
    looking_to listing_type not null,
    property_type text,
    city text not null,
    project_name text,
    locality text,
    
    -- Specs
    bhk text,
    built_up_area numeric,
    carpet_area numeric,
    cost numeric,
    maintenance numeric,
    construction_status text,
    transaction_type text, -- Resale / New Booking (Sell only)
    
    -- Dates / Ages
    age_of_property numeric,
    available_from date,
    lock_in_period text,
    
    -- Floor Info
    floor_no text,
    total_floors text,
    
    -- Features
    bathrooms text,
    balconies text,
    furnishing text,
    covered_parking text,
    open_parking text,
    facing text,
    gated_security boolean default false,
    power_backup boolean default false,
    pet_friendly text, -- 'yes' / 'no'
    
    -- Additional
    address text,
    servant_room text, -- 'yes' / 'no'
    description text,
    images text[], -- Array of image URLs
    
    -- PG Specific
    pg_name text,
    total_beds numeric,
    pg_for text, -- Girls, Boys, Both
    best_suited_for text,
    meals_available text, -- Yes / No
    notice_period numeric, -- Days
    common_areas text[], -- Array of strings
    managed_by text,
    manager_stays text, -- Yes / No
    
    -- PG Rules (As JSONB for flexibility)
    pg_rules jsonb default '{}'::jsonb
);

-- Enable RLS
alter table properties enable row level security;

-- Policies

-- 1. Everyone can read APPROVED properties
create policy "Public can view approved properties"
  on properties for select
  using ( status = 'approved' );

-- 2. Users can read their own properties (even pending)
create policy "Users can view own properties"
  on properties for select
  using ( auth.uid() = user_id );

-- 3. Users can insert properties (Submit)
create policy "Users can insert properties"
  on properties for insert
  with check ( auth.uid() = user_id );

-- 4. Admin (minecraftxbox1389@gmail.com) can view ALL properties
-- Note: This requires a custom function usually, or explicit RLS check on email if available in JWT
-- Assuming metadata or a separate admin table, but for simplicity we rely on email if stored or auth.email()
-- create policy "Admin can view all" on properties using (auth.jwt() ->> 'email' = 'minecraftxbox1389@gmail.com');

-- 5. Admin can update status
-- create policy "Admin can update status" ...
