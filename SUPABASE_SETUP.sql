-- Create a table to store favorite properties
create table saved_properties (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users not null,
  property_id integer not null,
  
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
