import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";
import { SectionIntro } from "@/components/SectionIntro";
import { Reveal } from "@/components/Reveal";
import { CtaBand } from "@/components/CtaBand";
import { BreadcrumbSchema } from "@/components/JsonLd";
import { layers } from "@/data/capabilities";

export const metadata: Metadata = {
  title: "What We Build — Operations, Automation, AI, Internal Tools & Platforms",
  description:
    "Corehold builds one connected system across five layers: an operations core, automation, applied AI, internal tools and customer platforms. Custom software for UAE and international businesses, owned outright by the client — code, data and infrastructure included.",
  alternates: { canonical: "/capabilities" },
  openGraph: {
    title: "What Corehold builds",
    description:
      "One foundation, five layers: operations core, automation, applied AI, internal tools, customer platforms.",
    url: "/capabilities",
  },
};

const notThis = [
  "We are not a marketing agency with a development team attached.",
  "We are not a staffing arrangement — you are not renting developers by the hour.",
  "We do not resell or white-label another company's platform as our own.",
  "We do not host your system on our infrastructure and bill you for the privilege.",
  "We do not take on more engagements than we can run properly at once.",
];

export default function CapabilitiesPage() {
  return (
    <>
      <PageHeader
        eyebrow="What we build"
        title={
          <>
            One foundation.
            <span className="block text-quarry-500">Five layers on top.</span>
          </>
        }
        lede={
          <>
            A rented stack leaks because every tool holds its own private
            version of the truth and someone has to reconcile them by hand.
            Corehold builds a single core that the business is described in —
            and then everything else reads from it rather than syncing with it.
            Read the layers from the bottom up, the way you would read a
            foundation detail.
          </>
        }
        meta={[
          ["Delivered as", "One system, staged — not five projects"],
          ["Registered to", "Your organisation, from the first commit"],
          ["Built on", "Standard languages and standard infrastructure"],
        ]}
        breadcrumb={{ label: "Home", href: "/" }}
      />

      {layers.map((layer, i) => (
        <section
          key={layer.index}
          id={layer.index.toLowerCase()}
          className={`border-t border-quarry-800 ${
            i % 2 === 0 ? "bg-quarry-950" : "bg-quarry-900"
          }`}
        >
          <div className="shell py-20 md:py-28">
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
              <div className="lg:col-span-4">
                <Reveal>
                  <div className="flex items-baseline gap-4">
                    <span className="tag text-oxide">{layer.index}</span>
                    <span className="h-px w-12 bg-quarry-700" />
                    <span className="tag text-quarry-500">{layer.code}</span>
                  </div>
                  <h2 className="mt-6 text-major text-bone">{layer.name}</h2>
                  <p className="mt-5 max-w-[28ch] text-lede text-quarry-400">
                    {layer.role}
                  </p>
                </Reveal>
              </div>

              <div className="lg:col-span-7 lg:col-start-6">
                <Reveal delay={70}>
                  <p className="max-w-[62ch] text-lede text-quarry-200">
                    {layer.body}
                  </p>
                </Reveal>

                <Reveal delay={120}>
                  <ul className="mt-10 border-t border-quarry-800">
                    {layer.examples.map((example, k) => (
                      <li
                        key={example}
                        className="grid grid-cols-[2.75rem_1fr] gap-4 border-b border-quarry-800 py-4"
                      >
                        <span className="tag pt-1 text-quarry-500">
                          {layer.index}.{k + 1}
                        </span>
                        <span className="text-[0.9375rem] leading-relaxed text-quarry-200">
                          {example}
                        </span>
                      </li>
                    ))}
                  </ul>
                </Reveal>

                <Reveal delay={160}>
                  <p className="mt-8 max-w-[58ch] border-l-2 border-oxide pl-5 font-mono text-xs leading-relaxed tracking-[0.02em] text-quarry-400">
                    <span className="text-quarry-500">
                      TYPICALLY REPLACES —{" "}
                    </span>
                    {layer.replaces}
                  </p>
                </Reveal>
              </div>
            </div>
          </div>
        </section>
      ))}

      <Section ground="dark">
        <SectionIntro
          index="—"
          label="The technical stance"
          align="wide"
          heading="Boring technology, held to an unreasonable standard."
          lede={
            <>
              Nothing in a Corehold system exists to be interesting. Every
              choice is made against one question: will a competent engineer who
              has never met us be able to read this, run it and extend it in
              five years?
            </>
          }
        />

        <div className="mt-14 grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="space-y-6 text-[0.9375rem] leading-relaxed text-quarry-400 lg:col-span-6">
            <p>
              Standard languages with deep hiring pools. Standard relational
              data stores. Infrastructure from providers your CFO has heard of,
              in accounts registered to your company and billed to you directly.
              No proprietary Corehold runtime, no framework we invented, no
              dependency that will be abandoned by its maintainer in three
              years.
            </p>
            <p>
              Where AI belongs in the system, it is applied to your own data
              inside your own boundary — not by sending the company&apos;s
              operating history to a platform that keeps it.
            </p>
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <p className="tag text-quarry-500">And equally, what this is not</p>
            <ul className="mt-6 space-y-4">
              {notThis.map((item) => (
                <li
                  key={item}
                  className="flex items-baseline gap-3.5 text-[0.9375rem] leading-relaxed text-quarry-200"
                >
                  <span
                    aria-hidden="true"
                    className="relative top-[-1px] h-px w-4 shrink-0 bg-oxide"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <CtaBand
        eyebrow="Before any of this"
        heading="We find out which layers you actually need."
        body="Most companies need less built than they expect, and something different from what they came in asking for. The audit decides the scope — not the sales conversation, and not this page."
        secondary={{ href: "/method", label: "How the audit works" }}
      />

      <BreadcrumbSchema
        items={[
          { name: "Home", path: "/" },
          { name: "What We Build", path: "/capabilities" },
        ]}
      />
    </>
  );
}
