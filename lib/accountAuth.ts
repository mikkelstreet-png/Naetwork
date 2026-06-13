import crypto from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "naetwork_account";
const SESSION_HOURS = 24 * 14;
const ITERATIONS = 120000;

export type AccountSession = {
  id: string;
  email: string;
  role: "customer" | "specialist";
  expiresAt: number;
};

export function normalizeAccountEmail(value: string) {
  return String(value || "").trim().toLowerCase();
}

export function accountEmailLooksValid(value: string) {
  return /^\S+@\S+\.\S+$/.test(normalizeAccountEmail(value));
}

function sessionSecret() {
  return process.env.ACCOUNT_SESSION_SECRET || process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "";
}

function sign(value: string) {
  return crypto.createHmac("sha256", sessionSecret()).update(value).digest("hex");
}

export function hashAccountPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, ITERATIONS, 32, "sha256").toString("hex");
  return `pbkdf2_sha256$${ITERATIONS}$${salt}$${hash}`;
}

export function verifyAccountPassword(password: string, stored: string) {
  const parts = String(stored || "").split("$");
  if (parts.length !== 4 || parts[0] !== "pbkdf2_sha256") return false;

  const iterations = Number(parts[1]);
  const salt = parts[2];
  const hash = parts[3];
  if (!Number.isFinite(iterations) || !salt || !hash) return false;

  const candidate = crypto.pbkdf2Sync(password, salt, iterations, 32, "sha256").toString("hex");
  return Buffer.byteLength(candidate) === Buffer.byteLength(hash) && crypto.timingSafeEqual(Buffer.from(candidate), Buffer.from(hash));
}

export function createAccountSessionValue(input: Omit<AccountSession, "expiresAt">) {
  const payload: AccountSession = {
    ...input,
    expiresAt: Date.now() + SESSION_HOURS * 60 * 60 * 1000
  };
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${encoded}.${sign(encoded)}`;
}

export function verifyAccountSessionValue(value?: string): AccountSession | null {
  if (!value || !sessionSecret()) return null;
  const [encoded, received] = value.split(".");
  if (!encoded || !received) return null;

  const expected = sign(encoded);
  if (Buffer.byteLength(expected) !== Buffer.byteLength(received)) return null;
  if (!crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(received))) return null;

  try {
    const session = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as AccountSession;
    if (!session.id || !session.email || !session.role || !session.expiresAt) return null;
    if (session.expiresAt < Date.now()) return null;
    if (!new Set(["customer", "specialist"]).has(session.role)) return null;
    return session;
  } catch {
    return null;
  }
}

export async function setAccountSession(input: Omit<AccountSession, "expiresAt">) {
  const store = await cookies();
  store.set(COOKIE_NAME, createAccountSessionValue(input), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_HOURS * 60 * 60
  });
}

export async function getAccountSession() {
  const store = await cookies();
  return verifyAccountSessionValue(store.get(COOKIE_NAME)?.value);
}

export async function clearAccountSession() {
  const store = await cookies();
  store.set(COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0
  });
}
