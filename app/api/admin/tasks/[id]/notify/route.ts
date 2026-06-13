import { NextResponse } from "next/server";
import { writeAdminAuditLog } from "@/lib/adminAudit";
import { isAdminAuthenticated } from "@/lib/adminSession";
import { buildCustomerTaskUrl, createCustomerAccessToken } from "@/lib/customerAccess";
import { notifyCustomerTaskUpdated } from "@/lib/notifications";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

type Context = { params: Promise<{ id: string }> };

export async function POST(_request: Request, context: Context) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: "Ikke autoriseret." }, { status: 401 });
    }

    const { id } = await context.params;
    const { data: task, error } = await getSupabaseAdmin()
      .from("tasks")
      .select("id, customer_email, category, brief, status, specialist_direction, next_step")
      .eq("id", id)
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!task) return NextResponse.json({ error: "Opgaven blev ikke fundet." }, { status: 404 });

    const access = await createCustomerAccessToken(String(task.customer_email));
    const taskUrl = buildCustomerTaskUrl(access.token, id);
    const brief = task.brief as Record<string, unknown> | null;
    const title = String(brief?.title || task.category || "Din opgave");

    await notifyCustomerTaskUpdated({
      to: String(task.customer_email),
      taskTitle: title,
      status: String(task.status || "updated"),
      specialistDirection: task.specialist_direction ? String(task.specialist_direction) : String(brief?.specialist || ""),
      nextStep: task.next_step ? String(task.next_step) : null,
      taskUrl
    });

    await writeAdminAuditLog({
      action: "customer_notified",
      entityType: "task",
      entityId: id,
      metadata: { customerEmail: task.customer_email, status: task.status }
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Admin customer notification failed", error);
    return NextResponse.json({ error: "Kundeopdateringen kunne ikke sendes." }, { status: 500 });
  }
}
