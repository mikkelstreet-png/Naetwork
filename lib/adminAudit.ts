import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

type AuditInput = {
  action: string;
  entityType: string;
  entityId?: string | null;
  metadata?: Record<string, unknown>;
};

export async function writeAdminAuditLog(input: AuditInput) {
  try {
    const { error } = await getSupabaseAdmin().from("admin_audit_log").insert({
      action: input.action,
      entity_type: input.entityType,
      entity_id: input.entityId || null,
      metadata: input.metadata || {}
    });

    if (error) console.error("Admin audit log failed", error.message);
  } catch (error) {
    console.error("Admin audit log failed", error);
  }
}
