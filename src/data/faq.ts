export type FaqItem = { question: string; answer: string };

export const faq: FaqItem[] = [
  {
    question: "What does it actually mean to own the system?",
    answer:
      "It means four specific things, and we put all four in writing. You hold the source code in your own repository. You hold the data in infrastructure registered and billed to you. You hold the documentation needed to operate and extend the system without us. And you hold the right to take all of it to any other engineer or studio, at any time, with no licence to renew and no permission to ask. If any one of those is missing, you are still renting — just from a smaller landlord.",
  },
  {
    question: "Isn't custom software more expensive than SaaS?",
    answer:
      "On the first invoice, almost always. Over a five-year horizon it depends entirely on your specific stack, and we will not pretend otherwise before we have seen it. What we do is make the comparison honestly during the audit: the full annual cost of what you rent today, escalated at your providers' actual renewal behaviour, set against the total cost of owning and maintaining a system. Sometimes ownership wins clearly. Sometimes it does not, and we say so.",
  },
  {
    question: "What happens if we stop working with Corehold?",
    answer:
      "Nothing switches off. That is the entire design constraint. The system runs on standard languages and standard infrastructure in accounts you control, with no proprietary Corehold layer in the middle. Handover is a stage of the engagement, not an exit negotiation — by the time we finish, your team has already run the system without us in the room.",
  },
  {
    question: "Do you replace everything we currently pay for?",
    answer:
      "No, and any studio that promises that before an audit is selling scope rather than judgement. Some subscriptions are genuinely good value and should stay — accounting platforms, payroll, and regulated tooling are common examples. What we replace is the software that holds your operating data hostage, the overlapping tools you pay for twice, and the manual work that exists only to bridge them.",
  },
  {
    question: "What if the audit says we don't need you?",
    answer:
      "Then that is what the audit says, in writing, with the reasoning. It is not a rare outcome. A company that has recently rebuilt, or that is too early to have a real operating shape, or whose leak is a process problem rather than a technology problem, should not be buying a system from us. A studio you would trust with your foundation has to be able to tell you to keep your money.",
  },
  {
    question: "How is this different from hiring an agency or a development shop?",
    answer:
      "An agency takes a brief and builds the feature list. We do not take orders for features — every engagement starts with an audit, and the architecture is derived from what the audit found rather than from what was requested. The second difference is the ending. A dev shop's incentive is to remain necessary; ours is to become unnecessary and be retained anyway, by choice.",
  },
  {
    question: "How long does an engagement take?",
    answer:
      "Audit and diagnosis usually run two to three weeks together. Architecture takes another two to three. Build is scoped against the architecture and staged so that working software reaches the business early rather than at the end. Handover adds one to two weeks of documentation, walkthroughs and supervised operation. We will give you a range after the audit and hold ourselves to it.",
  },
  {
    question: "Who maintains the system after handover?",
    answer:
      "Whoever you want. Your own engineers, a studio of your choosing, or Corehold on a long-term partnership. Many clients choose to keep us on, and it is good work — but it is a decision taken after the dependency has already been removed, never a condition of receiving the system.",
  },
  {
    question: "Do you work with companies outside the UAE?",
    answer:
      "Yes. Corehold is based in Dubai and works with businesses across the UAE and worldwide. The audit stage benefits from time on site or on video with the people who operate the business, and we plan the engagement around that regardless of where you are.",
  },
  {
    question: "What size of company is this for?",
    answer:
      "Companies with enough operating complexity that the stack has become the problem — usually somewhere past the point where a single tool could describe the business, and well before the point of an internal engineering department. We take on a small number of engagements a year and go deep on each one, because foundation work does not survive being done at volume.",
  },
];
