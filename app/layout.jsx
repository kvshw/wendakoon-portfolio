import { ClerkProvider } from "@clerk/nextjs";
import { Anton, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { Providers } from "@/components/Providers";
import { CookieConsent } from "@/components/CookieConsent";
import { clerkAppearance } from "@/lib/clerk-appearance";
import "./globals.css";
import "./fonts.css";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata = {
  title: "Kavishwa Wendakoon · Doctoral Researcher · Software Engineer",
  description: "Doctoral researcher and software engineer building safe, privacy-preserving AI for pediatric brain health.",
  metadataBase: new URL("https://wendakoon.com"),
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${anton.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body>
        <ClerkProvider
          appearance={clerkAppearance}
          signInFallbackRedirectUrl={
            process.env.NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL ??
            "/admin/content-engine"
          }
          signUpFallbackRedirectUrl={
            process.env.NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL ??
            "/admin/content-engine"
          }
        >
          <Providers>{children}</Providers>
          <CookieConsent />
        </ClerkProvider>
        <div className="mouse-glow" aria-hidden="true"></div>
      </body>
    </html>
  );
}
