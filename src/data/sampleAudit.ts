/**
 * THE SPECIMEN AUDIT
 * ----------------------------------------------------------------------------
 * A complete worked audit, so a visitor can see exactly what the deliverable
 * is instead of imagining it.
 *
 * IMPORTANT — this is a composite. "Meridian" is not a client, has never been a
 * client, and does not exist. The scenario is assembled from the shapes these
 * engagements typically take, and every figure in it is an illustrative worked
 * example. It is labelled SPECIMEN on the cover, in the running footer of every
 * page of the PDF, and on the web page that presents it. Corehold publishes no
 * real client results, because there are none to publish yet.
 */

export const specimen = {
  version: "1.0",
  issued: "2026-08",
  subject: "Meridian Freight",
  subjectNote: "composite scenario — not a real company",
  sector: "Freight forwarding & customs brokerage",
  size: "62 people, Dubai and Jebel Ali",
  window: "11 working days",
  currency: "AED",
} as const;

export const summary: [string, string][] = [
  [
    "19 subscriptions, 14 providers",
    "Nobody in the business could produce this list before the audit. Four subscriptions were being paid for tools that had not been opened in over a year.",
  ],
  [
    "Three systems each hold a customer record",
    "The CRM, the operations spreadsheet and the invoicing platform disagree about the same clients. Operations treats the spreadsheet as authoritative; finance treats the invoicing platform as authoritative. Neither is.",
  ],
  [
    "~11 hours a week of re-keying",
    "Measured by sitting with four operators for a full shift each. Almost all of it is moving the same shipment data between two tools that were never designed to speak.",
  ],
  [
    "The quoting process is the actual bottleneck",
    "Not the CRM. Quotes are assembled by hand from three sources and a rate sheet that lives in one person's inbox. Turnaround averages a day and a half; the market expects hours.",
  ],
  [
    "Annual rent is AED 402,400, escalating",
    "Up 31% over two years, driven mostly by seat growth and one renewal repricing. There is no final payment and no accumulating asset.",
  ],
];

export const verdict = {
  headline: "Build the operations core and the quoting engine. Keep everything else.",
  body: "Meridian does not need most of what it was preparing to buy. The customs platform, the accounting system and the payroll provider are all good value and should stay exactly where they are — replacing them would be scope for its own sake. What should be built is the layer that does not exist anywhere: one place the shipment is described, and a quoting engine that reads from it. That is roughly a third of what was originally scoped, and it removes about four fifths of the measured manual work.",
  notBuilding: [
    "Customs declaration platform — regulated, well-integrated, genuinely better rented",
    "Accounting and payroll — commoditised, compliant, no reason to touch them",
    "Email, calendar and storage — no leak, no lock-in worth acting on",
    "A mobile app — nobody asked for one; the field need is a responsive surface, not an app",
    "AI features, in phase one — the data model has to exist and be trusted first",
  ],
};

export const register: [string, string, string, string][] = [
  // provider category, seats/plan, annual, note
  ["CRM & pipeline", "24 seats", "96,000", "Two seat tiers, renewed upward twice"],
  ["Operations spreadsheets", "Bundled", "0", "Load-bearing. Owned by one person."],
  ["Invoicing & billing", "8 seats", "41,200", "Holds a second customer record"],
  ["Customs platform", "Per filing", "88,000", "Keep — regulated and well fitted"],
  ["Accounting", "6 seats", "34,800", "Keep"],
  ["Payroll & HR", "62 staff", "38,400", "Keep"],
  ["Automation / connectors", "Task-based", "27,600", "Exists only to bridge the gaps"],
  ["Helpdesk & shared inbox", "18 seats", "29,400", "Overlaps the CRM by ~60%"],
  ["Document storage", "Business", "18,000", "Keep"],
  ["E-signature", "5 seats", "9,600", "Keep"],
  ["Analytics & dashboards", "4 seats", "14,400", "Reads stale exports"],
  ["AI assistants", "12 seats", "22,000", "Unattached to any company data"],
  ["Website & CMS", "Agency plan", "31,000", "Retainer, no source access"],
  ["Misc. (4 tools)", "Various", "12,000", "Three unopened in 12 months"],
];

export const leaks: [string, string, string][] = [
  [
    "Manual re-keying between ops and invoicing",
    "≈ 11 hrs/week",
    "The single largest cost in the audit, and entirely structural: two systems, no shared record.",
  ],
  [
    "Quote turnaround at 1.5 days",
    "Unquantified, largest",
    "Lost work is not on any invoice. Operations estimate a meaningful share of enquiries go cold before a quote lands.",
  ],
  [
    "Duplicate spend, CRM vs helpdesk",
    "≈ 29,400 / yr",
    "Roughly 60% functional overlap. One of the two is redundant either way.",
  ],
  [
    "Automation platform billed per task",
    "≈ 27,600 / yr",
    "Every task it runs exists to compensate for the absence of a shared data model.",
  ],
  [
    "Dormant subscriptions",
    "≈ 12,000 / yr",
    "Three tools unopened in twelve months. Cancel this week; it needs no project.",
  ],
  [
    "Website held on an agency retainer",
    "≈ 31,000 / yr",
    "No source access, no ability to publish without raising a ticket.",
  ],
];

export const lockIn: [string, string, string][] = [
  ["CRM & pipeline", "High", "Export omits relationship history and custom fields. Two-year commitment with auto-renew."],
  ["Invoicing & billing", "Medium", "Clean export, but the numbering scheme is proprietary and audit history stays behind."],
  ["Automation platform", "Low", "Nothing of value is stored there; it only moves things."],
  ["Website / agency", "High", "Source code not held by Meridian. Content changes require the agency."],
  ["Customs platform", "High, and acceptable", "Regulatory integration. Lock-in here is the price of a real capability."],
];

export const horizon = {
  years: 5,
  rentNote: "Current rent, escalated at the provider behaviour observed over the last two renewals (8%/yr).",
  ownNote: "Illustrative build and upkeep for the recommended scope only — the operations core and quoting engine.",
  rent: [0, 402400, 836992, 1306151, 1812843, 2360070],
  own: [720000, 828000, 936000, 1044000, 1152000, 1260000],
  crossover: 3,
  retained: 249200,
  retainedNote: "Subscriptions the audit recommends keeping, still paid annually and excluded from the build case.",
};

export const architecture: [string, string][] = [
  [
    "One shipment record",
    "A single operational entity that finance, operations and the customer portal all read from. Nothing above it keeps a private copy.",
  ],
  [
    "A quoting engine on top of it",
    "Rate cards, surcharges and margin rules encoded once. A quote becomes a query, not an assembly job.",
  ],
  [
    "Two integrations, not fourteen",
    "The customs platform and the accounting system, both retained, both read/write through documented boundaries.",
  ],
  [
    "A customer surface reading live",
    "Shipment status and documents visible to the client from the same record operations works in.",
  ],
  [
    "Infrastructure in Meridian's name",
    "Repository, cloud account and domains registered to the company from the first commit.",
  ],
];

export const handover: string[] = [
  "Source code, full history, in Meridian's own repository",
  "All operational data in open formats, in Meridian's cloud account",
  "Architecture documentation, including the reasoning for every boundary",
  "Runbooks for operations, finance and the on-call engineer",
  "Recorded walkthroughs: one set for operators, one for engineers",
  "A written exit describing how to move the system to any other studio",
];

export const contents: [string, string][] = [
  ["01", "Executive summary and recommendation"],
  ["02", "The system as it stands"],
  ["03", "Subscription register"],
  ["04", "Where the money and time leak"],
  ["05", "Dependency and lock-in assessment"],
  ["06", "Five-year comparison"],
  ["07", "Proposed architecture, and explicit non-scope"],
  ["08", "What Meridian would own at handover"],
];
