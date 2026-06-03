import { CV_URL } from "@/lib/data";

/** Single source of truth for outbound profile links (QR hub, contact, footer). */
export const PROFILE = {
  name: "Kavishwa Wendakoon",
  title: "Doctoral researcher · software engineer",
  tagline: "Trustworthy AI in clinical settings · software that ships",
  location: "Oulu, Finland",
  email: "kaveebhashiofficial@gmail.com",
  website:
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
    "https://wendakoon.com",
} as const;

export type ProfileLinkIcon =
  | "website"
  | "blog"
  | "cv"
  | "email"
  | "linkedin"
  | "researchgate"
  | "instagram"
  | "facebook"
  | "github"
  | "scholar"
  | "orcid"
  | "twitter";

export type ProfileLink = {
  id: string;
  label: string;
  href: string;
  description?: string;
  icon: ProfileLinkIcon;
  /** Primary CTA (e.g. portfolio home) */
  featured?: boolean;
  /** Opens in a new tab with rel="noopener noreferrer" */
  external?: boolean;
};

const env = (key: string) => process.env[key]?.trim() || "";

/** Edit URLs here, or override per platform via NEXT_PUBLIC_PROFILE_* in .env.local */
const SOCIAL_URLS = {
  linkedin: env("NEXT_PUBLIC_PROFILE_LINKEDIN"),
  researchgate: env("NEXT_PUBLIC_PROFILE_RESEARCHGATE"),
  instagram: env("NEXT_PUBLIC_PROFILE_INSTAGRAM"),
  facebook: env("NEXT_PUBLIC_PROFILE_FACEBOOK"),
  github: env("NEXT_PUBLIC_PROFILE_GITHUB"),
  scholar: env("NEXT_PUBLIC_PROFILE_SCHOLAR"),
  orcid: env("NEXT_PUBLIC_PROFILE_ORCID"),
  twitter: env("NEXT_PUBLIC_PROFILE_TWITTER"),
};

const DEFAULT_SOCIAL_URLS: Record<keyof typeof SOCIAL_URLS, string> = {
  linkedin: "https://www.linkedin.com/in/kavishwa-wendakoon",
  researchgate:
    "https://www.researchgate.net/profile/Kavishwa-Bhashitha-Wendakoon-Mudiyanselage",
  instagram: "https://www.instagram.com/kvshw_offic/",
  facebook: "https://www.facebook.com/kavishwa.bhashitha/",
  github: "https://github.com/kvshw",
  scholar: "https://scholar.google.com/citations?user=PLACEHOLDER",
  orcid: "https://orcid.org/0000-0000-0000-0000",
  twitter: "",
};

function socialHref(key: keyof typeof SOCIAL_URLS): string {
  return SOCIAL_URLS[key] || DEFAULT_SOCIAL_URLS[key];
}

const ALL_PROFILE_LINKS: ProfileLink[] = [
  {
    id: "website",
    label: "Portfolio website",
    description: "Research, projects, publications & contact",
    href: "/",
    icon: "website",
    featured: true,
    external: false,
  },
  {
    id: "blog",
    label: "Blog",
    description: "Writing on trustworthy & adaptive AI",
    href: "/blog",
    icon: "blog",
    external: false,
  },
  {
    id: "cv",
    label: "Download CV",
    description: "PDF · updated 2026",
    href: CV_URL,
    icon: "cv",
    external: true,
  },
  {
    id: "email",
    label: "Email",
    description: PROFILE.email,
    href: `mailto:${PROFILE.email}`,
    icon: "email",
    external: true,
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    href: socialHref("linkedin"),
    icon: "linkedin",
    external: true,
  },
  {
    id: "researchgate",
    label: "ResearchGate",
    href: socialHref("researchgate"),
    icon: "researchgate",
    external: true,
  },
  {
    id: "scholar",
    label: "Google Scholar",
    href: socialHref("scholar"),
    icon: "scholar",
    external: true,
  },
  {
    id: "orcid",
    label: "ORCID",
    href: socialHref("orcid"),
    icon: "orcid",
    external: true,
  },
  {
    id: "github",
    label: "GitHub",
    href: socialHref("github"),
    icon: "github",
    external: true,
  },
  {
    id: "instagram",
    label: "Instagram",
    href: socialHref("instagram"),
    icon: "instagram",
    external: true,
  },
  {
    id: "facebook",
    label: "Facebook",
    href: socialHref("facebook"),
    icon: "facebook",
    external: true,
  },
  {
    id: "twitter",
    label: "X (Twitter)",
    href: socialHref("twitter"),
    icon: "twitter",
    external: true,
  },
];

const PLACEHOLDER_PATTERN =
  /PLACEHOLDER|#$|^$|0000-0000-0000-0000/i;

/** Links shown on the hub and reused in contact/footer chips. */
export function getProfileLinks(): ProfileLink[] {
  return ALL_PROFILE_LINKS.filter(
    (link) => link.href && !PLACEHOLDER_PATTERN.test(link.href)
  );
}

/** Compact list for contact section chips and footer. */
export function getProfileLinkChips() {
  return getProfileLinks()
    .filter((l) => !["email", "website", "blog", "cv"].includes(l.id))
    .map(({ label, href }) => ({ label, href }));
}
