"use client";

import { useState } from "react";
import { PERSPECTIVES } from "@/lib/data";
import { MagneticButton } from "@/components/primitives/MagneticButton";
import { Reveal } from "@/components/primitives/Reveal";
import { SectionHead } from "@/components/primitives/SectionHead";

function ratioFor(id) {
  return ({
    recruiters: { res: 0.85, eng: 0.92, reg: 0.7 },
    collaborators: { res: 0.95, eng: 0.78, reg: 0.85 },
    industry: { res: 0.72, eng: 0.98, reg: 0.9 },
    students: { res: 0.8, eng: 0.84, reg: 0.55 },
  })[id];
}

const Bar = ({ label, value }) => (
  <div>
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      fontFamily: "JetBrains Mono, monospace",
      fontSize: 10,
      letterSpacing: "0.14em",
      color: "var(--mono-tint)",
      textTransform: "uppercase",
      marginBottom: 4,
    }}>
      <span>{label}</span><span>{Math.round(value * 100)}%</span>
    </div>
    <div style={{ height: 3, background: "var(--line)", overflow: "hidden", borderRadius: 2 }}>
      <div style={{
        width: `${value * 100}%`,
        height: "100%",
        background: "linear-gradient(90deg, var(--accent), var(--accent-2))",
        transition: "width 0.8s cubic-bezier(.2,.7,.2,1)",
      }} />
    </div>
  </div>
);

export const PerspectiveSelector = ({ content }) => {
  const perspectives = content?.items ?? PERSPECTIVES;
  const [active, setActive] = useState("recruiters");
  const current = perspectives.find((p) => p.id === active);
  const next = perspectives.find((p) => p.id === current?.next);
  const idx = perspectives.findIndex((p) => p.id === active);

  return (
    <section id="perspective" className="section" data-screen-label="03 Perspective">
      <div className="container">
        <SectionHead
          label="Your lens"
          title={<>How can I<br />help you?</>}
          sub="Pick a perspective. The page rewrites itself to surface what matters to you."
        />

        <div className="persp-shell">
          <div className="persp-tabs" role="tablist">
            {perspectives.map((p) => (
              <button
                key={p.id}
                role="tab"
                aria-selected={active === p.id}
                className={`persp-tab ${active === p.id ? "active" : ""}`}
                onClick={() => setActive(p.id)}
              >
                <div className="num"><span className="bracket">{p.num}</span></div>
                <div className="name">{p.name}</div>
              </button>
            ))}
          </div>

          <div className="persp-body" key={active}>
            <div className="persp-main">
              <Reveal>
                <div className="mono">
                  <span className="bracket">PERSPECTIVE / {String(idx + 1).padStart(2, "0")} OF 04</span>
                </div>
                <h3>{current.title}</h3>
                <blockquote className="persp-quote">&ldquo;{current.quote}&rdquo;</blockquote>
                <ul className="persp-highlights">
                  {current.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </Reveal>
            </div>

            <div className="persp-side">
              <div>
                <div className="mono" style={{ marginBottom: 18 }}>
                  <span className="bracket">Snapshot</span>
                </div>
                <div className="persp-stats">
                  {current.stats.map((s, i) => (
                    <div className="persp-stat" key={i}>
                      <div className="v">{s.v}</div>
                      <div className="l">{s.l}</div>
                    </div>
                  ))}
                </div>

                <div style={{ padding: "20px 0", borderTop: "1px dashed var(--line-strong)" }}>
                  <div className="mono" style={{ marginBottom: 14 }}>
                    <span className="bracket">Signal</span>
                  </div>
                  <div style={{ display: "grid", gap: 6 }}>
                    <Bar label="Research depth" value={ratioFor(active).res} />
                    <Bar label="Engineering velocity" value={ratioFor(active).eng} />
                    <Bar label="Clinical / regulatory" value={ratioFor(active).reg} />
                  </div>
                </div>
              </div>

              <div className="persp-ctas">
                <MagneticButton
                  primary={current.cta.primary !== false}
                  href={current.cta.href}
                  download={current.cta.download || undefined}
                  target={current.cta.href?.startsWith("/") ? "_blank" : undefined}
                  rel={current.cta.href?.startsWith("/") ? "noopener noreferrer" : undefined}
                >
                  {current.cta.label}
                </MagneticButton>
                <MagneticButton onClick={() => setActive(current.next)}>
                  Next: {next.name}
                </MagneticButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
