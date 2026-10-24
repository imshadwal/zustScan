-- Zust Scan business owners (fresh install).
-- Run once per Supabase project when customers table does not exist yet.
-- If you already have public.customers, run migrate-customers-to-business-owners.sql instead.

create table if not exists public.business_owners (
  id uuid primary key default gen_random_uuid(),
  login_id text not null,
  password_hash text not null,
  sold_price integer not null,
  business_name text,
  phone text,
  map_link text,
  brief text,
  setup_complete boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint business_owners_login_id_key unique (login_id),
  constraint business_owners_login_id_format check (
    login_id ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'
    and char_length(login_id) between 2 and 40
  ),
  constraint business_owners_sold_price_positive check (sold_price between 1 and 10000000)
);

create table if not exists public.business_services (
  id uuid primary key default gen_random_uuid(),
  business_owner_id uuid not null references public.business_owners (id) on delete cascade,
  name text not null,
  sort_order integer not null default 0,
  constraint business_services_name_len check (
    char_length(trim(name)) between 1 and 80
  )
);

create unique index if not exists business_services_owner_name_key
  on public.business_services (business_owner_id, lower(trim(name)));

create table if not exists public.business_products (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references public.business_services (id) on delete cascade,
  name text not null,
  sort_order integer not null default 0,
  constraint business_products_name_len check (
    char_length(trim(name)) between 1 and 80
  )
);

create unique index if not exists business_products_service_name_key
  on public.business_products (service_id, lower(trim(name)));

alter table public.business_owners enable row level security;
alter table public.business_services enable row level security;
alter table public.business_products enable row level security;

revoke all on table public.business_owners from anon, authenticated;
revoke all on table public.business_services from anon, authenticated;
revoke all on table public.business_products from anon, authenticated;

grant all on table public.business_owners to service_role;
grant all on table public.business_services to service_role;
grant all on table public.business_products to service_role;
