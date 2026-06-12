import { NextResponse } from "next/server";
import { escapeHtml, insertIntoSupabase, sendAdminEmail } from "@/lib/naetworkIntegrations";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body?.name || !body?.email || !body?.skills) {
      return NextResponse.json({ ok: false, error: "Mangler navn, email eller kompetencer" }, { status: 400 });
    }

    const payload = {
      status: "pending",
      name: body.name,
      email: body.email,
      company: body.company || null,
      skills: body.skills,
      categories: body.categories || [],
      price_level: body.priceLevel || null,
      capacity: body.capacity || null,
      portfolio: body.portfolio || null,
      created_at: new Date().toISOString()
    };

    const db = await insertIntoSupabase("provider_applications", payload);
    const email = await sendAdminEmail({
      subject: `Ny Naetwork provider: ${body.name}`,
      replyTo: body.email,
      html: `
        <h2>Ny provider</h2>
        <p><strong>Navn:</strong> ${escapeHtml(body.name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(body.email)}</p>
        <p><strong>Firma:</strong> ${escapeHtml(body.company || "Ikke angivet")}</p>
        <p><strong>Kompetencer:</strong> ${escapeHtml(body.skills)}</p>
        <p><strong>Portfolio:</strong> ${escapeHtml(body.portfolio || "Ikke angivet")}</p>
      `
    });

    return NextResponse.json({ ok: true, mode: db.enabled || email.enabled ? "live_integrations" : "demo_no_env", db, email });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Ukendt fejl" }, { status: 500 });
  }
}
