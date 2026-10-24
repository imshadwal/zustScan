# 03 — Business owner dashboard

The **business owner** signs in with the login id and password the admin created. They complete **all** required setup: business name, phone, Google Maps link, brief, at least one service, and at least one product under that service. Until that setup is complete, the **guest page** (`/c/<login-id>`) does not offer the review flow. Plan 04 (guest steps, OpenAI, Copy to Google) starts only after this plan enforces that gate.

The admin creates business owner logins and QRs only. The admin does not edit name, phone, map link, brief, services, or products.

## Words we use in the product

| Say | Do not say (in UI and new code) |
| --- | --- |
| Business owner | Customer |
| Business owners (admin list) | Customers |
| Login id | Customer id (admin may still mean “the id inside the QR”) |

Admin screens, business portal, and new database objects use **business owner** language. Older plan files may still say “customer”; this plan replaces that for everything built from here on.

## Initials badge and display name

Do not greet the signed-in user as “Customer”.

**Initials badge** — a small circle (navy or blue background, white text). The text **inside the badge is always initials only**, never the full business name. Derive initials from **business name** when it is set: first letter of each word, up to two letters, uppercase. Examples: `Natkhat Media` → **NM**, `Lakeview Hotel` → **LH**. One word: first two letters if long enough, else one letter (`Spa` → **SP**).

Before **business name** is set, derive initials from **login id**: split on hyphens, take first letter of each segment, up to two letters (`natkhat-media` → **NM**; `natkhatmedia` → **NA** from first two characters of the id). Same helper everywhere (`src/lib/initials.ts`).

**Beside the badge** show the **full business name** as the main title once profile has it. Until then show the login id as the title, still with the login-id initials in the badge.

Use the badge + title pattern in:

- Business portal header (signed-in owner).
- Admin **business owners** list (each row: initials badge + business name, or login id if name empty).

Login id stays in secondary lines only (QR URL, sold for, created date). No full name inside the circle; no “Customer” label.

## What the business owner can do

- Sign in with `login_id` and password.
- Sign out.
- Set **business name**, **phone**, **Google Maps link**, and **brief** (all required).
- Add, rename, reorder, and delete **services** (at least one required for setup complete).
- Under each service, add, rename, reorder, and delete **products** (each service must have at least one product for setup complete).

They do not see sold price, admin tools, or other business owners. They do not see password hashes. Password change by the owner is out of scope for this plan.

## Setup complete (mandatory gate)

**Every** item below must be satisfied before `setup_complete` is true:

1. **Business name** — trimmed, 2–80 characters.
2. **Phone** — valid per app rules (India-friendly).
3. **Map link** — valid HTTPS Google Maps URL.
4. **Brief** — 20–2000 characters trimmed.
5. **Services** — count ≥ 1.
6. **Products** — every service has count ≥ 1.

Partial saves are allowed while editing (so one form can save its fields), but the dashboard shows a clear **setup checklist** with what is still missing. **`setup_complete`** is computed or stored on the `business_owners` row and updated whenever profile, services, or products change.

**Guest page (`/c/[loginId]`) in this plan:** if the business owner exists but `setup_complete` is false, show a short public message that the business is still setting up (no service/product picker, no review steps). Do **not** build plan 04 guest flow until this gate exists and works. When `setup_complete` is true, plan 04 may replace the placeholder with the real flow; until then the page must not pretend the flow is ready.

## Screens

- `/business/login` — login id and password. Copy: “Business owner sign in”. Link back to the marketing site, not admin.
- `/business` — home after sign-in: initials + business name, setup checklist until complete, links to profile and services.
- `/business/profile` — business name, phone, map link, brief (all required fields marked).
- `/business/services` — services and products management.

Same Zust Scan colours as admin: navy background, white cards, blue buttons. `robots: noindex` on all `/business/*`. No link to `/business/login` from the homepage.

## Login and session

Login checks `login_id` and password against **`business_owners.password_hash`** (bcrypt). Wrong credentials stay on the login page with a generic message.

httpOnly cookie **`zust_business`**, separate from `zust_admin`. HMAC-SHA256 with env **`ZUST_PORTAL_SECRET`**. Payload: `role: "business_owner"`, `loginId`, absolute `exp`. `SameSite=lax`, `Secure` in production, path `/`. Lifetime: 24 hours after sign-in unless adjusted in build.

All `/business/*` pages and `/api/business/*` routes require this session. Admin session does not grant access here.

## Database rename and schema

The admin table **`customers` is renamed to `business_owners`**. New installs use `business_owners` only. Existing projects run a migration script once (dev and production).

Run SQL from `supabase/business-owners.sql` (and migration from `customers` where that table already exists) in each Supabase project.

### Table `business_owners` (was `customers`)

| Column | Purpose |
| --- | --- |
| `id` | UUID primary key |
| `login_id` | Unique login and QR slug, lowercase |
| `password_hash` | bcrypt |
| `sold_price` | Whole rupees (admin only) |
| `business_name` | Display name; required for setup complete |
| `phone` | Required for setup complete |
| `map_link` | Required for setup complete |
| `brief` | Required for setup complete |
| `setup_complete` | Boolean, default false; true only when all mandatory rules pass |
| `created_at` | When admin created the row |
| `updated_at` | When profile or catalog last changed |

Same constraints as today on `login_id` and `sold_price`. RLS on; revoke `anon` / `authenticated`; grant `service_role` only.

### Table `business_services`

| Column | Purpose |
| --- | --- |
| `id` | UUID primary key |
| `business_owner_id` | FK → `business_owners.id`, on delete cascade |
| `name` | 1–80 chars |
| `sort_order` | Display order |

Unique per owner on normalized name.

### Table `business_products`

| Column | Purpose |
| --- | --- |
| `id` | UUID primary key |
| `service_id` | FK → `business_services.id`, on delete cascade |
| `name` | 1–80 chars |
| `sort_order` | Display order |

Unique per service on normalized name. Delete service → cascade products.

## Validation (app layer)

Same rules as before for phone, map link, brief, service and product names. **Business name** 2–80 chars. Limits: up to 20 services per owner; up to 50 products per service. Recompute **`setup_complete`** after every relevant save.

## Admin app updates (same plan)

When this plan is built, refactor admin to match:

- Code and Supabase queries use **`business_owners`**, not `customers`.
- UI copy: **Business owners**, **New business owner**, etc.
- `supabase/customers.sql` superseded by **`supabase/business-owners.sql`** plus optional **`supabase/migrate-customers-to-business-owners.sql`** for existing databases.
- File names like `src/lib/customers.ts` become **`business-owners.ts`** (or equivalent) as part of the build.

QR URL stays `/c/<login-id>`. Admin still does not edit owner profile fields.

## Environment

Add (Secret):

- **`ZUST_PORTAL_SECRET`** — signs `zust_business` cookies only.

Existing Supabase and admin env vars unchanged.

## App files (expected)

- `supabase/business-owners.sql`, migration from `customers` if needed.
- `src/lib/business-session.ts`, `src/lib/business-owners.ts`, `src/lib/business-portal.ts` (names may vary; no `customer-*` for new portal code).
- `src/lib/initials.ts` — business name → one or two letters for the badge.
- `src/app/business/...`, `src/app/api/business/...`
- `src/components/business/...`
- Admin and guest pages updated for table rename and guest **setup_complete** gate.

## Checks before this plan is done

- Admin creates a business owner; row lives in **`business_owners`**.
- Wrong password on `/business/login`; correct password reaches `/business` with **initials + business name** in header when name is set.
- Checklist blocks “ready for guests” until every mandatory item is done; then `setup_complete` is true.
- `/c/<login-id>` with incomplete setup shows setup-not-ready message, **not** guest review steps.
- `/c/<login-id>` with complete setup still shows plan-03 placeholder text until plan 04 (no fake guest flow).
- Sessions: admin vs business owner do not substitute.
- Another owner’s data cannot be read or changed.
- Secrets and hashes not in client bundle or git.

## Not in this plan

- Guest steps after setup is complete (plan 04).
- OpenAI review, Copy and Continue to Google.
- Business owner password change.
- Homepage enquiry changes.
