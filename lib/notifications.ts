import { escapeHtml, sendEmail, taskReceiverEmail } from "@/lib/email";

type TaskNotice = {
  id?: string;
  email: string;
  category: string;
  need: string;
  briefTitle?: string;
  specialist?: string;
  outcome?: string;
};

type ProviderNotice = {
  id?: string;
  name: string;
  email: string;
  skills: string;
  links?: string;
};

export async function notifyTaskCreated(task: TaskNotice) {
  const briefTitle = task.briefTitle || "Foreløbig brief under afklaring";
  const specialist = task.specialist || "Specialistretning afklares";
  const outcome = task.outcome || "Næste skridt afklares ud fra opgaven.";

  const adminHtml = `
    <h1>Ny Naetwork opgave</h1>
    <p><strong>ID:</strong> ${escapeHtml(task.id)}</p>
    <p><strong>Email:</strong> ${escapeHtml(task.email)}</p>
    <p><strong>Kategori:</strong> ${escapeHtml(task.category)}</p>
    <p><strong>Foreløbig specialistretning:</strong> ${escapeHtml(specialist)}</p>
    <p><strong>Ønsket resultat:</strong> ${escapeHtml(outcome)}</p>
    <hr />
    <p><strong>Opgave:</strong></p>
    <p>${escapeHtml(task.need)}</p>
  `;

  const receiptHtml = `
    <h1>Din opgave er modtaget</h1>
    <p>Tak fordi du har sendt din opgave til Naetwork.</p>
    <p><strong>Status:</strong> Modtaget</p>
    <p><strong>Foreløbig brief:</strong> ${escapeHtml(briefTitle)}</p>
    <p><strong>Foreløbig specialistretning:</strong> ${escapeHtml(specialist)}</p>
    <p><strong>Det ønskede resultat:</strong> ${escapeHtml(outcome)}</p>
    <h2>Hvad sker der nu?</h2>
    <ol>
      <li>Opgaven gennemgås og gøres klarere.</li>
      <li>Eventuelle åbne spørgsmål identificeres.</li>
      <li>Hvis opgaven er relevant, kan næste skridt være kontakt til en specialistretning.</li>
    </ol>
    <p>Der er ingen betaling og ingen binding på dette trin. Aftaler om pris, levering og rammer indgås direkte mellem kunde og specialist, medmindre andet aftales skriftligt.</p>
    <p>Venlig hilsen<br />Naetwork</p>
  `;

  await sendEmail({
    to: taskReceiverEmail,
    subject: `Ny Naetwork opgave: ${task.category}`,
    html: adminHtml,
    text: `Ny Naetwork opgave\nID: ${task.id}\nEmail: ${task.email}\nKategori: ${task.category}\nSpecialistretning: ${specialist}\nØnsket resultat: ${outcome}\n\n${task.need}`
  });

  await sendEmail({
    to: task.email,
    subject: "Din Naetwork-opgave er modtaget",
    html: receiptHtml,
    text: `Din opgave er modtaget hos Naetwork.\n\nStatus: Modtaget\nForeløbig brief: ${briefTitle}\nForeløbig specialistretning: ${specialist}\nØnsket resultat: ${outcome}\n\nNæste skridt er at gennemgå opgaven, gøre den klarere og identificere eventuelle åbne spørgsmål. Der er ingen betaling og ingen binding på dette trin.`
  });
}

export async function notifyProviderCreated(provider: ProviderNotice) {
  const adminHtml = `<h1>Ny specialistansøgning</h1><p><strong>ID:</strong> ${escapeHtml(provider.id)}</p><p><strong>Navn:</strong> ${escapeHtml(provider.name)}</p><p><strong>Email:</strong> ${escapeHtml(provider.email)}</p><p><strong>Kompetencer:</strong></p><p>${escapeHtml(provider.skills)}</p><p><strong>Links:</strong> ${escapeHtml(provider.links)}</p>`;
  const receiptHtml = `<h1>Tak for din interesse</h1><p>Vi har modtaget din interesse i at blive en del af Naetworks specialistnetværk.</p><p>Naetwork arbejder med bedre briefs, så specialister kan bruge mindre tid på uklare henvendelser og mere tid på relevante opgaver.</p><p>Vi vender tilbage, når der er relevante næste skridt.</p><p>Venlig hilsen<br />Naetwork</p>`;

  await sendEmail({
    to: taskReceiverEmail,
    subject: `Ny specialistansøgning: ${provider.name}`,
    html: adminHtml,
    text: `Ny specialistansøgning\nID: ${provider.id}\nNavn: ${provider.name}\nEmail: ${provider.email}\n\n${provider.skills}\n\n${provider.links || ""}`
  });

  await sendEmail({
    to: provider.email,
    subject: "Vi har modtaget din interesse hos Naetwork",
    html: receiptHtml,
    text: "Tak for din interesse i Naetwork. Vi arbejder med bedre briefs, så specialister kan bruge mindre tid på uklare henvendelser. Vi vender tilbage, når der er relevante næste skridt."
  });
}
