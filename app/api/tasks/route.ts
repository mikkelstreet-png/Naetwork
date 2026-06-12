import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { notifyTaskCreated } from "@/lib/notifications";

type RequestBody = { intake?: Record<string, unknown>; email?: string; brief?: Record<string, unknown> };

const emailLooksValid = (value: string) => /^\S+@\S+\.\S+$/.test(value.trim());
const toText = (value: unknown) => String(value || "").trim();

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RequestBody;
    const intake = body.intake || {};
    const brief = body.brief || {};
    const contact = toText(body.email).toLowerCase();
    const need = toText(intake.need);
    const category = toText(intake.category) || "Ikke sikker";
    const outcome = toText(intake.outcome);
    const briefTitle = toText(brief.title);
    const specialist = toText(brief.specialist);

    if (need.length < 30) return NextResponse.json({ error: "Skriv lidt mere om opgaven." }, { status: 400 });
    if (!emailLooksValid(contact)) return NextResponse.json({ error: "Indtast en gyldig email." }, { status: 400 });

    const { data, error } = await getSupabaseAdmin().from("tasks").insert({
      customer_email: contact,
      category,
      need,
      audience: toText(intake.audience) || null,
      budget: toText(intake.budget) || null,
      deadline: toText(intake.deadline) || null,
      brief,
      status: "new",
      source: "website"
    }).select("id").single();

    if (error) throw new Error(error.message);

    await notifyTaskCreated({
      id: data?.id,
      email: contact,
      category,
      need,
      briefTitle,
      specialist,
      outcome
    });

    return NextResponse.json({ ok: true, id: data?.id });
  } catch (error) {
    console.error("Task submission failed", error);
    return NextResponse.json({ error: "Opgaven kunne ikke sendes lige nu. Prøv igen om lidt." }, { status: 500 });
  }
}
