# Naetwork

Naetwork connects candidates with experienced professionals from AI, Banking, Management Consulting, and Private Equity for focused 60-minute career sessions.

Every paid session contributes 40-90% of its listed price to Kræftens Bekæmpelse. Booking requests, profile review, and transactional emails are active. Payment is intentionally disabled until the commercial and legal setup is approved.

## Stack

- Next.js 15 and React 19
- Supabase Auth and Postgres
- Resend transactional email
- Tailwind CSS
- Vercel

## Local setup

Use Node.js 20 or newer.

1. Copy `.env.example` to `.env.local` and provide every value.
2. Apply the SQL files in `supabase/migrations` in numeric order.
3. Run `pnpm install`.
4. Run `pnpm dev`.

Use `pnpm check` during development. Run `pnpm check:release` with the production environment loaded before release. TypeScript, production build, and core configuration errors are release blockers.

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

Transactional email can remain pending until Resend is activated:

- `RESEND_API_KEY`
- `EMAIL_FROM`

The Supabase URL must resolve publicly. When transactional email is activated, the Resend sender domain must also be verified. Configure the Supabase Auth site URL and redirect allow-list with:

- `https://naetwork.dk/auth/callback`
- the active Vercel production URL while the custom domain is being connected

The legal name, address, and registration value must identify the actual data controller shown in the terms and privacy policy.

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
- Payment remains disabled and no card or charge is created.
