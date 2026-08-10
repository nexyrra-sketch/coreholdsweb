import { site } from "@/lib/site";

/**
 * The contact card.
 *
 * One source of truth: the page renders from it, the QR encodes a link to it,
 * and the vCard a visitor saves to their phone is generated from the same
 * object. Change a number here and all three change together.
 */

export const card = {
  first: "Ghassan",
  last: "Adil",
  name: "Ghassan Adil",
  title: "Founder",
  org: site.name,
  line: "Intelligent systems studio — Dubai",
  claim: "Own the system your business runs on.",
  phone: site.phone,
  phoneDisplay: site.phoneDisplay,
  email: site.email,
  website: site.url,
  websiteDisplay: "corehold.systems",
  cardUrl: `${site.url}/card`,
  linkedin: "https://www.linkedin.com/company/corehold/",
  x: "https://x.com/coreholdsystems",
  xHandle: "@coreholdsystems",
  city: site.city,
  country: site.countryName,
  portrait: "/portrait.jpg",
} as const;
