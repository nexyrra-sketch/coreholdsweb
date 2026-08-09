import Link from "next/link";
import { Reveal } from "./Reveal";

const standards: [string, string, string][] = [
  [
    "01",
    "Ownership from day one",
    "Code, data and infrastructure are registered to the client at the start of the build, not transferred at the end as a courtesy.",
  ],
  [
    "02",
    "No component we alone can run",
    "If a part of the system depends on knowledge only Corehold holds, it is rebuilt until it does not.",
  ],
  [
    "03",
    "Legible to the next engineer",
    "The test is whether a competent engineer who has never met us can read the system and extend it. We hire that test out loud.",
  ],
  [
    "04",
    "Proportion over ambition",
    "The smallest system that changes the most. What we chose not to build is documented alongside what we did.",
  ],
  [
    "05",
    "Candour before commercials",
    "If the audit concludes you should not buy anything, that is the report you receive — in writing, with the reasoning.",
  ],
  [
    "06",
    "Built for a decade",
    "Standard languages, standard infrastructure, no clever dependency that will be abandoned in three years.",
  ],
];

export function Standards() {
  return (
    <>
      <div className="mt-14 grid gap-px border border-quarry-800 bg-quarry-800 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
        {standards.map(([index, title, body], i) => (
          <Reveal
            key={index}
            delay={i * 50}
            className="bg-quarry-950 p-7 transition-colors duration-300 hover:bg-quarry-900 lg:p-8"
          >
            <span className="tag text-oxide">{index}</span>
            <h3 className="mt-5 text-lg tracking-[-0.02em] text-bone">
              {title}
            </h3>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-quarry-400">
              {body}
            </p>
          </Reveal>
        ))}
      </div>

      {/* An honest placeholder. Corehold is early; this space stays empty until
          there is real, named, client-approved evidence to put in it. */}
      <Reveal className="mt-10">
        <div className="relative border border-dashed border-quarry-700 p-8 sm:p-10">
          <span className="tag absolute -top-2 left-6 bg-quarry-950 px-3 text-quarry-500">
            Reserved — client evidence
          </span>
          <p className="mt-2 max-w-[68ch] text-[0.9375rem] leading-relaxed text-quarry-300">
            Corehold is early. This is where named engagements, client
            references and published results will sit — and it stays empty
            until there are real ones to put in it. We have deliberately not
            filled it with logos, testimonials or numbers we cannot stand
            behind, because a studio that will hold your foundation should not
            open the relationship by rounding up.
          </p>
          <p className="mt-5 font-mono text-xs text-quarry-500">
            In the meantime, the honest substitute is published:{" "}
            <Link
              href="/specimen"
              className="text-oxide underline underline-offset-4 transition-colors hover:text-oxide-bright"
            >
              a complete worked audit
            </Link>
            , built from a composite scenario and labelled as one on every page.
          </p>
        </div>
      </Reveal>
    </>
  );
}
