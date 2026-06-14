-- Naetwork Project Board Schema
-- Run this in Supabase SQL Editor

-- Profiles
create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade unique,
  user_type text check (user_type in ('business', 'specialist')),
  name text,
  email text,
  company_name text,
  created_at timestamptz default now()
);
alter table profiles enable row level security;
drop policy if exists "Users manage own profile" on profiles;
create policy "Users manage own profile" on profiles for all using (auth.uid() = user_id);

-- Projects
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  project_category text,
  help_needed text,
  current_tools text,
  desired_result text,
  budget_range text,
  timeline text,
  company_name text,
  contact_name text,
  contact_email text,
  status text default 'open' check (status in ('open', 'in_progress', 'closed')),
  created_at timestamptz default now()
);
alter table projects enable row level security;
drop policy if exists "Business owns projects" on projects;
drop policy if exists "Specialists see open projects" on projects;
create policy "Business owns projects" on projects for all using (auth.uid() = user_id);
create policy "Specialists see open projects" on projects for select using (
  status = 'open' and exists (
    select 1 from specialists where user_id = auth.uid()
  )
);

-- Specialists
create table if not exists specialists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade unique,
  name text,
  role_title text,
  ai_specialty text,
  categories text[],
  typical_project_size text,
  availability text,
  short_bio text,
  email text,
  linkedin_or_website text,
  created_at timestamptz default now()
);
alter table specialists enable row level security;
drop policy if exists "Specialist owns profile" on specialists;
drop policy if exists "Business sees interested specialists" on specialists;
create policy "Specialist owns profile" on specialists for all using (auth.uid() = user_id);
create policy "Business sees interested specialists" on specialists for select using (
  exists (
    select 1 from project_interests pi
    join projects p on pi.project_id = p.id
    where pi.specialist_id = specialists.id and p.user_id = auth.uid()
  )
);

-- Project Interests
create table if not exists project_interests (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  specialist_id uuid references specialists(id) on delete cascade,
  created_at timestamptz default now(),
  unique(project_id, specialist_id)
);
alter table project_interests enable row level security;
drop policy if exists "Specialists manage own interests" on project_interests;
drop policy if exists "Business sees interests on own projects" on project_interests;
create policy "Specialists manage own interests" on project_interests for all using (
  specialist_id = (select id from specialists where user_id = auth.uid())
);
create policy "Business sees interests on own projects" on project_interests for select using (
  exists (select 1 from projects where id = project_id and user_id = auth.uid())
);
