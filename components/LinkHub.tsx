import Image from "next/image";
import Link from "next/link";
import { getProfileLinks, PROFILE } from "@/lib/profile-links";

type LinkItem = ReturnType<typeof getProfileLinks>[number];

function LinkButton({ link }: { link: LinkItem }) {
  const className = link.featured ? "lh-btn lh-btn--primary" : "lh-btn";
  const inner = (
    <>
      <span className="lh-btn__text">
        <span className="lh-btn__label">{link.label}</span>
        {link.description ? (
          <span className="lh-btn__sub">{link.description}</span>
        ) : null}
      </span>
      <span className="lh-btn__chev" aria-hidden="true">
        ↗
      </span>
    </>
  );

  const isExternal =
    link.external ||
    link.href.startsWith("http") ||
    link.href.startsWith("mailto:");

  if (isExternal) {
    return (
      <a
        href={link.href}
        className={className}
        target={link.href.startsWith("mailto:") ? undefined : "_blank"}
        rel={link.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
      >
        {inner}
      </a>
    );
  }

  return (
    <Link href={link.href} className={className}>
      {inner}
    </Link>
  );
}

export function LinkHub() {
  const links = getProfileLinks();

  return (
    <div className="lh">
      <div className="lh-glow lh-glow--a" aria-hidden="true" />
      <div className="lh-glow lh-glow--b" aria-hidden="true" />

      <div className="lh-inner">
        <header className="lh-header">
          <Link href="/" className="lh-logo" aria-label="Home">
            <Image
              src="/assets/logo.png"
              alt="Kavishwa Wendakoon"
              width={200}
              height={90}
              className="lh-logo__img"
              priority
            />
          </Link>
          <p className="lh-eyebrow">
            <span className="lh-bracket">Links</span>
            <span className="lh-eyebrow__dot">·</span>
            QR
            <span className="lh-bracket">2026</span>
          </p>
        </header>

        <section className="lh-profile" aria-labelledby="lh-name">
          <div className="lh-avatar">
            <Image
              src="/assets/portrait.png"
              alt=""
              width={128}
              height={160}
              className="lh-avatar__img"
              priority
            />
            <span className="lh-avatar__corner lh-avatar__corner--tl" aria-hidden="true" />
            <span className="lh-avatar__corner lh-avatar__corner--tr" aria-hidden="true" />
            <span className="lh-avatar__corner lh-avatar__corner--bl" aria-hidden="true" />
            <span className="lh-avatar__corner lh-avatar__corner--br" aria-hidden="true" />
          </div>

          <h1 id="lh-name" className="lh-name">
            <span className="lh-name__line">
              Kavi<span className="lh-name__accent">shwa</span>
            </span>
            <span className="lh-name__line lh-name__line--outline">Wendakoon</span>
          </h1>

          <p className="lh-role">{PROFILE.title}</p>
          <p className="lh-bio">{PROFILE.tagline}</p>
          <p className="lh-loc">
            <span className="lh-bracket">{PROFILE.location}</span>
          </p>
        </section>

        <nav className="lh-nav" aria-label="Links">
          <ul className="lh-list">
            {links.map((link) => (
              <li key={link.id}>
                <LinkButton link={link} />
              </li>
            ))}
          </ul>
        </nav>

        <footer className="lh-footer">
          <p className="lh-footer__mega" aria-hidden="true">
            Kavishwa
          </p>

          <div className="lh-footer__grid">
            <div className="lh-footer__col">
              <h2 className="lh-footer__label">Locale</h2>
              <p className="lh-footer__text">
                Oulu, Finland
                <br />
                65.0121° N · 25.4651° E
                <br />
                Open worldwide
              </p>
            </div>
            <div className="lh-footer__col">
              <h2 className="lh-footer__label">Focus</h2>
              <p className="lh-footer__text">
                Trustworthy AI in clinical settings
                <br />
                Self-adaptive systems · Engineering
              </p>
            </div>
          </div>

          <div className="lh-footer__bar">
            <span>© {new Date().getFullYear()} Kavishwa Wendakoon</span>
            <span className="lh-footer__tag">
              Trustworthy AI · Engineering
            </span>
            <span className="lh-bracket">Links · QR · 2026</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
