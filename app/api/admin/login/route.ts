import crypto from "crypto";
import { NextResponse } from "next/server";
import { getAdminPassword, setAdminSession } from "@/lib/adminSession";
import { checkRateLimit, rateLimitResponse } from "@/lib/rateLimit";

type RequestBody = { password?: string };

function safeCompare(left: string, right: string) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export async function POST(request: Request) {
  try {
    const limit = checkRateLimit(request, { scope: "admin-login", limit: 5, windowMs: 10 * 60 * 1000 });
    if (!limit.ok) return rateLimitResponse(limit.resetAt);

    const body = (await request.json()) as RequestBody;
    const password = String(body.password || "");
    const expected = getAdminPassword();

    if (!expected) {
      return NextResponse.json({ error: "Admin adgangskode mangler i miljøvariabler." }, { status: 500 });
    }

    if (!safeCompare(password, expected)) {
      return NextResponse.json({ error: "Forkert adgangskode." }, { status: 401 });
    }

    await setAdminSession();
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Admin login failed", error);
    return NextResponse.json({ error: "Admin-login fejlede." }, { status: 500 });
  }
}
