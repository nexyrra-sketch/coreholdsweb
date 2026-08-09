import type { Metadata } from "next";
import Link from "next/link";
import { Hero } from "@/components/Hero";
import { Section } from "@/components/Section";
import { SectionIntro } from "@/components/SectionIntro";
import { RentLedger } from "@/components/RentLedger";
import { DependencyGraph } from "@/components/DependencyGraph";
import { LandlordSwitch } from "@/components/LandlordSwitch";
import { PositionTable } from "@/components/PositionTable";
import { StrataSystem } from "@/components/StrataSystem";
import { MethodRail } from "@/components/MethodRail";
import { HandoverManifest } from "@/components/HandoverManifest";
import { RefusalBand } from "@/components/RefusalBand";
import { Standards } from "@/components/Standards";
import { Faq } from "@/components/Faq";
import { CtaBand } from "@/components/CtaBand";
import { PublishedIndex } from "@/components/PublishedIndex";
import { Reveal } from "@/components/Reveal";
import { Arrow } from "@/components/Button";
import { FaqSchema, HowToSchema } from "@/components/JsonLd";
import { faq } from "@/data/faq";
import { methodSteps } from "@/data/method";

export const metadata: Metadata = {
  title:
    "Corehold — Own the System Your Business Runs On | Systems Studio, Dubai",
  description:
    "Stop renting the software your company depends on. Corehold is an intelligent systems studio in Dubai that replaces stacks of SaaS subscriptions with one owned system — operations, AI, automation, internal tools — then hands over the code, data and documentation outright.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* 01 — THE LEDGER ------------------------------------------------- */}
      <Section ground="light" film id="ledger">
        <SectionIntro
          index="01"
          label="The ledger"
          ground="light"
          align="wide"
          heading={
            <>
              You already pay for a system.
              <span className="block text-quarry-600">You just don&apos;t own it.</span>
            </>
          }
          note={
            <>
              When did you last see the total as one number? For most companies
              it never arrives as one — it arrives as fourteen line items, each
              too small to argue about.
            </>
          }
          lede={
            <>
              Nobody decides to rent their entire operation. It accumulates. A
              subscription here, a per-seat licence there, an automation plan to
              connect the two, and within a few years the company&apos;s
              information lives with a dozen outside providers who each hold a
              piece of it. Add it up honestly — it is usually the first time
              anyone has.
            </>
          }
        />
        <RentLedger />
      </Section>

      {/* 02 — THE STACK, COLLAPSING ------------------------------------- */}
      <DependencyGraph index="02" />

      {/* 03 — THE POSITION ---------------------------------------------- */}
      <Section ground="dark" id="position">
        <SectionIntro
          index="03"
          label="The position"
          align="wide"
          heading={
            <>
              Software you rent is a cost.
              <span className="block text-quarry-500">
                Systems you own are a position.
              </span>
            </>
          }
          note={
            <>
              Same market. Same price. Same product. One of them owns the
              machinery underneath it.
            </>
          }
          lede={
            <>
              Two companies can sell the same thing at the same price to the
              same market. The one that owns its systems moves faster, spends
              less over time, and depends on nobody&apos;s roadmap but its own.
              Renting keeps you level with everyone else renting the same tools.
              Owning compounds.
            </>
          }
        />

        <PositionTable />

        <LandlordSwitch />

        <Reveal delay={80}>
          <div className="mt-14 grid gap-10 border-t border-quarry-800 pt-12 lg:grid-cols-12 lg:gap-16">
            <p className="text-minor text-bone lg:col-span-6">
              After five years of paying, a renting company owns nothing it runs
              on. It is a tenant in its own operation.
            </p>
            <div className="lg:col-span-5 lg:col-start-8">
              <p className="text-[0.9375rem] leading-relaxed text-quarry-400">
                This is not an argument against buying software. It is an
                argument about which software you should be buying and which you
                should be building — and about who holds the thing your business
                could not survive losing.
              </p>
              <Link
                href="/ownership"
                className="group mt-7 inline-flex items-center gap-3 text-[0.9375rem] text-oxide transition-colors hover:text-oxide-bright"
              >
                Read the full argument
                <Arrow />
              </Link>
            </div>
          </div>
        </Reveal>
      </Section>

      {/* 03 — WHAT WE BUILD --------------------------------------------- */}
      <Section ground="raised" id="capabilities">
        <SectionIntro
          index="04"
          label="What we build"
          align="wide"
          heading={
            <>
              One foundation.
              <span className="block text-quarry-500">
                Five layers, not five products.
              </span>
            </>
          }
          note={
            <>
              Read the diagram from the bottom. L1 carries the weight; every
              layer above it is a surface onto the same truth.
            </>
          }
          lede={
            <>
              The reason a rented stack leaks is that every tool holds its own
              private version of the truth, and someone has to reconcile them.
              Corehold builds a single core the company is described in — and
              then the operations, the automation, the intelligence, the
              internal tools and the customer-facing surfaces all read from it.
            </>
          }
        />
        <StrataSystem />

        <Reveal delay={80}>
          <Link
            href="/capabilities"
            className="group mt-14 inline-flex items-center gap-3 text-[0.9375rem] text-oxide transition-colors hover:text-oxide-bright"
          >
            See every layer in detail
            <Arrow />
          </Link>
        </Reveal>
      </Section>

      {/* 04 — THE METHOD ------------------------------------------------ */}
      <Section ground="dark" id="method">
        <SectionIntro
          index="05"
          label="The Corehold Method"
          align="wide"
          heading={
            <>
              We never start by building.
              <span className="block text-quarry-500">
                And we don&apos;t take orders for features.
              </span>
            </>
          }
          note={
            <>
              Stages 01 and 02 decide whether 03, 04 and 05 happen at all. That
              is the whole design.
            </>
          }
          lede={
            <>
              Every engagement runs the same five-stage protocol, in the same
              order, with no stage skipped because a client is in a hurry. The
              first two stages exist to find out whether the last three should
              happen at all.
            </>
          }
        />
        <MethodRail />

        <Reveal delay={80}>
          <Link
            href="/method"
            className="group mt-14 inline-flex items-center gap-3 text-[0.9375rem] text-oxide transition-colors hover:text-oxide-bright"
          >
            Walk through the method in full
            <Arrow />
          </Link>
        </Reveal>
      </Section>

      {/* 05 — THE HANDOVER ---------------------------------------------- */}
      <Section ground="light" film id="handover">
        <SectionIntro
          index="06"
          label="The handover"
          ground="light"
          align="wide"
          heading={
            <>
              At the end, you get the deed.
              <span className="block text-quarry-600">Not a login.</span>
            </>
          }
          note={
            <>
              A deed transfers title. A login grants permission. The difference
              is the entire studio.
            </>
          }
          lede={
            <>
              Handover is a stage of the work, not a clause at the bottom of a
              contract. Here is exactly what changes hands — and, just as
              importantly, what is deliberately absent from the list.
            </>
          }
        />
        <HandoverManifest />
      </Section>

      <RefusalBand />

      {/* 06 — THE STANDARD ---------------------------------------------- */}
      <Section ground="dark" id="standards">
        <SectionIntro
          index="07"
          label="The standard"
          align="wide"
          heading={
            <>
              Six standards.
              <span className="block text-quarry-500">
                Every system, every time.
              </span>
            </>
          }
          note={
            <>
              These hold on every engagement — not only the ones that happen to
              go well.
            </>
          }
          lede={
            <>
              Corehold takes on a small number of engagements a year and goes
              deep on each. That is not a limitation to apologise for — it is
              what makes the following six commitments possible to keep on all
              of them, rather than on the ones that happen to go well.
            </>
          }
        />
        <Standards />
      </Section>

      {/* 07 — QUESTIONS -------------------------------------------------- */}
      <Section ground="raised" id="faq">
        <SectionIntro
          index="08"
          label="Questions"
          align="wide"
          heading="The things people ask before they trust us with this."
        />
        <Faq items={faq} />
      </Section>

      {/* 09 — WHAT WE PUBLISH ------------------------------------------- */}
      <Section ground="dark" id="published">
        <SectionIntro
          index="09"
          label="Published"
          align="wide"
          heading={
            <>
              We have no client logos.
              <span className="block text-quarry-500">
                We have this instead.
              </span>
            </>
          }
          lede={
            <>
              What a studio puts in the open is a truer signal than what it
              claims. Everything below is free, complete, and written to be
              checked rather than admired — including the parts that cost us
              work.
            </>
          }
          note={
            <>
              Start with the specimen audit. It is the only one of these you can
              hold against what you would actually be buying.
            </>
          }
        />
        <PublishedIndex />
      </Section>

      <CtaBand secondary={{ href: "/specimen", label: "See a worked audit first" }} />

      <FaqSchema items={faq} />
      <HowToSchema steps={methodSteps} />
    </>
  );
}
