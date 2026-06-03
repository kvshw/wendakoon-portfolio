/* APP, root assembly */

const App = () => {
  const [theme, setTheme] = React.useState(() =>
    document.documentElement.getAttribute("data-theme") || "dark"
  );
  const [active, setActive] = React.useState("about");

  // theme effect
  React.useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // mouse glow, smooth rAF follow, viewport-relative (no scrollY offset)
  React.useEffect(() => {
    // skip entirely on touch / coarse pointers, the glow is hidden there and
    // there's no cursor to follow, so don't spin a rAF loop on mobile.
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const glow = document.querySelector(".mouse-glow");
    if (!glow) return;

    let targetX = -1000, targetY = -1000;
    let curX = -1000, curY = -1000;
    let raf = 0;
    let started = false;

    const onMove = (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!started) { curX = targetX; curY = targetY; started = true; }
    };
    const onLeave = () => { targetX = -1000; targetY = -1000; };

    const tick = () => {
      curX += (targetX - curX) * 0.16;
      curY += (targetY - curY) * 0.16;
      glow.style.transform = `translate3d(${curX}px, ${curY}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  // global parallax, smoothed (lerp), depth-aware, and gentler on small screens.
  // Idles the rAF when everything has settled so it costs nothing while still.
  React.useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const els = Array.from(document.querySelectorAll("[data-parallax]"));
    if (!els.length) return;

    const coarse = window.matchMedia("(pointer: coarse)").matches;
    let intensity = 1;
    const computeIntensity = () => {
      const w = window.innerWidth;
      if (w <= 720) intensity = 0.4;
      else if (w <= 1024) intensity = 0.65;
      else intensity = 1;
      if (coarse) intensity *= 0.85; // ease drift on touch devices
    };
    computeIntensity();

    const state = els.map((el) => ({
      el,
      speed: parseFloat(el.dataset.parallax) || 0.15,
      cur: 0,
      target: 0,
    }));

    let raf = 0;
    let running = false;

    const measure = () => {
      const vh = window.innerHeight;
      for (const s of state) {
        const r = s.el.getBoundingClientRect();
        if (r.bottom < -vh || r.top > vh * 2) continue; // ignore far off-screen
        const center = r.top + r.height / 2 - vh / 2;
        s.target = center * s.speed * intensity;
      }
    };

    const tick = () => {
      let moving = false;
      for (const s of state) {
        const d = s.target - s.cur;
        if (Math.abs(d) > 0.06) { s.cur += d * 0.12; moving = true; }
        else s.cur = s.target;
        s.el.style.transform = `translate3d(0, ${s.cur.toFixed(2)}px, 0)`;
      }
      if (moving) raf = requestAnimationFrame(tick);
      else running = false;
    };
    const kick = () => { if (!running) { running = true; raf = requestAnimationFrame(tick); } };

    // initial placement without animation (no entrance jump)
    measure();
    for (const s of state) {
      s.cur = s.target;
      s.el.style.transform = `translate3d(0, ${s.cur.toFixed(2)}px, 0)`;
    }

    const onScroll = () => { measure(); kick(); };
    const onResize = () => { computeIntensity(); measure(); kick(); };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // scroll reveals, attribute driven ([data-reveal]); no wrappers, so layout is
  // untouched. Each element animates in once, then is unobserved. A MutationObserver
  // catches nodes added later (e.g. tab/filter content) so they still reveal.
  React.useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -7% 0px" });

    const register = (el) => {
      if (!el || el.classList.contains("is-in")) return;
      if (reduce) { el.classList.add("is-in"); return; }
      io.observe(el);
    };
    const scan = (root) => {
      if (root.nodeType !== 1) return;
      if (root.matches && root.matches("[data-reveal]")) register(root);
      root.querySelectorAll && root.querySelectorAll("[data-reveal]").forEach(register);
    };

    scan(document.body);

    const mo = new MutationObserver((muts) => {
      muts.forEach((m) => m.addedNodes.forEach(scan));
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => { io.disconnect(); mo.disconnect(); };
  }, []);

  // scroll spy
  React.useEffect(() => {
    const ids = ["about","perspective","research","projects","journey","focus","cv","publications","blog","contact"];
    const sections = ids.map(id => document.getElementById(id)).filter(Boolean);
    const io = new IntersectionObserver((entries) => {
      const visible = entries
        .filter(e => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActive(visible.target.id);
    }, { threshold: [0.15, 0.4, 0.7] });
    sections.forEach(s => io.observe(s));
    return () => io.disconnect();
  }, []);

  return (
    <>
      <ScrollProgress />
      <Nav active={active} theme={theme} onToggleTheme={() => setTheme(t => t === "dark" ? "light" : "dark")} />
      <main>
        <Hero />
        <Orientation />
        <PerspectiveSelector />
        <ResearchAreas />
        <Projects />
        <Journey />
        <CurrentFocus />
        <Experience />
        <Publications />
        <Blog />
        <Contact />
      </main>
      <Footer />
      <Chat />
    </>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
