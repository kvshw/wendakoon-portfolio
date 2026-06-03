"use client";

import { ORIENT_CARDS } from "@/lib/data";
import { Arrow } from "@/components/primitives/Arrow";
import { SectionHead } from "@/components/primitives/SectionHead";

export const Orientation = ({ content }) => {
  const cards = content?.cards ?? ORIENT_CARDS;
  const onMove = (e) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
  };

  return (
    <section id="about" className="section" data-screen-label="02 About">
      <div className="container">
        <SectionHead
          label="Site map"
          title={<>How this<br />site works.</>}
          sub="Six rooms, one researcher. Each card opens a thread of work, from doctoral focus to shipped systems and the chat that ties it together."
        />
        <div className="orient-grid">
          {cards.map((c, i) => (
            <a
              key={c.idx}
              href={`#${c.to}`}
              className="orient-card"
              data-reveal="scale"
              onMouseMove={onMove}
              style={{ textDecoration: "none", color: "inherit", "--reveal-delay": `${i * 70}ms` }}
            >
              <div>
                <div className="idx"><span className="bracket">{c.idx}</span></div>
                <h3>{c.title}</h3>
                <p>{c.body}</p>
              </div>
              <div className="arrow"><Arrow size={18} /></div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
