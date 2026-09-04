import Link from 'next/link';

const features = [
  ['✦', 'AI Script Generator', 'Hooks, Stories und Scripts, die für Short-Form entwickelt sind.'],
  ['▧', 'AI Visuals', 'Passende KI-Visuals für jede Szene deines Videos.'],
  ['◉', 'AI Voiceover', 'Natürlich klingende Stimmen für deine Videos.'],
  ['CC', 'Auto Captions', 'Dynamische Untertitel mit modernem Creator-Look.'],
  ['↕', '9:16 Perfect Export', 'Optimiert für TikTok, Instagram Reels und YouTube Shorts.'],
  ['↗', 'Auto Publishing', 'Videos für deine Social-Kanäle vorbereiten und veröffentlichen.'],
];

const examples = [
  ['COSMOS', '5 Dinge, die niemand über das Universum weiß.', '12.4M'],
  ['MYSTERY', 'Das Geheimnis, das Wissenschaftler noch nicht lösen konnten.', '8.7M'],
  ['MINDSET', '7 Gewohnheiten, die dein Leben verändern können.', '12.1M'],
  ['HISTORY', 'Die Wahrheit über die Pyramiden.', '6.4M'],
  ['FUTURE', 'So könnte die Zukunft wirklich aussehen.', '7.8M'],
];

const pricing = [
  { name: 'Free', price: '0', suffix: '/Monat', items: ['2 Videos / Monat', 'AI Script', 'Basic Voice', 'Standard Visuals', 'Auto Captions'], cta: 'Kostenlos starten' },
  { name: 'Creator', price: '19,99', suffix: '/Monat', items: ['20 Videos / Monat', 'Premium Voices', 'AI Visuals', 'HD Export', 'Keine Wasserzeichen'], cta: 'Creator starten' },
  { name: 'Pro', price: '39,99', suffix: '/Monat', items: ['60 Videos / Monat', 'Premium Voices', 'AI Visuals', 'HD Export', 'Auto Publishing'], cta: 'Pro starten' },
  { name: 'Unlimited', price: '79,99', suffix: '/Monat', items: ['Unbegrenzte Videos*', 'Alle Premium Voices', 'AI Visuals', 'HD Export', 'Auto Publishing'], cta: 'Unlimited starten', hot: true },
];

export default function Home() {
  return (
    <main className="landing">
      <div className="ambient ambientA" />
      <div className="ambient ambientB" />
      <nav className="nav">
        <Link className="brand" href="/">◢ <span>Viralivo</span> AI</Link>
        <div className="navLinks">
          <Link href="#features">Features</Link>
          <Link href="#how">How it works</Link>
          <Link href="#examples">Examples</Link>
          <Link href="#pricing">Pricing</Link>
          <Link href="/login">Anmelden</Link>
          <Link className="button small" href="/signup">Kostenlos starten <b>→</b></Link>
        </div>
      </nav>

      <section className="hero">
        <div className="heroCopy">
          <div className="eyebrow"><span className="dot" /> AI SHORT-FORM VIDEO FACTORY</div>
          <h1>Eine Idee rein.<br /><span>Ein fertiges Short raus.</span></h1>
          <p>Viralivo AI erstellt faceless Videos mit Script, Visuals, Voiceover und Captions — alles automatisch, in wenigen Minuten.</p>
          <div className="heroActions">
            <Link className="button heroButton" href="/signup">Kostenlos starten <b>→</b></Link>
            <Link className="demoButton" href="#demo"><span>▶</span> Demo ansehen</Link>
          </div>
          <div className="trustRow"><span>✓ Keine Kreditkarte</span><span>✓ 2 Videos kostenlos</span><span>✓ 9:16 Export</span></div>
        </div>

        <div className="heroVisual" id="demo">
          <div className="heroGlow" />
          <div className="phoneShadow" />
          <div className="phone">
            <div className="phoneNotch" />
            <div className="phoneTop"><span>VIRALIVO AI</span><span>00:35</span></div>
            <div className="videoScene">
              <div className="planet" />
              <div className="stars" />
              <div className="videoMeta">DINGE, DIE NIEMAND WEISS</div>
              <h3>5 Fakten über das <strong>Universum</strong>, die dich überraschen werden.</h3>
              <div className="videoCaption"><span>Nummer 3</span> wird dich überraschen.</div>
              <div className="videoStats"><span>▶ 12.4M</span><span>♥ 412K</span></div>
            </div>
            <div className="phoneBottom"><span>◀</span><span>●</span><span>CC</span><span>↗</span></div>
          </div>
          <div className="floatCard voiceCard"><div className="cardIcon">◉</div><div><b>AI Voice</b><small>Natural · Female · DE</small></div><div className="wave">▂▅▃▇▂▆</div></div>
          <div className="floatCard visualCard"><div className="cardIcon">▧</div><div><b>AI Visuals</b><small>Perfect scene match</small></div><div className="miniThumbs"><i/><i/><i/></div></div>
          <div className="floatCard renderCard"><div className="check">✓</div><div><b>Render complete</b><small>1080 × 1920 MP4</small></div></div>
        </div>
      </section>

      <section className="pipeline"><span>IDEA</span><b>→</b><span>SCRIPT</span><b>→</b><span>VISUALS</span><b>→</b><span>VOICE</span><b>→</b><span>CAPTIONS</span><b>→</b><strong>MP4</strong></section>

      <section className="section" id="how">
        <div className="sectionLabel">SO FUNKTIONIERT VIRALIVO AI</div>
        <h2>Du lieferst die Idee.<br /><span>Viralivo macht den Rest.</span></h2>
        <div className="steps">
          <article><div className="stepNo">01</div><div className="stepIcon">✦</div><h3>Idee eingeben</h3><p>Gib ein Thema oder einen einfachen Satz ein. Viralivo macht daraus eine Short-Form-Idee.</p></article>
          <article><div className="stepNo">02</div><div className="stepIcon">▧</div><h3>Style wählen</h3><p>Wähle Stimme, Visual-Stil, Caption-Look und die Sprache deines Videos.</p></article>
          <article><div className="stepNo">03</div><div className="stepIcon">▶</div><h3>Video generieren</h3><p>Script, Visuals, Voiceover und Captions werden zu einem fertigen Short.</p></article>
        </div>
      </section>

      <section className="section featureSection" id="features">
        <div className="sectionLabel">BUILT FOR CREATORS</div>
        <h2>Alles, was du für<br /><span>virale Videos brauchst.</span></h2>
        <div className="featureGrid">
          {features.map(([icon, title, text]) => <article key={title}><div className="featureIcon">{icon}</div><h3>{title}</h3><p>{text}</p></article>)}
        </div>
      </section>

      <section className="examples" id="examples">
        <div className="sectionLabel">MADE WITH VIRALIVO AI</div>
        <h2>Von der Idee zum <span>fertigen Short.</span></h2>
        <p className="sectionLead">Beispiele des Video-Stils, den Viralivo für dich produzieren kann.</p>
        <div className="exampleGrid">
          {examples.map(([tag, title, views], i) => <article className={`exampleCard example${i}`} key={title}><div className="exampleOverlay"><small>{tag}</small><h3>{title}</h3><div><span>▶ {views}</span><span>00:{29 + i}</span></div></div></article>)}
        </div>
      </section>

      <section className="pricing" id="pricing">
        <div className="sectionLabel">SIMPLE. TRANSPARENT. FAIR.</div>
        <h2>Starte kostenlos.<br /><span>Skaliere, wenn du wächst.</span></h2>
        <div className="billingToggle"><b>Monatlich</b><span>Jährlich — 2 Monate gratis</span></div>
        <div className="priceGrid">
          {pricing.map(plan => <article className={`priceCard ${plan.hot ? 'hot' : ''}`} key={plan.name}>{plan.hot && <div className="popular">BESTE WAHL</div>}<h3>{plan.name}</h3><div className="price">€{plan.price}<small>{plan.suffix}</small></div><ul>{plan.items.map(item => <li key={item}>✓ {item}</li>)}</ul><Link className={`priceButton ${plan.hot ? 'primary' : ''}`} href="/signup">{plan.cta} →</Link></article>)}
        </div>
        <p className="fineprint">* Unlimited unterliegt fair-use / technischen Ressourcenlimits.</p>
      </section>

      <section className="faq">
        <div className="sectionLabel">FAQ</div>
        <h2>Häufige Fragen.</h2>
        <div className="faqGrid">
          <details><summary>Benötige ich Vorkenntnisse? <span>＋</span></summary><p>Nein. Du gibst nur deine Idee ein. Viralivo übernimmt den Produktionsprozess.</p></details>
          <details><summary>Kann ich die Videos kommerziell nutzen? <span>＋</span></summary><p>Das hängt von den verwendeten Assets und deinem Tarif ab. Die finalen Nutzungsbedingungen werden vor dem Launch festgelegt.</p></details>
          <details><summary>Welche Sprachen und Stimmen gibt es? <span>＋</span></summary><p>Deutsch und Englisch sind zum Start vorgesehen. Weitere Sprachen können später ergänzt werden.</p></details>
          <details><summary>Wie funktioniert die Abrechnung? <span>＋</span></summary><p>Die kostenpflichtigen Tarife werden monatlich über Stripe abgerechnet und können gekündigt werden.</p></details>
        </div>
      </section>

      <section className="finalCta"><div className="ctaIcon">▶</div><div><div className="sectionLabel">READY TO CREATE?</div><h2>Bereit für dein erstes virales Short?</h2><p>Starte jetzt kostenlos und erstelle dein erstes Video mit Viralivo AI.</p></div><Link className="button" href="/signup">Kostenlos starten <b>→</b></Link></section>

      <footer><div className="footerBrand"><div className="brand">◢ <span>Viralivo</span> AI</div><small>© 2026 Viralivo AI. Alle Rechte vorbehalten.</small></div><div className="footerLinks"><div><b>Produkt</b><Link href="#features">Features</Link><Link href="#examples">Examples</Link><Link href="#pricing">Pricing</Link></div><div><b>Ressourcen</b><Link href="#how">How it works</Link><Link href="/login">Login</Link><Link href="/signup">Get started</Link></div><div><b>Rechtliches</b><Link href="/privacy">Datenschutz</Link><Link href="/terms">Nutzungsbedingungen</Link></div></div></footer>
    </main>
  );
}
