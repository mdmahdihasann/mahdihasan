import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Instrument_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

import { profile } from "@/data/profile";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
});

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

const title = `${profile.name} — ${profile.role}`;

export const metadata: Metadata = {
  title,
  description: profile.summary,
  applicationName: title,
  authors: [{ name: profile.name }],
  creator: profile.name,
  keywords: [
    profile.name,
    "Frontend Developer",
    "React",
    "Next.js",
    "TypeScript",
    "WordPress",
    "WooCommerce",
    "Dhaka",
    "Bangladesh",
  ],
  openGraph: {
    type: "profile",
    title,
    description: profile.tagline,
    siteName: title,
    locale: "en_US",
  },
  twitter: { card: "summary_large_image", title, description: profile.tagline },
  // No `metadataBase` yet: set it (and an OG image) once the site has a domain.
};

/** `themeColor` lives on the viewport export, not on `metadata`. */
export const viewport: Viewport = {
  themeColor: "#1a271e",
  colorScheme: "dark",
  // Lets the mobile tab bar sit under the home indicator, padded by
  // env(safe-area-inset-bottom) rather than floating above a grey strip.
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${instrumentSans.variable} ${jetBrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* Reveal elements start at opacity 0 and are switched on by JS. Without
            this the whole page would read as blank to a no-script visitor. */}
        <noscript>
          <style>{`.reveal,.reveal-scale{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
