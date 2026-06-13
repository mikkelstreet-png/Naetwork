import { NextResponse } from "next/server";
import { getAccountSession } from "@/lib/accountAuth";
import { checkRateLimit, rateLimitResponse } from "@/lib/rateLimit";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { notifyTaskCreated } from "@/lib/notifications";

type RequestBody = {
  category?: string;
  need?: string;
  situation?: string;
  outcome?: string;
  audience?: string;
  budget?: string;
  deadline?: string;
};

const defaultCategory = "Ikke sikker endnu";

export async function POST(request: Request) {
  try {
    const session = await getAccountSession();
    if (!session) return NextResponse.json({ error: "Du skal være logget ind for at oprette en opgave." }, { status: 401 });

    const limit = checkRateLimit(request, { scope: "account-task-create", limit: 12, windowMs: 10 * 60 * 1000 });
    if (!limit.ok) return rateLimitResponse(limit.resetAt);

    const body = (await request.json()) as RequestBody;
    const category = String(body.category || defaultCategory).trim() || defaultCategory;
    const need = String(body.need || "").trim();
    const situation = String(body.situation || "").trim();
    const outcome = String(body.outcome || "").trim();
    const audience = String(body.audience || "").trim();
    const budget = String(body.budget || "").trim();
    const deadline = String(body.deadline || "").trim();

    if (need.length < 25) return NextResponse.json({ error: "Skriv lidt mere om opgaven." }, { status: 400 });
    if (outcome.length < 10) return NextResponse.json({ error: "Skriv kort, hvad du gerne vil opnå." }, { status: 400 });

    const brief = {
      title: category,
      raw_input: { need, situation, outcome, audience, budget, deadline },
      specialist: "Afklares af Naetwork",
      scope: [],
      questions: ["Hvad er vigtigst at opnå først?", "Hvilke eksisterende systemer eller links bør specialisten kende?"],
      status: "awaiting_ai_scope"
    };

    const { data, error } = await getSupabaseAdmin()
      .from("tasks")
      .insert({
        customer_email: session.email,
        category,
        need,
        audience,
        budget,
        deadline,
        brief,
        status: "new",
        source: "account"
      })
      .select("id")
      .single();

    if (error) throw new Error(error.message);

    await notifyTaskCreated({
      id: data.id,
      email: session.email,
      category,
      need,
      briefTitle: category,
      specialist: "Afklares af Naetwork",
      outcome
    });

    return NextResponse.json({ ok: true, id: data.id });
  } catch (error) {
    console.error("Account task creation failed", error);
    return NextResponse.json({ error: "Opgaven kunne ikke oprettes lige nu." }, { status: 500 });
  }
}
