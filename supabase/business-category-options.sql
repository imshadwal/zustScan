-- Admin-managed business categories (shown in business profile).
-- Run once per Supabase project after business_owners exists.
-- why_trust_template is unused (AI Generate on profile); column kept for older DBs.

create table if not exists public.business_category_options (
  id text primary key,
  label text not null,
  why_trust_template text,
  sort_order integer not null default 0,
  is_others boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint business_category_options_id_format check (
    id ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'
    and char_length(id) between 2 and 40
  ),
  constraint business_category_options_label_len check (
    char_length(trim(label)) between 2 and 80
  )
);

create unique index if not exists business_category_options_one_others
  on public.business_category_options ((is_others))
  where is_others = true;

insert into public.business_category_options (id, label, why_trust_template, sort_order, is_others)
values
  ('hotel', 'Hotels', null, 0, false),
  ('cafe', 'Cafe', null, 1, false),
  ('digital-marketing', 'Digital Marketing', null, 2, false),
  ('hospitality', 'Hospitality', null, 3, false),
  ('restaurant', 'Restaurant', null, 4, false),
  ('retail', 'Retail', null, 5, false),
  ('salon-spa', 'Salon & Spa', null, 6, false),
  ('healthcare', 'Healthcare', null, 7, false),
  ('education', 'Education', null, 8, false),
  ('real-estate', 'Real Estate', null, 9, false),
  ('others', 'Others', null, 99, true)
on conflict (id) do nothing;

-- Same pattern as business_owners: server (service_role) only; no anon/authenticated API access.
alter table public.business_category_options enable row level security;

revoke all on table public.business_category_options from anon, authenticated;

grant all on table public.business_category_options to service_role;
