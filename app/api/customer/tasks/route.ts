import { NextResponse } from "next/server";
import { resolveCustomerAccessToken } from "@/lib/customerAccess";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const token = url.searchParams.get("token") || "";
    const access = await resolveCustomerAccessToken(token);

    if (!access) {
      return NextResponse.json({ error: "Linket er udløbet eller ugyldigt." }, { status: 401 });
    }

    const { data, error } = await getSupabaseAdmin()
      .from("tasks")
      .select("id, created_at, category, need, status, brief, specialist_direction, next_step")
      .eq("customer_email", access.customerEmail)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);

    return NextResponse.json({ ok: true, customerEmail: access.customerEmail, tasks: data || [] });
  } catch (error) {
    console.error("Customer tasks fetch failed", error);
    return NextResponse.json({ error: "Opgaver kunne ikke hentes lige nu." }, { status: 500 });
  }
}
