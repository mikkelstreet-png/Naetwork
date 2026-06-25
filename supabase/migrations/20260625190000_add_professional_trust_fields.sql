alter table public.professional_profiles
  add column if not exists photo_url text,
  add column if not exists linkedin_url text,
  add column if not exists verification_status text not null default 'pending',
  add column if not exists output_promise text,
  add column if not exists sessions_completed integer not null default 0;

alter table public.professional_profiles
  drop constraint if exists professional_profiles_verification_status_check;

alter table public.professional_profiles
  add constraint professional_profiles_verification_status_check
  check (verification_status in ('pending', 'verified', 'placeholder'));
