import { NextResponse } from "next/server";
import { normalizeAccountEmail, setAccountSession, verifyAccountPassword } from "@/lib/accountAuth";
import { checkRateLimit, rateLimitResponse } from "@/lib/rateLimit";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

type RequestBody = { email?: string; password?: string };

export async function POST(request: Request) {
  try {
    const limit = checkRateLimit(request, { scope: "account-login", limit: 8, windowMs: 10 * 60 * 1000 });
    if (!limit.ok) return rateLimitResponse(limit.resetAt);

    const body = (await request.json()) as RequestBody;
    const email = normalizeAccountEmail(body.email || "");
    const password = String(body.password || "");

    const { data: account, error } = await getSupabaseAdmin()
      .from("user_accounts")
      .select("id, email, role, password_hash, status")
      .eq("email", email)
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!account || account.status !== "active" || !verifyAccountPassword(password, account.password_hash)) {
      return NextResponse.json({ error: "Email eller adgangskode er forkert." }, { status: 401 });
    }

    await getSupabaseAdmin().from("user_accounts").update({ last_login_at: new Date().toISOString() }).eq("id", account.id);
    await setAccountSession({ id: account.id, email: account.email, role: account.role });

    return NextResponse.json({ ok: true, role: account.role });
  } catch (error) {
    console.error("Account login failed", error);
    return NextResponse.json({ error: "Login fejlede lige nu." }, { status: 500 });
  }
}
