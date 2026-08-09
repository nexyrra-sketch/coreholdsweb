import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { CtaBand } from "@/components/CtaBand";
import { MethodCore } from "@/components/MethodCore";
import { BreadcrumbSchema, HowToSchema } from "@/components/JsonLd";
import { stages, methodSteps } from "@/data/method";

export const metadata: Metadata = {
  title: "The Corehold Method — Audit, Diagnose, Architect, Build, Hand Over",
  description:
    "The five-stage protocol behind every Corehold engagement: audit how the business actually operates, diagnose where money and time leak, architect the smallest system that changes the most, build it to be kept for a decade, and hand over the code, data and documentation outright.",
  alternates: { canonical: "/method" },
  openGraph: {
    title: "The Corehold Method",
    description:
      "Five stages, in the same order, on every engagement. The first two exist to decide whether the last three should happen at all.",
    url: "/method",
  },
};

export default function MethodPage() {
  return (
    <>
      <PageHeader
        eyebrow="The Corehold Method"
        title={
          <>
            Five stages.
            <span className="block text-quarry-500">No shortcuts sold.</span>
          </>
        }
        lede={
          <>
            We never start by building, and we do not take orders for features.
            Every engagement runs the same protocol in the same order, because
            the value of the last three stages depends entirely on having done
            the first two honestly. What follows is the whole thing — including
            the parts that cost us work.
          </>
        }
        meta={[
          ["Sequence", "Fixed. No stage is skipped for speed."],
          ["Decision point", "End of Stage 02, before anything is built."],
          ["Ends with", "Your team running the system without us."],
        ]}
      />

      <MethodCore>
        {stages.map((stage, i) => (
          <section
            key={stage.code}
            id={stage.code.toLowerCase().replace(/\s+/g, "-")}
            data-stage={i}
            className={`relative border-t border-quarry-800 ${
              i % 2 === 1 ? "bg-quarry-900/60" : ""
            }`}
          >
            <div className="py-20 md:py-24">
              <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
                <div className="lg:col-span-4">
                <Reveal>
                  {/* Decorative sheet numeral, drawn rather than set, so it is
                      neither announced nor assessed as body text. */}
                  <svg
                    viewBox="0 0 120 78"
                    aria-hidden="true"
                    focusable="false"
                    className="h-16 w-auto md:h-24"
                  >
                    <text
                      x="0"
                      y="70"
                      fill="currentColor"
                      className="text-quarry-700"
                      style={{
                        font: "600 96px var(--font-display)",
                        letterSpacing: "-0.05em",
                      }}
                    >
                      {stage.index}
                    </text>
                  </svg>
                  <p className="tag mt-4 text-oxide">Stage {stage.index}</p>
                  <h2 className="mt-3 text-minor tracking-[-0.02em] text-bone">
                    {stage.code}
                  </h2>
                  <p className="mt-4 font-mono text-xs text-quarry-400">
                    {stage.duration}
                  </p>
                </Reveal>
              </div>

                <div className="lg:col-span-8 lg:col-start-5">
                <Reveal delay={60}>
                  <p className="tag text-quarry-500">The question</p>
                  <p className="mt-4 max-w-[26ch] text-minor text-bone">
                    {stage.question}
                  </p>
                </Reveal>

                <Reveal delay={110}>
                  <p className="mt-10 max-w-[62ch] text-lede text-quarry-200">
                    {stage.body}
                  </p>
                </Reveal>

                <Reveal delay={150}>
                  <p className="mt-6 max-w-[66ch] text-[0.9375rem] leading-relaxed text-quarry-400">
                    {stage.extended}
                  </p>
                </Reveal>

                <Reveal delay={190}>
                  <div className="mt-12">
                    <p className="tag text-quarry-500">
                      What exists at the end of this stage
                    </p>
                    <ul className="mt-6 border-t border-quarry-800">
                      {stage.deliverables.map((item, k) => (
                        <li
                          key={item}
                          className="grid grid-cols-[2.5rem_1fr] gap-4 border-b border-quarry-800 py-4"
                        >
                          <span className="tag pt-1 text-quarry-500">
                            {stage.index}.{k + 1}
                          </span>
                          <span className="text-[0.9375rem] leading-relaxed text-quarry-200">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>

                <Reveal delay={230}>
                  <p className="mt-9 max-w-[62ch] border-l-2 border-oxide pl-5 text-[0.9375rem] leading-relaxed text-quarry-300">
                    {stage.edge}
                  </p>
                </Reveal>
                </div>
              </div>
            </div>
          </section>
        ))}
      </MethodCore>

      <section className="border-t border-quarry-800 bg-quarry-950">
        <div className="shell py-24 md:py-32">
          <Reveal>
            <p className="tag text-oxide">Why the order matters</p>
          </Reveal>
          <Reveal delay={70}>
            <h2 className="mt-7 max-w-[20ch] text-major text-bone">
              Most technology is bought at stage three and regretted at stage
              five.
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <div className="mt-8 grid max-w-[110ch] gap-8 text-[0.9375rem] leading-relaxed text-quarry-400 md:grid-cols-2 md:gap-14">
              <p>
                A company feels a problem, someone proposes a tool or a build,
                and the work starts from a solution nobody has tested against
                how the business actually runs. The audit and the diagnosis are
                not preamble — they are the two stages that decide whether
                anything should be built, and they are the two stages every
                other studio is incentivised to compress into a discovery call.
              </p>
              <p>
                Running them properly is slower and less profitable in the short
                term. It is also the difference between a system that removes
                the leak and an expensive new tool sitting alongside the old
                ones, quietly becoming another subscription your team works
                around.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <CtaBand
        eyebrow="Start at stage one"
        heading="The audit is the front door."
        body="There is no other way into a Corehold engagement. We map how your business actually operates, put a number against what the current arrangement costs, and tell you plainly what we would do — including, sometimes, nothing."
        secondary={{ href: "/capabilities", label: "See what we build" }}
      />

      <HowToSchema steps={methodSteps} />
      <BreadcrumbSchema
        items={[
          { name: "Home", path: "/" },
          { name: "The Method", path: "/method" },
        ]}
      />
    </>
  );
}
