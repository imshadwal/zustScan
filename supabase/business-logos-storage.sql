-- Public read bucket for business logos (uploads via service role in the app API).
-- Run once in Supabase SQL editor (same project as NEXT_PUBLIC_SUPABASE_URL).

insert into storage.buckets (id, name, public)
values ('business-logos', 'business-logos', true)
on conflict (id) do update set public = true;

-- Guest pages and profile preview load logos via public URL.
drop policy if exists "Public read business logos" on storage.objects;
create policy "Public read business logos"
  on storage.objects for select
  to public
  using (bucket_id = 'business-logos');
