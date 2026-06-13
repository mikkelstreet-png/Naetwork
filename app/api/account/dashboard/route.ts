import { NextResponse } from "next/server";
import { getAccountSession } from "@/lib/accountAuth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  try {
    const session = await getAccountSession();
    if (!session) return NextResponse.json({ error: "Du skal være logget ind." }, { status: 401 });

    const supabase = getSupabaseAdmin();
    const { data: account, error: accountError } = await supabase
      .from("user_accounts")
      .select("id, created_at, email, name, role, status, last_login_at")
      .eq("id", session.id)
      .maybeSingle();

    if (accountError) throw new Error(accountError.message);
    if (!account) return NextResponse.json({ error: "Brugeren blev ikke fundet." }, { status: 404 });

    const { data: tasks, error: taskError } = await supabase
      .from("tasks")
      .select("id, created_at, category, need, brief, status, specialist_direction, next_step")
      .eq("customer_email", account.email)
      .order("created_at", { ascending: false })
      .limit(50);

    if (taskError) throw new Error(taskError.message);

    const { data: provider, error: providerError } = await supabase
      .from("provider_applications")
      .select("id, created_at, name, email, skills, links, status, approved_at, preferred_task_types")
      .eq("email", account.email)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (providerError) throw new Error(providerError.message);

    const { data: invitations, error: invitationError } = await supabase
      .from("specialist_task_invitations")
      .select("id, created_at, task_id, specialist_email, status, response_note, responded_at")
      .eq("specialist_email", account.email)
      .order("created_at", { ascending: false })
      .limit(50);

    if (invitationError) throw new Error(invitationError.message);

    return NextResponse.json({ ok: true, account, tasks: tasks || [], provider, invitations: invitations || [] });
  } catch (error) {
    console.error("Account dashboard failed", error);
    return NextResponse.json({ error: "Konto kunne ikke hentes." }, { status: 500 });
  }
}
