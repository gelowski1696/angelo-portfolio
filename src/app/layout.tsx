import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Space_Grotesk } from "next/font/google";
import { portfolio } from "@/data/portfolio";
import "./globals.css";

const display = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const mono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const siteUrl = portfolio.siteUrl || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${portfolio.name} — Software Engineer`,
    template: `%s — ${portfolio.name}`,
  },
  description:
    "A software engineer portfolio focused on thoughtful systems, strong interfaces, and measurable performance.",
  openGraph: {
    title: `${portfolio.name} — Software Engineer`,
    description:
      "Thoughtful systems, strong interfaces, and measurable performance.",
    type: "website",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: `${portfolio.name} — Software Engineer`,
    description: "Thoughtful systems, strong interfaces, and measurable performance.",
  },
  robots: {
    index: Boolean(portfolio.siteUrl),
    follow: Boolean(portfolio.siteUrl),
  },
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#070a12",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}

