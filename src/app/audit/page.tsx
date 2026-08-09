import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import { AuditForm } from "@/components/AuditForm";
import { BreadcrumbSchema } from "@/components/JsonLd";
import { WhatsAppGlyph } from "@/components/Button";
import { site, whatsappHref, whatsappOpeners } from "@/lib/site";

export const metadata: Metadata = {
  title: "Request a System Audit — Corehold, Dubai",
  description:
    "Every Corehold engagement starts with an audit: a mapped account of how your business actually operates, what your rented software really costs across five years, and an honest recommendation — including, sometimes, that you should build nothing.",
  alternates: { canonical: "/audit" },
  openGraph: {
    title: "Request a System Audit — Corehold",
    description:
      "The only way into a Corehold engagement. Map the stack, price the rent, get an honest recommendation.",
    url: "/audit",
  },
};

const receive: [string, string][] = [
  ["01", "A system map of every tool, subscription and manual bridge between them"],
  ["02", "The true cost of your current arrangement — monthly, annual, and across five years"],
  ["03", "Your leaks ranked by cost and by operational risk"],
  ["04", "A written recommendation, including the option of doing nothing"],
];

const goodFit = [
  "The stack has become the problem, not the solution",
  "Subscription spend grows every year and nobody can explain the total",
  "People spend hours moving the same information between tools",
  "Leadership wants technology to become an asset, not a permanent expense",
];

const poorFit = [
  "You want a specific feature built to a brief you have already written",
  "You need engineers by the hour rather than a system",
  "The business is too early to have a stable operating shape",
  "The decision to buy has already been made and only needs a supplier",
];

export default function AuditPage() {
  return (
    <>
      <PageHeader
        eyebrow="Stage 01 — Audit"
        title={
          <>
            Find out what you are actually renting.
          </>
        }
        lede={
          <>
            This is the only way into a Corehold engagement. Before anyone
            discusses building anything, we map how your business genuinely
            operates and put a number against what the current arrangement
            costs to keep. It is a fixed fee over a fixed window, and it ends in
            a written recommendation — which is sometimes that you should change
            nothing at all.
          </>
        }
        meta={[
          ["Fee", "Fixed, and quoted before anything begins"],
          ["Window", "Typically two to three weeks end to end"],
          ["Possible outcome", "\u201cBuild nothing\u201d — in writing, with reasoning"],
        ]}
        breadcrumb={{ label: "Home", href: "/" }}
      />

      <Section ground="dark">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <Reveal>
              <h2 className="text-minor text-bone">
                What you receive at the end of it
              </h2>
            </Reveal>
            <Reveal delay={70}>
              <ul className="mt-8 border-t border-quarry-800">
                {receive.map(([index, item]) => (
                  <li
                    key={index}
                    className="grid grid-cols-[2.5rem_1fr] gap-4 border-b border-quarry-800 py-5"
                  >
                    <span className="tag pt-1 text-oxide">{index}</span>
                    <span className="text-[0.9375rem] leading-relaxed text-quarry-200">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={120}>
              <p className="mt-8 max-w-[60ch] text-[0.9375rem] leading-relaxed text-quarry-400">
                The audit belongs to you regardless of what happens next. If you
                take it to another studio, or hand it to your own team, or put
                it in a drawer — that is entirely your call. It is not a
                proposal dressed up as a document.
              </p>
            </Reveal>
          </div>

          <div className="lg:col-span-5">
            <Reveal delay={100}>
              <div className="border border-quarry-800 bg-quarry-900 p-8">
                <p className="tag text-oxide">Worth knowing first</p>
                <div className="mt-7 space-y-7">
                  <div>
                    <h3 className="text-[0.9375rem] font-medium text-bone">
                      This usually fits
                    </h3>
                    <ul className="mt-3.5 space-y-2.5">
                      {goodFit.map((item) => (
                        <li
                          key={item}
                          className="flex gap-3 text-[0.9375rem] leading-relaxed text-quarry-300"
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
                  <div className="border-t border-quarry-800 pt-7">
                    <h3 className="text-[0.9375rem] font-medium text-bone">
                      This usually does not
                    </h3>
                    <ul className="mt-3.5 space-y-2.5">
                      {poorFit.map((item) => (
                        <li
                          key={item}
                          className="flex gap-3 text-[0.9375rem] leading-relaxed text-quarry-400"
                        >
                          <span
                            aria-hidden="true"
                            className="mt-2.5 h-1 w-1 shrink-0 bg-quarry-600"
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="mt-8 border-t border-quarry-800 pt-6">
                  <p className="font-mono text-xs leading-relaxed text-quarry-400">
                    Prefer to skip the form?
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3">
                    <a
                      href={whatsappHref(whatsappOpeners.audit)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-2.5 text-[0.9375rem] text-oxide transition-colors hover:text-oxide-bright"
                    >
                      <WhatsAppGlyph />
                      <span className="latin underline underline-offset-4">
                        {site.phoneDisplay}
                      </span>
                      <span className="sr-only">on WhatsApp</span>
                    </a>
                    <a
                      href={`mailto:${site.email}`}
                      className="text-[0.9375rem] text-oxide underline underline-offset-4 transition-colors hover:text-oxide-bright"
                    >
                      {site.email}
                    </a>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </Section>

      <Section ground="raised" id="request">
        <Reveal className="flex items-center gap-4">
          <span className="tag text-oxide">Request</span>
          <span className="h-px max-w-[7rem] flex-1 bg-quarry-700" />
          <span className="tag text-quarry-400">Six minutes, at most</span>
        </Reveal>
        <Reveal delay={70}>
          <h2 className="mt-7 max-w-[20ch] text-major text-bone">
            Tell us what is running the business today.
          </h2>
        </Reveal>
        <Reveal delay={120}>
          <p className="mt-6 max-w-[58ch] text-lede text-quarry-300">
            The more specific you are here, the more useful our first reply
            will be. Rough answers are fine — nobody has these numbers to hand,
            which is rather the point.
          </p>
        </Reveal>

        <div className="max-w-[62rem]">
          <AuditForm />
        </div>
      </Section>

      <BreadcrumbSchema
        items={[
          { name: "Home", path: "/" },
          { name: "Request an Audit", path: "/audit" },
        ]}
      />
    </>
  );
}
