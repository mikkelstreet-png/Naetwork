import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/adminSession";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

const requiredEnv = [
  "SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "APP_BASE_URL",
  "NEXT_PUBLIC_APP_URL",
  "RESEND_API_KEY",
  "EMAIL_FROM",
  "TASK_RECEIVER_EMAIL",
  "ADMIN_PASSWORD",
  "ADMIN_SESSION_SECRET",
  "ACCOUNT_SESSION_SECRET"
];

const requiredTables = [
  "tasks",
  "provider_applications",
  "user_accounts",
  "customer_access_tokens",
  "specialist_access_tokens",
  "specialist_task_invitations",
  "task_customer_updates",
  "admin_audit_log"
];

async function checkTable(table: string) {
  try {
    const { error } = await getSupabaseAdmin().from(table).select("id", { head: true }).limit(1);
    return { table, ok: !error, error: error?.message || "" };
  } catch (error) {
    return { table, ok: false, error: error instanceof Error ? error.message : "Ukendt fejl" };
  }
}

export async function GET() {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: "Ikke autoriseret." }, { status: 401 });
    }

    const env = requiredEnv.map((name) => ({
      name,
      ok: Boolean(process.env[name]),
      valuePreview: process.env[name] ? "sat" : "mangler"
    }));

    const tables = await Promise.all(requiredTables.map(checkTable));
    const envOk = env.every((item) => item.ok);
    const databaseOk = tables.every((item) => item.ok);
    const emailOk = Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM && process.env.TASK_RECEIVER_EMAIL);

    return NextResponse.json({
      ok: true,
      summary: {
        envOk,
        databaseOk,
        emailConfigured: emailOk,
        readyForEndToEndTest: envOk && databaseOk && emailOk
      },
      env,
      tables,
      nextActions: [
        envOk ? null : "Sæt manglende miljøvariabler i Vercel.",
        databaseOk ? null : "Kør seneste database.sql i Supabase SQL Editor.",
        emailOk ? null : "Bekræft RESEND_API_KEY, EMAIL_FROM og TASK_RECEIVER_EMAIL. Bekræft også afsenderdomæne hos email-provider."
      ].filter(Boolean)
    });
  } catch (error) {
    console.error("Admin setup status failed", error);
    return NextResponse.json({ error: "Setup-status kunne ikke hentes." }, { status: 500 });
  }
}
