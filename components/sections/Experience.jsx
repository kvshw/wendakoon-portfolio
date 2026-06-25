"use client";

import { useState } from "react";
import {
  AWARDS,
  CV_STATS,
  CV_TIMELINE,
  CV_URL,
  SKILL_GROUPS,
} from "@/lib/data";
import { MagneticButton } from "@/components/primitives/MagneticButton";
import { Reveal } from "@/components/primitives/Reveal";
import { SectionHead } from "@/components/primitives/SectionHead";

export const Experience = ({ content }) => {
  const timeline = content?.timeline ?? CV_TIMELINE;
  const skillGroups = content?.skillGroups ?? SKILL_GROUPS;
  const awards = content?.awards ?? AWARDS;
  const stats = content?.stats ?? CV_STATS;
  const [tab, setTab] = useState("timeline");

  return (
    <section id="cv" className="section" data-screen-label="08 CV">
      <div className="container">
        <SectionHead
          label="Experience"
          title={<>Experience &<br />background.</>}
          sub="The path from engineering student to doctoral researcher, with national-scale systems shipped along the way."
        >
          <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
            <MagneticButton
              primary
              href={CV_URL}
              download
              target="_blank"
              rel="noopener noreferrer"
            >
              Download Full CV
            </MagneticButton>
            <MagneticButton href="#contact">Get in touch</MagneticButton>
          </div>
        </SectionHead>

        <div className="cv-shell">
          <div className="cv-stats">
            {stats.map((s, i) => (
              <div className="s" key={i}>
                <div className="v">{s.v}</div>
                <div className="l">{s.l}</div>
              </div>
            ))}
          </div>

          <div className="cv-tabs">
            {[
              { id: "timeline", l: "Timeline" },
              { id: "skills", l: "Skills & Tools" },
              { id: "awards", l: "Awards" },
            ].map((t) => (
              <button
                key={t.id}
                className={`cv-tab ${tab === t.id ? "active" : ""}`}
                onClick={() => setTab(t.id)}
              >
                {t.l}
              </button>
            ))}
          </div>

          {tab === "timeline" && (
            <div className="cv-timeline">
              {timeline.map((e, i) => (
                <Reveal key={i} delay={i * 60} className="cv-entry">
                  <div>
                    <div className="when">{e.when}</div>
                    <div className="type">[ {e.type} ]</div>
                  </div>
                  <div>
                    <h3>{e.title}</h3>
                    <div className="org">{e.org}</div>
                    <p className="desc">{e.desc}</p>
                    {e.bullets && (
                      <ul>
                        {e.bullets.map((b, j) => <li key={j}>{b}</li>)}
                      </ul>
                    )}
                    {e.stack && (
                      <div className="stack">
                        {e.stack.map((s) => <span className="chip" key={s}>{s}</span>)}
                      </div>
                    )}
                  </div>
                  <div className="right">
                    <span className="mono"><span className="bracket">REF.{String(i + 1).padStart(2, "0")}</span></span>
                    {i === 0 && <span className="chip accent">CURRENT</span>}
                  </div>
                </Reveal>
              ))}
              <div style={{
                padding: "32px 0",
                color: "var(--text-dim)",
                fontSize: 14,
                textAlign: "center",
                borderTop: "1px dashed var(--line-strong)",
              }}>
                Based in Oulu, Finland. Open to research positions and collaborations worldwide.
              </div>
            </div>
          )}

          {tab === "skills" && (
            <div className="skills-grid">
              {skillGroups.map((g, i) => (
                <div className="skill-group" key={g.name} data-reveal="scale" style={{ "--reveal-delay": `${i * 80}ms` }}>
                  <h4>{g.name}</h4>
                  <div className="items">
                    {g.items.map((s) => <span className="chip" key={s}>{s}</span>)}
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "awards" && (
            <div className="awards-grid">
              {awards.map((a, i) => (
                <div
                  className={`award-card${a.featured ? " featured" : ""}`}
                  key={i}
                  data-reveal="scale"
                  style={{ "--reveal-delay": `${i * 80}ms` }}
                >
                  <div className="yr"><span className="bracket">{a.yr}</span></div>
                  <h4>{a.title}</h4>
                  <div className="by">{a.by}</div>
                  {a.note && <div className="note">{a.note}</div>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
