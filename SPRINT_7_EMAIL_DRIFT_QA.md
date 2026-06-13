# Sprint 7 — Email, trust og drift QA

Formålet er at sikre, at Naetworks emails og driftsflows føles professionelle og hjælper brugeren videre.

## Forudsætninger

Sæt i Vercel:

- `RESEND_API_KEY`
- `EMAIL_FROM`
- `TASK_RECEIVER_EMAIL`
- `APP_BASE_URL`
- `NEXT_PUBLIC_APP_URL`
- `ADMIN_PASSWORD`
- `ADMIN_SESSION_SECRET`

Kør seneste `database.sql` i Supabase.

## Email 1 — Kunde opretter opgave

1. Opret ny opgave på forsiden.
2. Bekræft at kunden modtager email: `Din Naetwork-opgave er modtaget`.
3. Bekræft at emailen indeholder:
   - Status
   - Foreløbig brief
   - Specialistretning
   - `Se din opgave` link
   - Klar forklaring af næste skridt
4. Bekræft at admin modtager email om ny opgave.

## Email 2 — Kunde tilføjer mere info

1. Åbn kundens opgaveside.
2. Tilføj ekstra information.
3. Bekræft at admin modtager email om ny kundeinformation.
4. Bekræft at informationen også vises i admin-dashboardet.

## Email 3 — Admin sender kundeopdatering

1. Log ind på `/admin`.
2. Opdater en opgave med status, specialistretning og næste skridt.
3. Kald admin-notifikationen for opgaven via API eller UI, når knappen er koblet på.
4. Bekræft at kunden modtager email med:
   - Status
   - Specialistretning
   - Næste skridt
   - Link til opgaven

## Email 4 — Specialist invitation

1. Godkend specialist i admin.
2. Vælg en opgave.
3. Inviter specialist.
4. Bekræft at specialisten modtager email med:
   - Opgavetitel
   - Specialistretning
   - Kort opgavebeskrivelse
   - Link til specialistområdet

## Email 5 — Specialist svarer

1. Åbn specialistområdet via email-link.
2. Svar `Interesseret`, `Ønsker mere info` eller `Ikke relevant`.
3. Bekræft at admin modtager email med specialistsvar.
4. Bekræft at svaret også vises på opgaven i admin-dashboardet.

## Trust-side

Test `/trust`.

Siden skal forklare:

- Naetwork gør opgaven klarere
- Første trin er uden binding
- Kunde og specialist aftaler pris/levering direkte
- Specialister kurateres

## Done-kriterie

Sprint 7 er done, når alle centrale emails er forståelige, professionelle og hjælper næste handling videre.
