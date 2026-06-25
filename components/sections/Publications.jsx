"use client";

import { useState } from "react";
import { PUB_CATEGORIES, PUBLICATIONS } from "@/lib/data";
import { SectionHead } from "@/components/primitives/SectionHead";

export const Publications = ({ content }) => {
  const allPubs = content?.items ?? PUBLICATIONS;
  const categories = content?.categories ?? PUB_CATEGORIES;
  const [filter, setFilter] = useState("all");
  const items = filter === "all"
    ? allPubs
    : allPubs.filter((p) => p.cat === filter);

  return (
    <section id="publications" className="section" data-screen-label="09 Publications">
      <div className="container">
        <SectionHead
          label="Publications"
          title={<>Publications,<br />talks & prototypes.</>}
          sub="Research papers, working prototypes, and public presentations."
        />

        <div className="pub-tabs">
          {categories.map((c) => (
            <button
              key={c.id}
              className={`chip ${filter === c.id ? "accent" : ""}`}
              style={{ cursor: "pointer", background: filter === c.id ? "rgba(40,189,174,0.10)" : "transparent" }}
              onClick={() => setFilter(c.id)}
            >
              {c.label} <span style={{ opacity: 0.6, marginLeft: 4 }}>· {c.count}</span>
            </button>
          ))}
        </div>

        <div className="pub-list">
          {items.map((p, i) => (
            <div
              className={`pub-card${p.award ? " pub-card--award" : ""}`}
              key={i}
              data-reveal="left"
              style={{ "--reveal-delay": `${i * 70}ms` }}
            >
              <div className="pub-year">{p.year}</div>
              <div>
                {p.award && (
                  <div className="pub-award-banner">
                    <span className="pub-award-icon">★</span>
                    {p.award}
                  </div>
                )}
                <div className="pub-meta-top">
                  <span className="badge">{p.kind}</span>
                  <span>{p.venue}</span>
                </div>
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </div>
              <div className="pub-tags">
                {p.tags.map((t) => <span className="chip" key={t}>{t}</span>)}
              </div>
              {p.link ? (
                <a
                  href={p.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pub-action"
                >
                  {p.action}
                </a>
              ) : (
                <button className="pub-action">{p.action}</button>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
