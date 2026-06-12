type EmailInput = {
  subject: string;
  html: string;
  replyTo?: string;
};

type IntegrationResult = {
  enabled: boolean;
  ok: boolean;
  status?: number;
  message?: string;
};

export async function insertIntoSupabase(table: string, payload: Record<string, unknown>): Promise<IntegrationResult> {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    return { enabled: false, ok: true, message: "Supabase env vars not configured" };
  }

  const response = await fetch(`${url.replace(/\/$/, "")}/rest/v1/${table}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      Prefer: "return=representation"
    },
    body: JSON.stringify(payload)
  });

  return {
    enabled: true,
    ok: response.ok,
    status: response.status,
    message: response.ok ? "Inserted into Supabase" : await response.text()
  };
}

export async function sendAdminEmail(input: EmailInput): Promise<IntegrationResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const adminEmail = process.env.ADMIN_EMAIL;
  const fromEmail = process.env.RESEND_FROM_EMAIL || "Naetwork <onboarding@resend.dev>";

  if (!apiKey || !adminEmail) {
    return { enabled: false, ok: true, message: "Resend env vars not configured" };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: fromEmail,
      to: adminEmail,
      reply_to: input.replyTo,
      subject: input.subject,
      html: input.html
    })
  });

  return {
    enabled: true,
    ok: response.ok,
    status: response.status,
    message: response.ok ? "Email sent" : await response.text()
  };
}

export function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
