# Naetwork launch checklist

Denne checklist bruges til Sprint 5: backend, emails og live-kvalitet.

## 1. Vercel environment variables

Følgende skal ligge i Vercel under Project Settings -> Environment Variables:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`
- `EMAIL_FROM` = `no-reply@naetwork.dk`
- `TASK_RECEIVER_EMAIL` = den email, der skal modtage nye opgaver

Health check:

- Besøg `/api/health`
- Den skal returnere `ok: true`
- Den må ikke vise hemmelige nøgler

## 2. Supabase database

Kør `database.sql` i Supabase SQL editor.

Tjek at disse tabeller findes:

- `tasks`
- `provider_applications`

Tjek at nye opgaver får status `new`.

## 3. Resend

Tjek i Resend:

- Domænet `naetwork.dk` er verificeret
- Afsenderen `no-reply@naetwork.dk` virker
- Email sender ikke fra en midlertidig testadresse

## 4. Test opgaveflow

Gennemfør en rigtig test på hjemmesiden:

1. Opret opgave
2. Vælg opgavetype
3. Udfyld alle trin
4. Send opgaven
5. Tjek at opgaven ligger i Supabase
6. Tjek at intern email modtages
7. Tjek at brugerens kvitteringsmail modtages

## 5. Test specialistflow

1. Gå til For specialister
2. Udfyld ansøgning
3. Send ansøgningen
4. Tjek at ansøgningen ligger i Supabase
5. Tjek at intern email modtages
6. Tjek at specialisten får kvittering

## 6. Fejlscenarier

Test følgende:

- Ugyldig email
- For kort opgavebeskrivelse
- Manglende Supabase env vars
- Manglende Resend env vars

Brugeren må aldrig se tekniske fejl som `500 server error`.

## 7. Før offentlig brug

Før Naetwork bruges kommercielt:

- Gennemgå vilkår med jurist
- Bekræft privatlivspolitik
- Bekræft cookie-setup
- Test på mobil
- Test på desktop
- Test på Safari og Chrome
- Lav mindst 3 rigtige testopgaver
