import { NextResponse } from "next/server";
import { resolveCustomerAccessToken } from "@/lib/customerAccess";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

type Context = { params: Promise<{ id: string }> };

export async function GET(request: Request, context: Context) {
  try {
    const { id } = await context.params;
    const url = new URL(request.url);
    const token = url.searchParams.get("token") || "";
    const access = await resolveCustomerAccessToken(token);

    if (!access) {
      return NextResponse.json({ error: "Linket er udløbet eller ugyldigt." }, { status: 401 });
    }

    const { data: task, error } = await getSupabaseAdmin()
      .from("tasks")
      .select("id, created_at, customer_email, category, need, audience, budget, deadline, brief, status, specialist_direction, next_step")
      .eq("id", id)
      .eq("customer_email", access.customerEmail)
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!task) return NextResponse.json({ error: "Opgaven blev ikke fundet." }, { status: 404 });

    const { data: updates, error: updatesError } = await getSupabaseAdmin()
      .from("task_customer_updates")
      .select("id, created_at, message, source")
      .eq("task_id", id)
      .eq("customer_email", access.customerEmail)
      .order("created_at", { ascending: false });

    if (updatesError) throw new Error(updatesError.message);

    return NextResponse.json({ ok: true, task, updates: updates || [] });
  } catch (error) {
    console.error("Customer task fetch failed", error);
    return NextResponse.json({ error: "Opgaven kunne ikke hentes lige nu." }, { status: 500 });
  }
}
