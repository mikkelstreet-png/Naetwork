import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

type RequestBody = {
  intake?: Record<string, unknown>;
  email?: string;
  brief?: Record<string, unknown>;
};

function emailLooksValid(value: string) {
  return /^\S+@\S+\.\S+$/.test(value.trim());
}

function toText(value: unknown) {
  return String(value || "").trim();
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RequestBody;
    const intake = body.intake || {};
    const email = toText(body.email).toLowerCase();
    const need = toText(intake.need);
    const category = toText(intake.category) || "Ikke sikker";

    if (need.length < 30) {
      return NextResponse.json({ error: "Skriv lidt mere om opgaven." }, { status: 400 });
    }

    if (!emailLooksValid(email)) {
      return NextResponse.json({ error: "Indtast en gyldig email." }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("tasks")
      .insert({
        customer_email: email,
        category,
        need,
        audience: toText(intake.audience) || null,
        budget: toText(intake.budget) || null,
        deadline: toText(intake.deadline) || null,
        brief: body.brief || {},
        status: "new",
        source: "website"
      })
      .select("id")
      .single();

    if (error) throw new Error(error.message);

    return NextResponse.json({ ok: true, id: data?.id });
  } catch (error) {
    console.error("Task submission failed", error);
    return NextResponse.json({ error: "Opgaven kunne ikke sendes lige nu. Prøv igen om lidt." }, { status: 500 });
  }
}
