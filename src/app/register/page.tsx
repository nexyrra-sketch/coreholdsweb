import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import { RegisterTable } from "@/components/RegisterTable";
import { CtaBand } from "@/components/CtaBand";
import { BreadcrumbSchema } from "@/components/JsonLd";
import { registerMeta, verdictCopy, register } from "@/data/register";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "The Register — Build It or Rent It, Across 43 Software Categories",
  description:
    "A versioned index of build-or-rent verdicts across 43 categories of business software: CRM, quoting, billing, inventory, scheduling, AI, hosting and more — each with its lock-in risk and the exact threshold at which the verdict changes.",
  alternates: { canonical: "/register" },
  openGraph: {
    title: "The Corehold Register — build it, or rent it?",
    description:
      "Forty-three categories of business software, each with a verdict, a lock-in rating, and the threshold at which the answer flips.",
    url: "/register",
  },
};

const dataset = {
  "@context": "https://schema.org",
  "@type": "Dataset",
  name: "The Corehold Register",
  description:
    "Build-or-rent verdicts across 43 categories of business software, with lock-in risk and the threshold at which each verdict changes.",
  version: registerMeta.version,
  url: `${site.url}/register`,
  license: "https://creativecommons.org/licenses/by/4.0/",
  creator: { "@id": `${site.url}/#organization` },
  variableMeasured: ["Verdict", "Lock-in risk", "Threshold at which the verdict changes"],
};

export default function RegisterPage() {
  return (
    <>
      <PageHeader
        eyebrow={`The Register — v${registerMeta.version}`}
        title={
          <>
            Build it,
            <span className="block text-quarry-500">or rent it?</span>
          </>
        }
        lede={
          <>
            The ownership argument is useless as a slogan. It is only worth
            anything applied category by category — so here is our answer for
            forty-three of them, with the reasoning, the lock-in risk, and the exact
            point at which each verdict flips. Disagree with any of it and tell
            us; the document is versioned and revised quarterly.
          </>
        }
        meta={[
          ["Entries", `${register.length}`],
          ["Version", `${registerMeta.version} · ${registerMeta.issued}`],
          ["Reviewed", registerMeta.reviewed],
        ]}
        breadcrumb={{ label: "Home", href: "/" }}
      />

      <Section ground="dark">
        <div className="grid gap-px border border-quarry-800 bg-quarry-800 md:grid-cols-3">
          {(["build", "rent", "depends"] as const).map((v, i) => (
            <Reveal key={v} delay={i * 50} className="bg-quarry-950 p-7 lg:p-8">
              <p
                className={`tag ${v === "build" ? "text-oxide" : "text-quarry-400"}`}
              >
                {verdictCopy[v].label}
              </p>
              <p className="mt-4 text-[0.9375rem] leading-relaxed text-quarry-300">
                {verdictCopy[v].note}
              </p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={80}>
          <p className="mt-10 max-w-[72ch] text-[0.9375rem] leading-relaxed text-quarry-400">
            One thing to say plainly, because it is the most common
            misreading: most of this register says <em>rent</em>. Corehold is
            not against buying software — it is against buying the part of your
            stack that describes how your company specifically operates, because
            no vendor can sell you that and every vendor will try.
          </p>
        </Reveal>

        <RegisterTable />

        <Reveal>
          <div className="mt-16 border-t border-quarry-800 pt-10">
            <p className="tag text-quarry-500">Method</p>
            <div className="mt-6 grid max-w-[110ch] gap-8 text-[0.9375rem] leading-relaxed text-quarry-400 md:grid-cols-2 md:gap-14">
              <p>
                Each verdict is set against three questions. Does this encode
                something specific to how the company operates, or is it a solved
                problem sold to everybody? If the provider disappeared tomorrow,
                what would be unrecoverable? And at what size, sector or volume
                does the answer change — because a verdict without a threshold is
                an opinion.
              </p>
              <p>
                Lock-in is rated on exit difficulty rather than on price: how
                completely the data comes out, whether relationships survive the
                export, and how much of the business would need re-teaching. High
                lock-in is not automatically a problem. On regulated platforms it
                is simply the price of a real capability, and the register says so
                where that applies.
              </p>
            </div>
          </div>
        </Reveal>
      </Section>

      <CtaBand
        eyebrow="Your stack, not the general case"
        heading="The register is the general answer. An audit is yours."
        body="These verdicts hold for the typical company in each category. Yours is not typical in at least two places, and the audit exists to find out which two."
        secondary={{ href: "/specimen", label: "See a worked audit" }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(dataset) }}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", path: "/" },
          { name: "The Register", path: "/register" },
        ]}
      />
    </>
  );
}
