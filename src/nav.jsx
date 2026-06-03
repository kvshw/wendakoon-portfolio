/* NAV, top navigation, scroll progress, mouse glow, theme toggle */

const Nav = ({ active, theme, onToggleTheme }) => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  React.useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
  }, [mobileOpen]);

  return (
    <>
      <nav className="nav" role="navigation" aria-label="Primary">
        <div className="nav-inner">
          <a className="nav-brand" href="#top" aria-label="Kavishwa Wendakoon home">
            <img
              className="nav-logo"
              src={theme === "dark" ? "assets/logo.png" : "assets/logo-dark.png"}
              width="918"
              height="411"
              alt="Kavishwa Wendakoon"
            />
          </a>

          <div className="nav-links">
            {NAV_LINKS.map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                className={`nav-link ${active === l.id ? "active" : ""}`}
              >
                {l.label}
              </a>
            ))}
            <a href="#chat" className={`nav-link`} style={{color: "var(--accent)"}}>Chat with Me</a>
          </div>

          <div className="nav-actions">
            <button className="theme-toggle" onClick={onToggleTheme} aria-label="Toggle theme">
              {theme === "dark" ? <Icon.sun /> : <Icon.moon />}
            </button>
            <MagneticButton primary href="#contact">Get in Touch</MagneticButton>
            <button className="nav-burger" onClick={() => setMobileOpen(o => !o)} aria-label="Menu" aria-expanded={mobileOpen}>
              <span style={{transform: mobileOpen ? "translateY(5.5px) rotate(45deg)" : ""}} />
              <span style={{opacity: mobileOpen ? 0 : 1}} />
              <span style={{transform: mobileOpen ? "translateY(-5.5px) rotate(-45deg)" : ""}} />
            </button>
          </div>
        </div>
      </nav>

      <div className={`mobile-menu ${mobileOpen ? "open" : ""}`}>
        {NAV_LINKS.map((l) => (
          <a key={l.id} href={`#${l.id}`} onClick={() => setMobileOpen(false)}>{l.label}</a>
        ))}
        <a href="#chat" onClick={() => setMobileOpen(false)} style={{color: "var(--accent)"}}>Chat with Me</a>
      </div>
    </>
  );
};

/* Scroll progress strip */
const ScrollProgress = () => {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const fn = () => {
      const h = document.documentElement;
      const s = h.scrollTop || document.body.scrollTop;
      const max = h.scrollHeight - h.clientHeight;
      if (ref.current) ref.current.style.width = `${(s / Math.max(1, max)) * 100}%`;
    };
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return <div className="scroll-progress" ref={ref} />;
};

Object.assign(window, { Nav, ScrollProgress });
