# Naetwork

Naetwork is a Career Access platform: the access layer between a concrete career decision and people with relevant experience from the other side. Users start with their situation, not a profile catalogue, and move through Explore, Prepare, Apply, or Perform before reaching relevant professionals.

Every session lasts 60 minutes and is designed around a concrete outcome rather than time alone. A completed paid session uses the fixed revenue split defined by the product. Booking requests, profile review, and Resend transactional email automation are implemented. Payment remains intentionally disabled until the commercial, collection-through-sale, accounting, and legal setup is approved.

The canonical public entry points are `/start`, `/how-it-works`, `/sessions`, `/explore`, `/prepare`, `/apply`, and `/perform`. Legacy `/match` and `/onboarding` routes redirect to `/start`.

## Stack

- Next.js 15 and React 19
- Supabase Auth and Postgres
- Resend transactional email
- Tailwind CSS
- Vercel

## Local setup

Use Node.js 22.13 or newer.

1. Copy `.env.example` to `.env.local` and provide every value.
2. Apply the SQL files in `supabase/migrations` in numeric order.
3. Run `pnpm install`.
4. Run `pnpm dev`.

Use `pnpm check` during development. Run `pnpm check:release` with the production environment loaded before release. The release gate covers canonical product content, TypeScript, the production build, configuration validation, and responsive browser tests across desktop, tablet, Android-sized mobile, and mobile Safari.

## Production configuration

The following Vercel variables are required for Preview and Production:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_APP_URL`
- `APP_BASE_URL`
- `NEXT_PUBLIC_LEGAL_NAME`
- `NEXT_PUBLIC_LEGAL_ADDRESS`
- `NEXT_PUBLIC_LEGAL_REGISTRATION`
- `SUPPORT_EMAIL`

Set `NEXT_PUBLIC_SUPPORT_EMAIL` to the same address when the public contact address differs from `kontakt@naetwork.dk`.

Transactional email is required for release:

- `RESEND_API_KEY`
- `RESEND_WEBHOOK_SECRET`
- `CRON_SECRET`
- `EMAIL_FROM`

The Supabase URL must resolve publicly. When transactional email is activated, the Resend sender domain must also be verified. Configure the Supabase Auth site URL and redirect allow-list with:

- `https://naetwork.dk/auth/callback`
- the active Vercel production URL while the custom domain is being connected

The legal name, complete street address, and 8-digit CVR registration value must identify the actual data controller shown in the terms and privacy policy. Placeholder values intentionally fail release preflight.

## Admin bootstrap

Create the admin account through normal signup, then promote it once in the Supabase SQL editor:

```sql
update public.profiles
set role = 'admin'
where auth_user_id = (
  select id from auth.users where email = 'ADMIN_EMAIL_HERE'
);
```

Admin access is enforced server-side and by row-level security. Professional profiles are public only when `visibility = 'published'` and `review_status = 'approved'`.

## Launch behavior

- Candidate and professional signup require email confirmation.
- Welcome email is sent after confirmation.
- Booking requests are created through an authenticated server endpoint.
- Candidate and professional receive booking emails.
- Professionals can confirm or decline; candidates can cancel.
- Contact messages are stored in the admin inbox and notify the configured support address.
- Admins can run the published 12/24-month data-retention baseline from system administration after migration `007_data_retention.sql` is applied.
- Terms acceptance, privacy-notice versions, and the four-price database constraint require migration `008_consent_and_price_integrity.sql`.
- Fixed contribution choices and immutable booking-economics snapshots require migration `009_pricing_and_contribution_integrity.sql`.
- Auditable marketing consent timestamps and change history require migration `010_marketing_consent_audit.sql`.
- Public professional discovery, real availability, review records, and integration audit tables require migration `011_marketplace_foundation.sql`.
- Payment remains disabled and no card or charge is created.
- Payment must remain disabled until every critical legal blocker introduced in `006_legal_release_gates.sql` has been manually reviewed and resolved.
