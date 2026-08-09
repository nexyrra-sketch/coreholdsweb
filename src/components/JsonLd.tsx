import { site } from "@/lib/site";

function Script({ id, data }: { id: string; data: object }) {
  return (
    <script
      type="application/ld+json"
      id={id}
      // Structured data is static and authored here — no user input reaches it.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function OrganizationSchema() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "ProfessionalService"],
        "@id": `${site.url}/#organization`,
        name: site.name,
        legalName: site.legalName,
        url: site.url,
        email: site.email,
        slogan: site.tagline,
        description: site.shortDescription,
        foundingDate: site.founded,
        knowsAbout: [
          "Custom software development",
          "Business systems architecture",
          "Workflow automation",
          "Applied artificial intelligence",
          "Internal tooling",
          "Software ownership and SaaS replacement",
        ],
        address: {
          "@type": "PostalAddress",
          addressLocality: site.city,
          addressRegion: site.region,
          addressCountry: site.country,
        },
        areaServed: site.areaServed.map((name) => ({
          "@type": "AdministrativeArea",
          name,
        })),
        serviceType: [
          "Custom business systems",
          "Operations software",
          "Automation engineering",
          "Applied AI",
          "Internal tools",
        ],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Corehold engagements",
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "System Audit",
                description:
                  "A mapped account of how a business actually operates — every tool, subscription, handover and workaround — and where money and time leak.",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "System Architecture and Build",
                description:
                  "Design and construction of one connected system a company owns outright, replacing rented subscriptions.",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Handover",
                description:
                  "Full transfer of code, data, infrastructure and documentation, with no ongoing dependency on Corehold.",
              },
            },
          ],
        },
      },
      {
        "@type": "WebSite",
        "@id": `${site.url}/#website`,
        url: site.url,
        name: site.name,
        description: site.shortDescription,
        publisher: { "@id": `${site.url}/#organization` },
        inLanguage: "en",
      },
    ],
  };

  return <Script id="schema-organization" data={data} />;
}

export function BreadcrumbSchema({
  items,
}: {
  items: { name: string; path: string }[];
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${site.url}${item.path}`,
    })),
  };
  return <Script id="schema-breadcrumb" data={data} />;
}

export function FaqSchema({
  items,
}: {
  items: { question: string; answer: string }[];
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
  return <Script id="schema-faq" data={data} />;
}

export function HowToSchema({
  steps,
}: {
  steps: { name: string; text: string }[];
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "The Corehold Method",
    description:
      "The five-stage protocol Corehold runs on every engagement, from audit through to handover.",
    step: steps.map((step, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: step.name,
      text: step.text,
    })),
  };
  return <Script id="schema-howto" data={data} />;
}
