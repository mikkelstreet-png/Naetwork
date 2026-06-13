import { NextResponse } from "next/server";
import { buildCustomerTaskUrl, createCustomerAccessToken, emailLooksValid, normalizeEmail } from "@/lib/customerAccess";
import { escapeHtml, sendEmail } from "@/lib/email";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

type RequestBody = { email?: string };

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RequestBody;
    const email = normalizeEmail(body.email || "");

    if (!emailLooksValid(email)) {
      return NextResponse.json({ error: "Indtast en gyldig email." }, { status: 400 });
    }

    const { data: tasks, error } = await getSupabaseAdmin()
      .from("tasks")
      .select("id, created_at, category, status")
      .eq("customer_email", email)
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) throw new Error(error.message);

    // Return generic success even if no tasks exist to avoid account enumeration.
    if (!tasks || tasks.length === 0) {
      return NextResponse.json({ ok: true });
    }

    const { token, expiresAt } = await createCustomerAccessToken(email);
    const link = buildCustomerTaskUrl(token);

    const taskListHtml = tasks
      .map((task) => `<li>${escapeHtml(task.category)} · ${escapeHtml(task.status)} · ${escapeHtml(new Date(task.created_at).toLocaleDateString("da-DK"))}</li>`)
      .join("");

    await sendEmail({
      to: email,
      subject: "Se din opgave hos Naetwork",
      html: `
        <h1>Se din opgave hos Naetwork</h1>
        <p>Her er dit sikre link til dine opgaver og næste skridt.</p>
        <p><a href="${escapeHtml(link)}">Åbn Min opgave</a></p>
        <p>Linket udløber ${escapeHtml(new Date(expiresAt).toLocaleString("da-DK"))}.</p>
        <h2>Dine seneste opgaver</h2>
        <ul>${taskListHtml}</ul>
        <p>Venlig hilsen<br />Naetwork</p>
      `,
      text: `Se din opgave hos Naetwork: ${link}\n\nLinket udløber ${new Date(expiresAt).toLocaleString("da-DK")}.`
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Customer login failed", error);
    return NextResponse.json({ error: "Login-link kunne ikke sendes lige nu. Prøv igen om lidt." }, { status: 500 });
  }
}
