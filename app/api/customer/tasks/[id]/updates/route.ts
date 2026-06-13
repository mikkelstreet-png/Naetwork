import { NextResponse } from "next/server";
import { resolveCustomerAccessToken } from "@/lib/customerAccess";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { notifyAdminCustomerUpdate } from "@/lib/notifications";

type Context = { params: Promise<{ id: string }> };
type RequestBody = { token?: string; message?: string };

export async function POST(request: Request, context: Context) {
  try {
    const { id } = await context.params;
    const body = (await request.json()) as RequestBody;
    const token = body.token || "";
    const message = String(body.message || "").trim();
    const access = await resolveCustomerAccessToken(token);

    if (!access) {
      return NextResponse.json({ error: "Linket er udløbet eller ugyldigt." }, { status: 401 });
    }

    if (message.length < 10) {
      return NextResponse.json({ error: "Skriv lidt mere, så opdateringen bliver brugbar." }, { status: 400 });
    }

    const { data: task, error: taskError } = await getSupabaseAdmin()
      .from("tasks")
      .select("id")
      .eq("id", id)
      .eq("customer_email", access.customerEmail)
      .maybeSingle();

    if (taskError) throw new Error(taskError.message);
    if (!task) return NextResponse.json({ error: "Opgaven blev ikke fundet." }, { status: 404 });

    const { error } = await getSupabaseAdmin().from("task_customer_updates").insert({
      task_id: id,
      customer_email: access.customerEmail,
      message,
      source: "customer"
    });

    if (error) throw new Error(error.message);

    await notifyAdminCustomerUpdate({
      taskId: id,
      customerEmail: access.customerEmail,
      message
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Customer task update failed", error);
    return NextResponse.json({ error: "Opdateringen kunne ikke sendes lige nu." }, { status: 500 });
  }
}
