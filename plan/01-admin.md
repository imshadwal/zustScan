# 01 — Admin

The admin creates a customer login and keeps the QR for that customer. Scanning the QR opens that customer's public page. The customer dashboard, the guest choices, and the OpenAI draft are later plans.

## What the admin can do

There is one admin. The admin signs in, creates a customer id and password, and sees the QR for that customer. The admin can download the QR and reset the password. The admin does not edit services, products, the phone number, the map link, or the business brief. The customer will do that after they sign in.

## Screens

- `/admin/login` — admin id and password.
- `/admin` — list of customers. Each row shows the customer id, the date it was created, the QR, a download button, and a password reset.
- `/admin/customers/new` — customer id and password. After save, the same page shows the id, the password once, and the QR.

The marketing homepage stays at `/`. Admin pages use the same blue and navy, with a plain layout and no enquiry form.

## Customer id and password

The admin types the customer id. It is the login name, unique, short, and limited to letters, numbers, and hyphens. Example: `lakeview-hotel`.

The admin types the password. It is shown once on the success screen, then only the hash is stored. A later visit can reset the password and show the new one once. The old password cannot be displayed again.

## QR

The QR encodes the public URL:

`https://<site>/c/<customer-id>`

`<site>` is the live site URL from `NEXT_PUBLIC_SITE_URL`. On a local machine that is `http://localhost:3000`. The admin sees the QR on screen and can download a PNG.

`/c/<customer-id>` in this plan is a simple page with the business name area and the words that the guest flow is next. It exists so a scan does not 404. The service, product, and star steps are not part of this plan.

## Database

Use the existing Supabase project `zustscan`. Add one table, `customers`.

| Column | Purpose |
| --- | --- |
| `id` | UUID primary key |
| `login_id` | Unique customer id, stored lowercase |
| `password_hash` | bcrypt hash |
| `created_at` | When the admin created the row |

Row Level Security is on. The table is not exposed to the public Data API. Next.js server code uses the Supabase service role key. The browser never receives that key or a password hash.

The admin login is not a row in this table. It is `ADMIN_LOGIN` and `ADMIN_PASSWORD` in environment variables, checked on the server. One admin is enough.

## Session

A successful admin login sets an httpOnly cookie. Admin pages and the create, list, and reset actions require that cookie. The cookie expires after 7 days.

## Environment

Local file `.env.local`, and the same names in the Vercel project. `.env*` is already gitignored.

- `NEXT_PUBLIC_SUPABASE_URL` — project URL from the Supabase home screen
- `SUPABASE_SERVICE_ROLE_KEY` — Project Settings, API keys, service role
- `ADMIN_LOGIN` — admin id
- `ADMIN_PASSWORD` — admin password
- `NEXT_PUBLIC_SITE_URL` — origin used inside each QR

The anon key is not required for this plan. The database password from project creation is not used by the app.

## App files

- `src/app/admin/login/page.tsx`
- `src/app/admin/page.tsx`
- `src/app/admin/customers/new/page.tsx`
- `src/app/c/[loginId]/page.tsx`
- `src/app/api/admin/login/route.ts`
- `src/app/api/admin/logout/route.ts`
- `src/app/api/admin/customers/route.ts`
- `src/app/api/admin/customers/[loginId]/reset/route.ts`
- `src/lib/supabase/admin.ts` — server client with the service role key
- `src/lib/admin-session.ts` — cookie sign and check
- `supabase/customers.sql` — the table and RLS, run once in the Supabase SQL editor

## Checks before this plan is done

- Wrong admin password stays on the login page.
- A second customer with the same id is rejected.
- The password is visible only on the create and reset success screens.
- The QR downloads and opens `/c/<customer-id>`.
- A signed-out visit to `/admin` returns to login.
- The service role key is not in the browser bundle or in git.
