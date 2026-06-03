"use client";

import { useState } from "react";
import { FOCUS_AREAS } from "@/lib/data";
import { Reveal } from "@/components/primitives/Reveal";
import { SectionHead } from "@/components/primitives/SectionHead";

export const CurrentFocus = ({ content }) => {
  const focusAreas = content?.areas ?? FOCUS_AREAS;
  const [active, setActive] = useState("investigating");
  const current = focusAreas.find((a) => a.id === active);

  return (
    <section id="focus" className="section" data-screen-label="07 Focus">
      <div className="container">
        <SectionHead
          label="Now"
          title={<>Current<br />research focus.</>}
          sub="What I'm investigating, building, questioning, and open to collaborating on right now."
        />

        <div className="focus-shell">
          <div className="focus-head">
            <div><span className="bracket">CONSOLE / focus.kw</span></div>
            <div className="live"><span className="dot"></span><span>● ACTIVE</span></div>
          </div>

          <div className="focus-body">
            <div className="focus-tabs">
              {focusAreas.map((a) => (
                <button
                  key={a.id}
                  className={`focus-tab ${active === a.id ? "active" : ""}`}
                  onClick={() => setActive(a.id)}
                >
                  <span className="num"><span className="bracket">{a.num}</span></span>
                  <span className="ttl">{a.title}</span>
                  {active !== a.id && <span className="preview">{a.preview}</span>}
                </button>
              ))}
            </div>

            <div className="focus-content" key={active}>
              <div className="signal" aria-hidden="true">
                <span></span><span></span><span></span><span></span><span></span>
              </div>
              <div className="focus-meta">
                <span><span className="bracket">FOCUS {current.num} OF 04</span></span>
                <span><span className="bracket">↳ {current.related}</span></span>
              </div>
              <Reveal>
                <h3>{current.title}</h3>
                <p>{current.body}</p>
                <p className="deep" style={{ marginTop: 16 }}>{current.deep}</p>
                <div className="focus-tags">
                  {current.tags.map((t) => <span className="chip" key={t}>{t}</span>)}
                </div>
                <div className="focus-related">
                  Related: <span className="v">{current.related}</span>
                </div>
                <blockquote>&ldquo;{current.quote}&rdquo;</blockquote>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
