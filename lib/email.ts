import { Resend } from "resend";

type EmailInput = {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
};

export const emailFrom = process.env.EMAIL_FROM || "no-reply@naetwork.dk";
export const taskReceiverEmail = process.env.TASK_RECEIVER_EMAIL || "mikkelstreet@outlook.dk";

export async function sendEmail({ to, subject, html, text }: EmailInput) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("Missing Resend API key.");
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const result = await resend.emails.send({ from: emailFrom, to, subject, html, text });

  if (result.error) {
    throw new Error(result.error.message);
  }

  return result.data;
}

export function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function renderList(items: unknown[]) {
  if (!Array.isArray(items) || items.length === 0) return "<p>Ingen punkter angivet.</p>";
  return `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
}
