-- Guest funnel counters (anonymous — no guest PII).
-- Run in Supabase SQL editor after business_owners exists.

create table if not exists public.guest_analytics (
  business_owner_id uuid primary key references public.business_owners (id) on delete cascade,
  page_views bigint not null default 0 check (page_views >= 0),
  drafts_generated bigint not null default 0 check (drafts_generated >= 0),
  copy_continue_taps bigint not null default 0 check (copy_continue_taps >= 0),
  updated_at timestamptz not null default now()
);

alter table public.guest_analytics enable row level security;

revoke all on table public.guest_analytics from anon, authenticated;
grant all on table public.guest_analytics to service_role;
