/* SECTIONS 4, Experience CV + Publications */

const Experience = () => {
  const [tab, setTab] = React.useState("timeline");
  return (
    <section id="cv" className="section" data-screen-label="08 CV">
      <div className="container">
        <SectionHead
          label="Section 08 / Record"
          title={<>Experience &<br/>background.</>}
          sub="Research positions, industry roles, skills, and awards."
        >
          <div style={{display: "flex", gap: 10, marginTop: 18}}>
            <MagneticButton primary>Download Full CV</MagneticButton>
            <MagneticButton href="#contact">Get in touch</MagneticButton>
          </div>
        </SectionHead>

        <div className="cv-shell">
          <div className="cv-stats">
            {CV_STATS.map((s, i) => (
              <div className="s" key={i}>
                <div className="v">{s.v}</div>
                <div className="l">{s.l}</div>
              </div>
            ))}
          </div>

          <div className="cv-tabs">
            {[
              {id: "timeline", l: "Timeline"},
              {id: "skills",   l: "Skills & Tools"},
              {id: "awards",   l: "Awards"},
            ].map(t => (
              <button
                key={t.id}
                className={`cv-tab ${tab === t.id ? "active" : ""}`}
                onClick={() => setTab(t.id)}
              >
                {t.l}
              </button>
            ))}
          </div>

          {tab === "timeline" && (
            <div className="cv-timeline">
              {CV_TIMELINE.map((e, i) => (
                <Reveal key={i} delay={i * 60} className="cv-entry">
                  <div>
                    <div className="when">{e.when}</div>
                    <div className="type">[ {e.type} ]</div>
                  </div>
                  <div>
                    <h3>{e.title}</h3>
                    <div className="org">{e.org}</div>
                    <p className="desc">{e.desc}</p>
                    {e.bullets && (
                      <ul>
                        {e.bullets.map((b, j) => <li key={j}>{b}</li>)}
                      </ul>
                    )}
                    {e.stack && (
                      <div className="stack">
                        {e.stack.map((s) => <span className="chip" key={s}>{s}</span>)}
                      </div>
                    )}
                  </div>
                  <div className="right">
                    <span className="mono"><span className="bracket">REF.{String(i + 1).padStart(2, "0")}</span></span>
                    {i === 0 && <span className="chip accent">CURRENT</span>}
                  </div>
                </Reveal>
              ))}
              <div style={{padding: "32px 0", color: "var(--text-dim)", fontSize: 14, textAlign: "center", borderTop: "1px dashed var(--line-strong)"}}>
                Based in Oulu, Finland. Open to research positions and collaborations worldwide.
              </div>
            </div>
          )}

          {tab === "skills" && (
            <div className="skills-grid">
              {SKILL_GROUPS.map((g, i) => (
                <div className="skill-group" key={g.name} data-reveal="scale" style={{"--reveal-delay": `${i * 80}ms`}}>
                  <h4>{g.name}</h4>
                  <div className="items">
                    {g.items.map((s) => <span className="chip" key={s}>{s}</span>)}
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "awards" && (
            <div className="awards-grid">
              {AWARDS.map((a, i) => (
                <div className="award-card" key={i} data-reveal="scale" style={{"--reveal-delay": `${i * 80}ms`}}>
                  <div className="yr"><span className="bracket">{a.yr}</span></div>
                  <h4>{a.title}</h4>
                  <div className="by">{a.by}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

const Publications = () => {
  const [filter, setFilter] = React.useState("all");
  const items = filter === "all"
    ? PUBLICATIONS
    : PUBLICATIONS.filter(p => p.cat === filter);

  return (
    <section id="publications" className="section" data-screen-label="09 Publications">
      <div className="container">
        <SectionHead
          label="Section 09 / Output"
          title={<>Publications,<br/>talks & prototypes.</>}
          sub="Research papers, working prototypes, and public presentations."
        />

        <div className="pub-tabs">
          {PUB_CATEGORIES.map((c) => (
            <button
              key={c.id}
              className={`chip ${filter === c.id ? "accent" : ""}`}
              style={{cursor: "pointer", background: filter === c.id ? "rgba(40,189,174,0.10)" : "transparent"}}
              onClick={() => setFilter(c.id)}
            >
              {c.label} <span style={{opacity: 0.6, marginLeft: 4}}>· {c.count}</span>
            </button>
          ))}
        </div>

        <div className="pub-list">
          {items.map((p, i) => (
            <div className="pub-card" key={i} data-reveal="left" style={{"--reveal-delay": `${i * 70}ms`}}>
              <div className="pub-year">{p.year}</div>
              <div>
                <div className="pub-meta-top">
                  <span className="badge">{p.kind}</span>
                  <span>{p.venue}</span>
                </div>
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </div>
              <div className="pub-tags">
                {p.tags.map((t) => <span className="chip" key={t}>{t}</span>)}
              </div>
              <button className="pub-action">{p.action}</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

Object.assign(window, { Experience, Publications });
