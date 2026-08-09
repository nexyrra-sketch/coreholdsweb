import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";
import { SectionIntro } from "@/components/SectionIntro";
import { Reveal } from "@/components/Reveal";
import { CtaBand } from "@/components/CtaBand";
import { DocumentDownload } from "@/components/DocumentDownload";
import { BreadcrumbSchema } from "@/components/JsonLd";
import {
  specimen,
  summary,
  verdict,
  leaks,
  lockIn,
  architecture,
  handover,
  contents,
} from "@/data/sampleAudit";

export const metadata: Metadata = {
  title: "A Specimen Audit — See the Deliverable Before You Buy It",
  description:
    "A complete worked system audit, published in full: the tool map, the subscription register, the ranked leaks, the lock-in assessment, the five-year comparison, and the architecture recommendation — including what we would refuse to build. Composite scenario, not a real client.",
  alternates: { canonical: "/specimen" },
  openGraph: {
    title: "A specimen audit, published in full",
    description:
      "The deliverable, shown rather than described. Eight pages, downloadable, composite scenario.",
    url: "/specimen",
  },
};

export default function SpecimenPage() {
  return (
    <>
      <PageHeader
        eyebrow="The deliverable"
        title={
          <>
            Most studios describe
            <span className="block text-quarry-500">the work. Here it is.</span>
          </>
        }
        lede={
          <>
            An audit is the only way into a Corehold engagement, which makes it
            the thing you are actually buying — so you should be able to look at
            one before you commit to anything. This is a complete audit, start to
            finish, published in full and free to download.
          </>
        }
        meta={[
          ["Subject", `${specimen.subject} — ${specimen.subjectNote}`],
          ["Sector", specimen.sector],
          ["Window", specimen.window],
        ]}
        breadcrumb={{ label: "Home", href: "/" }}
      />

      {/* --------------------------------------------- the honesty note --- */}
      <Section ground="dark">
        <Reveal>
          <div className="relative border border-dashed border-oxide/50 p-8 sm:p-10">
            <span className="tag absolute -top-2 left-6 bg-quarry-950 px-3 text-oxide">
              Specimen
            </span>
            <p className="mt-2 max-w-[72ch] text-lede text-bone">
              Meridian Freight is a composite. It is not a client, has never been
              a client, and does not exist.
            </p>
            <p className="mt-5 max-w-[72ch] text-[0.9375rem] leading-relaxed text-quarry-400">
              We could have published a real engagement with the names removed.
              We have not, because we do not have one to publish yet and because
              an anonymised real audit is impossible for you to verify anyway.
              What this document is instead: an honest reconstruction of the
              shape these audits take, with worked illustrative figures, so that
              you can judge the rigour of the method rather than take our word
              for it. Every page of the PDF carries the word SPECIMEN in its
              footer for exactly this reason.
            </p>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="mt-12 flex flex-wrap items-center gap-4">
            <DocumentDownload
              kind="specimen-audit"
              label="Download the full audit (PDF)"
            />
            <p className="font-mono text-xs text-quarry-500">
              Eight pages · built in your browser · nothing uploaded
            </p>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <ol className="mt-14 grid gap-px border border-quarry-800 bg-quarry-800 sm:grid-cols-2 lg:grid-cols-4">
            {contents.map(([n, label]) => (
              <li key={n} className="bg-quarry-950 px-6 py-6">
                <span className="tag text-oxide">{n}</span>
                <p className="mt-3 text-[0.9375rem] leading-snug text-quarry-200">
                  {label}
                </p>
              </li>
            ))}
          </ol>
        </Reveal>
      </Section>

      {/* ------------------------------------------------------ findings --- */}
      <Section ground="light" film>
        <SectionIntro
          index="01"
          label="Executive summary"
          ground="light"
          align="wide"
          heading="Five findings, and one of them is not a technology problem."
          lede={
            <>
              Every audit opens with what was actually found, in the order it
              matters. No preamble, no methodology section nobody reads.
            </>
          }
          note={
            <>
              The fourth finding is the one that changed the recommendation. It
              is also the one nobody in the business had raised.
            </>
          }
        />

        <div className="mt-14 border-t border-limestone-line">
          {summary.map(([head, body], i) => (
            <Reveal key={head} delay={i * 50}>
              <div className="grid gap-4 border-b border-limestone-line py-8 lg:grid-cols-12 lg:gap-10">
                <div className="flex items-start gap-4 lg:col-span-5">
                  <span className="tag mt-1.5 text-oxide-deep">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-[1.0625rem] leading-snug font-medium tracking-[-0.015em] text-quarry-950 sm:text-lg">
                    {head}
                  </h3>
                </div>
                <p className="text-[0.9375rem] leading-relaxed text-quarry-700 lg:col-span-7">
                  {body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-14 border-l-2 border-oxide-deep pl-6 sm:pl-8">
            <p className="tag text-oxide-deep">The recommendation</p>
            <p className="mt-5 max-w-[24ch] text-major text-quarry-950">
              {verdict.headline}
            </p>
            <p className="mt-7 max-w-[62ch] text-[0.9375rem] leading-relaxed text-quarry-700">
              {verdict.body}
            </p>
          </div>
        </Reveal>
      </Section>

      {/* --------------------------------------------------------- leaks --- */}
      <Section ground="dark">
        <SectionIntro
          index="02"
          label="The leaks"
          align="wide"
          heading="Ranked by what they cost, not by what is easiest to sell."
          note={
            <>
              Two of these need no project at all. We say so in the document,
              before anything is quoted.
            </>
          }
        />

        <div className="mt-14 border-t border-quarry-800">
          {leaks.map(([title, cost, note], i) => (
            <Reveal key={title} delay={i * 40}>
              <div className="grid gap-3 border-b border-quarry-800 py-6 lg:grid-cols-12 lg:items-baseline lg:gap-8">
                <span className="tag text-quarry-500 lg:col-span-1">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-[1.0625rem] font-medium text-bone lg:col-span-4">
                  {title}
                </p>
                <p className="tabular font-mono text-[0.9375rem] text-oxide lg:col-span-2">
                  {cost}
                </p>
                <p className="text-[0.9375rem] leading-relaxed text-quarry-400 lg:col-span-5">
                  {note}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ------------------------------------------------------- lock-in --- */}
      <Section ground="raised">
        <SectionIntro
          index="03"
          label="Lock-in"
          align="wide"
          heading="High lock-in is not automatically a problem."
          lede={
            <>
              On one provider in this audit it is simply the price of a real
              regulatory capability, and the document says so. An assessment that
              only ever finds fault is a sales document, not an assessment.
            </>
          }
        />

        <div className="mt-14 grid gap-px border border-quarry-800 bg-quarry-800 sm:grid-cols-2 lg:grid-cols-3">
          {lockIn.map(([provider, level, note], i) => (
            <Reveal key={provider} delay={i * 40} className="bg-quarry-900 p-7">
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="text-[0.9375rem] font-medium text-bone">
                  {provider}
                </h3>
                <span
                  className={`tag shrink-0 ${
                    level.startsWith("High") ? "text-oxide" : "text-quarry-400"
                  }`}
                >
                  {level}
                </span>
              </div>
              <p className="mt-3.5 text-[0.9375rem] leading-relaxed text-quarry-400">
                {note}
              </p>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* -------------------------------------------------- architecture --- */}
      <Section ground="dark">
        <SectionIntro
          index="04"
          label="What we would build"
          align="wide"
          heading="Roughly a third of what was originally scoped."
          note={
            <>
              The non-scope list is longer than the scope list. On a good audit
              it usually is.
            </>
          }
        />

        <div className="mt-14 grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <p className="tag text-oxide">In scope</p>
            <ul className="mt-6 border-t border-quarry-800">
              {architecture.map(([title, body], i) => (
                <Reveal as="li" key={title} delay={i * 40}>
                  <div className="border-b border-quarry-800 py-5">
                    <p className="text-[1.0625rem] font-medium text-bone">
                      {title}
                    </p>
                    <p className="mt-2 text-[0.9375rem] leading-relaxed text-quarry-400">
                      {body}
                    </p>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-5">
            <Reveal delay={100}>
              <div className="border border-quarry-800 bg-quarry-900 p-8">
                <p className="tag text-quarry-400">Deliberately not building</p>
                <ul className="mt-6 space-y-4">
                  {verdict.notBuilding.map((item) => (
                    <li
                      key={item}
                      className="flex items-baseline gap-3.5 text-[0.9375rem] leading-relaxed text-bone"
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
            </Reveal>

            <Reveal delay={150}>
              <div className="mt-8 border border-quarry-800 p-8">
                <p className="tag text-quarry-400">Owned at handover</p>
                <ul className="mt-6 space-y-3.5">
                  {handover.map((item) => (
                    <li
                      key={item}
                      className="flex gap-3.5 text-[0.9375rem] leading-relaxed text-quarry-300"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-2.5 h-1 w-1 shrink-0 bg-oxide"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>

        <Reveal delay={80}>
          <div className="mt-16 flex flex-wrap items-center gap-4 border-t border-quarry-800 pt-12">
            <DocumentDownload
              kind="specimen-audit"
              label="Download the full audit (PDF)"
            />
            <p className="max-w-[46ch] font-mono text-xs leading-relaxed text-quarry-500">
              The document is generated in your browser by the same code that
              runs this site. Nothing is uploaded and nothing is recorded.
            </p>
          </div>
        </Reveal>
      </Section>

      <CtaBand
        eyebrow="Yours would look like this"
        heading="Same rigour. Your actual numbers."
        body="An audit on your business produces this document about your stack — including, if that is where the evidence lands, a recommendation to build nothing at all."
        secondary={{ href: "/method", label: "How the audit runs" }}
      />

      <BreadcrumbSchema
        items={[
          { name: "Home", path: "/" },
          { name: "Specimen Audit", path: "/specimen" },
        ]}
      />
    </>
  );
}
