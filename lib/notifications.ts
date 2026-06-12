import { escapeHtml, sendEmail, taskReceiverEmail } from "@/lib/email";

type TaskNotice = {
  id?: string;
  email: string;
  category: string;
  need: string;
};

type ProviderNotice = {
  id?: string;
  name: string;
  email: string;
  skills: string;
  links?: string;
};

export async function notifyTaskCreated(task: TaskNotice) {
  const adminHtml = `<h1>Ny Naetwork opgave</h1><p><strong>ID:</strong> ${escapeHtml(task.id)}</p><p><strong>Email:</strong> ${escapeHtml(task.email)}</p><p><strong>Kategori:</strong> ${escapeHtml(task.category)}</p><p>${escapeHtml(task.need)}</p>`;
  const receiptHtml = `<h1>Din opgave er modtaget</h1><p>Tak fordi du har sendt din opgave til Naetwork.</p><p>Næste skridt er at gennemgå briefen og finde relevante specialistretninger.</p><p>Der er ingen betaling og ingen binding på dette trin.</p><p>Venlig hilsen<br />Naetwork</p>`;

  await sendEmail({
    to: taskReceiverEmail,
    subject: `Ny Naetwork opgave: ${task.category}`,
    html: adminHtml,
    text: `Ny Naetwork opgave\nID: ${task.id}\nEmail: ${task.email}\nKategori: ${task.category}\n\n${task.need}`
  });

  await sendEmail({
    to: task.email,
    subject: "Din opgave er modtaget hos Naetwork",
    html: receiptHtml,
    text: "Tak fordi du har sendt din opgave til Naetwork. Der er ingen betaling og ingen binding på dette trin."
  });
}

export async function notifyProviderCreated(provider: ProviderNotice) {
  const adminHtml = `<h1>Ny specialistansøgning</h1><p><strong>ID:</strong> ${escapeHtml(provider.id)}</p><p><strong>Navn:</strong> ${escapeHtml(provider.name)}</p><p><strong>Email:</strong> ${escapeHtml(provider.email)}</p><p><strong>Kompetencer:</strong></p><p>${escapeHtml(provider.skills)}</p><p><strong>Links:</strong> ${escapeHtml(provider.links)}</p>`;
  const receiptHtml = `<h1>Tak for din interesse</h1><p>Vi har modtaget din interesse i at blive en del af Naetworks specialistnetværk.</p><p>Vi vender tilbage, når der er relevante næste skridt.</p><p>Venlig hilsen<br />Naetwork</p>`;

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
    text: "Tak for din interesse i Naetwork. Vi vender tilbage, når der er relevante næste skridt."
  });
}
