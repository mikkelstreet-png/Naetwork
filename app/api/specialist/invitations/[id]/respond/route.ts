import crypto from "crypto";
import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { notifyAdminSpecialistResponse } from "@/lib/notifications";

type Context = { params: Promise<{ id: string }> };
type RequestBody = { token?: string; status?: string; note?: string };

const allowedStatuses = new Set(["interested", "not_relevant", "needs_more_info"]);
const hashValue = (value: string) => crypto.createHash("sha256").update(value).digest("hex");

async function resolveSpecialist(token: string) {
  const { data, error } = await getSupabaseAdmin()
    .from("specialist_access_tokens")
    .select("specialist_email, expires_at")
    .eq("token_hash", hashValue(token))
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return null;
  if (new Date(data.expires_at).getTime() < Date.now()) return null;
  return String(data.specialist_email || "").toLowerCase();
}

export async function POST(request: Request, context: Context) {
  try {
    const { id } = await context.params;
    const body = (await request.json()) as RequestBody;
    const token = body.token || "";
    const email = await resolveSpecialist(token);

    if (!email) {
      return NextResponse.json({ error: "Linket er udløbet eller ugyldigt." }, { status: 401 });
    }

    const nextStatus = String(body.status || "").trim();
    if (!allowedStatuses.has(nextStatus)) {
      return NextResponse.json({ error: "Vælg et gyldigt svar." }, { status: 400 });
    }

    const note = String(body.note || "").trim() || null;

    const { data: invitation, error } = await getSupabaseAdmin()
      .from("specialist_task_invitations")
      .update({
        status: nextStatus,
        response_note: note,
        responded_at: new Date().toISOString()
      })
      .eq("id", id)
      .eq("specialist_email", email)
      .select("task_id")
      .maybeSingle();

    if (error) throw new Error(error.message);

    await notifyAdminSpecialistResponse({
      taskId: String(invitation?.task_id || "Ukendt opgave"),
      specialistEmail: email,
      status: nextStatus,
      note
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Specialist invitation response failed", error);
    return NextResponse.json({ error: "Svaret kunne ikke gemmes lige nu." }, { status: 500 });
  }
}
