import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";
import { SectionIntro } from "@/components/SectionIntro";
import { Reveal } from "@/components/Reveal";
import { PositionTable } from "@/components/PositionTable";
import { CtaBand } from "@/components/CtaBand";
import { BreadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Own vs Rent — Why Software Ownership Is a Position, Not a Line Item",
  description:
    "The argument behind Corehold: software you rent is a cost that never ends, systems you own are an asset that compounds. How rented stacks accumulate, what a company never receives for its subscription spend, and what ownership does and does not mean.",
  alternates: { canonical: "/ownership" },
  openGraph: {
    title: "Own vs Rent — the Corehold position",
    description:
      "Software you rent is a cost. Systems you own are a position. The full argument, including what ownership is not.",
    url: "/ownership",
  },
};

const misreadings: [string, string][] = [
  [
    "Ownership is not building everything yourself",
    "Nobody should write their own accounting ledger, payroll engine or payment processor. Those are regulated, commoditised and genuinely better rented. Ownership applies to the part of your stack that encodes how your company specifically operates — the part no vendor can sell you because it does not exist anywhere else.",
  ],
  [
    "Ownership is not hostility toward SaaS",
    "Subscriptions are a good way to buy a solved problem. They are a poor way to hold the definition of your business. The question is never 'SaaS or custom' — it is which category each piece of your operation belongs in, and most companies have never made that distinction deliberately.",
  ],
  [
    "Ownership is not cheaper on day one",
    "It is almost always more expensive at the start. The case for it is made across a five-year horizon, against renewal escalation, seat growth and the manual labour a fragmented stack quietly requires. If that arithmetic does not work for your business, we will be the ones who tell you.",
  ],
  [
    "Ownership is not a project you finish and forget",
    "An owned system needs maintenance, the same way a building needs maintenance. The difference is that you are paying to keep your own asset in good condition rather than paying for continued permission to use somebody else's.",
  ],
];

const missing: [string, string][] = [
  [
    "The code",
    "You never see it, cannot audit it, and cannot change it. If the roadmap goes somewhere you do not want to go, you go anyway.",
  ],
  [
    "The data model",
    "Your business gets described in someone else's abstractions. Over years, the company slowly reshapes itself to fit the fields available.",
  ],
  [
    "The exit",
    "Export usually exists. Export in a form that another system can actually use, with relationships intact, frequently does not.",
  ],
  [
    "The leverage",
    "Pricing, terms, deprecations and acquisitions all happen to you. There is no version of the relationship where you hold the stronger position.",
  ],
];

export default function OwnershipPage() {
  return (
    <>
      <PageHeader
        eyebrow="The position"
        title={
          <>
            Renting keeps you average.
            <span className="block text-quarry-500">Owning compounds.</span>
          </>
        }
        lede={
          <>
            This is the argument the rest of the studio is built on, stated
            plainly and with its weak points included. If you disagree with it
            after reading this page, we are probably not the right people to
            build your foundation — and that is a useful thing for both of us to
            establish early.
          </>
        }
        breadcrumb={{ label: "Home", href: "/" }}
      />

      <Section ground="dark">
        <SectionIntro
          index="01"
          label="How it happens"
          align="wide"
          heading="Nobody decides to become a tenant."
          lede={
            <>
              No company sits down and chooses to rent its entire operation. It
              accumulates, one reasonable decision at a time, and each decision
              is defensible on the day it is made.
            </>
          }
        />

        <Reveal>
          <div className="mt-14 grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="space-y-6 text-[0.9375rem] leading-relaxed text-quarry-400 lg:col-span-6">
              <p>
                A website goes up on a platform because it is faster than
                building one. A CRM arrives because the spreadsheet stopped
                working. An automation tool gets added to connect the two,
                because they were never designed to speak. Someone signs up for
                an AI assistant. Support gets its own system. Analytics gets
                another. Each one is cheap in isolation and each one solves a
                real problem on the day it is bought.
              </p>
              <p>
                Three years later the company&apos;s information is distributed
                across a dozen providers who each hold a fragment. No single
                system knows what is true. Staff spend hours a week moving
                records between tools by hand, and the process everyone
                complains about turns out to be four tools failing to agree.
              </p>
            </div>
            <div className="space-y-6 text-[0.9375rem] leading-relaxed text-quarry-400 lg:col-span-6">
              <p>
                The bills renew quietly. Seats get added as the team grows.
                Renewal pricing moves in one direction. The total is rarely
                looked at as a single number, because it never arrives as a
                single number — it arrives as fourteen line items on a card
                statement, each one too small to argue about.
              </p>
              <p>
                And underneath all of it, the company has been slowly reshaping
                itself to fit whatever the tools allow. That is the part that
                does not show up on any invoice, and it is the expensive part.
              </p>
            </div>
          </div>
        </Reveal>
      </Section>

      <Section ground="raised">
        <SectionIntro
          index="02"
          label="What the money does not buy"
          align="wide"
          heading="Four things you never receive, however long you pay."
          lede={
            <>
              A subscription buys access. It is worth being precise about what
              it does not buy, because these four gaps are the ones that
              eventually decide how much room a company has to manoeuvre.
            </>
          }
        />

        <div className="mt-14 grid gap-px border border-quarry-800 bg-quarry-800 sm:grid-cols-2">
          {missing.map(([term, detail], i) => (
            <Reveal
              key={term}
              delay={i * 60}
              className="bg-quarry-900 p-8 lg:p-10"
            >
              <span className="tag text-oxide">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-5 text-minor tracking-[-0.02em] text-bone">
                {term}
              </h3>
              <p className="mt-4 text-[0.9375rem] leading-relaxed text-quarry-400">
                {detail}
              </p>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section ground="dark">
        <SectionIntro
          index="03"
          label="Side by side"
          align="wide"
          heading="The same seven questions, asked of both arrangements."
        />
        <PositionTable />
      </Section>

      <Section ground="light" film>
        <SectionIntro
          index="04"
          label="Where the argument stops"
          ground="light"
          align="wide"
          heading="Four things this position is not."
          lede={
            <>
              An argument you cannot state the limits of is a slogan. Here are
              ours — the places where the ownership case genuinely does not
              apply, and where a studio selling it should tell you so.
            </>
          }
        />

        <div className="mt-14 border-t border-limestone-line">
          {misreadings.map(([term, detail], i) => (
            <Reveal key={term} delay={i * 50}>
              <div className="grid gap-6 border-b border-limestone-line py-9 lg:grid-cols-12 lg:gap-10">
                <div className="flex items-start gap-4 lg:col-span-5">
                  <span className="tag mt-1.5 text-oxide-deep">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-[1.0625rem] leading-snug font-medium tracking-[-0.015em] text-quarry-950 sm:text-lg">
                    {term}
                  </h3>
                </div>
                <p className="text-[0.9375rem] leading-relaxed text-quarry-700 lg:col-span-7">
                  {detail}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section ground="dark">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="tag text-oxide">The whole thing, in one line</p>
            </Reveal>
            <Reveal delay={70}>
              <p className="mt-8 text-major text-bone">
                A tenant improves a building they will never own. At some point
                that stops being a cost and starts being a decision about what
                kind of company you are.
              </p>
            </Reveal>
          </div>
          <div className="lg:col-span-5">
            <Reveal delay={130}>
              <p className="text-[0.9375rem] leading-relaxed text-quarry-400">
                Every process you refine inside a rented tool, every workflow
                your team learns, every year of history you accumulate — all of
                it improves an asset held by someone else, under terms they can
                change. The alternative is not to stop improving. It is to make
                sure the improvement lands somewhere you hold.
              </p>
            </Reveal>
          </div>
        </div>
      </Section>

      <CtaBand
        eyebrow="Test the argument on your own numbers"
        heading="We will tell you if it doesn't hold for you."
        body="The audit exists to check whether this position is actually true for your business. Sometimes it is not — the stack is fine, the leak is a process problem, or the company is too early. You will get that answer in writing, with the reasoning, and no invoice for a system you did not need."
        secondary={{ href: "/method", label: "See how the audit works" }}
      />

      <BreadcrumbSchema
        items={[
          { name: "Home", path: "/" },
          { name: "Ownership", path: "/ownership" },
        ]}
      />
    </>
  );
}
