import Link from "next/link";

export const metadata = {
  title: "Privacy Notice · Kavishwa Wendakoon",
  description:
    "How personal data submitted through kavishwa.com is collected, used, stored, and protected under the GDPR.",
};

const LAST_UPDATED = "15 June 2026";

export default function PrivacyPage() {
  return (
    <main className="legal-page">
      <div className="legal-container">
        <Link href="/" className="legal-back">
          ← Back to site
        </Link>

        <p className="legal-kicker">Privacy</p>
        <h1 className="legal-title">Privacy Notice</h1>
        <p className="legal-updated">Last updated: {LAST_UPDATED}</p>

        <p className="legal-lead">
          This notice explains what personal data is collected through{" "}
          <strong>kavishwa.com</strong>, why, and the rights you have over it. It
          is written to comply with the EU General Data Protection Regulation
          (GDPR).
        </p>

        <section className="legal-section">
          <h2>Who is responsible</h2>
          <p>
            Kavishwa Wendakoon (&ldquo;I&rdquo;, &ldquo;me&rdquo;) is the data
            controller for personal data submitted through this website. You can
            reach me at{" "}
            <a href="mailto:hello@kavishwa.com">hello@kavishwa.com</a> for any
            privacy-related request.
          </p>
        </section>

        <section className="legal-section">
          <h2>What I collect and why</h2>
          <p>When you use the contact form, I collect:</p>
          <ul>
            <li>
              <strong>Your name</strong> — so I know who I&apos;m replying to.
            </li>
            <li>
              <strong>Your email address</strong> — so I can respond.
            </li>
            <li>
              <strong>Context and message</strong> — the content you choose to
              send.
            </li>
            <li>
              <strong>The time of submission</strong> — for my own records.
            </li>
          </ul>
          <p>
            I only use this information to read and reply to your message. I do
            not sell it, and I do not use it for advertising.
          </p>
        </section>

        <section className="legal-section">
          <h2>Legal basis</h2>
          <p>
            I process this data on the basis of your <strong>consent</strong>,
            which you give by ticking the box on the contact form before sending.
            You can withdraw consent at any time by emailing me — see{" "}
            <em>Your rights</em> below.
          </p>
        </section>

        <section className="legal-section">
          <h2>Where it is stored & who processes it</h2>
          <p>
            Your data is handled by a small number of trusted processors, each
            bound by their own data-protection terms:
          </p>
          <ul>
            <li>
              <strong>Supabase</strong> — database storage, hosted in the EU
              (eu-west-1, Ireland).
            </li>
            <li>
              <strong>Resend</strong> — sends the notification and confirmation
              emails.
            </li>
            <li>
              <strong>Vercel</strong> — hosts the website and processes requests.
            </li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>How long I keep it</h2>
          <p>
            I keep contact messages only as long as needed to handle your enquiry
            and any follow-up, and no longer than 24 months, after which they are
            deleted. You can ask me to delete yours sooner at any time.
          </p>
        </section>

        <section className="legal-section">
          <h2>Cookies</h2>
          <p>
            This site uses a minimal set of cookies and local storage:
          </p>
          <ul>
            <li>
              <strong>Essential</strong> — remembering your cookie choice and
              keeping the on-page chat working on your device. These are always
              on because the site needs them.
            </li>
            <li>
              <strong>Optional analytics</strong> — only enabled if you choose
              &ldquo;Accept all&rdquo; in the cookie banner. You can decline with
              no loss of functionality.
            </li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>Your rights</h2>
          <p>Under the GDPR you can ask me to:</p>
          <ul>
            <li>access the personal data I hold about you;</li>
            <li>correct it if it&apos;s wrong;</li>
            <li>delete it (&ldquo;right to be forgotten&rdquo;);</li>
            <li>restrict or object to how it&apos;s used;</li>
            <li>receive a copy in a portable format.</li>
          </ul>
          <p>
            To exercise any of these, email{" "}
            <a href="mailto:hello@kavishwa.com">hello@kavishwa.com</a>. You also
            have the right to complain to your local data-protection authority.
          </p>
        </section>

        <section className="legal-section">
          <h2>Changes</h2>
          <p>
            If this notice changes, the updated version will be posted here with a
            new date at the top.
          </p>
        </section>
      </div>
    </main>
  );
}
