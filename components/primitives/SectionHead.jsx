export const SectionHead = ({ label, title, sub, children = null }) => (
  <div className="section-head">
    {label ? (
      <div className="label-col" data-reveal="left">
        <p className="section-kicker">{label}</p>
      </div>
    ) : (
      <div className="label-col" aria-hidden="true" />
    )}
    <div data-reveal style={{ "--reveal-delay": "90ms" }}>
      <h2 className="display" data-parallax="0.06">{title}</h2>
      {sub && <p className="sub">{sub}</p>}
      {children}
    </div>
  </div>
);
