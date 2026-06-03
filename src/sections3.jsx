/* SECTIONS 3, Research Journey + Current Focus */

const Journey = () => (
  <section id="journey" className="section" data-screen-label="06 Journey">
    <div className="container">
      <SectionHead
        label="Section 06 / Evolution"
        title={<>How my<br/>thinking evolved.</>}
        sub="The paradigm shifts that shaped how I think about building trustworthy AI systems."
      />

      <div className="journey-rail">
        {JOURNEY.map((j, i) => (
          <Reveal key={i} delay={i * 80} className="journey-item">
            <div className="journey-year">
              {j.year}
            </div>
            <div className="journey-body">
              <div className="journey-tag">
                <span className="bracket">SHIFT {j.num}</span><br/>
                <span style={{color: "var(--mono-tint)"}}>{j.tag}</span>
              </div>
              <div className="journey-content">
                <h3>
                  {j.title}<span className="arrow">{j.arrow}</span>{j.title2}
                </h3>
                <blockquote>"{j.quote}"</blockquote>
                <a href="#" className="journey-link">Read more about this shift →</a>
              </div>
              <div className="journey-side">
                <div><span className="bracket">REF.{j.num}</span></div>
                <div style={{marginTop: 8}}>{j.year}</div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="journey-milestones">
        {MILESTONES.map((m, i) => (
          <div className="journey-milestone" key={i}>
            <div className="yr">'{m.yr}</div>
            <div className="lbl">{m.lbl}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const CurrentFocus = () => {
  const [active, setActive] = React.useState("investigating");
  const current = FOCUS_AREAS.find(a => a.id === active);
  const idx = FOCUS_AREAS.findIndex(a => a.id === active);

  return (
    <section id="focus" className="section" data-screen-label="07 Focus">
      <div className="container">
        <SectionHead
          label="Section 07 / Active"
          title={<>Current<br/>research focus.</>}
          sub="What I'm investigating, building, questioning, and open to collaborating on, right now."
        />

        <div className="focus-shell">
          <div className="focus-head">
            <div><span className="bracket">CONSOLE / focus.kw</span></div>
            <div className="live"><span className="dot"></span><span>● ACTIVE</span></div>
          </div>

          <div className="focus-body">
            <div className="focus-tabs">
              {FOCUS_AREAS.map((a) => (
                <button
                  key={a.id}
                  className={`focus-tab ${active === a.id ? "active" : ""}`}
                  onClick={() => setActive(a.id)}
                >
                  <span className="num"><span className="bracket">{a.num}</span></span>
                  <span className="ttl">{a.title}</span>
                  {active !== a.id && <span className="preview">{a.preview}</span>}
                </button>
              ))}
            </div>

            <div className="focus-content" key={active}>
              <div className="signal" aria-hidden="true">
                <span></span><span></span><span></span><span></span><span></span>
              </div>
              <div className="focus-meta">
                <span><span className="bracket">FOCUS {current.num} OF 04</span></span>
                <span><span className="bracket">↳ {current.related}</span></span>
              </div>
              <Reveal>
                <h3>{current.title}</h3>
                <p>{current.body}</p>
                <p className="deep" style={{marginTop: 16}}>{current.deep}</p>
                <div className="focus-tags">
                  {current.tags.map((t) => <span className="chip" key={t}>{t}</span>)}
                </div>
                <div className="focus-related">
                  Related: <span className="v">{current.related}</span>
                </div>
                <blockquote>"{current.quote}"</blockquote>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

Object.assign(window, { Journey, CurrentFocus });
