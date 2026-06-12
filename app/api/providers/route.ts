import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

type RequestBody = {
  name?: string;
  email?: string;
  skills?: string;
  links?: string;
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
    const name = toText(body.name);
    const email = toText(body.email).toLowerCase();
    const skills = toText(body.skills);
    const links = toText(body.links);

    if (name.length < 2) {
      return NextResponse.json({ error: "Skriv dit navn eller firmanavn." }, { status: 400 });
    }

    if (!emailLooksValid(email)) {
      return NextResponse.json({ error: "Indtast en gyldig email." }, { status: 400 });
    }

    if (skills.length < 20) {
      return NextResponse.json({ error: "Skriv lidt mere om dine kompetencer og opgavetyper." }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("provider_applications")
      .insert({
        name,
        email,
        skills,
        links: links || null,
        status: "new",
        source: "website"
      })
      .select("id")
      .single();

    if (error) throw new Error(error.message);

    return NextResponse.json({ ok: true, id: data?.id });
  } catch (error) {
    console.error("Provider application failed", error);
    return NextResponse.json({ error: "Ansøgningen kunne ikke sendes lige nu. Prøv igen om lidt." }, { status: 500 });
  }
}
