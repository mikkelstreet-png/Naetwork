-- Naetwork Sprint 1 without AI
-- Run this in Supabase SQL editor.

create table if not exists public.consumer_leads (
  id uuid primary key default gen_random_uuid(),
  type text default 'consumer_intake',
  status text not null default 'new',
  name text,
  email text not null,
  category text not null,
  need text not null,
  audience text,
  must_have text,
  inspiration text,
  budget text,
  deadline text,
  brief jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.provider_applications (
  id uuid primary key default gen_random_uuid(),
  status text not null default 'pending',
  name text not null,
  email text not null,
  company text,
  skills text not null,
  categories jsonb default '[]'::jsonb,
  price_level text,
  capacity text,
  portfolio text,
  created_at timestamptz not null default now()
);

create index if not exists consumer_leads_status_idx on public.consumer_leads(status);
create index if not exists consumer_leads_category_idx on public.consumer_leads(category);
create index if not exists provider_applications_status_idx on public.provider_applications(status);
