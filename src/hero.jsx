/* HERO, editorial cover composition */

const Hero = () => {
  return (
    <header id="top" className="hero" data-screen-label="01 Hero">
      <div className="hero-orb o1" data-parallax="0.22" aria-hidden="true"></div>
      <div className="hero-orb o2" data-parallax="0.14" aria-hidden="true"></div>

      <div className="container" style={{position: "relative"}}>
        <div className="hero-meta-bar">
          <div className="bracket">Portfolio · Edition 2026</div>
          <div className="hero-meta-mid">Oulu · 65.0121° N · 25.4651° E</div>
          <div className="bracket">Doctoral Researcher · Engineer</div>
        </div>

        <div className="hero-grid">
          <div className="hero-tagline">
            <Reveal delay={120}>
              <div className="mono"><span className="bracket">Statement 01</span></div>
              <p className="lead" style={{marginTop: 14}}>
              Doctoral Researcher in <span className="accent">Self-Adaptive AI · Clinical Decision Support · Runtime Governance</span>
              </p>
            </Reveal>
            <Reveal delay={220}>
              <p className="body">
                PhD candidate at the University of Oulu (ITEE), researching how software engineering and runtime governance mechanisms can make adaptive AI in clinical decision support systems trustworthy and deployable in safety-critical workflows.
              </p>
            </Reveal>
            <Reveal delay={320}>
              <div className="hero-ctas">
                <MagneticButton primary href="#cv">View CV</MagneticButton>
                <MagneticButton href="#research">Selected Research</MagneticButton>
                <MagneticButton href="#contact">Contact</MagneticButton>
              </div>
            </Reveal>
          </div>

          <Reveal delay={140} className="hero-portrait-col">
            <figure className="hero-portrait-wrap">
              <div className="hero-portrait" data-parallax="-0.04">
                <img src="assets/portrait.png" alt="Kavishwa Wendakoon" />
                <span className="portrait-bracket tl" aria-hidden="true"></span>
                <span className="portrait-bracket tr" aria-hidden="true"></span>
                <span className="portrait-bracket bl" aria-hidden="true"></span>
                <span className="portrait-bracket br" aria-hidden="true"></span>
              </div>
              <figcaption className="portrait-caption">
                <span><span className="bracket">Portrait</span></span>
                <span>Oulu · 2026</span>
              </figcaption>
            </figure>
          </Reveal>
        </div>

        <h1 className="hero-name display reveal-name" data-parallax="0.04">
          <span className="name-line"><span className="name-inner">Kavi<span className="accent-line">shwa</span></span></span>
          <span className="name-line"><span className="name-inner stroke">Wendakoon</span></span>
        </h1>

        <Reveal delay={420}>
          <div className="hero-stats">
            {HERO_STATS.map((s, i) => (
              <div className="hero-stat" key={i}>
                <div className="val">
                  {s.acc ? <span className="acc">{s.val}</span> : s.val}
                </div>
                <div className="lbl">{s.lbl}</div>
              </div>
            ))}
          </div>
        </Reveal>

        <div className="foryou-teaser" onClick={() => document.getElementById("perspective")?.scrollIntoView({behavior: "smooth"})}>
          <span className="ping"></span>
          <span className="lbl"><span className="h">For You</span> · Pick a perspective ↓</span>
        </div>

        <div className="scroll-cue" aria-hidden="true">
          <span>Scroll</span>
          <span className="line"></span>
          <span>01 / 12</span>
        </div>
      </div>
    </header>
  );
};

Object.assign(window, { Hero });
