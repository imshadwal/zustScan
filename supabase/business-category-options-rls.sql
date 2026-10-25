-- Lock down business_category_options (fixes Supabase "UNRESTRICTED" badge).
-- Run once if you already ran supabase/business-category-options.sql without RLS.
-- Safe to re-run.

alter table public.business_category_options enable row level security;

revoke all on table public.business_category_options from anon, authenticated;

grant all on table public.business_category_options to service_role;
