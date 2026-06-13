import crypto from "crypto";
import { NextResponse } from "next/server";
import { escapeHtml, sendEmail } from "@/lib/email";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

type RequestBody = { email?: string };

const tokenHours = 48;
const normalizeEmail = (value: string) => String(value || "").trim().toLowerCase();
const validEmail = (value: string) => /^\S+@\S+\.\S+$/.test(normalizeEmail(value));
const hashValue = (value: string) => crypto.createHash("sha256").update(value).digest("hex");
const baseUrl = () => (process.env.APP_BASE_URL || process.env.NEXT_PUBLIC_APP_URL || "").replace(/\/$/, "");

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RequestBody;
    const email = normalizeEmail(body.email || "");

    if (!validEmail(email)) {
      return NextResponse.json({ error: "Indtast en gyldig email." }, { status: 400 });
    }

    const { data: application, error: appError } = await getSupabaseAdmin()
      .from("provider_applications")
      .select("id, name, email, status")
      .eq("email", email)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (appError) throw new Error(appError.message);

    const approvedStatuses = new Set(["approved", "godkendt", "active"]);
    if (!application || !approvedStatuses.has(String(application.status).toLowerCase())) {
      return NextResponse.json({ ok: true, pending: true });
    }

    const rawToken = crypto.randomBytes(32).toString("base64url");
    const expiresAt = new Date(Date.now() + tokenHours * 60 * 60 * 1000).toISOString();

    const { error: insertError } = await getSupabaseAdmin().from("specialist_access_tokens").insert({
      specialist_email: email,
      token_hash: hashValue(rawToken),
      expires_at: expiresAt
    });

    if (insertError) throw new Error(insertError.message);

    const link = `${baseUrl()}/specialist?token=${encodeURIComponent(rawToken)}`;

    await sendEmail({
      to: email,
      subject: "Specialist-adgang hos Naetwork",
      html: `
        <h1>Specialist-adgang hos Naetwork</h1>
        <p>Her er dit sikre link til specialistområdet.</p>
        <p><a href="${escapeHtml(link)}">Åbn specialistområdet</a></p>
        <p>Linket udløber ${escapeHtml(new Date(expiresAt).toLocaleString("da-DK"))}.</p>
        <p>Venlig hilsen<br />Naetwork</p>
      `,
      text: `Åbn specialistområdet hos Naetwork: ${link}\n\nLinket udløber ${new Date(expiresAt).toLocaleString("da-DK")}.`
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Specialist login failed", error);
    return NextResponse.json({ error: "Login-link kunne ikke sendes lige nu. Prøv igen om lidt." }, { status: 500 });
  }
}
