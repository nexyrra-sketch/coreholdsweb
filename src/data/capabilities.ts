export type Layer = {
  index: string;
  code: string;
  name: string;
  role: string;
  body: string;
  examples: string[];
  /** What this layer usually replaces in a rented stack. */
  replaces: string;
};

/**
 * Ordered as built: the core at the base, the surfaces at the top. This is the
 * order the strata diagram renders in reverse — you read a section drawing from
 * the ground up, and so does this.
 */
export const layers: Layer[] = [
  {
    index: "L1",
    code: "CORE",
    name: "Operations",
    role: "The system the company actually runs on",
    body: "One place where the business is described: your customers, your work, your inventory, your projects, your money — under one data model, with one set of rules. Everything above this layer reads from it. Nothing above it is allowed to hold its own private version of the truth.",
    examples: [
      "Operating system for the core workflow, built to how the business runs",
      "Single customer and account record across every function",
      "Approval, handover and status logic encoded once",
      "Reporting that reads the same numbers the operators do",
    ],
    replaces: "The CRM, the project tool, the ops spreadsheets, and the gaps between them",
  },
  {
    index: "L2",
    code: "AUTO",
    name: "Automation",
    role: "The manual work that stops existing",
    body: "Most manual work inside a company is not work. It is translation — moving the same information between tools that were never designed to speak. When the core holds one version of the truth, the translation layer disappears rather than getting automated.",
    examples: [
      "Document and record generation from live data, not templates and copy-paste",
      "Scheduled and event-driven processes replacing recurring human checklists",
      "Automated reconciliation between operations, finance and delivery",
      "Alerting on conditions the business cares about, not on system noise",
    ],
    replaces: "Per-task automation subscriptions billed by the run",
  },
  {
    index: "L3",
    code: "INTL",
    name: "Intelligence",
    role: "Decisions made on your own data",
    body: "Applied AI on top of a foundation that is actually yours: models and retrieval running against your operating data, answering the questions your business asks — not a general assistant bolted onto the side of a stack it cannot see.",
    examples: [
      "Retrieval and search across the company's own documents and records",
      "Forecasting and pattern detection on operating history",
      "Drafting, classification and extraction inside real workflows",
      "Decision support surfaced where the decision is made, not in a separate tab",
    ],
    replaces: "Per-seat AI add-ons that keep your data on someone else's platform",
  },
  {
    index: "L4",
    code: "TOOL",
    name: "Internal tools",
    role: "What your team touches every day",
    body: "Interfaces built for the specific people who use them, in the shape of the work rather than the shape of a generic product. The measure of this layer is simple: nobody needs a workaround, and nobody keeps a private spreadsheet.",
    examples: [
      "Role-specific consoles for operations, delivery, finance and leadership",
      "Field and mobile interfaces for work that happens away from a desk",
      "Admin and configuration surfaces your team controls without an engineer",
      "Permissions modelled on your actual organisation",
    ],
    replaces: "A per-seat licence for every function, and the spreadsheets in between",
  },
  {
    index: "L5",
    code: "FACE",
    name: "Customer platforms",
    role: "What your market sees",
    body: "Portals, applications, marketplaces and sites that sit directly on the core rather than syncing with it overnight. What the customer sees is what the business knows, at the moment they see it.",
    examples: [
      "Customer and partner portals reading live from the core",
      "Booking, ordering, quoting and onboarding flows",
      "Marketing sites and content platforms you can edit without a retainer",
      "Public APIs and integrations you control and can revoke",
    ],
    replaces: "Website subscriptions, portal platforms, and the sync jobs holding them together",
  },
];
