create extension if not exists pgcrypto;

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  customer_email text not null,
  category text not null default 'Ikke sikker',
  need text not null,
  audience text,
  budget text,
  deadline text,
  brief jsonb not null default '{}'::jsonb,
  status text not null default 'new',
  source text not null default 'website'
);

create table if not exists public.provider_applications (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  skills text not null,
  links text,
  status text not null default 'new',
  source text not null default 'website'
);

alter table public.tasks enable row level security;
alter table public.provider_applications enable row level security;

create index if not exists tasks_created_at_idx on public.tasks (created_at desc);
create index if not exists tasks_status_idx on public.tasks (status);
create index if not exists provider_applications_created_at_idx on public.provider_applications (created_at desc);
create index if not exists provider_applications_status_idx on public.provider_applications (status);
