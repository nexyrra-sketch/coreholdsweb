export type Stage = {
  index: string;
  code: string;
  title: string;
  question: string;
  body: string;
  extended: string;
  deliverables: string[];
  duration: string;
  /** The thing a client does not expect to hear at this stage. */
  edge: string;
};

export const stages: Stage[] = [
  {
    index: "01",
    code: "AUDIT",
    title: "We map the business before anyone touches a keyboard.",
    question: "What is actually running this company?",
    body: "Every tool. Every subscription. Every export-and-re-import. Every spreadsheet quietly doing load-bearing work. Every handover that only happens because one person remembers to do it.",
    extended:
      "We sit with the people who operate the business, not only the people who bought the software. Operators know where the real process is, because they are the ones bending around it. For most companies this is the first time the full picture has existed in one place — and the map alone changes how they talk about their own operation.",
    deliverables: [
      "System map: every tool, integration and manual bridge between them",
      "Subscription register with renewal dates and true annual cost",
      "Workflow trace for each core operating process, as performed rather than as documented",
      "Data inventory: where your company's information physically lives, and who controls it",
    ],
    duration: "Typically 1–2 weeks",
    edge: "You will see workarounds your team never reported, because they stopped noticing them years ago.",
  },
  {
    index: "02",
    code: "DIAGNOSE",
    title: "We find where the money and the time leak out.",
    question: "What is the current arrangement actually costing you?",
    body: "Duplicate spend across tools that overlap. Information trapped inside a provider that will not export it cleanly. Hours of manual work that exist only to bridge two systems never designed to talk to each other.",
    extended:
      "We put a number against each leak. Not a projection of what we could sell you — an account of what keeping things exactly as they are costs per month, per year, and across five years. Cost is the visible half. The other half is dependency: what breaks, and how badly, if a provider changes its pricing, its terms, or its mind.",
    deliverables: [
      "Cost of rent: monthly, annual, and five-year, with renewal escalation applied",
      "Leaks ranked by cost and by operational risk",
      "Lock-in assessment per provider: exit difficulty, data portability, contractual exposure",
      "A written recommendation — which sometimes reads: change nothing",
    ],
    duration: "Typically 1 week",
    edge: "This is the stage where we tell you which of your subscriptions are fine. Most studios never do.",
  },
  {
    index: "03",
    code: "ARCHITECT",
    title: "We design the smallest system that changes the most.",
    question: "What is the least we can build for the largest change?",
    body: "Not the most technology. The right technology. One data model, one set of rules, one place the business is described — and a clear line around what genuinely needs building versus what should stay exactly as it is.",
    extended:
      "Scope here is an engineering decision, not a commercial one. We would rather architect a foundation you can extend for a decade than a feature list you can approve this quarter. The architecture is written down in plain language before it is written in code, and you sign off on the shape of the thing — not just the price of it.",
    deliverables: [
      "System architecture: data model, services, integration boundaries, infrastructure plan",
      "Build sequence staged so working software lands long before the engagement ends",
      "Explicit non-scope: what we are deliberately not building, and the reasoning",
      "Total cost of ownership, projected against what you currently pay in rent",
    ],
    duration: "Typically 2–3 weeks",
    edge: "The non-scope document is often longer than the scope document. That is the point.",
  },
  {
    index: "04",
    code: "BUILD",
    title: "We build it to be kept for a decade, not demoed for a quarter.",
    question: "Will this still be maintainable in five years, by engineers who are not us?",
    body: "Standard languages. Standard infrastructure. No proprietary Corehold layer you would have to keep paying for. Written to be read by whoever comes next.",
    extended:
      "Your repository, your cloud account, your domains — from the first commit, not transferred at the end as a formality. Tests where tests earn their keep, monitoring on the paths that would hurt if they failed silently, and staged releases so the business feels progress rather than waiting for a launch date.",
    deliverables: [
      "The system, shipped in stages, each stage usable on its own",
      "Source code in your repository, under your organisation, from day one",
      "Infrastructure and domains registered to you and billed to you directly",
      "Test coverage and monitoring on the paths that carry real consequence",
    ],
    duration: "Scoped per engagement",
    edge: "If any part of the build only works because Corehold is holding it, we have failed the brief.",
  },
  {
    index: "05",
    code: "HAND OVER",
    title: "You receive everything. Nothing about it requires us.",
    question: "Can your team run this without a single call to Corehold?",
    body: "Code, data, credentials, infrastructure, architecture documentation, runbooks, and recorded walkthroughs for the people who will actually operate it.",
    extended:
      "We prove the handover by stepping back and watching your team run the system without us in the room. Many clients keep Corehold on afterwards as a long-term partner — and we like that work. But it is a decision made after the dependency is already gone, never a condition of getting the system in the first place.",
    deliverables: [
      "Full transfer of code, data, infrastructure and access credentials",
      "Architecture documentation and operational runbooks",
      "Recorded walkthroughs — one set for operators, one set for engineers",
      "A written exit: what you own, where it lives, and how to take it anywhere",
    ],
    duration: "Typically 1–2 weeks",
    edge: "The engagement ends with your team running the system while we watch. Not the other way round.",
  },
];

export const methodSteps = stages.map((s) => ({
  name: `${s.code} — ${s.question}`,
  text: `${s.body} ${s.extended}`,
}));
