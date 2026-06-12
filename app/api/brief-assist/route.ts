import { NextResponse } from "next/server";

type BriefInput = {
  title?: string;
  category?: string;
  tags?: string[];
  scope?: string[];
  notIncluded?: string[];
  acceptance?: string[];
  budget?: string;
  deadline?: string;
};

function fallbackBrief(brief: BriefInput) {
  return {
    ...brief,
    ai_enabled: false,
    ai_note: "AI er ikke aktiveret endnu. Briefen er derfor regelbaseret.",
    clarification_questions: [
      "Hvad er den vigtigste forretningsmæssige effekt af løsningen?",
      "Hvad skal absolut være med i første version?",
      "Hvad må vente til en senere version?"
    ]
  };
}

function extractText(data: any) {
  if (typeof data?.output_text === "string") return data.output_text;
  const parts = data?.output?.flatMap((item: any) => item?.content || []) || [];
  return parts.map((part: any) => part?.text || "").filter(Boolean).join("\n");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const intake = body?.intake;
    const brief = body?.brief;

    if (!intake?.need || !brief?.category) {
      return NextResponse.json({ ok: false, error: "Mangler intake eller brief" }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    const model = process.env.OPENAI_BRIEF_MODEL || "gpt-5.5-mini";

    if (!apiKey) {
      return NextResponse.json({ ok: true, mode: "fallback_no_openai_key", brief: fallbackBrief(brief) });
    }

    const prompt = `Du er Naetworks brief-assistent. Du skal forbedre en projektbrief på dansk.

Principper:
- AI bruges kun til at fjerne friktion: omsæt uklart behov til klar brief.
- Resten af platformen er regelbaseret.
- Vær konkret, kort og professionel.
- Opfind ikke falske cases, priser, kunder eller garantier.
- Returnér KUN valid JSON uden markdown.

Returnér JSON med denne struktur:
{
  "title": string,
  "category": string,
  "tags": string[],
  "scope": string[],
  "notIncluded": string[],
  "acceptance": string[],
  "clarification_questions": string[],
  "provider_summary": string,
  "budget": string,
  "deadline": string,
  "ai_enabled": true
}

Kunde-intake:
${JSON.stringify(intake, null, 2)}

Regelbaseret brief:
${JSON.stringify(brief, null, 2)}`;

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        input: prompt,
        max_output_tokens: 1200
      })
    });

    if (!response.ok) {
      return NextResponse.json({ ok: true, mode: "fallback_openai_error", brief: fallbackBrief(brief), openaiStatus: response.status, openaiError: await response.text() });
    }

    const data = await response.json();
    const text = extractText(data);

    try {
      const enhanced = JSON.parse(text);
      return NextResponse.json({ ok: true, mode: "ai_enhanced", brief: enhanced });
    } catch {
      return NextResponse.json({ ok: true, mode: "fallback_parse_error", brief: fallbackBrief(brief), raw: text });
    }
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Ukendt fejl" }, { status: 500 });
  }
}
