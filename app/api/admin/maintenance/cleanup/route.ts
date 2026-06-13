import { NextResponse } from "next/server";
import { writeAdminAuditLog } from "@/lib/adminAudit";
import { isAdminAuthenticated } from "@/lib/adminSession";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST() {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: "Ikke autoriseret." }, { status: 401 });
    }

    const now = new Date().toISOString();
    const supabase = getSupabaseAdmin();

    const customerCleanup = await supabase.from("customer_access_tokens").delete().lt("expires_at", now);
    const specialistCleanup = await supabase.from("specialist_access_tokens").delete().lt("expires_at", now);

    if (customerCleanup.error) throw new Error(customerCleanup.error.message);
    if (specialistCleanup.error) throw new Error(specialistCleanup.error.message);

    await writeAdminAuditLog({
      action: "expired_tokens_cleaned",
      entityType: "maintenance",
      metadata: { cleanedAt: now }
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Token cleanup failed", error);
    return NextResponse.json({ error: "Oprydning kunne ikke gennemføres." }, { status: 500 });
  }
}
