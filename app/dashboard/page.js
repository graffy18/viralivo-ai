import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";

export default async function Dashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("plan,credits").eq("id", user.id).single();
  const { data: projects } = await supabase.from("projects").select("id,title,topic,status,created_at").order("created_at",{ascending:false}).limit(10);

  return <main className="appShell">
    <header className="topbar"><Link className="brand" href="/">Viralivo <span>AI</span></Link><div className="user">{user.email}</div><nav><Link href="/create">+ Neues Video</Link> · <Link href="/publish">Publishing Hub</Link></nav></header>
    <section className="dashboard">
      <div className="dashHead"><div><div className="pill">DASHBOARD</div><h1>Dein Creator Workspace</h1><p>Erstelle dein nächstes Short.</p></div><div style={{display:"flex",gap:10}}><Link className="button" href="/billing">Plan upgraden</Link><Link className="button" href="/create">+ Neues Video</Link></div></div>
      <div className="stats">
        <div><span>PLAN</span><strong>{profile?.plan || "free"}</strong></div>
        <div><span>VIDEOS ÜBRIG</span><strong>{profile?.credits ?? "—"}</strong></div>
        <div><span>PROJEKTE</span><strong>{projects?.length ?? 0}</strong></div>
      </div>
      <div className="panel"><h2>Letzte Projekte</h2>
        {!projects?.length ? <p className="muted">Noch keine Projekte. Erstelle dein erstes KI-Script.</p> :
        <div className="projects">{projects.map(p=><div className="project" key={p.id}><div><b>{p.title}</b><small>{p.topic}</small></div><span>{p.status}</span></div>)}</div>}
      </div>
    </section>
  </main>;
}
