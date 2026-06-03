/* SECTIONS 2, Research areas + Selected projects */

const ResearchAreas = () => {
  const onMove = (e) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
  };

  return (
    <section id="research" className="section" data-screen-label="04 Research">
      <div className="container">
        <SectionHead
          label="Section 04 / Domains"
          title={<>Research<br/>Areas.</>}
          sub="Four interconnected domains, each informing the others to create cohesive, trustworthy AI systems."
        />

        <div className="research-grid">
          {/* Primary card */}
          {(() => {
            const a = RESEARCH_AREAS[0];
            return (
              <div className="research-card primary" data-reveal="scale" onMouseMove={onMove}>
                <div className="research-primary-vis" data-parallax="-0.18" aria-hidden="true"></div>
                <div className="top">
                  <div className="idx"><span className="bracket">AREA / {a.idx}</span></div>
                  <div className="badge">{a.badge}</div>
                </div>
                <h3>{a.title}</h3>
                <p>{a.body}</p>
                <div className="tags">
                  {a.tags.map((t) => <span key={t} className="chip">{t}</span>)}
                </div>
                <div style={{marginTop: 20}}>
                  <MagneticButton primary>{a.cta}</MagneticButton>
                </div>
                <div className="meta">
                  <span><span className="bracket">{a.papers} papers</span></span>
                  <span><span className="bracket">{a.prototypes} prototypes</span></span>
                </div>
              </div>
            );
          })()}

          {/* Secondary cards */}
          {RESEARCH_AREAS.slice(1).map((a, i) => (
            <div className="research-card r2" key={a.idx} data-reveal="scale" onMouseMove={onMove} style={{"--reveal-delay": `${(i + 1) * 90}ms`}}>
              <div className="top">
                <div className="idx"><span className="bracket">AREA / {a.idx}</span></div>
              </div>
              <h3>{a.title}</h3>
              <p>{a.body}</p>
              <div className="tags">
                {a.tags.map((t) => <span key={t} className="chip">{t}</span>)}
              </div>
              <div className="meta">
                <span><span className="bracket">{a.papers} papers</span></span>
                <span><span className="bracket">{a.prototypes} prototypes</span></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Projects = () => {
  const onMove = (e) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
  };

  return (
    <section id="projects" className="section" data-screen-label="05 Projects">
      <div className="container">
        <SectionHead
          label="Section 05 / Case Files"
          title={<>Selected<br/>Projects.</>}
          sub="National-scale systems, healthcare AI, and research prototypes. Hover any case file for the signal."
        />

        <div className="projects-list">
          {PROJECTS.map((p, i) => (
            <div className="project-row" key={p.idx} data-reveal="left" onMouseMove={onMove} style={{"--reveal-delay": `${i * 80}ms`}}>
              <div className="project-idx">{p.idx}</div>
              <div className="project-meta-stack">
                <span className="project-slug">{p.slug}</span>
                <h3 className="project-title">{p.title}</h3>
                <div style={{display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8}}>
                  {p.tags.map((t) => <span className="chip" key={t}>{t}</span>)}
                </div>
              </div>
              <p className="project-desc">{p.body}</p>
              <div className="project-flags">
                <div className="project-flag"><span className="dot"></span>{p.status}</div>
                <div className="project-flag year"><span className="dot"></span>{p.year}</div>
                <div className="project-flag year"><span className="dot"></span>{p.type}</div>
                <div className="project-flag year">
                  <span className="dot"></span>{p.evidence.join(" · ")}
                </div>
              </div>
              <div className="project-cta" title="See project timeline">
                <Arrow size={16} />
              </div>
            </div>
          ))}
        </div>

        <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 40, flexWrap: "wrap", gap: 16}}>
          <div className="mono"><span className="bracket">3 of 10+ case files surfaced</span></div>
          <MagneticButton>View all projects</MagneticButton>
        </div>
      </div>
    </section>
  );
};

Object.assign(window, { ResearchAreas, Projects });
