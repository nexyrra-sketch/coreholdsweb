import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";
import { SectionIntro } from "@/components/SectionIntro";
import { Reveal } from "@/components/Reveal";
import { CtaBand } from "@/components/CtaBand";
import { LiveVitals } from "@/components/LiveVitals";
import { BreadcrumbSchema } from "@/components/JsonLd";
import { measured, budgets, decisions, tokens } from "@/data/system";

export const metadata: Metadata = {
  title: "System — This Site's Own Specification",
  description:
    "Corehold has no client case studies yet, so this site is the case study. Its measured bundle size, dependency count, accessibility result, design tokens and the reasoning behind every engineering decision — published, and verifiable from the source.",
  alternates: { canonical: "/system" },
  openGraph: {
    title: "System — Corehold's own specification",
    description:
      "Bundle size, dependencies, accessibility result, tokens and reasoning. Published rather than claimed.",
    url: "/system",
  },
};

export default function SystemPage() {
  return (
    <>
      <PageHeader
        eyebrow="Specification"
        title={
          <>
            We have no case studies.
            <span className="block text-quarry-500">So here is the site.</span>
          </>
        }
        lede={
          <>
            Corehold is early, and inventing client results would undo
            everything else on this website. What we can do instead is publish
            the engineering of the one system we have shipped in public — this
            one — and let it be judged on the same standard we sell. Every
            number below is measured from the production build, and every one of
            them is verifiable from the source.
          </>
        }
        meta={[
          ["Framework", `Next.js ${measured.nextVersion} · React ${measured.reactVersion}`],
          ["Runtime dependencies", `${measured.runtimeDependencies}`],
          ["axe-core violations", `${measured.axeViolations}`],
        ]}
        breadcrumb={{ label: "Home", href: "/" }}
      />

      {/* --------------------------------------------------------- budgets -- */}
      <Section ground="dark">
        <SectionIntro
          index="01"
          label="Budgets"
          align="wide"
          heading="What this page cost to send you."
          lede={
            <>
              Performance is not a nice-to-have on a site arguing for
              engineering rigour — it is the first evidence a visitor gets that
              the argument is sincere.
            </>
          }
          note={
            <>
              Measured on the production build dated {measured.buildDate}. Run{" "}
              <span className="text-quarry-300">npm run build</span> against the
              source and you will get the same figures.
            </>
          }
        />

        <div className="mt-14 border-t border-quarry-800">
          {budgets.map(([label, value, detail], i) => (
            <Reveal key={label} delay={i * 40}>
              <div className="grid gap-4 border-b border-quarry-800 py-6 lg:grid-cols-12 lg:items-baseline lg:gap-10">
                <p className="text-[0.9375rem] font-medium text-bone lg:col-span-4">
                  {label}
                </p>
                <p className="tabular font-mono text-2xl text-oxide lg:col-span-2">
                  {value}
                </p>
                <p className="text-[0.9375rem] leading-relaxed text-quarry-400 lg:col-span-6">
                  {detail}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={80}>
          <dl className="mt-12 grid gap-px border border-quarry-800 bg-quarry-800 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Prerendered routes", `${measured.prerenderedRoutes}`],
              ["Heaviest route", `${measured.heaviestRoute.path} · ${measured.heaviestRoute.value}`],
              ["Self-hosted font files", `${measured.fontFiles} · ${measured.fontWeight}`],
              ["Trackers", `${measured.trackers}`],
            ].map(([term, value]) => (
              <div key={term} className="bg-quarry-950 px-6 py-6">
                <dt className="tag text-quarry-500">{term}</dt>
                <dd className="mt-2.5 font-mono text-[0.9375rem] text-bone">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </Section>

      {/* ---------------------------------------------------- live vitals -- */}
      <Section ground="raised">
        <SectionIntro
          index="02"
          label="Measured, not claimed"
          align="wide"
          heading="These numbers are from your browser, not ours."
          lede={
            <>
              Every performance claim you have read on a studio website is a
              screenshot of somebody else&apos;s lab run on somebody else&apos;s
              hardware. The figures below were taken from this page load, in this
              browser, on your connection.
            </>
          }
          note={
            <>
              On a slow phone on hotel wifi this will not flatter us. Publishing
              it anyway is rather the point.
            </>
          }
        />
        <LiveVitals />
      </Section>

      {/* ------------------------------------------------------- decisions -- */}
      <Section ground="dark">
        <SectionIntro
          index="03"
          label="Decisions"
          align="wide"
          heading="Eight choices, and why each one went that way."
          lede={
            <>
              An audit report is only useful if it shows its reasoning. The same
              applies to a build. These are the decisions on this site that a
              reviewer would question, answered before they have to ask.
            </>
          }
          note={
            <>
              This is the section we would want to read on somebody else&apos;s
              studio site, and never find.
            </>
          }
        />

        <div className="mt-14 grid gap-px border border-quarry-800 bg-quarry-800 md:grid-cols-2">
          {decisions.map(([title, body], i) => (
            <Reveal
              key={title}
              delay={i * 40}
              className="bg-quarry-900 p-7 lg:p-9"
            >
              <span className="tag text-oxide">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-5 text-lg tracking-[-0.02em] text-bone">
                {title}
              </h3>
              <p className="mt-3.5 text-[0.9375rem] leading-relaxed text-quarry-400">
                {body}
              </p>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ---------------------------------------------------------- tokens -- */}
      <Section ground="dark">
        <SectionIntro
          index="04"
          label="Tokens"
          align="wide"
          heading="The whole design system, published."
          lede={
            <>
              Twelve colours, two typefaces and one easing curve. There is no
              second palette, no secondary accent and no gradient anywhere in
              the system — gradients imply transition, and this studio sells
              permanence.
            </>
          }
          note={
            <>
              Contrast ratios are stated against the ground each token is
              actually used on. Nothing here is decorative-only.
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

      {/* ---------------------------------------------------------- verify -- */}
      <Section ground="raised">
        <SectionIntro
          index="05"
          label="Verify it"
          align="wide"
          heading="Don't take the numbers on trust."
          lede={
            <>
              Every figure on this page comes out of commands you can run
              yourself against the source. That is the whole point of publishing
              them.
            </>
          }
        />

        <Reveal>
          <div className="mt-14 border border-quarry-800 bg-quarry-950">
            <p className="tag border-b border-quarry-800 px-6 py-4 text-quarry-500">
              Terminal
            </p>
            <pre
              tabIndex={0}
              role="region"
              aria-label="Commands for verifying the figures on this page"
              className="overflow-x-auto px-6 py-6 font-mono text-[0.8125rem] leading-loose text-quarry-300"
            >
              <code>{`npm run build        # route sizes and first-load JS
npm run typecheck    # strict TypeScript, zero errors
node scripts/a11y.mjs   # axe-core, every page, two viewports
node scripts/og.mjs     # regenerates the Open Graph card`}</code>
            </pre>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <p className="mt-8 max-w-[68ch] text-[0.9375rem] leading-relaxed text-quarry-400">
            The QA scripts are deliberately kept out of the dependency tree so a
            normal install stays light — the README explains how to add them for
            a run. And if you find a number on this page that does not hold,
            write to us. We would rather be corrected than believed.
          </p>
        </Reveal>
      </Section>

      <CtaBand
        eyebrow="The same standard, on your system"
        heading="This is the bar we hold our own work to."
        body="Everything on this page — the budgets, the reasoning, the published tokens, the invitation to check — is what a Corehold handover document looks like, applied to the one system we can show you in public. Yours would be documented to the same standard, and then it would be yours."
        secondary={{ href: "/method", label: "How we get there" }}
      />

      <BreadcrumbSchema
        items={[
          { name: "Home", path: "/" },
          { name: "System", path: "/system" },
        ]}
      />
    </>
  );
}
