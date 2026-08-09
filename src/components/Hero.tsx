import { ButtonLink, Arrow } from "./Button";
import { HeroDiagram } from "./HeroDiagram";
import { Parallax } from "./Parallax";
import { ctaHref, ctaLabel } from "@/lib/site";

const specs = [
  ["BASE", "Dubai, UAE"],
  ["CLIENTS", "UAE & worldwide"],
  ["INTAKE", "Small, deliberate"],
  ["OUTCOME", "Full ownership transfer"],
];

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-quarry-800">
      <div className="gridfilm" />
      {/* A single soft field of light behind the statement. No gradient mesh. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 h-[36rem] w-[72rem] -translate-x-1/2 rounded-full opacity-[0.055]"
        style={{
          background:
            "radial-gradient(closest-side, var(--color-oxide), transparent)",
        }}
      />

      <div className="shell relative">
        <div className="grid items-center gap-16 pt-32 pb-20 md:pt-44 md:pb-28 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <p
              className="tag settle flex items-center gap-3 text-quarry-400"
              style={{ animationDelay: "60ms" }}
            >
              <span
                className="datum-pulse inline-block h-1.5 w-1.5 bg-oxide"
                aria-hidden="true"
              />
              Intelligent systems studio — Dubai
            </p>

            <h1 className="type-land mt-8 text-mega text-bone">
              Own the system your business runs on.
              <span className="mt-1 block text-quarry-500">
                Stop renting it.
              </span>
            </h1>

            <p
              className="settle mt-9 max-w-[54ch] text-lede text-quarry-300"
              style={{ animationDelay: "180ms" }}
            >
              Most companies do not own the technology their business depends
              on. They rent it — a subscription for the website, another for
              customers, another for automation, another for AI, five more
              holding it together. Corehold replaces that stack with one system
              built for how your company actually works, and hands you the code,
              the data and the documentation outright.
            </p>

            <div
              className="settle mt-11 flex flex-col gap-3 sm:flex-row sm:items-center"
              style={{ animationDelay: "280ms" }}
            >
              <ButtonLink href={ctaHref} size="lg" trailing={<Arrow />}>
                {ctaLabel}
              </ButtonLink>
              <ButtonLink href="/method" size="lg" variant="secondary">
                See the method
              </ButtonLink>
            </div>

            <p
              className="settle mt-6 font-mono text-xs leading-relaxed text-quarry-500"
              style={{ animationDelay: "340ms" }}
            >
              Every engagement begins with an audit. Some of them end there.
            </p>
          </div>

          <div className="relative hidden lg:col-span-5 lg:block">
            <Parallax depth={12}>
              <HeroDiagram className="ml-auto w-full max-w-[24rem]" />
            </Parallax>
          </div>
        </div>
      </div>

      <div className="relative border-t border-quarry-800">
        <div className="shell">
          <dl className="grid grid-cols-2 sm:grid-cols-4">
            {specs.map(([term, value], i) => (
              <div
                key={term}
                className={`settle py-6 sm:py-7 ${
                  i > 0 ? "sm:border-l sm:border-quarry-800 sm:pl-6" : ""
                } ${i % 2 === 1 ? "border-l border-quarry-800 pl-6 sm:pl-6" : ""}`}
                style={{ animationDelay: `${420 + i * 60}ms` }}
              >
                <dt className="tag text-quarry-500">{term}</dt>
                <dd className="mt-2.5 text-[0.9375rem] text-quarry-200">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
