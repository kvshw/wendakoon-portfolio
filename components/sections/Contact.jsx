"use client";

import { useState } from "react";
import { CONTACT_DEFAULTS } from "@/lib/content/section-defaults";
import { MagneticButton } from "@/components/primitives/MagneticButton";

const EMPTY_FORM = { name: "", email: "", context: "", message: "", company: "" };

export const Contact = ({ content }) => {
  const c = { ...CONTACT_DEFAULTS, ...content };
  const links = c.links ?? CONTACT_DEFAULTS.links;

  const [form, setForm] = useState(EMPTY_FORM);
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [error, setError] = useState("");

  const update = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === "sending") return;
    setError("");

    if (!consent) {
      setError("Please agree to be contacted before sending.");
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, consent }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error || "Could not send your message.");
      }
      setStatus("success");
      setForm(EMPTY_FORM);
      setConsent(false);
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Could not send your message.");
    }
  };

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

          {status === "success" ? (
            <div className="contact-form contact-form--success" role="status">
              <div className="mono" style={{ marginBottom: 18 }}>
                <span className="bracket">Message received</span>
              </div>
              <h3 className="contact-success-title">Thanks — it landed.</h3>
              <p className="contact-success-body">
                I read everything personally and reply within about 48 hours. A
                confirmation is on its way to your inbox.
              </p>
              <button
                type="button"
                className="contact-reset"
                onClick={() => setStatus("idle")}
              >
                Send another message
              </button>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit} noValidate>
              <div className="mono" style={{ marginBottom: 18 }}>
                <span className="bracket">Direct Channel · v1</span>
              </div>

              {/* Honeypot: hidden from humans, catches bots */}
              <div className="contact-hp" aria-hidden="true">
                <label>Company</label>
                <input
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.company}
                  onChange={update("company")}
                />
              </div>

              <label htmlFor="cf-name">Your Name</label>
              <input
                id="cf-name"
                type="text"
                placeholder="Dr. / Mx. ___"
                value={form.name}
                onChange={update("name")}
                required
              />
              <label htmlFor="cf-email">Email</label>
              <input
                id="cf-email"
                type="email"
                placeholder="you@institution.org"
                value={form.email}
                onChange={update("email")}
                required
              />
              <label htmlFor="cf-context">Context</label>
              <input
                id="cf-context"
                type="text"
                placeholder="Research collaboration · pilot · hiring · other"
                value={form.context}
                onChange={update("context")}
              />
              <label htmlFor="cf-message">Message</label>
              <textarea
                id="cf-message"
                placeholder="A paragraph is enough. I read everything."
                value={form.message}
                onChange={update("message")}
                required
              />

              <label className="contact-consent">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                />
                <span>
                  I agree that my name and email may be stored so Kavishwa can
                  reply to my message. See the{" "}
                  <a href="/privacy" target="_blank" rel="noopener noreferrer">
                    privacy notice
                  </a>
                  .
                </span>
              </label>

              {error && (
                <p className="contact-error" role="alert">
                  {error}
                </p>
              )}

              <MagneticButton
                primary
                type="submit"
                disabled={status === "sending"}
              >
                {status === "sending" ? "Sending…" : "Start a Conversation"}
              </MagneticButton>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
