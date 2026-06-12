import { NextResponse } from "next/server";

const present = (value: string | undefined) => Boolean(value && value.trim().length > 0);

export async function GET() {
  const checks = {
    supabaseUrl: present(process.env.SUPABASE_URL),
    supabaseServiceRoleKey: present(process.env.SUPABASE_SERVICE_ROLE_KEY),
    resendApiKey: present(process.env.RESEND_API_KEY),
    emailFrom: present(process.env.EMAIL_FROM),
    taskReceiverEmail: present(process.env.TASK_RECEIVER_EMAIL)
  };

  const requiredReady = checks.supabaseUrl && checks.supabaseServiceRoleKey && checks.resendApiKey;

  return NextResponse.json({
    ok: requiredReady,
    service: "naetwork",
    checks,
    message: requiredReady
      ? "Naetwork backend configuration is present."
      : "Missing required backend configuration. Check Vercel environment variables."
  }, { status: requiredReady ? 200 : 503 });
}
