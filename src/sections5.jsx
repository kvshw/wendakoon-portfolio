/* SECTIONS 5, Blog + Contact + Footer */

const Blog = () => (
  <section id="blog" className="section" data-screen-label="10 Blog">
    <div className="container">
      <SectionHead
        label="Section 10 / Writing"
        title={<>Latest<br/>writing.</>}
        sub="Notes from research and engineering practice, with a focus on trustworthy AI and real-world systems."
      />

      <div className="blog-grid">
        {POSTS.map((p, i) => (
          <Reveal key={i} delay={i * 80}>
            <TiltCard className="blog-card" strength={3}>
              <div className="date">[ {p.date} ]</div>
              <h3>{p.title}</h3>
              <p>{p.excerpt}</p>
              <a href="#" className="link">
                Read post <Arrow size={12} />
              </a>
            </TiltCard>
          </Reveal>
        ))}
      </div>

      <div style={{display: "flex", justifyContent: "center", marginTop: 48}}>
        <MagneticButton>View all blog posts</MagneticButton>
      </div>
    </div>
  </section>
);

const Contact = () => (
  <section id="contact" className="contact" data-screen-label="11 Contact">
    <div className="contact-bg" data-parallax="0.18" aria-hidden="true"></div>
    <div className="container" style={{position: "relative", zIndex: 2}}>
      <div className="mono" style={{marginBottom: 28}}>
        <span className="bracket">Section 11 / Signal</span>
      </div>
      <h2 className="contact-statement display" data-parallax="0.05">
        If you are <span className="h">building</span> systems<br/>
        that must <span className="stroke">adapt</span> without<br/>
        losing trust, <span className="h">we should talk.</span>
      </h2>

      <div className="contact-layout">
        <div className="contact-info">
          <p>
            Open to collaboration on medical AI, mHealth, and privacy-preserving systems. I bring both industry engineering and doctoral research to the table.
          </p>
          <a className="email" href="mailto:kaveebhashiofficial@gmail.com">
            kaveebhashiofficial@gmail.com
          </a>
          <div className="contact-links">
            {["GitHub", "LinkedIn", "Google Scholar", "ORCID"].map((s) => (
              <a key={s} href="#" className="chip" style={{textDecoration: "none"}}>{s}</a>
            ))}
          </div>

          <div style={{display: "grid", gap: 16, marginTop: 48, maxWidth: 480,
            fontFamily: "JetBrains Mono, monospace", fontSize: 11,
            letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--mono-tint)"}}>
            <div style={{display: "flex", justifyContent: "space-between"}}>
              <span>Status</span><span style={{color: "var(--accent)"}}>● Accepting collaborations</span>
            </div>
            <div style={{display: "flex", justifyContent: "space-between"}}>
              <span>Response Time</span><span>~ 48 hours</span>
            </div>
            <div style={{display: "flex", justifyContent: "space-between"}}>
              <span>Time Zone</span><span>Europe/Helsinki · UTC+2</span>
            </div>
          </div>
        </div>

        <form className="contact-form" onSubmit={(e) => { e.preventDefault(); alert("Thanks, message captured. (mock form)"); }}>
          <div className="mono" style={{marginBottom: 18}}>
            <span className="bracket">Direct Channel · v1</span>
          </div>
          <label>Your Name</label>
          <input type="text" placeholder="Dr. / Mx. ___" required />
          <label>Email</label>
          <input type="email" placeholder="you@institution.org" required />
          <label>Context</label>
          <input type="text" placeholder="Research collaboration · pilot · hiring · other" />
          <label>Message</label>
          <textarea placeholder="A paragraph is enough. I read everything." required />
          <MagneticButton primary>Start a Conversation</MagneticButton>
        </form>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer data-screen-label="12 Footer">
    <div className="container">
      <div className="footer-mega" data-parallax="0.18" aria-hidden="true">Kavishwa</div>
      <div className="footer-grid">
        <div className="footer-col">
          <h5>Sitemap</h5>
          <a href="#research">Research</a>
          <a href="#projects">Projects</a>
          <a href="#cv">CV</a>
          <a href="#blog">Blog</a>
          <a href="#publications">Publications</a>
        </div>
        <div className="footer-col">
          <h5>Channels</h5>
          <a href="mailto:kaveebhashiofficial@gmail.com">Email</a>
          <a href="#">GitHub</a>
          <a href="#">LinkedIn</a>
          <a href="#">Google Scholar</a>
          <a href="#">ORCID</a>
        </div>
        <div className="footer-col">
          <h5>Stack</h5>
          <div style={{color: "var(--text-dim)", fontSize: 13, lineHeight: 1.7}}>
            Built with React, CSS variables and a small dose of restraint. Type set in Anton, Space Grotesk and JetBrains Mono.
          </div>
        </div>
        <div className="footer-col">
          <h5>Locale</h5>
          <div style={{color: "var(--text-dim)", fontSize: 13, lineHeight: 1.7}}>
            Oulu, Finland<br/>65.0121° N · 25.4651° E<br/>Open worldwide
          </div>
        </div>
      </div>
      <div className="footer-bar">
        <div>© 2026 Kavishwa Wendakoon</div>
        <div>Trustworthy AI · Pediatric Health · Engineering</div>
        <div><span className="bracket">v3.0 · 2026</span></div>
      </div>
    </div>
  </footer>
);

Object.assign(window, { Blog, Contact, Footer });
