-- Guest page: address under business name, "Why trust us" line, contact uses phone.
-- Run once per Supabase project.

alter table public.business_owners
  add column if not exists address text,
  add column if not exists why_trust_us text;
