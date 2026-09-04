 "use client";
import { useState } from "react";
import Link from "next/link";
import { createClient } from "../../lib/supabase/client";

export default function Signup() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  async function submit(e) {
    e.preventDefault();
    setMsg("");
    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` }
    });
    if (error) return setMsg(error.message);
    if (data.session) window.location.href = "/dashboard";
    else setMsg("Fast geschafft! Prüfe deine E-Mail und bestätige dein Konto.");
  }

  return <main className="authPage"><div className="authCard">
    <Link className="brand authBrand" href="/">Viralivo <span>AI</span></Link>
    <h1>Konto erstellen</h1><p>Starte kostenlos mit Viralivo AI.</p>
    <form onSubmit={submit} className="form">
      <label>E-Mail<input type="email" required value={email} onChange={e=>setEmail(e.target.value)} /></label>
      <label>Passwort<input type="password" minLength="6" required value={password} onChange={e=>setPassword(e.target.value)} /></label>
      {msg && <div className={msg.includes("Fast") ? "success" : "error"}>{msg}</div>}
      <button className="button full">Konto erstellen →</button>
    </form>
    <p className="switch">Schon registriert? <Link href="/login">Anmelden</Link></p>
  </div></main>;
}
