-- ==========================================
-- RESET / CLEANUP (CAREFUL: DELETES DATA)
-- ==========================================
-- Only uncomment if you want a complete reset
-- drop table if exists leads;
-- drop table if exists valuations;
-- drop table if exists saved_properties;
-- drop table if exists properties;
-- drop type if exists property_status;
-- drop type if exists listing_type;

-- ==========================================
-- PROPERTIES TABLE
-- ==========================================
do $$ begin
    create type property_status as enum ('pending', 'approved', 'rejected');
exception
    when duplicate_object then null;
end $$;

do $$ begin
    create type listing_type as enum ('rent', 'sell', 'pg');
exception
    when duplicate_object then null;
end $$;

create table if not exists properties (
    id uuid default uuid_generate_v4() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    user_id uuid references auth.users, 
    user_email text, 
    contact_name text, -- Full name from signup
    contact_phone text, -- Phone from signup
    
    status property_status default 'pending',
    looking_to listing_type not null,
    property_type text,
    city text not null,
    project_name text,
    locality text,
    
    bhk text,
    built_up_area numeric,
    carpet_area numeric,
    cost numeric,
    maintenance numeric,
    construction_status text,
    transaction_type text,
    
    age_of_property numeric,
    available_from date,
    lock_in_period text,
    
    floor_no text,
    total_floors text,
    
    bathrooms text,
    balconies text,
    furnishing text,
    covered_parking text,
    open_parking text,
    facing text,
    gated_security boolean default false,
    power_backup boolean default false,
    pet_friendly text,
    
    address text,
    servant_room text,
    description text,
    images text[],
    
    pg_name text,
    total_beds numeric,
    pg_for text,
    best_suited_for text,
    meals_available text,
    notice_period numeric,
    common_areas text[],
    managed_by text,
    manager_stays text,
    pg_rules jsonb default '{}'::jsonb
);

alter table properties enable row level security;

-- ==========================================
-- SAVED PROPERTIES
-- ==========================================
create table if not exists saved_properties (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users not null,
  property_id uuid references properties(id) on delete cascade,
  unique(user_id, property_id)
);

alter table saved_properties enable row level security;

-- ==========================================
-- NEW: VALUATIONS TABLE
-- ==========================================
create table if not exists valuations (
    id uuid default uuid_generate_v4() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    user_id uuid references auth.users, -- Optional
    name text not null,
    email text not null,
    phone text not null,
    property_type text,
    address text,
    city text,
    pincode text,
    message text,
    status text default 'new'
);
alter table valuations enable row level security;

-- ==========================================
-- NEW: LEADS / CONTACT SELLER TABLE
-- ==========================================
create table if not exists leads (
    id uuid default uuid_generate_v4() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    property_id uuid references properties(id),
    user_id uuid references auth.users,
    name text not null,
    email text not null,
    phone text not null,
    whatsapp text,
    message text,
    is_broker boolean default false,
    status text default 'new'
);
alter table leads enable row level security;

-- ==========================================
-- POLICIES
-- ==========================================

-- PROPERTIES
drop policy if exists "Public can view approved properties" on properties;
create policy "Public can view approved properties" 
  on properties for select using ( status = 'approved' );

drop policy if exists "Users can view own properties" on properties;
create policy "Users can view own properties" 
  on properties for select using ( auth.uid() = user_id );

drop policy if exists "Users can insert properties" on properties;
create policy "Users can insert properties" 
  on properties for insert with check ( auth.uid() = user_id );

drop policy if exists "Users can update own properties" on properties;
create policy "Users can update own properties" 
  on properties for update using ( auth.uid() = user_id );

drop policy if exists "Admin can view all properties" on properties;
create policy "Admin can view all properties"
  on properties for select
  using ( auth.jwt() ->> 'email' = 'minecraftxbox1389@gmail.com' );

drop policy if exists "Admin can update all properties" on properties;
create policy "Admin can update all properties"
  on properties for update
  using ( auth.jwt() ->> 'email' = 'minecraftxbox1389@gmail.com' );

-- SAVED PROPERTIES
drop policy if exists "Users can view own saved properties" on saved_properties;
create policy "Users can view own saved properties" 
  on saved_properties for select using ( auth.uid() = user_id );

drop policy if exists "Users can save properties" on saved_properties;
create policy "Users can save properties" 
  on saved_properties for insert with check ( auth.uid() = user_id );

drop policy if exists "Users can remove saved properties" on saved_properties;
create policy "Users can remove saved properties" 
  on saved_properties for delete using ( auth.uid() = user_id );

-- VALUATIONS
drop policy if exists "Public can insert valuations" on valuations;
create policy "Public can insert valuations" 
    on valuations for insert with check (true);

drop policy if exists "Admin can view valuations" on valuations;
create policy "Admin can view valuations"
    on valuations for select
    using (auth.jwt() ->> 'email' = 'minecraftxbox1389@gmail.com');

-- LEADS
drop policy if exists "Public can insert leads" on leads;
create policy "Public can insert leads" 
    on leads for insert with check (true);

drop policy if exists "Admin can view leads" on leads;
create policy "Admin can view leads"
    on leads for select
    using (auth.jwt() ->> 'email' = 'minecraftxbox1389@gmail.com');

-- STORAGE (OPTIONAL)
insert into storage.buckets (id, name, public)
values ('property-images', 'property-images', true)
on conflict (id) do nothing;

drop policy if exists "Public Access" on storage.objects;
create policy "Public Access"
  on storage.objects for select using ( bucket_id = 'property-images' );

drop policy if exists "Auth Users Upload" on storage.objects;
create policy "Auth Users Upload"
  on storage.objects for insert with check ( bucket_id = 'property-images' and auth.role() = 'authenticated' );
