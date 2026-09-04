import { NextResponse } from "next/server";
import { createClient } from "../../../../lib/supabase/server";

const demoScript = (topic) => ({
  title: `3 Dinge über ${topic}`,
  script: `HOOK: Das hier über ${topic} kennen die wenigsten.\n\n1. Überraschender Fakt – kurz und verständlich erklärt.\n2. Noch ein Fakt mit einem starken visuellen Moment.\n3. Der Fakt, den du dir merken solltest.\n\nCTA: Folge für mehr kurze Fakten.`,
  demo: true
});

export async function POST(request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error:"Nicht angemeldet." }, { status:401 });

  const { topic } = await request.json();
  if (!topic || topic.length < 3) return NextResponse.json({ error:"Bitte ein Thema eingeben." }, { status:400 });

  const { data: profile } = await supabase.from("profiles").select("credits").eq("id", user.id).single();
  if (!profile || profile.credits < 1) return NextResponse.json({ error:"Keine Videos mehr verfügbar. Upgrade deinen Plan." }, { status:402 });

  let output;
  if (!process.env.OPENAI_API_KEY) {
    output = demoScript(topic);
  } else {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method:"POST",
      headers:{ "Content-Type":"application/json", "Authorization":`Bearer ${process.env.OPENAI_API_KEY}` },
      body:JSON.stringify({
        model:"gpt-5-mini",
        input:`Erstelle ein deutsches Script für einen 30-45 Sekunden langen faceless Short zum Thema: ${topic}. Struktur: starker Hook, 3 kurze Punkte, Schluss-CTA. Keine erfundenen Fakten. Gib zuerst einen kurzen Titel und danach das Script.`
      })
    });
    if (!response.ok) return NextResponse.json({error:"Die KI konnte das Script gerade nicht erzeugen."},{status:502});
    const data = await response.json();
    output = { title:`AI Short: ${topic}`, script:data.output_text || "Kein Script zurückgegeben.", demo:false };
  }

  const { data: consumed } = await supabase.rpc("consume_credit", { p_user_id:user.id });
  if (consumed !== true) return NextResponse.json({error:"Dein Kontingent wurde bereits aufgebraucht."},{status:402});

  const { data: project, error: insertError } = await supabase
  .from("projects")
  .insert({
    user_id: user.id,
    title: output.title,
    topic,
    script: output.script,
    status: "script_ready"
  })
  .select("id")
  .single();

if (insertError) {
  return NextResponse.json(
    { error: "Projekt konnte nicht gespeichert werden." },
    { status: 500 }
  );
}

return NextResponse.json({
  ...output,
  projectId: project.id
});

