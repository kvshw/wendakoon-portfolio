"use client";

import { useEffect, useState } from "react";
import { NAV_LINKS } from "@/lib/data";
import { useTheme } from "./Providers";
import { Arrow } from "./primitives/Arrow";
import { Icon } from "./primitives/Icons";
import { MagneticButton } from "./primitives/MagneticButton";

export const Nav = ({ active, standalone = false }) => {
  const { theme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const sectionHref = (id) => (standalone ? `/#${id}` : `#${id}`);
  const brandHref = standalone ? "/" : "#top";
  const contactHref = standalone ? "/#contact" : "#contact";
  const chatHref = standalone ? "/#chat" : "#chat";

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const closeMobile = () => setMobileOpen(false);
  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <>
      <nav className="nav" role="navigation" aria-label="Primary">
        <div className="nav-inner">
          <a className="nav-brand" href={brandHref} aria-label="Kavishwa Wendakoon, home">
            <img
              className="nav-logo"
              src={theme === "dark" ? "/assets/logo.png" : "/assets/logo-dark.png"}
              width="918"
              height="411"
              alt="Kavishwa Wendakoon"
            />
          </a>

          <div className="nav-links">
            {NAV_LINKS.map((l) => (
              <a
                key={l.id}
                href={sectionHref(l.id)}
                className={`nav-link ${active === l.id ? "active" : ""}`}
              >
                {l.label}
              </a>
            ))}
            <a href={chatHref} className="nav-link nav-link-accent">Chat with Me</a>
          </div>

          <div className="nav-actions">
            <button
              className="theme-toggle nav-theme-desktop"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Icon.sun /> : <Icon.moon />}
            </button>
            <MagneticButton primary href={contactHref} className="nav-cta-desktop">
              Get in Touch
            </MagneticButton>
            <button
              type="button"
              className={`nav-burger ${mobileOpen ? "open" : ""}`}
              onClick={() => setMobileOpen((o) => !o)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
            >
              <span className="nav-burger-line" />
              <span className="nav-burger-line" />
              <span className="nav-burger-line" />
            </button>
          </div>
        </div>
      </nav>

      <button
        type="button"
        className={`mobile-menu-backdrop ${mobileOpen ? "open" : ""}`}
        aria-label="Close menu"
        onClick={closeMobile}
        tabIndex={mobileOpen ? 0 : -1}
      />

      <div
        id="mobile-menu"
        className={`mobile-menu ${mobileOpen ? "open" : ""}`}
        aria-hidden={!mobileOpen}
      >
        <div className="mobile-menu-head">
          <p className="mobile-menu-label">
            <span className="bracket">Navigation</span>
          </p>
          <button
            type="button"
            className="mobile-menu-close"
            onClick={closeMobile}
            aria-label="Close menu"
          >
            <Icon.close />
          </button>
        </div>

        <nav className="mobile-menu-scroll" aria-label="Mobile">
          {NAV_LINKS.map((l, i) => (
            <a
              key={l.id}
              href={sectionHref(l.id)}
              className={`mobile-menu-link ${active === l.id ? "active" : ""}`}
              onClick={closeMobile}
            >
              <span className="mobile-menu-link-num">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="mobile-menu-link-text">{l.label}</span>
            </a>
          ))}
          <a
            href={chatHref}
            className="mobile-menu-link accent"
            onClick={closeMobile}
          >
            <span className="mobile-menu-link-num">+</span>
            <span className="mobile-menu-link-text">Chat with Me</span>
          </a>
        </nav>

        <div className="mobile-menu-dock">
          <button
            type="button"
            className="mobile-menu-theme"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Icon.sun /> : <Icon.moon />}
            <span>{theme === "dark" ? "Light mode" : "Dark mode"}</span>
          </button>
          <a
            className="btn primary mobile-menu-cta"
            href={contactHref}
            onClick={closeMobile}
          >
            Get in Touch
            <Arrow />
          </a>
        </div>
      </div>
    </>
  );
};
