import { getProfileLinks, PROFILE } from "@/lib/profile-links";

export const Footer = ({ standalone = false }) => {
  const channelLinks = getProfileLinks().filter(
    (l) => !["website", "blog", "cv"].includes(l.id)
  );
  const href = (id) => (standalone ? `/#${id}` : `#${id}`);

  return (
  <footer data-screen-label="12 Footer">
    <div className="container">
      <div className="footer-mega" data-parallax="0.18" aria-hidden="true">Kavishwa</div>
      <div className="footer-grid">
        <div className="footer-col footer-col--sitemap">
          <h5>Sitemap</h5>
          <nav className="footer-sitemap" aria-label="Sitemap">
            <a href={href("research")}>Research</a>
            <a href={href("projects")}>Projects</a>
            <a href={href("cv")}>CV</a>
            <a href={standalone ? "/blog" : href("blog")}>Blog</a>
            <a href={href("publications")}>Publications</a>
          </nav>
        </div>
        <div className="footer-col">
          <h5>Channels</h5>
          <a href={`mailto:${PROFILE.email}`}>Email</a>
          <a href="/links">All links</a>
          {channelLinks.map((link) => (
            <a
              key={link.id}
              href={link.href}
              {...(link.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
            >
              {link.label}
            </a>
          ))}
        </div>
        <div className="footer-col">
          <h5>Stack</h5>
          <div style={{ color: "var(--text-dim)", fontSize: 13, lineHeight: 1.7 }}>
            Built with Next.js and CSS variables. Type in Anton, Space Grotesk, and JetBrains Mono.
          </div>
        </div>
        <div className="footer-col">
          <h5>Locale</h5>
          <div style={{ color: "var(--text-dim)", fontSize: 13, lineHeight: 1.7 }}>
            Oulu, Finland<br />65.0121° N · 25.4651° E<br />Open worldwide
          </div>
        </div>
      </div>
      <div className="footer-bar">
        <div>© 2026 Kavishwa Wendakoon</div>
        <div>Trustworthy AI · Pediatric Health · Engineering</div>
        <div><span className="bracket">v3.0 · 2026</span></div>
      </div>
    </div>
  </footer>
  );
};
