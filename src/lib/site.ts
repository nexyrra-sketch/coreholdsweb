export const site = {
  name: "Corehold",
  legalName: "Corehold",
  domain: "corehold.com",
  url: "https://corehold.com",
  tagline: "Own the system your business runs on. Stop renting it.",
  shortDescription:
    "Corehold is an intelligent systems studio in Dubai. We replace stacks of rented software with one owned system — operations, intelligence, automation and internal tools — and hand over the code, the data and the documentation outright.",
  city: "Dubai",
  region: "Dubai",
  country: "AE",
  countryName: "United Arab Emirates",
  email: "audit@corehold.com",
  areaServed: ["United Arab Emirates", "GCC", "Worldwide"],
  founded: "2025",
} as const;

export type NavItem = {
  href: string;
  label: string;
  index: string;
  blurb: string;
};

export const primaryNav: NavItem[] = [
  {
    href: "/ownership",
    label: "Ownership",
    index: "01",
    blurb: "Why renting your systems is a position, not a line item.",
  },
  {
    href: "/method",
    label: "The Method",
    index: "02",
    blurb: "Audit, Diagnose, Architect, Build, Hand Over.",
  },
  {
    href: "/capabilities",
    label: "What We Build",
    index: "03",
    blurb: "One foundation. Five layers. No scattered pieces.",
  },
];

export const ctaLabel = "Request a System Audit";
export const ctaHref = "/audit";
