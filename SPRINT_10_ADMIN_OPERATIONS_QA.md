# Sprint 10 — Admin & Operations Excellence QA

Formålet er at gøre admin-dashboardet brugbart som reelt operations-center.

## Sider

- `/admin`
- `/admin/setup`

## Funktioner der skal testes

### 1. Opgavesøgning

Test at admin kan søge på:

- kunde-email
- opgavetitel
- kategori
- opgavebeskrivelse
- specialistretning

### 2. Filtre

Test filtre for:

- status
- kategori
- næste handling

Næste handling skal hjælpe admin med at se:

- Gennemgå opgave
- Sæt specialistretning
- Inviter specialist
- Afventer specialistsvar
- Send kundeopdatering

### 3. Opgavedetalje

Tjek at valgt opgave viser:

- titel
- kunde-email
- næste handling
- opgavebeskrivelse
- scope
- åbne spørgsmål
- kundeopdateringer
- invitationer

### 4. Admin-handlinger

Test:

- gem status
- gem specialistretning
- gem næste skridt
- gem intern note
- send kundeopdatering
- inviter specialist

### 5. Specialiststyring

Test:

- vælg specialist
- se kompetencer
- se links
- skift status
- gem foretrukne opgavetyper

### 6. Audit log

Tjek fanen `Audit log`.

Audit log skal vise seneste adminhandlinger, fx:

- task_updated
- provider_updated
- specialist_invited
- customer_notified
- expired_tokens_cleaned

### 7. Driftsoverblik

Top metrics skal give mening:

- åbne opgaver
- klar til invitation
- kundeinfo
- åbne invitationer

## Done-kriterie

Sprint 10 er done, når admin kan håndtere mange opgaver uden at miste overblik over næste handling.
