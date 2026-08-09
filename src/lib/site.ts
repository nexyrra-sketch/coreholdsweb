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
  /** E.164, for tel: and structured data. No spaces, no punctuation. */
  phone: "+971503953988",
  /** Grouped for reading. Never used as an href. */
  phoneDisplay: "+971 50 395 3988",
  areaServed: ["United Arab Emirates", "GCC", "Worldwide"],
  founded: "2025",
} as const;

/**
 * WhatsApp is the working channel for business in this region, so it is treated
 * as a first-class route in rather than a floating bubble bolted to the corner.
 * wa.me wants the number without the leading plus.
 */
const WA_NUMBER = site.phone.replace(/\D/g, "");

export function whatsappHref(message?: string): string {
  const base = `https://wa.me/${WA_NUMBER}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** Openers, so the first message already says which page it came from. */
export const whatsappOpeners = {
  general: "Hello Corehold — I would like to talk about a system audit.",
  audit:
    "Hello Corehold — I would like to request a system audit for my company.",
  ledger:
    "Hello Corehold — I priced my stack on your ledger and would like to talk about replacing it.",
  ar: "مرحبًا Corehold — أود التحدث بخصوص تدقيق أنظمة لشركتي.",
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
