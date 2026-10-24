-- Deprecated: use supabase/migrate-customers-to-business-owners.sql if this table exists,
-- or supabase/business-owners.sql for a fresh project.
--
-- Zust Scan customers (legacy).
-- Run once in the Supabase SQL editor for the zustscan project.
-- Next.js uses the service role key, which bypasses row level security.
-- The public Data API roles have no access to this table.

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  login_id text not null,
  password_hash text not null,
  sold_price integer not null,
  created_at timestamptz not null default now(),
  constraint customers_login_id_key unique (login_id),
  constraint customers_login_id_format check (
    login_id ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'
    and char_length(login_id) between 2 and 40
  ),
  constraint customers_sold_price_positive check (sold_price between 1 and 10000000)
);

alter table public.customers enable row level security;

revoke all on table public.customers from anon, authenticated;
grant all on table public.customers to service_role;
