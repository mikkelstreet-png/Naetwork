import crypto from "crypto";
import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

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

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const token = url.searchParams.get("token") || "";
    const email = await resolveSpecialist(token);

    if (!email) {
      return NextResponse.json({ error: "Linket er udløbet eller ugyldigt." }, { status: 401 });
    }

    const { data: profile, error: profileError } = await getSupabaseAdmin()
      .from("provider_applications")
      .select("id, created_at, name, email, skills, links, status, approved_at, preferred_task_types")
      .eq("email", email)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (profileError) throw new Error(profileError.message);

    const { data: invitations, error: invitationError } = await getSupabaseAdmin()
      .from("specialist_task_invitations")
      .select("id, created_at, task_id, specialist_email, status, response_note, responded_at")
      .eq("specialist_email", email)
      .order("created_at", { ascending: false });

    if (invitationError) throw new Error(invitationError.message);

    const taskIds = (invitations || []).map((item) => item.task_id).filter(Boolean);
    let tasks: unknown[] = [];

    if (taskIds.length > 0) {
      const { data: taskRows, error: taskError } = await getSupabaseAdmin()
        .from("tasks")
        .select("id, created_at, category, need, brief, status, specialist_direction, next_step")
        .in("id", taskIds);

      if (taskError) throw new Error(taskError.message);
      tasks = taskRows || [];
    }

    return NextResponse.json({ ok: true, email, profile, invitations: invitations || [], tasks });
  } catch (error) {
    console.error("Specialist dashboard failed", error);
    return NextResponse.json({ error: "Specialistområdet kunne ikke hentes lige nu." }, { status: 500 });
  }
}
