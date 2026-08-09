export const standardMeta = {
  version: "1.0",
  issued: "2026-08",
  supersedes: "Nothing. This is the first published version.",
  changePolicy:
    "Material changes get a new version number and stay published alongside the old one. Nothing here is quietly edited.",
} as const;

/** The six standards, each with what it means in practice and how to check it. */
export const commitments: {
  index: string;
  title: string;
  body: string;
  practice: string;
  check: string;
}[] = [
  {
    index: "01",
    title: "Ownership from day one",
    body: "Code, data and infrastructure are registered to the client at the start of the build, not transferred at the end as a courtesy.",
    practice:
      "The repository is created inside your organisation before the first commit. Cloud accounts and domains are opened in your company's name and billed to your card, not ours.",
    check:
      "Ask to see the repository owner and the cloud billing account in week one. If either says Corehold, we have broken this.",
  },
  {
    index: "02",
    title: "No component we alone can run",
    body: "If a part of the system depends on knowledge only Corehold holds, it is rebuilt until it does not.",
    practice:
      "Standard languages, standard infrastructure, no proprietary runtime, no undocumented deployment ritual, no service that only works because someone here remembers a setting.",
    check:
      "At handover we step out and your team deploys a change without us in the room. If that cannot happen, the engagement is not finished.",
  },
  {
    index: "03",
    title: "Legible to the next engineer",
    body: "The test is whether a competent engineer who has never met us can read the system and extend it.",
    practice:
      "Written to be read rather than admired. Architecture decisions recorded with their reasoning, including the options rejected and why.",
    check:
      "Have your own engineer, or any engineer you trust, read the codebase during the build rather than after it. We will make time for that review.",
  },
  {
    index: "04",
    title: "Proportion over ambition",
    body: "The smallest system that changes the most. What we chose not to build is documented alongside what we did.",
    practice:
      "Every architecture document contains an explicit non-scope section. On a well-run engagement it is longer than the scope section.",
    check:
      "Read the non-scope list. If it is short or missing, we have started selling instead of thinking.",
  },
  {
    index: "05",
    title: "Candour before commercials",
    body: "If the audit concludes you should not buy anything, that is the report you receive — in writing, with the reasoning.",
    practice:
      "We will name the subscriptions worth keeping, say when a leak is a process problem rather than a technology one, and tell you when a business is too early to have an operating shape worth encoding.",
    check:
      "This is the one you cannot verify in advance. It is why the specimen audit is published in full, including the parts that cost us work.",
  },
  {
    index: "06",
    title: "Built for a decade",
    body: "Standard languages, standard infrastructure, no clever dependency that will be abandoned in three years.",
    practice:
      "Dependencies are chosen for hiring pool and maintenance record, not novelty. Anything unusual has to justify itself in the architecture document.",
    check:
      "Read the dependency list. Count how many of them you have heard of, and how many have a maintainer with more than one person.",
  },
];

/** The engagement, in plain English. Published before you speak to us. */
export const terms: { index: string; question: string; answer: string }[] = [
  {
    index: "01",
    question: "What are we actually buying?",
    answer:
      "First an audit: a fixed fee for a fixed window, ending in a written report you keep whatever happens next. Then, only if the audit says it is worth doing, an architecture and a build — priced against that architecture, not against a guess.",
  },
  {
    index: "02",
    question: "How is it priced?",
    answer:
      "Fixed fee per stage, quoted before the stage begins. Not hourly. If we get the estimate wrong, that is our problem to absorb, which is the correct incentive for an engineering studio to carry.",
  },
  {
    index: "03",
    question: "Who owns the work?",
    answer:
      "You do, from the first commit — not on final payment. There is no licence to renew, no seat count, and no clause that returns anything to us if the relationship ends.",
  },
  {
    index: "04",
    question: "What if we want to stop halfway?",
    answer:
      "You stop. You keep everything built up to that point, in your accounts, with the documentation that exists at that moment. We do not hold work hostage against a final invoice.",
  },
  {
    index: "05",
    question: "What happens to our data?",
    answer:
      "It lives in infrastructure registered to you throughout. Corehold retains no copy after handover. We will sign whatever confidentiality agreement your legal team prefers, and we will not use your business as a named reference without written permission.",
  },
  {
    index: "06",
    question: "What will you refuse to do?",
    answer:
      "Build something the audit says you do not need. Take on more engagements than we can run properly at once. Host your system on our infrastructure and bill you for it. Resell somebody else's platform as ours. Add features to a brief we have not tested against how the business actually runs.",
  },
  {
    index: "07",
    question: "What do you need from us?",
    answer:
      "Access to the people who operate the business, not only the people who bought the software. One decision-maker who can say yes. And honesty during the audit — a leak nobody mentions is a leak we will find later and more expensively.",
  },
  {
    index: "08",
    question: "What if something breaks after handover?",
    answer:
      "Defects in what we built are fixed by us, at our cost, for ninety days after handover. Beyond that it is a maintenance arrangement if you want one, and your own engineers' work if you do not. Either way the system does not stop working because a period ended.",
  },
  {
    index: "09",
    question: "Do we have to keep you on?",
    answer:
      "No, and the handover is designed to make that a real choice rather than a polite fiction. Many clients keep us on as a long-term partner. That decision is made after the dependency is gone, never as a condition of getting the system.",
  },
  {
    index: "10",
    question: "What if we disagree with the audit?",
    answer:
      "Tell us where and why. If you are right, the report is corrected and reissued. If we still disagree after that, the report stands as our honest view and you are free to take it to another studio — which you own the right to do, because the document is yours.",
  },
];
