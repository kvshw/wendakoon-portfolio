"use client";

import { CONTACT_DEFAULTS } from "@/lib/content/section-defaults";
import { MagneticButton } from "@/components/primitives/MagneticButton";

export const Contact = ({ content }) => {
  const c = { ...CONTACT_DEFAULTS, ...content };
  const links = c.links ?? CONTACT_DEFAULTS.links;

  return (
    <section id="contact" className="contact" data-screen-label="11 Contact">
      <div className="contact-bg" data-parallax="0.18" aria-hidden="true"></div>
      <div className="container" style={{ position: "relative", zIndex: 2 }}>
        <p className="section-kicker" style={{ marginBottom: 28 }}>{c.kicker}</p>
        <h2 className="contact-statement display" data-parallax="0.05">
          {c.statement}
        </h2>

        <div className="contact-layout">
          <div className="contact-info">
            <p>{c.body}</p>
            <a className="email" href={`mailto:${c.email}`}>
              {c.email}
            </a>
            <div className="contact-links">
              {links.map((s) => {
                const external =
                  s.href.startsWith("http") || s.href.startsWith("mailto:");
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    className="chip"
                    style={{ textDecoration: "none" }}
                    {...(external && !s.href.startsWith("mailto:")
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    {s.label}
                  </a>
                );
              })}
            </div>

            <dl className="contact-meta">
              <div className="contact-meta-row contact-meta-row--wide">
                <dt>Status</dt>
                <dd className="contact-meta-status">
                  <span className="contact-meta-dot" aria-hidden="true" />
                  {c.availability}
                </dd>
              </div>
              <div className="contact-meta-row">
                <dt>Response</dt>
                <dd>~ 48 hours</dd>
              </div>
              <div className="contact-meta-row">
                <dt>Time zone</dt>
                <dd>Europe/Helsinki · UTC+2</dd>
              </div>
            </dl>
          </div>

          <form
            className="contact-form"
            onSubmit={(e) => {
              e.preventDefault();
              alert("Thanks, message captured. (mock form)");
            }}
          >
            <div className="mono" style={{ marginBottom: 18 }}>
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
};
