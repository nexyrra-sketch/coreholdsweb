import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  alternates: {
    languages: {
      "en-AE": "/",
      "ar-AE": "/ar",
      "x-default": "/",
    },
  },
  openGraph: {
    locale: "ar_AE",
    alternateLocale: "en_AE",
  },
};

/**
 * The Arabic edition sets its own direction on a wrapper as well as on the
 * document element, so the layout is correct even before the bootstrap script
 * in the root layout has run and regardless of how the page was reached.
 */
export default function ArabicLayout({ children }: { children: ReactNode }) {
  return (
    <div dir="rtl" lang="ar" className="ar-edition">
      {children}
    </div>
  );
}
