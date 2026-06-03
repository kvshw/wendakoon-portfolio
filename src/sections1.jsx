/* SECTIONS 1, Orientation + Perspective selector */

const Orientation = () => {
  const onMove = (e) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
  };

  return (
    <section id="about" className="section" data-screen-label="02 About">
      <div className="container">
        <SectionHead
          label="Section 02 / About"
          title={<>How this<br/>site works.</>}
          sub="Six rooms, one researcher. Each card opens a thread of work, from doctoral focus to shipped systems and the chat that ties it together."
        />
        <div className="orient-grid">
          {ORIENT_CARDS.map((c, i) => (
            <a
              key={c.idx}
              href={`#${c.to}`}
              className="orient-card"
              data-reveal="scale"
              onMouseMove={onMove}
              style={{textDecoration: "none", color: "inherit", "--reveal-delay": `${i * 70}ms`}}
            >
              <div>
                <div className="idx"><span className="bracket">{c.idx}</span></div>
                <h3>{c.title}</h3>
                <p>{c.body}</p>
              </div>
              <div className="arrow"><Arrow size={18} /></div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

const PerspectiveSelector = () => {
  const [active, setActive] = React.useState("recruiters");
  const current = PERSPECTIVES.find(p => p.id === active);
  const next = PERSPECTIVES.find(p => p.id === current.next);
  const idx = PERSPECTIVES.findIndex(p => p.id === active);

  return (
    <section id="perspective" className="section" data-screen-label="03 Perspective">
      <div className="container">
        <SectionHead
          label="Section 03 / Tailor"
          title={<>How can I<br/>help you?</>}
          sub="Pick a perspective. The page rewrites itself to surface what matters to you."
        />

        <div className="persp-shell">
          <div className="persp-tabs" role="tablist">
            {PERSPECTIVES.map((p, i) => (
              <button
                key={p.id}
                role="tab"
                aria-selected={active === p.id}
                className={`persp-tab ${active === p.id ? "active" : ""}`}
                onClick={() => setActive(p.id)}
              >
                <div className="num"><span className="bracket">{p.num}</span></div>
                <div className="name">{p.name}</div>
              </button>
            ))}
          </div>

          <div className="persp-body" key={active}>
            <div className="persp-main">
              <Reveal>
                <div className="mono">
                  <span className="bracket">PERSPECTIVE / {String(idx + 1).padStart(2, "0")} OF 04</span>
                </div>
                <h3>{current.title}</h3>
                <blockquote className="persp-quote">"{current.quote}"</blockquote>
                <ul className="persp-highlights">
                  {current.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </Reveal>
            </div>

            <div className="persp-side">
              <div>
                <div className="mono" style={{marginBottom: 18}}>
                  <span className="bracket">Snapshot</span>
                </div>
                <div className="persp-stats">
                  {current.stats.map((s, i) => (
                    <div className="persp-stat" key={i}>
                      <div className="v">{s.v}</div>
                      <div className="l">{s.l}</div>
                    </div>
                  ))}
                </div>

                <div style={{padding: "20px 0", borderTop: "1px dashed var(--line-strong)"}}>
                  <div className="mono" style={{marginBottom: 14}}>
                    <span className="bracket">Signal</span>
                  </div>
                  <div style={{display: "grid", gap: 6}}>
                    <Bar label="Research depth" value={ratioFor(active).res} />
                    <Bar label="Engineering velocity" value={ratioFor(active).eng} />
                    <Bar label="Clinical / regulatory" value={ratioFor(active).reg} />
                  </div>
                </div>
              </div>

              <div className="persp-ctas">
                <MagneticButton primary>{current.cta.label}</MagneticButton>
                <MagneticButton onClick={() => setActive(current.next)}>
                  Next: {next.name}
                </MagneticButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

function ratioFor(id) {
  return ({
    recruiters:    { res: 0.85, eng: 0.92, reg: 0.7  },
    collaborators: { res: 0.95, eng: 0.78, reg: 0.85 },
    industry:      { res: 0.72, eng: 0.98, reg: 0.9  },
    students:      { res: 0.8,  eng: 0.84, reg: 0.55 },
  })[id];
}

const Bar = ({ label, value }) => (
  <div>
    <div style={{display: "flex", justifyContent: "space-between",
      fontFamily: "JetBrains Mono, monospace", fontSize: 10, letterSpacing: "0.14em",
      color: "var(--mono-tint)", textTransform: "uppercase", marginBottom: 4}}>
      <span>{label}</span><span>{Math.round(value * 100)}%</span>
    </div>
    <div style={{height: 3, background: "var(--line)", overflow: "hidden", borderRadius: 2}}>
      <div style={{
        width: `${value * 100}%`, height: "100%",
        background: "linear-gradient(90deg, var(--accent), var(--accent-2))",
        transition: "width 0.8s cubic-bezier(.2,.7,.2,1)"
      }} />
    </div>
  </div>
);

Object.assign(window, { Orientation, PerspectiveSelector });
