# Sprint 5 — End-to-end QA for Naetwork

Denne checkliste bruges til at teste hele flowet uden manuelle database-hacks.

## Forudsætninger

Sæt miljøvariabler i Vercel:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`
- `EMAIL_FROM`
- `TASK_RECEIVER_EMAIL`
- `APP_BASE_URL`
- `NEXT_PUBLIC_APP_URL`
- `ADMIN_PASSWORD`
- `ADMIN_SESSION_SECRET`

Kør seneste `database.sql` i Supabase.

## Flow 1 — Kunde opretter opgave

1. Gå til forsiden.
2. Klik `Start med en kort beskrivelse`.
3. Vælg opgavetype.
4. Udfyld behov, situation, resultat og detaljer.
5. Send opgaven.
6. Bekræft at success-siden vises.
7. Bekræft at end-to-end boksen vises nederst: `Se min opgave`.
8. Klik `Se min opgave`.
9. Bekræft at `/opgave/[id]` åbner.
10. Bekræft at opgaven viser status, brief, scope, specialistretning og næste skridt.

## Flow 2 — Kunde tilføjer mere info

1. Åbn kundens opgaveside.
2. Skriv en ekstra opdatering i `Tilføj mere information`.
3. Klik `Tilføj til opgaven`.
4. Bekræft at opdateringen gemmes.
5. Bekræft at opdateringen vises under `Dine tilføjelser`.

## Flow 3 — Admin håndterer opgaven

1. Gå til `/admin/login`.
2. Log ind med admin-adgangskode.
3. Åbn `/admin`.
4. Find den nye opgave i opgavelisten.
5. Skift status til `Under gennemgang`.
6. Tilføj specialistretning.
7. Tilføj næste skridt.
8. Tilføj intern note.
9. Klik `Gem opgave`.
10. Genindlæs siden og bekræft at ændringerne stadig er gemt.

## Flow 4 — Admin godkender specialist

1. Gå til fanen `Specialister`.
2. Vælg en specialistansøgning.
3. Skift status til `Godkendt` eller `Aktiv`.
4. Tilføj foretrukne opgavetyper.
5. Klik `Gem specialist`.
6. Gå tilbage til opgavefanen.
7. Bekræft at specialisten kan vælges under `Inviter specialist`.

## Flow 5 — Admin inviterer specialist

1. Vælg en opgave.
2. Vælg en godkendt specialist.
3. Skriv en kort note.
4. Klik `Send invitation`.
5. Bekræft at opgaven ændrer status til `Specialist inviteret`.
6. Bekræft at invitationen vises under `Invitationer på opgaven`.
7. Bekræft at specialist-email sendes.

## Flow 6 — Specialist svarer

1. Åbn specialistens login-link fra email.
2. Bekræft at `/specialist` viser profil og opgaveinvitation.
3. Åbn opgavekortet.
4. Tilføj eventuelt en note.
5. Klik en af:
   - `Interesseret`
   - `Ønsker mere info`
   - `Ikke relevant`
6. Gå tilbage til `/admin`.
7. Bekræft at specialistens svar og note vises på opgaven.

## Flow 7 — Visuel QA

Test disse sider på mobil og desktop:

- `/`
- `/login`
- `/opgave`
- `/opgave/[id]`
- `/specialist/login`
- `/specialist`
- `/admin/login`
- `/admin`

Tjek:

- Ingen clipped tekst
- Ingen vandret scroll
- Knapper er nemme at trykke på
- Status er tydelig
- Tomme states giver mening
- Fejlbeskeder er menneskelige
- Lange opgaver ødelægger ikke layoutet

## Done-kriterie

Sprint 5 er done, når hele flowet kan gennemføres:

Kundeopgave → kundeopgaveside → admin-opdatering → specialistgodkendelse → specialistinvitation → specialistsvar → admin-overblik.
