import { escapeHtml, sendEmail, taskReceiverEmail } from "@/lib/email";

type TaskNotice = {
  id?: string;
  email: string;
  category: string;
  need: string;
  briefTitle?: string;
  specialist?: string;
  outcome?: string;
  taskUrl?: string;
};

type ProviderNotice = {
  id?: string;
  name: string;
  email: string;
  skills: string;
  links?: string;
};

type CustomerUpdateNotice = {
  taskId: string;
  customerEmail: string;
  message: string;
};

type SpecialistResponseNotice = {
  taskId: string;
  specialistEmail: string;
  status: string;
  note?: string | null;
};

type CustomerTaskUpdateNotice = {
  to: string;
  taskTitle: string;
  status: string;
  specialistDirection?: string | null;
  nextStep?: string | null;
  taskUrl?: string;
};

const statusCopy: Record<string, string> = {
  new: "Modtaget",
  reviewing: "Under gennemgang",
  direction_ready: "Specialistretning klar",
  specialist_invited: "Specialist inviteret",
  awaiting_specialist: "Afventer specialist",
  ready_for_customer: "Klar til næste skridt",
  follow_up_ready: "Klar til opfølgning",
  closed: "Lukket"
};

const responseCopy: Record<string, string> = {
  interested: "Interesseret",
  needs_more_info: "Ønsker mere info",
  not_relevant: "Ikke relevant",
  invited: "Inviteret"
};

function statusLabel(value: string) {
  return statusCopy[value] || value || "Opdateret";
}

function responseLabel(value: string) {
  return responseCopy[value] || value || "Svar modtaget";
}

function baseEmailLayout(title: string, body: string) {
  return `
    <div style="font-family:Arial,sans-serif;max-width:680px;margin:0 auto;color:#0f172a;line-height:1.6">
      <div style="padding:24px 0;border-bottom:1px solid #e2e8f0;margin-bottom:24px">
        <div style="font-size:20px;font-weight:800;color:#071527">Naetwork</div>
        <div style="font-size:13px;color:#64748b">Gør uklare digitale opgaver klare nok til at blive løst.</div>
      </div>
      <h1 style="font-size:28px;line-height:1.15;margin:0 0 16px;color:#071527">${escapeHtml(title)}</h1>
      ${body}
      <hr style="border:none;border-top:1px solid #e2e8f0;margin:28px 0" />
      <p style="font-size:13px;color:#64748b">Naetwork hjælper med at gøre opgaver klarere. Aftaler om pris, levering, rettigheder, betaling, tidsplan og kvalitet indgås direkte mellem kunde og specialist, medmindre andet er aftalt skriftligt.</p>
      <p style="font-size:14px;color:#0f172a">Venlig hilsen<br />Naetwork</p>
    </div>
  `;
}

export async function notifyTaskCreated(task: TaskNotice) {
  const briefTitle = task.briefTitle || "Foreløbig brief under afklaring";
  const specialist = task.specialist || "Specialistretning afklares";
  const outcome = task.outcome || "Næste skridt afklares ud fra opgaven.";
  const taskLinkHtml = task.taskUrl
    ? `<p><a href="${escapeHtml(task.taskUrl)}" style="display:inline-block;background:#071527;color:#fff;text-decoration:none;border-radius:999px;padding:12px 18px;font-weight:800">Se din opgave</a></p>`
    : "";
  const taskLinkText = task.taskUrl ? `\n\nSe din opgave: ${task.taskUrl}` : "";

  const adminHtml = baseEmailLayout(
    "Ny Naetwork opgave",
    `
      <p><strong>ID:</strong> ${escapeHtml(task.id)}</p>
      <p><strong>Email:</strong> ${escapeHtml(task.email)}</p>
      <p><strong>Kategori:</strong> ${escapeHtml(task.category)}</p>
      <p><strong>Foreløbig specialistretning:</strong> ${escapeHtml(specialist)}</p>
      <p><strong>Ønsket resultat:</strong> ${escapeHtml(outcome)}</p>
      <h2 style="font-size:18px;margin-top:24px;color:#071527">Opgave</h2>
      <p>${escapeHtml(task.need)}</p>
    `
  );

  const receiptHtml = baseEmailLayout(
    "Din opgave er modtaget",
    `
      <p>Tak fordi du har sendt din opgave til Naetwork.</p>
      <p><strong>Status:</strong> Modtaget</p>
      <p><strong>Foreløbig brief:</strong> ${escapeHtml(briefTitle)}</p>
      <p><strong>Foreløbig specialistretning:</strong> ${escapeHtml(specialist)}</p>
      <p><strong>Det ønskede resultat:</strong> ${escapeHtml(outcome)}</p>
      ${taskLinkHtml}
      <h2 style="font-size:18px;margin-top:24px;color:#071527">Hvad sker der nu?</h2>
      <ol>
        <li>Opgaven gennemgås og gøres klarere.</li>
        <li>Eventuelle åbne spørgsmål identificeres.</li>
        <li>Du kan følge status og tilføje mere information via dit opgavelink.</li>
      </ol>
    `
  );

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
    text: `Din opgave er modtaget hos Naetwork.\n\nStatus: Modtaget\nForeløbig brief: ${briefTitle}\nForeløbig specialistretning: ${specialist}\nØnsket resultat: ${outcome}${taskLinkText}\n\nNæste skridt er at gennemgå opgaven, gøre den klarere og identificere eventuelle åbne spørgsmål.`
  });
}

export async function notifyProviderCreated(provider: ProviderNotice) {
  const adminHtml = baseEmailLayout(
    "Ny specialistansøgning",
    `<p><strong>ID:</strong> ${escapeHtml(provider.id)}</p><p><strong>Navn:</strong> ${escapeHtml(provider.name)}</p><p><strong>Email:</strong> ${escapeHtml(provider.email)}</p><h2 style="font-size:18px;margin-top:24px;color:#071527">Kompetencer</h2><p>${escapeHtml(provider.skills)}</p><p><strong>Links:</strong> ${escapeHtml(provider.links)}</p>`
  );
  const receiptHtml = baseEmailLayout(
    "Tak for din interesse",
    `<p>Vi har modtaget din interesse i at blive en del af Naetworks specialistnetværk.</p><p>Naetwork arbejder med bedre briefs, så specialister kan bruge mindre tid på uklare henvendelser og mere tid på relevante opgaver.</p><p>Vi vender tilbage, når der er relevante næste skridt.</p>`
  );

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

export async function notifyAdminCustomerUpdate(update: CustomerUpdateNotice) {
  await sendEmail({
    to: taskReceiverEmail,
    subject: `Kunde har tilføjet info til opgave ${update.taskId.slice(0, 8)}`,
    html: baseEmailLayout(
      "Kunde har tilføjet mere information",
      `<p><strong>Opgave:</strong> ${escapeHtml(update.taskId)}</p><p><strong>Kunde:</strong> ${escapeHtml(update.customerEmail)}</p><h2 style="font-size:18px;margin-top:24px;color:#071527">Ny information</h2><p>${escapeHtml(update.message)}</p>`
    ),
    text: `Kunde har tilføjet mere information\nOpgave: ${update.taskId}\nKunde: ${update.customerEmail}\n\n${update.message}`
  });
}

export async function notifyAdminSpecialistResponse(response: SpecialistResponseNotice) {
  await sendEmail({
    to: taskReceiverEmail,
    subject: `Specialist har svaret: ${responseLabel(response.status)}`,
    html: baseEmailLayout(
      "Specialist har svaret på en opgave",
      `<p><strong>Opgave:</strong> ${escapeHtml(response.taskId)}</p><p><strong>Specialist:</strong> ${escapeHtml(response.specialistEmail)}</p><p><strong>Svar:</strong> ${escapeHtml(responseLabel(response.status))}</p>${response.note ? `<h2 style="font-size:18px;margin-top:24px;color:#071527">Note</h2><p>${escapeHtml(response.note)}</p>` : ""}`
    ),
    text: `Specialist har svaret\nOpgave: ${response.taskId}\nSpecialist: ${response.specialistEmail}\nSvar: ${responseLabel(response.status)}\n\n${response.note || ""}`
  });
}

export async function notifyCustomerTaskUpdated(update: CustomerTaskUpdateNotice) {
  const linkHtml = update.taskUrl
    ? `<p><a href="${escapeHtml(update.taskUrl)}" style="display:inline-block;background:#071527;color:#fff;text-decoration:none;border-radius:999px;padding:12px 18px;font-weight:800">Åbn din opgave</a></p>`
    : "";

  await sendEmail({
    to: update.to,
    subject: `Din Naetwork-opgave er opdateret: ${statusLabel(update.status)}`,
    html: baseEmailLayout(
      "Din opgave er opdateret",
      `<p><strong>Opgave:</strong> ${escapeHtml(update.taskTitle)}</p><p><strong>Status:</strong> ${escapeHtml(statusLabel(update.status))}</p>${update.specialistDirection ? `<p><strong>Specialistretning:</strong> ${escapeHtml(update.specialistDirection)}</p>` : ""}${update.nextStep ? `<h2 style="font-size:18px;margin-top:24px;color:#071527">Næste skridt</h2><p>${escapeHtml(update.nextStep)}</p>` : ""}${linkHtml}`
    ),
    text: `Din opgave er opdateret\n\nOpgave: ${update.taskTitle}\nStatus: ${statusLabel(update.status)}\nSpecialistretning: ${update.specialistDirection || "Afklares"}\nNæste skridt: ${update.nextStep || "Afklares"}\n${update.taskUrl || ""}`
  });
}
