import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Dancing_Script, Inter } from "next/font/google";
import { site } from "@/data/site";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PageMotion } from "@/components/page-motion";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const script = Dancing_Script({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-script",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s — ${site.name}`,
  },
  description: site.shortDescription,
  openGraph: {
    title: `${site.name} — ${site.tagline}`,
    description: site.shortDescription,
    url: site.url,
    siteName: site.name,
    type: "website",
    images: [{ url: "/brand/mark-512.png", width: 512, height: 512, alt: site.name }],
  },
  twitter: {
    card: "summary",
    title: `${site.name} — ${site.tagline}`,
    description: site.shortDescription,
    images: ["/brand/mark-512.png"],
  },
  icons: {
    icon: [{ url: "/brand/mark.svg", type: "image/svg+xml" }, { url: "/brand/mark-32.png", sizes: "32x32", type: "image/png" }],
    apple: "/brand/mark-180.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#08060a",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${script.variable} motion-ready`}>
      <body className="grain-overlay min-h-screen antialiased">
        <div className="site-bg" aria-hidden />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-full focus:bg-[var(--color-brand)] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-[var(--color-brand-foreground)]"
        >
          Skip to content
        </a>
        <SiteHeader />
        <PageMotion>
          <main id="main">{children}</main>
          <SiteFooter />
        </PageMotion>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
