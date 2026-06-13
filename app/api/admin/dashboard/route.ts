import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/adminSession";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: "Ikke autoriseret." }, { status: 401 });
    }

    const supabase = getSupabaseAdmin();

    const [tasksResult, providersResult, invitationsResult, updatesResult, auditResult] = await Promise.all([
      supabase
        .from("tasks")
        .select("id, created_at, customer_email, category, need, audience, budget, deadline, brief, status, specialist_direction, next_step, internal_note")
        .order("created_at", { ascending: false })
        .limit(150),
      supabase
        .from("provider_applications")
        .select("id, created_at, name, email, skills, links, status, approved_at, preferred_task_types")
        .order("created_at", { ascending: false })
        .limit(150),
      supabase
        .from("specialist_task_invitations")
        .select("id, created_at, task_id, specialist_email, status, response_note, responded_at")
        .order("created_at", { ascending: false })
        .limit(150),
      supabase
        .from("task_customer_updates")
        .select("id, created_at, task_id, customer_email, message, source")
        .order("created_at", { ascending: false })
        .limit(150),
      supabase
        .from("admin_audit_log")
        .select("id, created_at, action, entity_type, entity_id, metadata")
        .order("created_at", { ascending: false })
        .limit(100)
    ]);

    if (tasksResult.error) throw new Error(tasksResult.error.message);
    if (providersResult.error) throw new Error(providersResult.error.message);
    if (invitationsResult.error) throw new Error(invitationsResult.error.message);
    if (updatesResult.error) throw new Error(updatesResult.error.message);

    return NextResponse.json({
      ok: true,
      tasks: tasksResult.data || [],
      providers: providersResult.data || [],
      invitations: invitationsResult.data || [],
      updates: updatesResult.data || [],
      audit: auditResult.error ? [] : auditResult.data || [],
      auditWarning: auditResult.error?.message || ""
    });
  } catch (error) {
    console.error("Admin dashboard failed", error);
    return NextResponse.json({ error: "Admin-dashboard kunne ikke hentes." }, { status: 500 });
  }
}
