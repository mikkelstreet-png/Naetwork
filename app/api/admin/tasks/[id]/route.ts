import { NextResponse } from "next/server";
import { writeAdminAuditLog } from "@/lib/adminAudit";
import { isAdminAuthenticated } from "@/lib/adminSession";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

type Context = { params: Promise<{ id: string }> };
type RequestBody = {
  status?: string;
  specialist_direction?: string;
  next_step?: string;
  internal_note?: string;
};

const allowedStatuses = new Set([
  "new",
  "received",
  "reviewing",
  "direction_ready",
  "specialist_invited",
  "awaiting_specialist",
  "ready_for_customer",
  "follow_up_ready",
  "closed"
]);

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
    }

    if (body.specialist_direction !== undefined) updates.specialist_direction = clean(body.specialist_direction) || null;
    if (body.next_step !== undefined) updates.next_step = clean(body.next_step) || null;
    if (body.internal_note !== undefined) updates.internal_note = clean(body.internal_note) || null;

    const { error } = await getSupabaseAdmin().from("tasks").update(updates).eq("id", id);
    if (error) throw new Error(error.message);

    await writeAdminAuditLog({
      action: "task_updated",
      entityType: "task",
      entityId: id,
      metadata: { fields: Object.keys(updates), status: updates.status || undefined }
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Admin task update failed", error);
    return NextResponse.json({ error: "Opgaven kunne ikke opdateres." }, { status: 500 });
  }
}
