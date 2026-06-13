import crypto from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "naetwork_admin";
const SESSION_HOURS = 12;

function secret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "";
}

export function getAdminPassword() {
  return process.env.ADMIN_PASSWORD || "";
}

function sign(value: string) {
  return crypto.createHmac("sha256", secret()).update(value).digest("hex");
}

export function createAdminSessionValue() {
  const expires = Date.now() + SESSION_HOURS * 60 * 60 * 1000;
  const nonce = crypto.randomBytes(16).toString("hex");
  const payload = `${expires}.${nonce}`;
  return `${payload}.${sign(payload)}`;
}

export function verifyAdminSessionValue(value?: string) {
  if (!value || !secret()) return false;
  const parts = value.split(".");
  if (parts.length !== 3) return false;

  const payload = `${parts[0]}.${parts[1]}`;
  const expected = sign(payload);
  const received = parts[2];

  if (!crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(received))) return false;
  const expires = Number(parts[0]);
  return Number.isFinite(expires) && expires > Date.now();
}

export async function isAdminAuthenticated() {
  const store = await cookies();
  return verifyAdminSessionValue(store.get(COOKIE_NAME)?.value);
}

export async function setAdminSession() {
  const store = await cookies();
  store.set(COOKIE_NAME, createAdminSessionValue(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_HOURS * 60 * 60
  });
}

export async function clearAdminSession() {
  const store = await cookies();
  store.set(COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0
  });
}
