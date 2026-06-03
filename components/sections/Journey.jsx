import { JOURNEY, MILESTONES } from "@/lib/data";
import { Reveal } from "@/components/primitives/Reveal";
import { SectionHead } from "@/components/primitives/SectionHead";

export const Journey = ({ content }) => {
  const journey = content?.entries ?? JOURNEY;
  const milestones = content?.milestones ?? MILESTONES;
  return (
  <section id="journey" className="section" data-screen-label="06 Journey">
    <div className="container">
      <SectionHead
        label="Career arc"
        title={<>How my<br />thinking evolved.</>}
        sub="Five turning points that changed how I think about building AI that can actually be trusted."
      />

      <div className="journey-rail">
        {journey.map((j, i) => (
          <Reveal key={i} delay={i * 80} className="journey-item">
            <div className="journey-year">
              {j.year}
            </div>
            <div className="journey-body">
              <div className="journey-tag">
                <span className="bracket">SHIFT {j.num}</span><br />
                <span style={{ color: "var(--mono-tint)" }}>{j.tag}</span>
              </div>
              <div className="journey-content">
                <h3>
                  {j.title}<span className="arrow">{j.arrow}</span>{j.title2}
                </h3>
                <blockquote>&ldquo;{j.quote}&rdquo;</blockquote>
                <a href="#" className="journey-link">Read more about this shift →</a>
              </div>
              <div className="journey-side">
                <div><span className="bracket">REF.{j.num}</span></div>
                <div style={{ marginTop: 8 }}>{j.year}</div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="journey-milestones">
        {milestones.map((m, i) => (
          <div className="journey-milestone" key={i}>
            <div className="yr">&apos;{m.yr}</div>
            <div className="lbl">{m.lbl}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
  );
};
