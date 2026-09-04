 "use client";
import { useState } from "react";
import Link from "next/link";

export default function Create() {
  const [topic,setTopic]=useState("");
  const [script,setScript]=useState(null);
  const [scenes,setScenes]=useState([]);
  const [loading,setLoading]=useState(false);
  const [stage,setStage]=useState("");
  const [error,setError]=useState("");

  async function generateScript(e){
    e.preventDefault(); setLoading(true); setError(""); setStage("Script wird erstellt…");
    const r=await fetch("/api/script",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({topic})});
    const d=await r.json(); if(!r.ok){setError(d.error||"Fehler");setLoading(false);return;}
    setScript(d); setStage("Szenen werden geplant…");
    const s=await fetch("/api/scenes",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({script:d.script})});
    const sd=await s.json(); if(!s.ok){setError(sd.error||"Szenenfehler");setLoading(false);return;}
    setScenes(sd.scenes||[]); setStage("Pipeline bereit"); setLoading(false);
  }

  return <main className="appShell">
    <header className="topbar"><Link className="brand" href="/">Viralivo <span>AI</span></Link><Link href="/dashboard">← Dashboard</Link></header>
    <section className="createPage">
      <div className="pill">ONE-CLICK VIDEO FACTORY</div>
      <h1>Von der Idee zum Short.</h1>
      <p>Viralivo erstellt dein Script und zerlegt es automatisch in renderbare Szenen mit Captions und Visual-Prompts.</p>
      <form onSubmit={generateScript} className="createForm">
        <textarea required minLength="3" value={topic} onChange={e=>setTopic(e.target.value)} placeholder="z. B. 5 überraschende Fakten über den Mond" />
        <button className="button">{loading ? stage : "Video-Konzept erstellen →"}</button>
      </form>
      {error && <div className="error">{error}</div>}
      {script && <div className="result">
        <div className="resultTop"><span>1 · SCRIPT</span><b>{script.demo?"DEMO":"AI"}</b></div>
        <h2>{script.title}</h2><pre>{script.script}</pre>
        <div className="resultTop" style={{marginTop:30}}><span>2 · SCENES + CAPTIONS</span><b>{scenes.length} SZENEN</b></div>
        <div className="projects">
          {scenes.map((s,i)=><div className="project" key={s.id||i}>
            <div><b>Scene {i+1} · {s.caption}</b><small>{s.visualPrompt}</small></div>
            <span>{s.duration}s</span>
          </div>)}
        </div>
        <Link href={`/editor?projectId=${script.projectId}`} className="button" style={{display:"inline-block",marginTop:20}}>Im Creator Studio öffnen →</Link><div className="pipeline">
          <span>✓ Script</span><span>✓ Szenen</span><span>→ Voiceover</span><span>→ Visuals</span><span>→ Captions</span><span>→ MP4</span>
        </div>
      </div>}
    </section>
  </main>;
}
