import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { OrganizationSchema } from "@/components/JsonLd";
import { BootSequence } from "@/components/BootSequence";
import { CommandPalette } from "@/components/CommandPalette";
import { RouteTransition } from "@/components/RouteTransition";
import { DatumReticle } from "@/components/DatumReticle";
import { site } from "@/lib/site";

/**
 * TYPE SYSTEM
 * ----------------------------------------------------------------------------
 * ARCHIVO — a grotesque drawn for signage and high-impact print. Tight
 * apertures, near-vertical stress, a low contrast between thick and thin. It
 * holds together at 96px as a masthead and at 15px as body text, which means
 * the site can run on one voice rather than borrowing authority from a second
 * display face. It is built, not styled.
 *
 * IBM PLEX MONO — the technical register. Every measurement, stage code, field
 * label, sheet number and manifest line is set in it. Monospace here is not a
 * developer affectation: it is the typography of specification documents, and
 * it does the work of separating what Corehold *claims* from what Corehold
 * *records*.
 */
/**
 * Both families are vendored into the repository and served from this origin.
 * No request leaves for Google Fonts at runtime — one less third party in the
 * critical path, one less dependency on somebody else's uptime, and a site
 * that renders identically whether or not an outside CDN is reachable. Given
 * what this studio argues for, hot-linking its own typography would be a poor
 * look.
 */
const archivo = localFont({
  src: [
    {
      path: "../fonts/archivo-latin-wght-normal.woff2",
      weight: "100 900",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-archivo",
  preload: true,
  fallback: [
    "ui-sans-serif",
    "system-ui",
    "-apple-system",
    "Segoe UI",
    "Helvetica Neue",
    "Arial",
    "sans-serif",
  ],
  adjustFontFallback: false,
});

/**
 * IBM PLEX SANS ARABIC — the Arabic edition's voice. Chosen because it shares
 * the Plex family's engineering-documentation heritage with the mono face
 * already in the system, and because its counters and stroke contrast sit
 * comfortably beside Archivo at the same optical size. Arabic is never tracked
 * here: letter-spacing breaks the joins, so every tracked class is neutralised
 * under [dir="rtl"].
 */
const plexArabic = localFont({
  src: [
    {
      path: "../fonts/ibm-plex-sans-arabic-arabic-400-normal.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/ibm-plex-sans-arabic-arabic-500-normal.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/ibm-plex-sans-arabic-arabic-600-normal.woff2",
      weight: "600",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-arabic",
  preload: false,
  adjustFontFallback: false,
});

const plexMono = localFont({
  src: [
    {
      path: "../fonts/ibm-plex-mono-latin-400-normal.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/ibm-plex-mono-latin-500-normal.woff2",
      weight: "500",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-plex-mono",
  preload: true,
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "monospace"],
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default:
      "Corehold — Own the System Your Business Runs On | Systems Studio, Dubai",
    template: "%s | Corehold",
  },
  description:
    "Corehold is an intelligent systems studio in Dubai. We replace stacks of rented SaaS subscriptions with one custom system your company owns outright — operations software, AI, automation and internal tools — then hand over the code, data and documentation. Serving the UAE and worldwide.",
  keywords: [
    "custom software development Dubai",
    "own your software UAE",
    "systems studio Dubai",
    "replace SaaS subscriptions",
    "business automation UAE",
    "custom internal tools Dubai",
    "AI systems for business UAE",
    "software ownership vs SaaS",
    "custom operations software Middle East",
    "bespoke business systems Dubai",
  ],
  authors: [{ name: site.name }],
  creator: site.name,
  publisher: site.name,
  applicationName: site.name,
  category: "technology",
  alternates: {
    canonical: "/",
    languages: {
      "en-AE": "/",
      "ar-AE": "/ar",
      "x-default": "/",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_AE",
    url: site.url,
    siteName: site.name,
    title: "Corehold — Own the system your business runs on. Stop renting it.",
    description:
      "An intelligent systems studio in Dubai. One owned system instead of a stack of subscriptions — built, documented, and handed over outright.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Corehold wordmark and mark on a dark mineral ground, above the line: Own the system your business runs on. Stop renting it.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Corehold — Own the system your business runs on.",
    description:
      "An intelligent systems studio in Dubai. One owned system instead of a stack of subscriptions — built, documented, and handed over outright.",
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  formatDetection: {
    telephone: false,
    address: false,
    email: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#0b0d0c",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      dir="ltr"
      className={`${archivo.variable} ${plexMono.variable} ${plexArabic.variable}`}
    >
      <head>
        {/* Direction is settled before first paint rather than after hydration,
            so an Arabic page never renders left-to-right for a frame. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var p=location.pathname;var ar=p==='/ar'||p.indexOf('/ar/')===0;var e=document.documentElement;e.lang=ar?'ar':'en';e.dir=ar?'rtl':'ltr';}catch(e){}})();",
          }}
        />
        {/* Reveals are a progressive enhancement. Without scripting the page
            is simply present — nothing on this site depends on JavaScript to
            be readable. */}
        <noscript>
          <style>{`[data-reveal],[data-scribe]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <DatumReticle />
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <RouteTransition />
        <CommandPalette />
        <BootSequence />
        <OrganizationSchema />
      </body>
    </html>
  );
}
