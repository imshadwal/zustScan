-- Bring an existing business_owners table up to date with the current app.
-- Safe to run multiple times (uses IF NOT EXISTS).
-- Run in Supabase SQL editor after business_owners exists.

alter table public.business_owners
  add column if not exists city text,
  add column if not exists address text,
  add column if not exists why_trust_us text,
  add column if not exists business_category text,
  add column if not exists business_category_other text,
  add column if not exists qr_active boolean not null default true,
  add column if not exists guest_theme_id text not null default 'zust-default',
  add column if not exists logo_path text;

-- guest_theme_id: if column existed without default, backfill nulls
update public.business_owners
set guest_theme_id = 'zust-default'
where guest_theme_id is null;

-- Then run (separately or after this file):
--   supabase/guest-analytics.sql
--   supabase/business-logos-storage.sql
--   supabase/business-category-options.sql
