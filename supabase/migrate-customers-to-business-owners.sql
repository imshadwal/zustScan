-- Run once in projects that already have public.customers (e.g. zustscan-dev).
-- Renames the table and adds business-owner columns and catalog tables.

alter table if exists public.customers rename to business_owners;

alter table public.business_owners
  add column if not exists business_name text,
  add column if not exists city text,
  add column if not exists phone text,
  add column if not exists map_link text,
  add column if not exists brief text,
  add column if not exists setup_complete boolean not null default false,
  add column if not exists updated_at timestamptz not null default now();

-- Rename legacy constraints when present (ignore errors on fresh names).
do $$
begin
  alter table public.business_owners rename constraint customers_login_id_key to business_owners_login_id_key;
exception when undefined_object then null;
end $$;

do $$
begin
  alter table public.business_owners rename constraint customers_login_id_format to business_owners_login_id_format;
exception when undefined_object then null;
end $$;

do $$
begin
  alter table public.business_owners rename constraint customers_sold_price_positive to business_owners_sold_price_positive;
exception when undefined_object then null;
end $$;

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
