-- Business category + custom label when "Others" is selected.
-- Run once per Supabase project.

alter table public.business_owners
  add column if not exists business_category text,
  add column if not exists business_category_other text;
