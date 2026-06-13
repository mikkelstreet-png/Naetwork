# Sprint 8 — Sikkerhed og robusthed QA

Formålet er at gøre Naetwork mere robust før flere rigtige brugere.

## Database

Kør seneste `database.sql` i Supabase.

Tjek at disse tabeller findes:

- `tasks`
- `provider_applications`
- `customer_access_tokens`
- `specialist_access_tokens`
- `specialist_task_invitations`
- `task_customer_updates`
- `admin_audit_log`

## Miljøvariabler

Tjek i Vercel:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `APP_BASE_URL`
- `NEXT_PUBLIC_APP_URL`
- `RESEND_API_KEY`
- `EMAIL_FROM`
- `TASK_RECEIVER_EMAIL`
- `ADMIN_PASSWORD`
- `ADMIN_SESSION_SECRET`

## Rate limiting

Test at følgende endpoints begrænser gentagne forsøg:

- `POST /api/customer/login`
- `POST /api/specialist/login`
- `POST /api/admin/login`

Forventning:

- Efter for mange forsøg får brugeren HTTP 429
- Fejlen er menneskelig: `For mange forsøg. Vent lidt og prøv igen.`

## Admin audit log

Test at disse handlinger opretter audit-log:

- Admin opdaterer opgave
- Admin opdaterer specialist
- Admin inviterer specialist
- Admin sender kundeopdatering
- Admin rydder udløbne login-links

## Admin kontrol

Test:

- `/admin` uden session fejler pænt via API
- `/admin/login` virker kun med korrekt adgangskode
- `ADMIN_PASSWORD` må ikke være tom i production
- `ADMIN_SESSION_SECRET` skal være sat og være lang nok

## Token cleanup

Test endpoint:

- `POST /api/admin/maintenance/cleanup`

Forventning:

- Udløbne kunde-login tokens slettes
- Udløbne specialist-login tokens slettes
- Audit-log oprettes

## Kundeopdatering fra admin

Test i `/admin`:

1. Vælg en opgave
2. Opdater status/specialistretning/næste skridt
3. Klik `Send kundeopdatering`
4. Bekræft at kunden modtager email
5. Bekræft at audit-log oprettes

## Error handling

Test:

- Ugyldig email
- Manglende token
- Udløbet token
- Forkert admin-password
- Specialist der ikke er godkendt
- Specialist-invitation uden valgt specialist

## Done-kriterie

Sprint 8 er done, når platformen har:

- Rate limiting på login
- Admin audit log
- Token cleanup
- Admin kundeopdateringsknap
- Robuste fejlbeskeder
- Klar drift-checkliste
