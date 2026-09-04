"use client";
import {useState} from "react";
import Link from "next/link";

const channels=[
 {name:"YouTube Shorts",desc:"OAuth + Video Upload API vorbereiten",state:"ready"},
 {name:"TikTok",desc:"Content Posting API / OAuth",state:"coming"},
 {name:"Instagram Reels",desc:"Meta Graph API / Instagram Publishing",state:"coming"}
];
export default function Publish(){
 const [msg,setMsg]=useState("");
 return <main className="appShell"><header className="topbar"><Link className="brand" href="/">Viralivo <span>AI</span></Link><Link href="/dashboard">← Dashboard</Link></header>
 <section className="createPage"><div className="pill">PUBLISHING HUB</div><h1>Dein Video. Deine Kanäle.</h1><p>Der Export ist fertig vorbereitet. Als nächstes werden die Plattform-Konten per OAuth verbunden und Videos direkt veröffentlicht.</p>
 <div className="projects">{channels.map(c=><div className="project" key={c.name}><div><b>{c.name}</b><small>{c.desc}</small></div><button className="button secondary" onClick={()=>setMsg(c.state==='ready'?`${c.name}: OAuth-Konfiguration benötigt API Client ID/Secret.`:`${c.name}: Connector ist als nächster Publishing-Schritt vorbereitet.`)}>{c.state==='ready'?"Verbinden":"Bald verfügbar"}</button></div>)}</div>
 {msg&&<div className="tip"><b>Status</b><p>{msg}</p></div>}
 <div className="tip"><b>Warum OAuth?</b><p>Die Plattformen müssen dein Konto autorisieren. Viralivo sollte niemals Passwörter speichern.</p></div></section></main>
}
