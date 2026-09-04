"use client";
import dynamic from "next/dynamic";
import Link from "next/link";
const Player = dynamic(() => import("@remotion/player").then(m => m.Player), { ssr:false });
const Video = dynamic(() => import("../../src/remotion/ViralivoShort").then(m => m.ViralivoShort), { ssr:false });

const demoScenes = [
  {id:"1", caption:"Die meisten kennen diesen Fakt nicht.", duration:3.5, imageUrl:"https://placehold.co/720x1280/png?text=VIRALIVO+1"},
  {id:"2", caption:"Und genau deshalb ist er so verrückt.", duration:3.5, imageUrl:"https://placehold.co/720x1280/png?text=VIRALIVO+2"},
  {id:"3", caption:"Speichere das für später.", duration:3, imageUrl:"https://placehold.co/720x1280/png?text=VIRALIVO+3"}
];
export default function Preview(){
  const duration = Math.round(demoScenes.reduce((a,s)=>a+(s.duration||4),0)*30);
  return <main className="appShell"><header className="topbar"><Link className="brand" href="/">Viralivo <span>AI</span></Link><Link href="/create">← Creator</Link></header><section className="createPage"><div className="pill">LIVE PREVIEW</div><h1>Dein Short, bevor er gerendert wird.</h1><p>Der Player zeigt das vertikale 9:16-Layout direkt im Browser.</p><div style={{maxWidth:380,margin:"30px auto"}}><Player component={Video} inputProps={{scenes:demoScenes}} durationInFrames={duration} fps={30} compositionWidth={1080} compositionHeight={1920} controls loop style={{width:"100%",borderRadius:24}} /></div></section></main>
}
