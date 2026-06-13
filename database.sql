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

create table if not exists public.user_accounts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  email text not null unique,
  name text,
  role text not null default 'customer',
  password_hash text not null,
  last_login_at timestamptz,
  status text not null default 'active'
);

create table if not exists public.customer_access_tokens (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  customer_email text not null,
  token_hash text not null unique,
  expires_at timestamptz not null,
  used_at timestamptz
);

create table if not exists public.task_customer_updates (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  task_id uuid not null references public.tasks(id) on delete cascade,
  customer_email text not null,
  message text not null,
  source text not null default 'customer'
);

create table if not exists public.specialist_access_tokens (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  specialist_email text not null,
  token_hash text not null unique,
  expires_at timestamptz not null,
  used_at timestamptz
);

create table if not exists public.specialist_task_invitations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  task_id uuid not null references public.tasks(id) on delete cascade,
  specialist_email text not null,
  status text not null default 'invited',
  response_note text,
  responded_at timestamptz
);

create table if not exists public.admin_audit_log (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  action text not null,
  entity_type text not null,
  entity_id text,
  metadata jsonb not null default '{}'::jsonb
);

alter table public.tasks enable row level security;
alter table public.provider_applications enable row level security;
alter table public.user_accounts enable row level security;
alter table public.customer_access_tokens enable row level security;
alter table public.task_customer_updates enable row level security;
alter table public.specialist_access_tokens enable row level security;
alter table public.specialist_task_invitations enable row level security;
alter table public.admin_audit_log enable row level security;

alter table public.tasks add column if not exists internal_note text;
alter table public.tasks add column if not exists specialist_direction text;
alter table public.tasks add column if not exists next_step text;
alter table public.provider_applications add column if not exists approved_at timestamptz;
alter table public.provider_applications add column if not exists preferred_task_types text;
alter table public.user_accounts add column if not exists name text;
alter table public.user_accounts add column if not exists role text not null default 'customer';
alter table public.user_accounts add column if not exists last_login_at timestamptz;
alter table public.user_accounts add column if not exists status text not null default 'active';
alter table public.user_accounts add column if not exists updated_at timestamptz not null default now();

create index if not exists tasks_created_at_idx on public.tasks (created_at desc);
create index if not exists tasks_status_idx on public.tasks (status);
create index if not exists tasks_customer_email_idx on public.tasks (customer_email);
create index if not exists provider_applications_created_at_idx on public.provider_applications (created_at desc);
create index if not exists provider_applications_status_idx on public.provider_applications (status);
create index if not exists provider_applications_email_idx on public.provider_applications (email);
create index if not exists user_accounts_email_idx on public.user_accounts (email);
create index if not exists user_accounts_role_idx on public.user_accounts (role);
create index if not exists customer_access_tokens_email_idx on public.customer_access_tokens (customer_email);
create index if not exists customer_access_tokens_expires_idx on public.customer_access_tokens (expires_at);
create index if not exists task_customer_updates_task_id_idx on public.task_customer_updates (task_id, created_at desc);
create index if not exists specialist_access_tokens_email_idx on public.specialist_access_tokens (specialist_email);
create index if not exists specialist_access_tokens_expires_idx on public.specialist_access_tokens (expires_at);
create index if not exists specialist_task_invitations_email_idx on public.specialist_task_invitations (specialist_email, created_at desc);
create index if not exists specialist_task_invitations_task_idx on public.specialist_task_invitations (task_id);
create index if not exists admin_audit_log_created_idx on public.admin_audit_log (created_at desc);
create index if not exists admin_audit_log_entity_idx on public.admin_audit_log (entity_type, entity_id);
