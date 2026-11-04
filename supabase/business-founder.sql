-- Founder card on guest review forms. Run once in the Supabase SQL editor.
-- Guest pages only receive these fields when founder_visible is true and a name plus phone or email is saved.

alter table public.business_owners
  add column if not exists founder_visible boolean not null default false,
  add column if not exists founder_name text,
  add column if not exists founder_role text,
  add column if not exists founder_phone text,
  add column if not exists founder_email text,
  add column if not exists founder_note text,
  add column if not exists founder_photo_path text;

alter table public.business_owners
  drop constraint if exists business_owners_founder_name_len;
alter table public.business_owners
  add constraint business_owners_founder_name_len
  check (founder_name is null or char_length(trim(founder_name)) between 2 and 80);

alter table public.business_owners
  drop constraint if exists business_owners_founder_role_len;
alter table public.business_owners
  add constraint business_owners_founder_role_len
  check (founder_role is null or char_length(trim(founder_role)) between 2 and 40);

alter table public.business_owners
  drop constraint if exists business_owners_founder_note_len;
alter table public.business_owners
  add constraint business_owners_founder_note_len
  check (founder_note is null or char_length(trim(founder_note)) between 1 and 200);

alter table public.business_owners
  drop constraint if exists business_owners_founder_email_len;
alter table public.business_owners
  add constraint business_owners_founder_email_len
  check (founder_email is null or char_length(trim(founder_email)) between 3 and 120);
