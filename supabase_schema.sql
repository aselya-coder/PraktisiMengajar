-- Enable RLS
alter table auth.users enable row level security;

-- Create table for storing site sections
create table public.sections (
  key text primary key,
  data jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on sections
alter table public.sections enable row level security;

-- Policy: Everyone can read sections (public website)
create policy "Public sections are viewable by everyone"
  on public.sections for select
  using ( true );

-- Policy: Only authenticated users can insert/update sections (admin panel)
create policy "Authenticated users can insert sections"
  on public.sections for insert
  with check ( auth.role() = 'authenticated' );

create policy "Authenticated users can update sections"
  on public.sections for update
  using ( auth.role() = 'authenticated' );

-- Optional: Seed initial data if needed
-- insert into public.sections (key, data) values ('hero', '{...}');
