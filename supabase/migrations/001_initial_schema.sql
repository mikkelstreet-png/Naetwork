-- 001_initial_schema.sql
-- Naetwork initial database schema

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- profiles table (one per auth user)
create table public.profiles (
  id uuid primary key default uuid_generate_v4(),
  auth_user_id uuid not null unique references auth.users(id) on delete cascade,
  name text,
  role text not null default 'candidate' check (role in ('candidate', 'professional')),
  status text not null default 'active' check (status in ('active', 'deletion_requested', 'deleted')),
  notification_booking_reminders boolean not null default true,
  notification_marketing boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- professional_profiles table (one per professional)
create table public.professional_profiles (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid not null unique references public.profiles(id) on delete cascade,
  title text,
  company text,
  bio text check (char_length(bio) <= 500),
  industries text[] not null default '{}',
  focus_areas text[] not null default '{}',
  price_dkk integer not null default 300 check (price_dkk >= 300 and price_dkk <= 2000),
  visibility text not null default 'hidden' check (visibility in ('hidden', 'published')),
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (auth_user_id, name, role)
  values (
    new.id,
    new.raw_user_meta_data->>'name',
    coalesce(new.raw_user_meta_data->>'role', 'candidate')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Updated_at trigger
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

create trigger professional_profiles_updated_at
  before update on public.professional_profiles
  for each row execute procedure public.set_updated_at();

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.professional_profiles enable row level security;

-- profiles: users can read/update their own row
create policy "profiles: own read" on public.profiles
  for select using (auth.uid() = auth_user_id);

create policy "profiles: own update" on public.profiles
  for update using (auth.uid() = auth_user_id);

-- professional_profiles: owner full access
create policy "professional_profiles: own all" on public.professional_profiles
  for all using (
    exists (
      select 1 from public.profiles p
      where p.id = profile_id and p.auth_user_id = auth.uid()
    )
  );

-- professional_profiles: published profiles visible to all authenticated users
create policy "professional_profiles: published read" on public.professional_profiles
  for select using (visibility = 'published');
