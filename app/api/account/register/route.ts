import { NextResponse } from "next/server";
import { accountEmailLooksValid, hashAccountPassword, normalizeAccountEmail, setAccountSession } from "@/lib/accountAuth";
import { checkRateLimit, rateLimitResponse } from "@/lib/rateLimit";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

type RequestBody = {
  name?: string;
  email?: string;
  password?: string;
  role?: string;
};

const allowedRoles = new Set(["customer", "specialist"]);

export async function POST(request: Request) {
  try {
    const limit = checkRateLimit(request, { scope: "account-register", limit: 8, windowMs: 10 * 60 * 1000 });
    if (!limit.ok) return rateLimitResponse(limit.resetAt);

    const body = (await request.json()) as RequestBody;
    const name = String(body.name || "").trim();
    const email = normalizeAccountEmail(body.email || "");
    const password = String(body.password || "");
    const role = String(body.role || "customer").trim();

    if (name.length < 2) return NextResponse.json({ error: "Skriv dit navn eller firmanavn." }, { status: 400 });
    if (!accountEmailLooksValid(email)) return NextResponse.json({ error: "Indtast en gyldig email." }, { status: 400 });
    if (password.length < 8) return NextResponse.json({ error: "Adgangskoden skal være mindst 8 tegn." }, { status: 400 });
    if (!allowedRoles.has(role)) return NextResponse.json({ error: "Vælg om du er kunde eller specialist." }, { status: 400 });

    const supabase = getSupabaseAdmin();
    const { data: existing, error: existingError } = await supabase
      .from("user_accounts")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (existingError) throw new Error(existingError.message);
    if (existing) return NextResponse.json({ error: "Der findes allerede en bruger med den email." }, { status: 409 });

    const { data, error } = await supabase
      .from("user_accounts")
      .insert({
        name,
        email,
        role,
        password_hash: hashAccountPassword(password),
        status: "active"
      })
      .select("id, email, role")
      .single();

    if (error) throw new Error(error.message);

    await setAccountSession({ id: data.id, email: data.email, role: data.role });

    return NextResponse.json({ ok: true, role: data.role });
  } catch (error) {
    console.error("Account registration failed", error);
    return NextResponse.json({ error: "Brugeren kunne ikke oprettes lige nu." }, { status: 500 });
  }
}
