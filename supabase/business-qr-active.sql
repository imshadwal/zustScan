-- Admin can pause / resume guest QR without deleting the business.
-- Run once in Supabase SQL editor on existing projects.

alter table public.business_owners
  add column if not exists qr_active boolean not null default true;

comment on column public.business_owners.qr_active is
  'When false, /c/<login_id> shows paused and guest APIs reject reviews.';
