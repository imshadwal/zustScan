-- Rate limits for OpenAI-backed API routes (guest drafts, profile Generate).
-- Run in Supabase SQL editor, then reload API schema if needed.

create table if not exists public.ai_rate_limits (
  bucket text primary key,
  window_start timestamptz not null default now(),
  hit_count integer not null default 0 check (hit_count >= 0)
);

alter table public.ai_rate_limits enable row level security;

create or replace function public.check_ai_rate_limit(
  p_bucket text,
  p_max_hits integer,
  p_window_seconds integer
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_now timestamptz := clock_timestamp();
  v_window interval := make_interval(secs => greatest(p_window_seconds, 1));
  v_row public.ai_rate_limits%rowtype;
  v_retry integer;
begin
  if p_bucket is null or length(trim(p_bucket)) = 0 then
    return jsonb_build_object('allowed', true, 'retry_after_seconds', 0);
  end if;

  insert into public.ai_rate_limits (bucket, window_start, hit_count)
  values (p_bucket, v_now, 0)
  on conflict (bucket) do nothing;

  select * into v_row from public.ai_rate_limits where bucket = p_bucket for update;

  if v_now >= v_row.window_start + v_window then
    v_row.window_start := v_now;
    v_row.hit_count := 0;
  end if;

  if v_row.hit_count >= greatest(p_max_hits, 1) then
    v_retry := greatest(
      1,
      ceil(extract(epoch from (v_row.window_start + v_window - v_now)))::integer
    );
    update public.ai_rate_limits
    set window_start = v_row.window_start, hit_count = v_row.hit_count
    where bucket = p_bucket;
    return jsonb_build_object('allowed', false, 'retry_after_seconds', v_retry);
  end if;

  update public.ai_rate_limits
  set window_start = v_row.window_start, hit_count = v_row.hit_count + 1
  where bucket = p_bucket;

  return jsonb_build_object('allowed', true, 'retry_after_seconds', 0);
end;
$$;

revoke all on function public.check_ai_rate_limit(text, integer, integer) from public;
grant execute on function public.check_ai_rate_limit(text, integer, integer) to service_role;
