"use client";

import { PROJECTS } from "@/lib/data";
import { Arrow } from "@/components/primitives/Arrow";
import { MagneticButton } from "@/components/primitives/MagneticButton";
import { SectionHead } from "@/components/primitives/SectionHead";

export const Projects = ({ content }) => {
  const projects = content?.items ?? PROJECTS;
  const onMove = (e) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
  };

  return (
    <section id="projects" className="section" data-screen-label="05 Projects">
      <div className="container">
        <SectionHead
          label="Selected work"
          title={<>Selected<br />Projects.</>}
          sub="National-scale systems, healthcare AI, and research prototypes. Hover any case file for the signal."
        />

        <div className="projects-list">
          {projects.map((p, i) => (
            <div
              className="project-row"
              key={p.idx}
              data-reveal="left"
              onMouseMove={onMove}
              style={{ "--reveal-delay": `${i * 80}ms` }}
            >
              <div className="project-idx">{p.idx}</div>
              <div className="project-meta-stack">
                <span className="project-slug">{p.slug}</span>
                <h3 className="project-title">{p.title}</h3>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
                  {p.tags.map((t) => <span className="chip" key={t}>{t}</span>)}
                </div>
              </div>
              <p className="project-desc">{p.body}</p>
              <div className="project-flags">
                <div className="project-flag"><span className="dot"></span>{p.status}</div>
                <div className="project-flag year"><span className="dot"></span>{p.year}</div>
                <div className="project-flag year"><span className="dot"></span>{p.type}</div>
                <div className="project-flag year">
                  <span className="dot"></span>{p.evidence.join(" · ")}
                </div>
              </div>
              <div className="project-cta" title="See project timeline">
                <Arrow size={16} />
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 40, flexWrap: "wrap", gap: 16 }}>
          <div className="mono"><span className="bracket">3 of 10+ case files surfaced</span></div>
          <MagneticButton>View all projects</MagneticButton>
        </div>
      </div>
    </section>
  );
};
