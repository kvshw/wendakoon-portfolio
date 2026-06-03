/* PRIMITIVES, shared small components */

const Arrow = ({ size = 14, className = "" }) => (
  <svg className={`arrow ${className}`} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 19L19 5" />
    <path d="M8 5h11v11" />
  </svg>
);

const ArrowDown = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 5v14" />
    <path d="M5 12l7 7 7-7" />
  </svg>
);

const Icon = {
  sun: (p) => (
    <svg {...p} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5" />
    </svg>
  ),
  moon: (p) => (
    <svg {...p} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    </svg>
  ),
  send: (p) => (
    <svg {...p} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 2L11 13" />
      <path d="M22 2l-7 20-4-9-9-4 20-7z" />
    </svg>
  ),
  chat: (p) => (
    <svg {...p} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  ),
  close: (p) => (
    <svg {...p} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  ),
};

/* Section header */
const SectionHead = ({ label, num, title, sub, children }) => (
  <div className="section-head">
    <div className="label-col" data-reveal="left">
      <div className="mono"><span className="bracket">{label}</span></div>
      {num && <div className="mono" style={{marginTop: 8}}>{num}</div>}
    </div>
    <div data-reveal style={{"--reveal-delay": "90ms"}}>
      <h2 className="display" data-parallax="0.06">{title}</h2>
      {sub && <p className="sub">{sub}</p>}
      {children}
    </div>
  </div>
);

/* Magnetic CTA button */
const MagneticButton = ({ children, primary, onClick, href, ...rest }) => {
  const ref = React.useRef(null);
  const onMove = (e) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    el.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px)`;
  };
  const onLeave = () => { if (ref.current) ref.current.style.transform = ""; };
  const Tag = href ? "a" : "button";
  return (
    <Tag
      ref={ref}
      className={`btn ${primary ? "primary" : ""}`}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={onClick}
      href={href}
      {...rest}
    >
      {children}
      <Arrow />
    </Tag>
  );
};

/* Tilt card wrapper */
const TiltCard = ({ children, className = "", strength = 6, ...rest }) => {
  const ref = React.useRef(null);
  const onMove = (e) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    const rx = (0.5 - py) * strength;
    const ry = (px - 0.5) * strength;
    el.style.setProperty("--mx", `${px * 100}%`);
    el.style.setProperty("--my", `${py * 100}%`);
    el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  };
  const onLeave = () => { if (ref.current) ref.current.style.transform = ""; };
  return (
    <div ref={ref} className={className} onMouseMove={onMove} onMouseLeave={onLeave} {...rest}>
      {children}
    </div>
  );
};

/* In-view reveal */
const Reveal = ({ children, delay = 0, as = "div", className = "", ...rest }) => {
  const ref = React.useRef(null);
  const [shown, setShown] = React.useState(false);
  const blur = React.useRef(
    typeof window !== "undefined" &&
    !window.matchMedia("(max-width: 720px)").matches
  ).current;
  React.useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setShown(true); io.disconnect(); }
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const Tag = as;
  const EASE = "cubic-bezier(.21,.6,.18,1)";
  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        ...(rest.style || {}),
        opacity: shown ? 1 : 0,
        transform: shown ? "translateY(0)" : "translateY(22px)",
        filter: shown ? "none" : (blur ? "blur(6px)" : "none"),
        transition: `opacity 0.8s ${EASE} ${delay}ms, transform 0.9s ${EASE} ${delay}ms, filter 0.8s ${EASE} ${delay}ms`,
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
};

/* Monochrome image placeholder */
const ImagePlaceholder = ({ label = "image", w = "100%", h = 200, code, glyph, style }) => (
  <div className="placeholder" style={{ width: w, height: h, ...(style || {}) }}>
    <span className="ph-label">{label}</span>
    <span className="ph-corner">
      <span>{code || "[IMG]"}</span>
    </span>
    {glyph && <span className="ph-glyph">{glyph}</span>}
  </div>
);

Object.assign(window, {
  Arrow, ArrowDown, Icon,
  SectionHead, MagneticButton, TiltCard, Reveal, ImagePlaceholder,
});
