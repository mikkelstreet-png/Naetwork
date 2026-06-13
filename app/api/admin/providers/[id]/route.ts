import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/adminSession";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

type Context = { params: Promise<{ id: string }> };
type RequestBody = {
  status?: string;
  preferred_task_types?: string;
};

const allowedStatuses = new Set(["new", "approved", "rejected", "active", "paused"]);

function clean(value: unknown) {
  return String(value || "").trim();
}

export async function PATCH(request: Request, context: Context) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: "Ikke autoriseret." }, { status: 401 });
    }

    const { id } = await context.params;
    const body = (await request.json()) as RequestBody;
    const updates: Record<string, string | null> = {};

    if (body.status !== undefined) {
      const status = clean(body.status);
      if (!allowedStatuses.has(status)) {
        return NextResponse.json({ error: "Ugyldig status." }, { status: 400 });
      }
      updates.status = status;
      if (status === "approved" || status === "active") updates.approved_at = new Date().toISOString();
    }

    if (body.preferred_task_types !== undefined) updates.preferred_task_types = clean(body.preferred_task_types) || null;

    const { error } = await getSupabaseAdmin().from("provider_applications").update(updates).eq("id", id);
    if (error) throw new Error(error.message);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Admin provider update failed", error);
    return NextResponse.json({ error: "Specialisten kunne ikke opdateres." }, { status: 500 });
  }
}
