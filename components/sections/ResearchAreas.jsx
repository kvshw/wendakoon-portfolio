"use client";

import { RESEARCH_AREAS } from "@/lib/data";
import { Arrow } from "@/components/primitives/Arrow";
import { MagneticButton } from "@/components/primitives/MagneticButton";
import { SectionHead } from "@/components/primitives/SectionHead";

const onMove = (e) => {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
  el.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
};

const ResearchCard = ({ area, featured = false, revealDelay = 0 }) => (
  <article
    className={`research-card${featured ? " is-featured" : " is-compact"}`}
    data-area={area.idx}
    data-reveal="scale"
    onMouseMove={onMove}
    style={{ "--reveal-delay": `${revealDelay}ms` }}
  >
    <div className="research-card__spotlight" aria-hidden="true" />
    {featured && (
      <>
        <div className="research-card__glow" data-parallax="-0.18" aria-hidden="true" />
        <div className="research-card__grid" aria-hidden="true" />
        <span className="research-card__watermark" aria-hidden="true">{area.idx}</span>
      </>
    )}

    <div className="research-card__inner">
      <header className="research-card__head">
        <span className="research-card__idx"><span className="bracket">AREA / {area.idx}</span></span>
        {area.badge && <span className="research-card__badge">{area.badge}</span>}
        {!featured && (area.papers || area.prototypes) && (
          <span className="research-card__stat">
            <span className="bracket">
              {area.papers ? `${area.papers} paper${area.papers !== "1" ? "s" : ""}` : `${area.prototypes} prototype`}
            </span>
          </span>
        )}
      </header>

      <h3 className="research-card__title">{area.title}</h3>
      <p className="research-card__body">{area.body}</p>
      {area.detail && <p className="research-card__detail">{area.detail}</p>}

      <footer className="research-card__foot">
        <div className="research-card__tags">
          {area.tags.map((t) => (
            <span key={t} className="chip">{t}</span>
          ))}
        </div>

        {featured && area.cta && (
          <div className="research-card__cta">
            <MagneticButton primary>{area.cta}</MagneticButton>
          </div>
        )}

        {featured && (area.papers || area.prototypes) && (
          <div className="research-card__meta">
            {area.papers && <span><span className="bracket">{area.papers} papers</span></span>}
            {area.prototypes && <span><span className="bracket">{area.prototypes} prototypes</span></span>}
          </div>
        )}

        {!featured && (
          <span className="research-card__arrow" aria-hidden="true">
            <Arrow size={16} />
          </span>
        )}
      </footer>
    </div>
  </article>
);

export const ResearchAreas = ({ content }) => {
  const areas = content?.areas ?? RESEARCH_AREAS;
  return (
  <section id="research" className="section" data-screen-label="04 Research">
    <div className="container">
      <SectionHead
        label="Research domains"
        title={<>Research<br />Areas.</>}
        sub="Adaptive clinical AI, runtime governance, trustworthy deployment, empirical evaluation, and a live prototype: five threads of doctoral work."
      />

      <div className="research-grid">
        {areas.map((area, i) => (
          <ResearchCard
            key={area.idx}
            area={area}
            featured={i === 0}
            revealDelay={i * 70}
          />
        ))}
      </div>
    </div>
  </section>
  );
};
