import { LegalPage, LegalSection } from "@/components/LegalPage";

export default function CookiesPage() {
  return (
    <LegalPage eyebrow="Cookies" title="Cookie- og lokal lagringspolitik">
      <p className="rounded-2xl bg-slate-50 p-4 text-slate-600">
        Naetworks MVP bør som udgangspunkt kun bruge nødvendige tekniske funktioner. Hvis der senere tilføjes statistik, marketing eller tredjepartstracking, bør cookiepolitikken og samtykkeflowet opdateres.
      </p>

      <LegalSection title="1. Nødvendige funktioner">
        <p>Naetwork kan bruge nødvendige tekniske funktioner for at få hjemmesiden til at fungere, eksempelvis browserens lokale lagring til at huske, at cookieinformationen er blevet vist.</p>
        <p>Disse funktioner bruges ikke til markedsføring.</p>
      </LegalSection>

      <LegalSection title="2. Statistik og analyse">
        <p>Hvis Naetwork senere bruger analyseværktøjer til at forstå trafik, klik eller brugeradfærd, bør brugeren informeres tydeligt, og der bør indhentes samtykke, hvor det er påkrævet.</p>
      </LegalSection>

      <LegalSection title="3. Marketingcookies">
        <p>Naetwork bruger i MVP-versionen ikke marketingcookies som en central del af løsningen.</p>
        <p>Hvis marketingcookies senere tilføjes, bør brugeren kunne acceptere eller afvise dem særskilt.</p>
      </LegalSection>

      <LegalSection title="4. Ændring af valg">
        <p>Da MVP-versionen primært bruger en simpel informationsbanner, kan brugeren rydde browserdata eller lokal lagring for at nulstille valget.</p>
      </LegalSection>

      <LegalSection title="5. Kontakt">
        <p>Spørgsmål om cookies og lokal lagring kan sendes til Naetwork via de kontaktoplysninger, der fremgår af hjemmesiden.</p>
      </LegalSection>
    </LegalPage>
  );
}
