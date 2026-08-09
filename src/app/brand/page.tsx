import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";
import { SectionIntro } from "@/components/SectionIntro";
import { Reveal } from "@/components/Reveal";
import { Mark } from "@/components/Logo";
import { DocumentDownload } from "@/components/DocumentDownload";
import { CtaBand } from "@/components/CtaBand";
import { BreadcrumbSchema } from "@/components/JsonLd";
import { tokens } from "@/data/system";

export const metadata: Metadata = {
  title: "Brand Standard v1.0 — The Identity, Published",
  description:
    "Corehold's identity in the open: the mark and its construction, the colour system with contrast ratios, the type scale, the motion specification and the voice guide — plus the brand book, letterhead and proposal template as downloadable documents.",
  alternates: { canonical: "/brand" },
  openGraph: {
    title: "Corehold Brand Standard v1.0",
    description:
      "Mark, colour, type, motion and voice — published, with the business documents to match.",
    url: "/brand",
  },
};

const voice: [boolean, string][] = [
  [true, "Own the system your business runs on. Stop renting it."],
  [false, "We help businesses scale with innovative digital solutions."],
  [true, "Sometimes the audit says: build nothing."],
  [false, "We work closely with you to understand your unique needs."],
  [true, "After five years of paying, you own nothing you run on."],
  [false, "Digital transformation for the modern enterprise."],
];

const motionSpec: [string, string][] = [
  ["Curve", "cubic-bezier(0.22, 0.68, 0.24, 1) — the only easing in the system"],
  ["Reveal", "Rise 14px and resolve over 720ms. Nothing bounces, scales or blurs."],
  ["Rules", "Hairlines scribe left to right over 900ms."],
  ["Type", "Headlines land: weight 470 → 600, tracking −0.010em → −0.032em."],
  ["Accent", "Oxide arrives last and moves least."],
  ["Off switch", "prefers-reduced-motion disables all of it, properly."],
];

export default function BrandPage() {
  return (
    <>
      <PageHeader
        eyebrow="Brand Standard v1.0"
        title={
          <>
            The identity,
            <span className="block text-quarry-500">in the open.</span>
          </>
        }
        lede={
          <>
            Most companies treat their brand guidelines as an internal document.
            Publishing ours costs nothing and demonstrates something: that every
            decision here has a reason behind it, and that the reasons survive
            being read by people outside the studio.
          </>
        }
        meta={[
          ["Version", "1.0 · 2026-08"],
          ["Families", "Archivo · IBM Plex Mono"],
          ["Accent", "One. Oxide #D9622B"],
        ]}
        breadcrumb={{ label: "Home", href: "/" }}
      />

      {/* ------------------------------------------------------- the mark -- */}
      <Section ground="dark">
        <SectionIntro
          index="01"
          label="The mark"
          align="wide"
          heading="Two brackets and a core."
          lede={
            <>
              An interrupted square: a bracket at the upper-left and its exact
              180° twin at the lower-right, so the mark carries the same weight
              whichever way you look at it. Inside sits a solid block, dead
              centre, fully enclosed and touching neither.
            </>
          }
          note={
            <>
              It also reads as three things an engineer already knows: a
              registration target, a footing detail in plan, and a pair of clamps
              under load.
            </>
          }
        />

        <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <div className="relative border border-quarry-800 bg-quarry-900 p-10">
              <div className="gridfilm opacity-60" />
              <Mark
                className="relative mx-auto h-40 w-40 text-oxide"
                title="The Corehold mark"
              />
            </div>
            <p className="mt-4 font-mono text-xs text-quarry-500">
              Drawn on a 32-unit grid. Bracket stroke 3 units. Core 10 × 10,
              centred. Clear space equals the core&apos;s width on every side.
            </p>
          </Reveal>

          <div className="lg:col-span-6 lg:col-start-7">
            <Reveal delay={70}>
              <p className="tag text-oxide">Never</p>
              <ul className="mt-6 space-y-4">
                {[
                  "Rotate the mark. It is 180° symmetric for a reason; 45° is not a reason.",
                  "Outline the core or fill the brackets. The relationship is the idea.",
                  "Split the wordmark into two colours across “core” and “hold”.",
                  "Place it on a mid-tone. It lives on quarry or on limestone.",
                  "Add a tagline lock-up. The slogan is copy, not part of the mark.",
                ].map((item) => (
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
            </Reveal>

            <Reveal delay={120}>
              <div className="mt-10 border-t border-quarry-800 pt-8">
                <p className="tag text-quarry-500">Wordmark</p>
                <p className="mt-5 text-[2.5rem] leading-none font-semibold tracking-[-0.03em] text-bone">
                  Corehold
                </p>
                <p className="mt-4 font-mono text-xs text-quarry-500">
                  Archivo SemiBold · −0.03em · sentence case
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* ------------------------------------------------------- the system */}
      <Section ground="raised">
        <SectionIntro
          index="02"
          label="Colour & type"
          align="wide"
          heading="Twelve colours, two families, one curve."
          lede={
            <>
              There is no second palette, no secondary accent and no gradient
              anywhere in the system. Contrast ratios are stated against the
              ground each token is actually used on.
            </>
          }
        />

        <div className="mt-14 space-y-12">
          {tokens.map((group) => (
            <Reveal key={group.group}>
              <div>
                <p className="tag text-quarry-500">{group.group}</p>
                <ul className="mt-5 border-t border-quarry-800">
                  {group.rows.map(([name, value, note]) => (
                    <li
                      key={name}
                      className="grid grid-cols-[1.25rem_1fr] items-baseline gap-x-4 gap-y-1 border-b border-quarry-800 py-4 sm:grid-cols-[1.25rem_13rem_12rem_1fr]"
                    >
                      <span
                        aria-hidden="true"
                        className="h-3 w-3 self-center border border-quarry-700"
                        style={
                          value.startsWith("#")
                            ? { backgroundColor: value }
                            : { backgroundColor: "transparent" }
                        }
                      />
                      <span className="font-mono text-[0.8125rem] text-bone">
                        {name}
                      </span>
                      <span className="font-mono text-[0.8125rem] text-quarry-400">
                        {value}
                      </span>
                      <span className="col-span-2 text-[0.9375rem] leading-relaxed text-quarry-400 sm:col-span-1">
                        {note}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ---------------------------------------------------------- voice -- */}
      <Section ground="light" film>
        <SectionIntro
          index="03"
          label="Voice"
          ground="light"
          align="wide"
          heading="Confident, technical, a little blunt."
          lede={
            <>
              The test is simple: if a line could be pasted onto any other
              agency&apos;s website and still make sense, it is wrong. Rewrite it
              until it could only have come from here.
            </>
          }
        />

        <div className="mt-14 border-t border-limestone-line">
          {voice.map(([good, line], i) => (
            <Reveal key={line} delay={i * 40}>
              <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2 border-b border-limestone-line py-5">
                <span
                  className={`tag w-16 shrink-0 ${good ? "text-oxide-deep" : "text-quarry-600"}`}
                >
                  {good ? "Say" : "Never"}
                </span>
                <span
                  className={`flex-1 text-[1.0625rem] ${
                    good
                      ? "font-medium text-quarry-950"
                      : "text-quarry-600 line-through decoration-limestone-line"
                  }`}
                >
                  {line}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* --------------------------------------------------------- motion -- */}
      <Section ground="dark">
        <SectionIntro
          index="04"
          label="Motion"
          align="wide"
          heading="One curve. Nothing bounces."
        />

        <div className="mt-14 border-t border-quarry-800">
          {motionSpec.map(([term, value], i) => (
            <Reveal key={term} delay={i * 40}>
              <div className="grid gap-2 border-b border-quarry-800 py-5 sm:grid-cols-[10rem_1fr] sm:gap-8">
                <p className="text-[0.9375rem] font-medium text-bone">{term}</p>
                <p className="font-mono text-[0.8125rem] leading-relaxed text-quarry-300">
                  {value}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ------------------------------------------------------ documents -- */}
      <Section ground="raised">
        <SectionIntro
          index="05"
          label="The documents"
          align="wide"
          heading="The business system, generated by the site itself."
          lede={
            <>
              The brand book, the letterhead and the proposal template are all
              produced by the same PDF writer that builds the audit — about 120
              lines, no library, running in your browser. One engine, one set of
              inks, so a Corehold document is recognisable whatever it says.
            </>
          }
        />

        <Reveal>
          <div className="mt-14 flex flex-wrap gap-4">
            <DocumentDownload kind="brand-book" label="Brand Standard (PDF)" />
            <DocumentDownload
              kind="letterhead"
              label="Letterhead"
              variant="secondary"
            />
            <DocumentDownload
              kind="proposal"
              label="Proposal template"
              variant="secondary"
            />
          </div>
        </Reveal>

        <Reveal delay={80}>
          <p className="mt-8 max-w-[68ch] font-mono text-xs leading-relaxed text-quarry-500">
            Nothing is uploaded and nothing is stored. The files are assembled
            from vector paths and the base-14 fonts every PDF reader already has,
            which is why they land at a few kilobytes each.
          </p>
        </Reveal>
      </Section>

      <CtaBand
        eyebrow="Built the same way"
        heading="Your system would be documented to this standard."
        body="Everything on this page — the reasoning written down, the decisions defensible, the documents generated rather than assembled by hand — is what a Corehold handover looks like applied to a brand instead of an operating system."
        secondary={{ href: "/system", label: "See the site's own spec" }}
      />

      <BreadcrumbSchema
        items={[
          { name: "Home", path: "/" },
          { name: "Brand Standard", path: "/brand" },
        ]}
      />
    </>
  );
}
