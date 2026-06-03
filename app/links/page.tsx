import type { Metadata } from "next";
import { LinkHub } from "@/components/LinkHub";
import { PROFILE } from "@/lib/profile-links";

export const metadata: Metadata = {
  title: `${PROFILE.name} · Links`,
  description:
    "All ways to connect with Kavishwa Wendakoon: portfolio, research profiles, social channels, and email.",
  alternates: {
    canonical: "/links",
  },
  openGraph: {
    title: `${PROFILE.name} · Links`,
    description: PROFILE.tagline,
    url: "/links",
    type: "website",
  },
  robots: { index: true, follow: true },
  appleWebApp: {
    capable: true,
    title: PROFILE.name,
    statusBarStyle: "black-translucent",
  },
};

export default function LinksPage() {
  return <LinkHub />;
}
