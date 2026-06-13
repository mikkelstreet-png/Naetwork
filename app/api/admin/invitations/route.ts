import crypto from "crypto";
import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/adminSession";
import { escapeHtml, sendEmail } from "@/lib/email";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

type RequestBody = { task_id?: string; specialist_email?: string; note?: string };

const tokenHours = 48;
const clean = (value: unknown) => String(value || "").trim();
const normalizeEmail = (value: unknown) => clean(value).toLowerCase();
const validEmail = (value: string) => /^\S+@\S+\.\S+$/.test(value);
const hashValue = (value: string) => crypto.createHash("sha256").update(value).digest("hex");
const baseUrl = () => (process.env.APP_BASE_URL || process.env.NEXT_PUBLIC_APP_URL || "").replace(/\/$/, "");

export async function POST(request: Request) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: "Ikke autoriseret." }, { status: 401 });
    }

    const body = (await request.json()) as RequestBody;
    const taskId = clean(body.task_id);
    const specialistEmail = normalizeEmail(body.specialist_email);
    const note = clean(body.note);

    if (!taskId) return NextResponse.json({ error: "Vælg en opgave." }, { status: 400 });
    if (!validEmail(specialistEmail)) return NextResponse.json({ error: "Vælg en gyldig specialist-email." }, { status: 400 });

    const supabase = getSupabaseAdmin();

    const { data: provider, error: providerError } = await supabase
      .from("provider_applications")
      .select("id, name, email, status")
      .eq("email", specialistEmail)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (providerError) throw new Error(providerError.message);
    if (!provider) return NextResponse.json({ error: "Specialisten findes ikke." }, { status: 404 });

    const providerStatus = String(provider.status || "").toLowerCase();
    if (!new Set(["approved", "active", "godkendt"]).has(providerStatus)) {
      return NextResponse.json({ error: "Specialisten skal godkendes før invitation." }, { status: 400 });
    }

    const { data: task, error: taskError } = await supabase
      .from("tasks")
      .select("id, category, need, brief, specialist_direction")
      .eq("id", taskId)
      .maybeSingle();

    if (taskError) throw new Error(taskError.message);
    if (!task) return NextResponse.json({ error: "Opgaven findes ikke." }, { status: 404 });

    const { error: invitationError } = await supabase.from("specialist_task_invitations").insert({
      task_id: taskId,
      specialist_email: specialistEmail,
      status: "invited",
      response_note: note || null
    });

    if (invitationError) throw new Error(invitationError.message);

    await supabase.from("tasks").update({ status: "specialist_invited" }).eq("id", taskId);

    const rawToken = crypto.randomBytes(32).toString("base64url");
    const expiresAt = new Date(Date.now() + tokenHours * 60 * 60 * 1000).toISOString();
    await supabase.from("specialist_access_tokens").insert({
      specialist_email: specialistEmail,
      token_hash: hashValue(rawToken),
      expires_at: expiresAt
    });

    const link = `${baseUrl()}/specialist?token=${encodeURIComponent(rawToken)}`;
    const brief = task.brief as Record<string, unknown> | null;
    const title = clean(brief?.title) || clean(task.category) || "Ny opgave";
    const specialistDirection = clean(task.specialist_direction) || clean(brief?.specialist) || "Specialistretning matcher din profil";

    await sendEmail({
      to: specialistEmail,
      subject: `Ny Naetwork-opgave: ${title}`,
      html: `
        <h1>Ny opgaveinvitation hos Naetwork</h1>
        <p>Du er inviteret til at vurdere en opgave.</p>
        <p><strong>Opgave:</strong> ${escapeHtml(title)}</p>
        <p><strong>Retning:</strong> ${escapeHtml(specialistDirection)}</p>
        <p><strong>Kort beskrivelse:</strong></p>
        <p>${escapeHtml(task.need)}</p>
        ${note ? `<p><strong>Note fra Naetwork:</strong> ${escapeHtml(note)}</p>` : ""}
        <p><a href="${escapeHtml(link)}">Åbn specialistområdet</a></p>
        <p>Linket udløber ${escapeHtml(new Date(expiresAt).toLocaleString("da-DK"))}.</p>
        <p>Venlig hilsen<br />Naetwork</p>
      `,
      text: `Ny opgaveinvitation hos Naetwork\n\nOpgave: ${title}\nRetning: ${specialistDirection}\n\n${task.need}\n\nÅbn specialistområdet: ${link}`
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Admin invitation failed", error);
    return NextResponse.json({ error: "Invitationen kunne ikke sendes." }, { status: 500 });
  }
}
