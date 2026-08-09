import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";
import { SectionIntro } from "@/components/SectionIntro";
import { Reveal } from "@/components/Reveal";
import { CtaBand } from "@/components/CtaBand";
import { BreadcrumbSchema } from "@/components/JsonLd";
import { standardMeta, commitments, terms } from "@/data/standard";

export const metadata: Metadata = {
  title: "The Corehold Standard v1.0 — Our Commitments, Published",
  description:
    "Six standards every Corehold engagement is held to, each with what it means in practice and how a client can verify it — plus the full engagement terms in plain English, published before you ever speak to us.",
  alternates: { canonical: "/standard" },
  openGraph: {
    title: "The Corehold Standard v1.0",
    description:
      "Our commitments and our engagement terms, published, versioned and checkable.",
    url: "/standard",
  },
};

export default function StandardPage() {
  return (
    <>
      <PageHeader
        eyebrow={`Standard v${standardMeta.version}`}
        title={
          <>
            Here is the contract,
            <span className="block text-quarry-500">
              before you speak to us.
            </span>
          </>
        }
        lede={
          <>
            Most studios publish values and negotiate terms. We would rather do
            it the other way around: what follows is what every Corehold
            engagement commits to, how you can verify each commitment while the
            work is happening, and the terms of the engagement in plain English —
            all of it versioned, dated and open to being held against us.
          </>
        }
        meta={[
          ["Version", `${standardMeta.version} · ${standardMeta.issued}`],
          ["Supersedes", standardMeta.supersedes],
          ["Applies to", "Every engagement, without exception"],
        ]}
        breadcrumb={{ label: "Home", href: "/" }}
      />

      {/* ------------------------------------------------- the standards -- */}
      <Section ground="dark">
        <SectionIntro
          index="01"
          label="The commitments"
          align="wide"
          heading="Six standards, and how to check each one."
          lede={
            <>
              A commitment nobody can verify is a slogan. Each of these comes
              with the thing to look at while the work is running — including
              the one you genuinely cannot check in advance, which we say so
              about.
            </>
          }
          note={
            <>
              If we break one of these on your engagement, we would rather you
              quoted this page back at us than quietly lost confidence.
            </>
          }
        />

        <div className="mt-14 border-t border-quarry-800">
          {commitments.map((c, i) => (
            <Reveal key={c.index} delay={i * 40}>
              <article className="grid gap-8 border-b border-quarry-800 py-10 lg:grid-cols-12 lg:gap-12">
                <div className="lg:col-span-4">
                  <span className="tag text-oxide">{c.index}</span>
                  <h3 className="mt-4 text-minor tracking-[-0.02em] text-bone">
                    {c.title}
                  </h3>
                  <p className="mt-4 text-[0.9375rem] leading-relaxed text-quarry-400">
                    {c.body}
                  </p>
                </div>

                <div className="lg:col-span-4">
                  <p className="tag text-quarry-500">In practice</p>
                  <p className="mt-4 text-[0.9375rem] leading-relaxed text-quarry-200">
                    {c.practice}
                  </p>
                </div>

                <div className="lg:col-span-4">
                  <p className="tag text-oxide">How to check it</p>
                  <p className="mt-4 border-l border-quarry-700 pl-5 text-[0.9375rem] leading-relaxed text-quarry-300">
                    {c.check}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ------------------------------------------------------- the terms */}
      <Section ground="light" film>
        <SectionIntro
          index="02"
          label="The engagement"
          ground="light"
          align="wide"
          heading="Ten questions, answered before you have to ask them."
          lede={
            <>
              This is not the legal agreement — that gets drafted per engagement
              and your lawyers will want their say. It is the plain-English
              version of what will be in it, published so nothing in the contract
              is a surprise.
            </>
          }
          note={
            <>
              If your lawyer finds a clause in our agreement that contradicts a
              line on this page, the page wins and we fix the agreement.
            </>
          }
        />

        <div className="mt-14 border-t border-limestone-line">
          {terms.map((t, i) => (
            <Reveal key={t.index} delay={Math.min(i, 6) * 30}>
              <div className="grid gap-4 border-b border-limestone-line py-8 lg:grid-cols-12 lg:gap-10">
                <div className="flex items-start gap-4 lg:col-span-5">
                  <span className="tag mt-1.5 text-oxide-deep">{t.index}</span>
                  <h3 className="text-[1.0625rem] leading-snug font-medium tracking-[-0.015em] text-quarry-950 sm:text-lg">
                    {t.question}
                  </h3>
                </div>
                <p className="text-[0.9375rem] leading-relaxed text-quarry-700 lg:col-span-7">
                  {t.answer}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ------------------------------------------------------ versioning */}
      <Section ground="raised">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <Reveal>
              <p className="tag text-oxide">Versioning</p>
            </Reveal>
            <Reveal delay={70}>
              <h2 className="mt-7 max-w-[18ch] text-major text-bone">
                Nothing on this page gets quietly edited.
              </h2>
            </Reveal>
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <Reveal delay={130}>
              <p className="text-[0.9375rem] leading-relaxed text-quarry-300">
                {standardMeta.changePolicy}
              </p>
            </Reveal>
            <Reveal delay={180}>
              <dl className="mt-8 border-t border-quarry-800">
                {[
                  ["v1.0", `${standardMeta.issued} — first published version`],
                ].map(([v, note]) => (
                  <div
                    key={v}
                    className="flex gap-6 border-b border-quarry-800 py-4"
                  >
                    <dt className="tag w-14 shrink-0 text-oxide">{v}</dt>
                    <dd className="text-[0.9375rem] text-quarry-300">{note}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
            <Reveal delay={220}>
              <p className="mt-6 font-mono text-xs leading-relaxed text-quarry-500">
                A studio that will not put its terms in writing before the
                conversation is telling you something. So is one that will.
              </p>
            </Reveal>
          </div>
        </div>
      </Section>

      <CtaBand
        eyebrow="You have read the terms"
        heading="Now find out whether there is anything worth doing."
        body="Every engagement starts with an audit, and a real proportion of those audits end with us telling a company to change nothing. That outcome is on the table before you write to us — it is written into the standard above."
        secondary={{ href: "/specimen", label: "See a worked audit" }}
      />

      <BreadcrumbSchema
        items={[
          { name: "Home", path: "/" },
          { name: "The Standard", path: "/standard" },
        ]}
      />
    </>
  );
}
