# Naetwork — Setup og go-live

Denne guide bruges, når kodebasen er deployet, men Supabase, Vercel og email-domæne stadig skal bekræftes.

## 1. Supabase database

Gå til Supabase:

1. Åbn dit project.
2. Gå til SQL Editor.
3. Kopiér hele database.sql fra repoet.
4. Kør scriptet.
5. Tjek at de centrale tabeller findes.

Tabeller der skal findes:

- tasks
- provider_applications
- customer_access_tokens
- specialist_access_tokens
- specialist_task_invitations
- task_customer_updates
- admin_audit_log

## 2. Vercel environment variables

Gå til Vercel project settings og sæt alle nødvendige miljøvariabler.

Du skal bruge variabler til:

- Supabase URL
- Supabase service role key
- App base URL
- Public app URL
- Resend API key
- Email-afsender
- Admin-modtager email
- Admin-password
- Admin-session secret

App URL skal være dit rigtige production-domæne.

## 3. Email-domæne

Hvis du sender fra et Naetwork-domæne, skal domænet bekræftes hos email-provider, fx Resend.

Tjek:

- SPF
- DKIM
- eventuelt DMARC
- at domænestatus er verified

## 4. Admin setup-side

Når miljøvariabler og admin-password er sat:

1. Gå til /admin/login.
2. Log ind.
3. Gå til /admin/setup.
4. Tjek at miljø, database og email står OK.

## 5. End-to-end test

Test følgende:

1. Kunde opretter opgave.
2. Kunde modtager email.
3. Kunde åbner Se min opgave.
4. Admin ser opgaven.
5. Admin opdaterer status, specialistretning og næste skridt.
6. Admin sender kundeopdatering.
7. Specialist godkendes.
8. Specialist inviteres.
9. Specialist svarer.
10. Admin ser specialistens svar.

## 6. Før offentlig deling

Del ikke bredt, før:

- /admin/setup viser klar status
- kunde-email virker
- specialist-email virker
- admin-login virker
- mindst én testopgave er gennemført end-to-end
