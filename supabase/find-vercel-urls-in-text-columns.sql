-- Guest QR paths (/c/…, /e/…) are NOT stored — only login_id. QRs embed NEXT_PUBLIC_SITE_URL at PNG generation time.
-- This query finds any text fields that still mention the old Vercel host (e.g. map_link typos).

select login_id, 'business_owners.map_link' as field, map_link as value
from public.business_owners
where map_link ilike '%zustscan.vercel.app%'

union all

select login_id, 'business_owners.why_trust_us', why_trust_us
from public.business_owners
where why_trust_us ilike '%zustscan.vercel.app%'

union all

select login_id, 'business_owners.brief', brief
from public.business_owners
where brief ilike '%zustscan.vercel.app%';

-- Optional replace (review SELECT results first):
-- update public.business_owners
-- set map_link = replace(map_link, 'https://zustscan.vercel.app', 'https://www.zustscan.com')
-- where map_link ilike '%zustscan.vercel.app%';
