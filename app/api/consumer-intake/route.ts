import { NextResponse } from "next/server";
import { escapeHtml, insertIntoSupabase, sendAdminEmail } from "@/lib/naetworkIntegrations";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const intake = body?.intake;
    const brief = body?.brief;

    if (!intake?.need || !intake?.category || !intake?.email) {
      return NextResponse.json({ ok: false, error: "Mangler behov, kategori eller email" }, { status: 400 });
    }

    const payload = {
      type: "consumer_intake",
      status: "new",
      name: intake.name || null,
      email: intake.email,
      category: intake.category,
      need: intake.need,
      audience: intake.audience || null,
      must_have: intake.mustHave || null,
      inspiration: intake.inspiration || null,
      budget: intake.budget || null,
      deadline: intake.deadline || null,
      brief,
      created_at: new Date().toISOString()
    };

    const db = await insertIntoSupabase("consumer_leads", payload);
    const email = await sendAdminEmail({
      subject: `Nyt Naetwork behov: ${intake.category}`,
      replyTo: intake.email,
      html: `
        <h2>Nyt consumer-behov</h2>
        <p><strong>Navn:</strong> ${escapeHtml(intake.name || "Ikke angivet")}</p>
        <p><strong>Email:</strong> ${escapeHtml(intake.email)}</p>
        <p><strong>Kategori:</strong> ${escapeHtml(intake.category)}</p>
        <p><strong>Budget:</strong> ${escapeHtml(intake.budget || "Afklares")}</p>
        <p><strong>Deadline:</strong> ${escapeHtml(intake.deadline || "Afklares")}</p>
        <hr />
        <p><strong>Behov:</strong></p>
        <p>${escapeHtml(intake.need)}</p>
        <p><strong>Automatisk brief:</strong></p>
        <pre style="white-space:pre-wrap;font-family:Arial,sans-serif;">${escapeHtml(JSON.stringify(brief, null, 2))}</pre>
      `
    });

    return NextResponse.json({ ok: true, mode: db.enabled || email.enabled ? "live_integrations" : "demo_no_env", db, email });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Ukendt fejl" }, { status: 500 });
  }
}
