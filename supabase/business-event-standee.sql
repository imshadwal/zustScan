-- Event standee vs table standee (admin picks at create). Table flow keeps business_services/products unchanged.

alter table public.business_owners
  add column if not exists standee_type text not null default 'table';

alter table public.business_owners
  drop constraint if exists business_owners_standee_type_check;

alter table public.business_owners
  add constraint business_owners_standee_type_check
  check (standee_type in ('table', 'event'));

create table if not exists public.business_event_profiles (
  business_owner_id uuid primary key references public.business_owners (id) on delete cascade,
  event_name text not null,
  event_date date,
  updated_at timestamptz not null default now(),
  constraint business_event_profiles_event_name_len check (
    char_length(trim(event_name)) between 2 and 120
  )
);

create table if not exists public.business_event_areas (
  id uuid primary key default gen_random_uuid(),
  business_owner_id uuid not null references public.business_owners (id) on delete cascade,
  name text not null,
  sort_order integer not null default 0,
  constraint business_event_areas_name_len check (
    char_length(trim(name)) between 1 and 80
  )
);

create unique index if not exists business_event_areas_owner_name_key
  on public.business_event_areas (business_owner_id, lower(trim(name)));

alter table public.business_event_profiles enable row level security;
alter table public.business_event_areas enable row level security;

revoke all on table public.business_event_profiles from anon, authenticated;
revoke all on table public.business_event_areas from anon, authenticated;

grant all on table public.business_event_profiles to service_role;
grant all on table public.business_event_areas to service_role;
