-- Event name is optional (empty guest header when null). Run after business-event-standee.sql.

alter table public.business_event_profiles
  alter column event_name drop not null;

alter table public.business_event_profiles
  drop constraint if exists business_event_profiles_event_name_len;

alter table public.business_event_profiles
  add constraint business_event_profiles_event_name_len check (
    event_name is null
    or char_length(trim(event_name)) between 2 and 120
  );
