"use client";

import { useEffect, useState } from "react";

const CONSENT_COOKIE = "kw-consent";
const MAX_AGE = 60 * 60 * 24 * 180; // 180 days

function readConsent() {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${CONSENT_COOKIE}=`));
  return match ? match.split("=")[1] : null;
}

function writeConsent(value) {
  document.cookie = `${CONSENT_COOKIE}=${value}; Max-Age=${MAX_AGE}; Path=/; SameSite=Lax`;
  try {
    window.dispatchEvent(
      new CustomEvent("kw-consent-change", { detail: { value } })
    );
  } catch {
    /* no-op */
  }
}

export const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!readConsent()) {
      const t = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  const decide = (value) => {
    writeConsent(value);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="cookie-consent"
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
    >
      <div className="cookie-consent__text">
        <p className="cookie-consent__title">A note on cookies</p>
        <p className="cookie-consent__body">
          This site uses only what it needs to work (like remembering your chat
          on this device). I&apos;d also like to enable optional analytics to
          understand what&apos;s useful — your call. See the{" "}
          <a href="/privacy">privacy notice</a>.
        </p>
      </div>
      <div className="cookie-consent__actions">
        <button
          type="button"
          className="cookie-consent__btn cookie-consent__btn--ghost"
          onClick={() => decide("rejected")}
        >
          Reject optional
        </button>
        <button
          type="button"
          className="cookie-consent__btn cookie-consent__btn--primary"
          onClick={() => decide("accepted")}
        >
          Accept all
        </button>
      </div>
    </div>
  );
};
