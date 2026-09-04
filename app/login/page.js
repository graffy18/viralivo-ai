 "use client";
import { useState } from "react";
import Link from "next/link";
import { createClient } from "../../lib/supabase/client";

export default function Login() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  async function submit(e) {
    e.preventDefault();
    setMsg("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return setMsg(error.message);
    window.location.href = "/dashboard";
  }

  return <AuthCard title="Willkommen zurück" subtitle="Melde dich bei deinem Viralivo AI Konto an.">
    <form onSubmit={submit} className="form">
      <label>E-Mail<input type="email" required value={email} onChange={e=>setEmail(e.target.value)} /></label>
      <label>Passwort<input type="password" required value={password} onChange={e=>setPassword(e.target.value)} /></label>
      {msg && <div className="error">{msg}</div>}
      <button className="button full">Anmelden</button>
    </form>
    <p className="switch">Noch kein Konto? <Link href="/signup">Kostenlos registrieren</Link></p>
  </AuthCard>;
}

function AuthCard({title, subtitle, children}) {
  return <main className="authPage"><div className="authCard">
    <Link className="brand authBrand" href="/">Viralivo <span>AI</span></Link>
    <h1>{title}</h1><p>{subtitle}</p>{children}
  </div></main>;
}
