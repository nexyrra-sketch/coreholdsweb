import type { Metadata } from "next";
import Link from "next/link";
import { ContactCard } from "@/components/ContactCard";
import { card } from "@/data/card";
import { site } from "@/lib/site";
import { Arrow } from "@/components/Button";

export const metadata: Metadata = {
  title: `${card.name} — ${card.title}, Corehold`,
  description: `${card.name}, ${card.title} of Corehold, an intelligent systems studio in Dubai. WhatsApp, call, email, or save the contact straight to your phone.`,
  alternates: { canonical: "/card" },
  openGraph: {
    title: `${card.name} — ${card.title}, Corehold`,
    description: `${card.claim} Contact card for ${card.name}.`,
    url: "/card",
  },
  robots: { index: true, follow: true },
};

/**
 * The card is a Person and an Organization at once, so a search engine reading
 * this page gets a real entity rather than a page of buttons.
 */
function CardSchema() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${site.url}/card#person`,
    name: card.name,
    givenName: card.first,
    familyName: card.last,
    jobTitle: card.title,
    telephone: card.phone,
    email: card.email,
    url: card.cardUrl,
    image: `${site.url}${card.portrait}`,
    sameAs: [card.linkedin, card.x],
    worksFor: { "@id": `${site.url}/#organization` },
    address: {
      "@type": "PostalAddress",
      addressLocality: card.city,
      addressCountry: site.country,
    },
  };
  return (
    <script
      type="application/ld+json"
      id="card-schema"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default function CardPage() {
  return (
    <>
      <CardSchema />
      <section className="relative overflow-hidden border-b border-quarry-800 bg-quarry-950">
        <div className="gridfilm" />
        <div className="shell relative py-20 md:py-28">
          <ContactCard />

          <div className="mt-16 flex flex-wrap items-center justify-between gap-6 border-t border-quarry-800 pt-8">
            <p className="max-w-[52ch] font-mono text-xs leading-relaxed text-quarry-500">
              This card is a page on our own domain, not an account on somebody
              else&apos;s platform. It cannot be deleted by a service shutting
              down, and it does not expire when a subscription does.
            </p>
            <Link
              href="/"
              className="group inline-flex items-center gap-3 text-[0.9375rem] text-oxide transition-colors hover:text-oxide-bright"
            >
              See what we build
              <Arrow />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
