"use client";
import {useMemo,useState,useEffect} from "react";
import Link from "next/link";
import {Player} from "@remotion/player";
import {ViralivoShort} from "../../src/remotion/ViralivoShort";
import {useSearchParams} from "next/navigation";

const starter=[
 {id:"1",caption:"3 Fakten, die du heute noch nicht kennst",visualPrompt:"Cinematic vertical social media visual, mysterious modern style",duration:4,imageUrl:""},
 {id:"2",caption:"Fakt Nummer eins: Das Gehirn schläft nie wirklich",visualPrompt:"Human brain cinematic illustration, dark background, vertical",duration:4,imageUrl:""},
 {id:"3",caption:"Und genau deshalb passiert nachts etwas Verrücktes",visualPrompt:"Person sleeping with subtle surreal brain activity, cinematic, vertical",duration:4,imageUrl:""}
];

export default function Editor(){
 const params=useSearchParams();
 const projectId=params.get("projectId");
 const [jobId,setJobId]=useState(null); const [downloadUrl,setDownloadUrl]=useState("");
 const [scenes,setScenes]=useState(starter); const [active,setActive]=useState(0); const [busy,setBusy]=useState(false); const [status,setStatus]=useState("Bereit");
 const duration=useMemo(()=>Math.max(1,scenes.reduce((a,s)=>a+Number(s.duration||4),0)),[scenes]);
 function update(k,v){setScenes(x=>x.map((s,i)=>i===active?{...s,[k]:v}:s));}
 async function visuals(){setBusy(true);setStatus("Visuals werden erstellt…"); try{const r=await fetch('/api/visuals',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({scenes})});const d=await r.json();if(!r.ok)throw new Error(d.error);setScenes(d.scenes);setStatus(d.demo?"Demo-Visuals bereit":"KI-Visuals bereit")}catch(e){setStatus(e.message||"Fehler")}setBusy(false)}
 async function voice(){setBusy(true);setStatus("Voiceover wird erstellt…"); try{const r=await fetch('/api/voice',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text:scenes.map(s=>s.caption).join(' ')})});if(!r.ok)throw new Error((await r.json()).error||'Fehler');const blob=await r.blob();const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='viralivo-voiceover.mp3';a.click();setStatus("Voiceover bereit")}catch(e){setStatus(e.message)}setBusy(false)}
 async function render(){setBusy(true);setStatus("Render-Job wird erstellt…");try{const r=await fetch('/api/render',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({projectId,scenes})});const d=await r.json();if(!r.ok)throw new Error(d.error);setJobId(d.jobId);setStatus(`Render-Job ${d.jobId.slice(0,8)}… angelegt`);}catch(e){setStatus(e.message)}setBusy(false)}
 useEffect(()=>{ if(!jobId) return; let timer; const poll=async()=>{ try{const r=await fetch(`/api/render/status?jobId=${jobId}`); const d=await r.json(); if(d.job?.status==='completed'){setStatus('MP4 fertig ✓'); const dr=await fetch(`/api/render/download?jobId=${jobId}`); const dd=await dr.json(); if(dd.url)setDownloadUrl(dd.url); clearInterval(timer);} else if(d.job?.status==='failed'){setStatus(`Render fehlgeschlagen: ${d.job.error||'Fehler'}`);clearInterval(timer);} else setStatus(`Render: ${d.job?.status||'queued'}…`);}catch(e){} }; poll(); timer=setInterval(poll,4000); return ()=>clearInterval(timer); },[jobId]);
 return <main className="appShell"><header className="topbar"><Link className="brand" href="/">Viralivo <span>AI</span></Link><div className="topActions"><span className="statusDot">● {status}</span><Link href="/dashboard">Dashboard</Link></div></header>
 <div className="editorLayout">
  <aside className="sceneRail"><div className="railHead"><b>Scenes</b><span>{scenes.length}</span></div>{scenes.map((s,i)=><button className={`sceneCard ${i===active?'selected':''}`} onClick={()=>setActive(i)} key={s.id}><span>{String(i+1).padStart(2,'0')}</span><div><b>{s.caption}</b><small>{s.duration}s</small></div></button>)}<button className="addScene" onClick={()=>{setScenes([...scenes,{id:String(Date.now()),caption:'Neue Caption',visualPrompt:'Cinematic vertical visual',duration:4,imageUrl:''}]);setActive(scenes.length)}}>+ Szene hinzufügen</button></aside>
  <section className="previewPanel"><div className="previewHeader"><div><b>Preview</b><small>9:16 · {duration.toFixed(0)}s</small></div><span>LIVE</span></div><div className="playerWrap"><Player component={ViralivoShort} inputProps={{scenes}} durationInFrames={Math.ceil(duration*30)} fps={30} compositionWidth={1080} compositionHeight={1920} controls style={{width:'100%',height:'100%'}}/></div></section>
  <aside className="inspector"><div className="inspectorHead"><b>Scene {active+1}</b><span>EDIT</span></div><label>Caption<textarea value={scenes[active]?.caption||''} onChange={e=>update('caption',e.target.value)}/></label><label>Visual prompt<textarea value={scenes[active]?.visualPrompt||''} onChange={e=>update('visualPrompt',e.target.value)}/></label><label>Duration <input type="number" min="2" max="12" step="0.5" value={scenes[active]?.duration||4} onChange={e=>update('duration',e.target.value)}/></label><div className="toolStack"><button onClick={visuals} disabled={busy} className="button">{busy?'Bitte warten…':'✨ KI-Visuals erzeugen'}</button><button onClick={voice} disabled={busy} className="button secondary">🎙 Voiceover erzeugen</button><button onClick={render} disabled={busy||!projectId} className="button secondary">🎬 MP4 Render starten</button>{downloadUrl&&<><a href={downloadUrl} className="button" target="_blank" rel="noreferrer">⬇️ MP4 herunterladen</a><Link href="/publish" className="button secondary">🚀 Veröffentlichen</Link></>}</div><div className="tip"><b>Pipeline</b><p>Script → Scenes → Visuals → Voice → Captions → MP4</p></div></aside>
 </div></main>
}
