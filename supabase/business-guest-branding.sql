-- Guest page branding: theme preset + optional logo path (file in storage).
-- Run once per Supabase project after business_owners exists.

alter table public.business_owners
  add column if not exists guest_theme_id text not null default 'zust-default',
  add column if not exists logo_path text,
  add column if not exists address text,
  add column if not exists why_trust_us text,
  add column if not exists business_category text,
  add column if not exists business_category_other text;

comment on column public.business_owners.guest_theme_id is
  'Curated palette id — see src/lib/guest-themes.ts';
comment on column public.business_owners.logo_path is
  'Object path in business-logos bucket, e.g. natkhatmedia/logo.png';
