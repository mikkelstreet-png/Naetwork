import crypto from "crypto";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

const TOKEN_BYTES = 32;
const TOKEN_TTL_HOURS = 48;

export function normalizeEmail(email: string) {
  return String(email || "").trim().toLowerCase();
}

export function emailLooksValid(email: string) {
  return /^\S+@\S+\.\S+$/.test(normalizeEmail(email));
}

export function hashAccessToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function createRawAccessToken() {
  return crypto.randomBytes(TOKEN_BYTES).toString("base64url");
}

export function getBaseUrl() {
  return (process.env.APP_BASE_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/$/, "");
}

export function buildCustomerTaskUrl(token: string, taskId?: string) {
  const path = taskId ? `/opgave/${encodeURIComponent(taskId)}` : "/opgave";
  return `${getBaseUrl()}${path}?token=${encodeURIComponent(token)}`;
}

export async function createCustomerAccessToken(email: string) {
  const normalizedEmail = normalizeEmail(email);
  const token = createRawAccessToken();
  const tokenHash = hashAccessToken(token);
  const expiresAt = new Date(Date.now() + TOKEN_TTL_HOURS * 60 * 60 * 1000).toISOString();

  const { error } = await getSupabaseAdmin().from("customer_access_tokens").insert({
    customer_email: normalizedEmail,
    token_hash: tokenHash,
    expires_at: expiresAt
  });

  if (error) throw new Error(error.message);

  return { token, expiresAt, customerEmail: normalizedEmail };
}

export async function resolveCustomerAccessToken(token: string) {
  const tokenHash = hashAccessToken(String(token || ""));

  const { data, error } = await getSupabaseAdmin()
    .from("customer_access_tokens")
    .select("id, customer_email, expires_at, used_at")
    .eq("token_hash", tokenHash)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return null;
  if (new Date(data.expires_at).getTime() < Date.now()) return null;

  return {
    id: data.id as string,
    customerEmail: data.customer_email as string,
    expiresAt: data.expires_at as string
  };
}
