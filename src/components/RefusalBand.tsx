import { Reveal } from "./Reveal";

/**
 * The credibility hinge of the whole site. It gets a section of its own, no
 * competing content, and the only full-width oxide rule on the page — because
 * a studio that cannot say "don't build this" has no business asking to hold
 * anyone's foundation.
 */
export function RefusalBand() {
  return (
    <section className="relative overflow-hidden border-t border-quarry-800 bg-quarry-950">
      <div className="shell py-28 md:py-36 lg:py-44">
        <Reveal scribe className="h-px w-full origin-left bg-oxide" />

        <div className="grid gap-12 pt-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="tag text-quarry-500">The part that costs us work</p>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="mt-8 max-w-[18ch] text-major text-bone">
                Sometimes the audit says: build nothing.
              </h2>
            </Reveal>
          </div>

          <div className="lg:col-span-5">
            <Reveal delay={140}>
              <p className="text-lede text-quarry-300">
                We have no interest in selling a system to a company that does
                not need one.
              </p>
            </Reveal>
            <Reveal delay={190}>
              <p className="mt-6 text-[0.9375rem] leading-relaxed text-quarry-400">
                If the diagnosis is that the leak is a process problem rather
                than a technology one — if your current stack is genuinely
                good value — if the business is too early to have an operating
                shape worth encoding — that is the report you get, with the
                reasoning, and the engagement ends there.
              </p>
            </Reveal>
            <Reveal delay={240}>
              <p className="mt-6 text-[0.9375rem] leading-relaxed text-quarry-400">
                It costs us a project every time. It is also the only reason
                anything else on this page is worth reading. A studio you would
                trust with the foundation of your business has to be able to
                tell you no.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
