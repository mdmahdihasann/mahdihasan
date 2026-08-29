import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

import { profile } from "@/data/profile";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
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
  themeColor: "#050816",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetBrainsMono.variable} h-full antialiased`}
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
