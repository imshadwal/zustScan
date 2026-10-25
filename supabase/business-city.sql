-- Add city for guest page display (Business name, City).
-- Run once in Supabase SQL editor on existing projects.

alter table public.business_owners
  add column if not exists city text;
