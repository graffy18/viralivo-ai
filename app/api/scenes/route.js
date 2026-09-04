import { NextResponse } from "next/server";
import { createClient } from "../../../lib/supabase/server";

function demoScenes(script) {
  const clean = script.replace(/\r/g, "").split("\n").filter(Boolean);
  const chunks = [];
  let current = "";
  for (const line of clean) {
    if (/^(HOOK:|1\.|2\.|3\.|CTA:)/i.test(line) && current) {
      chunks.push(current.trim());
      current = line;
    } else {
      current += (current ? " " : "") + line;
    }
  }
  if (current) chunks.push(current.trim());

  return chunks.slice(0, 6).map((text, i) => ({
    id: i + 1,
    caption: text.replace(/^(HOOK:|CTA:)\s*/i, ""),
    visualPrompt: `Vertical faceless short video visual for: ${text}. Cinematic, modern, high contrast, no text, no logos.`,
    duration: i === 0 ? 3 : 4
  }));
}

export async function POST(request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });

  const { script } = await request.json();
  if (!script) return NextResponse.json({ error: "Script fehlt." }, { status: 400 });

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ demo: true, scenes: demoScenes(script) });
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-5-mini",
      input: `Zerlege dieses deutsche Short-Script in 4 bis 6 Szenen. Antworte ausschließlich als JSON-Array. Jede Szene braucht: id (number), caption (max 12 Wörter), visualPrompt (englisch, beschreibt ein vertikales faceless Visual ohne Text/Logo), duration (number, 2.5 bis 5 Sekunden). Script:\n${script}`
    })
  });

  if (!response.ok) return NextResponse.json({ error: "Szenen konnten nicht erzeugt werden." }, { status: 502 });
  const data = await response.json();
  const raw = data.output_text || "[]";
  let scenes;
  try { scenes = JSON.parse(raw); }
  catch { return NextResponse.json({ error: "Die KI lieferte kein gültiges Szenenformat." }, { status: 502 }); }

  return NextResponse.json({ demo: false, scenes });
}
