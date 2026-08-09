export type Verdict = "rent" | "build" | "depends";

export type Entry = {
  id: string;
  name: string;
  group: string;
  verdict: Verdict;
  lockIn: "low" | "medium" | "high";
  reason: string;
  /** The threshold at which the verdict flips. The most useful column here. */
  flips: string;
};

export const registerMeta = {
  version: "1.0",
  issued: "2026-08",
  reviewed: "Quarterly",
  count: 43,
} as const;

export const verdictCopy: Record<Verdict, { label: string; note: string }> = {
  rent: {
    label: "Rent",
    note: "A solved problem. Buying it is the right answer and probably always will be.",
  },
  build: {
    label: "Build",
    note: "This encodes how your company specifically operates. No vendor can sell it to you, because it does not exist anywhere else.",
  },
  depends: {
    label: "Depends",
    note: "The answer changes with size, sector or how central this is to what you actually sell.",
  },
};

export const register: Entry[] = [
  /* ------------------------------------------------ money & compliance -- */
  {
    id: "accounting",
    name: "Accounting & bookkeeping",
    group: "Money & compliance",
    verdict: "rent",
    lockIn: "medium",
    reason:
      "Regulated, commoditised, and audited by people who expect to see familiar software. Building your own ledger is a way to fail an audit expensively.",
    flips: "Never. If you are considering this, the problem is somewhere else.",
  },
  {
    id: "payroll",
    name: "Payroll & WPS",
    group: "Money & compliance",
    verdict: "rent",
    lockIn: "medium",
    reason:
      "Compliance changes under you without warning, and the penalty for getting it wrong lands on the company rather than the vendor.",
    flips: "Never.",
  },
  {
    id: "tax",
    name: "VAT & corporate tax filing",
    group: "Money & compliance",
    verdict: "rent",
    lockIn: "low",
    reason:
      "The rules move, and someone else maintaining that is worth every dirham.",
    flips: "Never.",
  },
  {
    id: "payments",
    name: "Payment processing",
    group: "Money & compliance",
    verdict: "rent",
    lockIn: "high",
    reason:
      "PCI scope alone settles this. Rent the rails; own the logic that decides what gets charged and when.",
    flips: "Never for the rails. Always for the billing logic on top of them.",
  },
  {
    id: "billing",
    name: "Billing & invoicing logic",
    group: "Money & compliance",
    verdict: "build",
    lockIn: "high",
    reason:
      "How you price, prorate, discount and surcharge is a description of your commercial model. Off-the-shelf billing forces you to sell the way the tool bills.",
    flips: "Rent it while your pricing is genuinely simple. It stops being simple sooner than you think.",
  },
  {
    id: "expenses",
    name: "Expenses & reimbursement",
    group: "Money & compliance",
    verdict: "rent",
    lockIn: "low",
    reason:
      "Clean exports, low switching cost, no strategic value in owning it.",
    flips: "Past a few hundred staff with unusual approval rules — and even then, build only the approval layer.",
  },

  /* -------------------------------------------------- customer & revenue */
  {
    id: "crm",
    name: "CRM & pipeline",
    group: "Customer & revenue",
    verdict: "depends",
    lockIn: "high",
    reason:
      "Below about thirty people a rented CRM is fine. Above it, the CRM stops describing your sales process and starts dictating it — and the export never brings the relationship history with it.",
    flips: "Build once your sales motion has steps no CRM has a field for.",
  },
  {
    id: "quoting",
    name: "Quoting & pricing engine",
    group: "Customer & revenue",
    verdict: "build",
    lockIn: "high",
    reason:
      "This is almost always where the real bottleneck is hiding, and it is almost never what a company asks us to look at first. Rate cards and margin rules encoded once turn a day-long assembly job into a query.",
    flips: "Rent it if you sell one thing at one price. Otherwise build.",
  },
  {
    id: "proposals",
    name: "Proposal & contract generation",
    group: "Customer & revenue",
    verdict: "build",
    lockIn: "low",
    reason:
      "Generating documents from live data is trivial to own and removes a copy-paste ritual that every company quietly performs.",
    flips: "Rent while volume is low enough that a template and an hour still works.",
  },
  {
    id: "esign",
    name: "E-signature",
    group: "Customer & revenue",
    verdict: "rent",
    lockIn: "low",
    reason:
      "Legal weight comes from the provider's audit trail. That is exactly the kind of thing worth renting.",
    flips: "Never.",
  },
  {
    id: "portal",
    name: "Customer portal",
    group: "Customer & revenue",
    verdict: "build",
    lockIn: "high",
    reason:
      "What your customer sees should be what your business knows, at the moment they see it. A rented portal syncing overnight guarantees the opposite.",
    flips: "Rent only as a stopgap, and only with a date on it.",
  },
  {
    id: "subscriptions",
    name: "Subscription management",
    group: "Customer & revenue",
    verdict: "depends",
    lockIn: "high",
    reason:
      "If subscriptions are how you make money, this is your core and you should own it. If they are a side channel, rent.",
    flips: "Build the moment recurring revenue is the main revenue.",
  },

  /* -------------------------------------------------------- operations -- */
  {
    id: "ops-core",
    name: "Core operating system",
    group: "Operations",
    verdict: "build",
    lockIn: "high",
    reason:
      "The place where your job, shipment, case, project or booking is described. Nothing sold as a product knows what your business calls this or what states it moves through.",
    flips: "Never rented successfully. This is the one that matters.",
  },
  {
    id: "project",
    name: "Project & task management",
    group: "Operations",
    verdict: "rent",
    lockIn: "low",
    reason:
      "Genuinely good tools, cheap, and your team already knows them. Do not rebuild a kanban board.",
    flips: "Build only when the 'projects' are your actual production process, not internal coordination.",
  },
  {
    id: "inventory",
    name: "Inventory & stock",
    group: "Operations",
    verdict: "depends",
    lockIn: "high",
    reason:
      "Standard warehousing is a solved product. Anything with unusual units, batches, conditions or ownership rules is not, and forcing it into a generic tool creates the spreadsheet you are trying to eliminate.",
    flips: "Build when your stock has rules the vendor's data model cannot express.",
  },
  {
    id: "scheduling",
    name: "Scheduling & dispatch",
    group: "Operations",
    verdict: "build",
    lockIn: "medium",
    reason:
      "Constraints are the whole product here, and yours are specific: skills, geography, licences, shift rules, the customer who will only accept one particular crew.",
    flips: "Rent if scheduling is a calendar. Build if it is a puzzle.",
  },
  {
    id: "field",
    name: "Field & mobile operations",
    group: "Operations",
    verdict: "build",
    lockIn: "medium",
    reason:
      "The surface is simple; the workflow behind it is yours. Usually a responsive interface on the core, not a separate app.",
    flips: "Rent while the field team is small and the process is stable.",
  },
  {
    id: "procurement",
    name: "Procurement & purchase orders",
    group: "Operations",
    verdict: "depends",
    lockIn: "medium",
    reason:
      "Approval chains are company-specific; catalogues and supplier records are not.",
    flips: "Build the approval logic, rent the catalogue.",
  },
  {
    id: "qms",
    name: "Quality & compliance records",
    group: "Operations",
    verdict: "depends",
    lockIn: "high",
    reason:
      "If a regulator specifies the system, rent the certified one. If the regulator specifies the outcome, own the records.",
    flips: "Read the regulation before deciding. Not the vendor's summary of it.",
  },

  /* ------------------------------------------------------------- people */
  {
    id: "hris",
    name: "HR records & leave",
    group: "People",
    verdict: "rent",
    lockIn: "medium",
    reason:
      "Employment law is not a differentiator and staying current with it is expensive.",
    flips: "Never, though the approval flows around it are often worth owning.",
  },
  {
    id: "ats",
    name: "Recruitment & ATS",
    group: "People",
    verdict: "rent",
    lockIn: "low",
    reason:
      "Low switching cost, high vendor investment, no strategic advantage in owning it.",
    flips: "Never.",
  },
  {
    id: "lms",
    name: "Training & certification tracking",
    group: "People",
    verdict: "depends",
    lockIn: "medium",
    reason:
      "Generic training platforms are fine. Tracking licences and certifications that gate who is allowed to do what belongs in the operating core, not beside it.",
    flips: "Build when a lapsed certificate should stop a job being assigned.",
  },
  {
    id: "perf",
    name: "Performance & reviews",
    group: "People",
    verdict: "rent",
    lockIn: "low",
    reason:
      "Rent it, or run it in a document. Building here is almost always displacement activity.",
    flips: "Never.",
  },

  /* ----------------------------------------------------- communication -- */
  {
    id: "email",
    name: "Email, calendar, storage",
    group: "Communication",
    verdict: "rent",
    lockIn: "medium",
    reason:
      "Rent, obviously. Anyone proposing otherwise is not solving your problem.",
    flips: "Never.",
  },
  {
    id: "chat",
    name: "Internal chat",
    group: "Communication",
    verdict: "rent",
    lockIn: "low",
    reason: "Rent. The lock-in is social, not technical.",
    flips: "Never.",
  },
  {
    id: "helpdesk",
    name: "Helpdesk & shared inbox",
    group: "Communication",
    verdict: "depends",
    lockIn: "medium",
    reason:
      "Frequently overlaps a CRM by more than half. One of the two is usually redundant, and almost nobody checks which.",
    flips: "Build when support conversations need to sit against the operating record rather than beside it.",
  },
  {
    id: "telephony",
    name: "Telephony & call routing",
    group: "Communication",
    verdict: "rent",
    lockIn: "medium",
    reason:
      "Rent the network. Own any routing logic that depends on your own data.",
    flips: "Never for the carrier. Often for the rules.",
  },
  {
    id: "notifications",
    name: "Customer notifications",
    group: "Communication",
    verdict: "build",
    lockIn: "low",
    reason:
      "Rent the delivery — email, SMS, WhatsApp. Own the decision about what gets sent, to whom, and when, because that decision reads from your core.",
    flips: "Build as soon as notifications depend on state rather than on someone remembering.",
  },

  /* ------------------------------------------------ data & intelligence */
  {
    id: "warehouse",
    name: "Data warehouse",
    group: "Data & intelligence",
    verdict: "rent",
    lockIn: "medium",
    reason:
      "Managed storage and compute are cheap and standard. Rent the warehouse; own the schema inside it and the account it bills to.",
    flips: "Never rent the account. Always rent the infrastructure.",
  },
  {
    id: "bi",
    name: "Dashboards & BI",
    group: "Data & intelligence",
    verdict: "depends",
    lockIn: "low",
    reason:
      "Rented BI is excellent and cheap. The trap is per-seat pricing that quietly decides who in your company is allowed to see numbers.",
    flips: "Build the handful of views everyone needs; rent the exploration tool for the few who explore.",
  },
  {
    id: "reporting",
    name: "Operational reporting",
    group: "Data & intelligence",
    verdict: "build",
    lockIn: "low",
    reason:
      "The numbers operators act on daily should come from the same records they work in. Reporting that reads a nightly export is reporting about yesterday.",
    flips: "Rent while the business is small enough that yesterday is close enough.",
  },
  {
    id: "ai-assist",
    name: "General AI assistants",
    group: "Data & intelligence",
    verdict: "rent",
    lockIn: "low",
    reason:
      "Rent them. They are improving faster than anyone can build, and they hold nothing of yours.",
    flips: "Never — but do not confuse this with the row below.",
  },
  {
    id: "ai-applied",
    name: "AI applied to your own data",
    group: "Data & intelligence",
    verdict: "build",
    lockIn: "high",
    reason:
      "Retrieval, classification and forecasting over your operating history. Rent the model; own the pipeline, the boundary and the data. Sending your company's history to a platform that keeps it is the most expensive kind of renting there is.",
    flips: "Build always — but only after the core exists and the data is trusted.",
  },
  {
    id: "search",
    name: "Internal search",
    group: "Data & intelligence",
    verdict: "depends",
    lockIn: "medium",
    reason:
      "Rent an index. Own what gets indexed, and the permissions model that decides who sees what.",
    flips: "Build the permissions layer regardless.",
  },

  /* --------------------------------------------------- product & surface */
  {
    id: "website",
    name: "Marketing website",
    group: "Product & surface",
    verdict: "build",
    lockIn: "high",
    reason:
      "Cheap to own, and the alternative is needing permission to publish a sentence. An agency retainer for content edits is a small permanent tax on how fast your company can speak.",
    flips: "Rent a builder while you are pre-revenue and the site is a placeholder.",
  },
  {
    id: "cms",
    name: "Content management",
    group: "Product & surface",
    verdict: "depends",
    lockIn: "medium",
    reason:
      "A hosted CMS is fine and often excellent. What matters is that the content is exportable and the front end is yours.",
    flips: "Rent the editor, own the rendering.",
  },
  {
    id: "ecommerce",
    name: "E-commerce storefront",
    group: "Product & surface",
    verdict: "depends",
    lockIn: "high",
    reason:
      "Standard retail is superbly served by rented platforms. Unusual fulfilment, pricing or B2B terms are where those platforms start charging you to work around them.",
    flips: "Build when your workarounds cost more than the platform does.",
  },
  {
    id: "booking",
    name: "Booking & reservations",
    group: "Product & surface",
    verdict: "depends",
    lockIn: "high",
    reason:
      "If booking is your product, own it. If it is a convenience on top of a different product, rent it.",
    flips: "Build when availability rules stop fitting a calendar grid.",
  },
  {
    id: "api",
    name: "Public API & integrations",
    group: "Product & surface",
    verdict: "build",
    lockIn: "high",
    reason:
      "Your API is a contract with your customers. Nobody else should hold the pen, or be able to deprecate it on your behalf.",
    flips: "Never rent the contract. Rent the gateway if you like.",
  },

  /* --------------------------------------------------------- foundation */
  {
    id: "hosting",
    name: "Cloud hosting",
    group: "Foundation",
    verdict: "rent",
    lockIn: "medium",
    reason:
      "Rent the compute — but the account must be registered to your company and billed to you directly. A studio hosting your system on its own account and invoicing you for it has quietly become your landlord.",
    flips: "Never rent the account itself.",
  },
  {
    id: "identity",
    name: "Authentication & identity",
    group: "Foundation",
    verdict: "rent",
    lockIn: "high",
    reason:
      "Security is a discipline, not a feature. Rent the identity provider, own the permissions model that sits on top of it.",
    flips: "Never build the crypto. Always build the roles.",
  },
  {
    id: "monitoring",
    name: "Monitoring & error tracking",
    group: "Foundation",
    verdict: "rent",
    lockIn: "low",
    reason: "Rent. Cheap, standard, and switching costs nothing.",
    flips: "Never.",
  },
  {
    id: "automation",
    name: "Workflow automation platforms",
    group: "Foundation",
    verdict: "depends",
    lockIn: "medium",
    reason:
      "Excellent for prototyping and for genuinely occasional glue. When they are billed per task and running thousands a month, they have become a tax on the absence of a shared data model.",
    flips: "Build the moment the automation bill scales with your business volume.",
  },
];

export const groups = Array.from(new Set(register.map((e) => e.group)));
