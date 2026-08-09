import type { Metadata } from "next";
import Link from "next/link";
import { CoreScene } from "@/components/CoreScene";
import { LandlordSwitch } from "@/components/LandlordSwitch";
import { CostMeter, CountTo } from "@/components/Counters";
import { Magnetic } from "@/components/Magnetic";
import { Reveal } from "@/components/Reveal";
import { Decode } from "@/components/Decode";
import { ButtonLink, Arrow } from "@/components/Button";
import { stages } from "@/data/method";
import { ctaHref, ctaLabel } from "@/lib/site";

export const metadata: Metadata = {
  title:
    "Corehold — Own the System Your Business Runs On | Systems Studio, Dubai",
  description:
    "Stop renting the software your company depends on. Corehold is an intelligent systems studio in Dubai that replaces stacks of SaaS subscriptions with one owned system — operations, AI, automation, internal tools — then hands over the code, data and documentation outright.",
  alternates: { canonical: "/" },
};

/* -------------------------------------------------------------------------- */

function Beat({
  children,
  align = "start",
  className,
}: {
  children: React.ReactNode;
  align?: "start" | "end";
  className?: string;
}) {
  return (
    <section
      className={`relative flex min-h-[100svh] items-center py-28 ${className ?? ""}`}
    >
      <div className="shell w-full">
        <div className="grid lg:grid-cols-12">
          <div
            className={`relative z-10 ${
              align === "end"
                ? "scrim-start scrim-end lg:col-span-6 lg:col-start-7"
                : "scrim-start lg:col-span-6"
            }`}
          >
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}

function Tag({ index, label }: { index: string; label: string }) {
  return (
    <p className="tag flex items-center gap-4 text-quarry-400">
      <span className="text-oxide">{index}</span>
      <span className="h-px w-10 bg-quarry-700" />
      <Decode text={label.toUpperCase()} />
    </p>
  );
}

/* -------------------------------------------------------------------------- */

export default function HomePage() {
  return (
    <>
      <CoreScene stageId="stage" />

      {/* ============================================ THE CINEMATIC STAGE == */}
      <div id="stage" className="relative">
        {/* ---------------------------------------------------- 01 hook -- */}
        <Beat>
          <p className="tag settle flex items-center gap-3 text-quarry-400">
            <span
              className="datum-pulse inline-block h-1.5 w-1.5 bg-oxide"
              aria-hidden="true"
            />
            Intelligent systems studio — Dubai
          </p>

          <h1 className="type-land mt-8 text-[clamp(2.6rem,5.4vw,4.6rem)] leading-[0.96] tracking-[-0.035em] text-bone">
            Own the system
            <span className="block">your business</span>
            <span className="block">runs on.</span>
            <span className="mt-1 block text-quarry-500">Stop renting it.</span>
          </h1>

          <p className="settle mt-9 max-w-[42ch] text-lede text-quarry-300">
            We build the core your company operates on — and then we hand you
            the deed to it.
          </p>

          <div
            className="settle mt-11 flex flex-col gap-3 sm:flex-row sm:items-center"
            style={{ animationDelay: "220ms" }}
          >
            <Magnetic>
              <ButtonLink href={ctaHref} size="lg" trailing={<Arrow />}>
                {ctaLabel}
              </ButtonLink>
            </Magnetic>
            <ButtonLink href="/specimen" size="lg" variant="secondary">
              See a worked audit
            </ButtonLink>
          </div>

          <p
            className="settle mt-14 max-w-[44ch] border-l border-quarry-700 pl-5 font-mono text-xs leading-relaxed text-quarry-500"
            style={{ animationDelay: "340ms" }}
          >
            A company on the example stack in our ledger has spent{" "}
            <CostMeter className="text-oxide" /> since you opened this page.
            <br />
            Played at one second per day. Your own figures will differ.
          </p>
        </Beat>

        {/* ----------------------------------------------- 02 arithmetic -- */}
        <Beat align="end">
          <Reveal>
            <Tag index="01" label="The arithmetic" />
          </Reveal>

          <Reveal delay={70}>
            <h2 className="type-settle mt-8 max-w-[14ch] text-major text-bone">
              Fourteen subscriptions. None of them yours.
            </h2>
          </Reveal>

          <Reveal delay={130}>
            <p className="text-[clamp(2.4rem,5.6vw,4.4rem)] mt-10 leading-none tracking-[-0.03em] text-oxide">
              <CountTo value={791448} prefix="AED " />
            </p>
            <p className="tag mt-5 text-quarry-400">
              Five years of rent, at 6% a year, on that example stack
            </p>
          </Reveal>

          <Reveal delay={190}>
            <p className="mt-10 max-w-[40ch] text-lede text-quarry-300">
              Equity acquired at the end of it:{" "}
              <span className="text-bone">none</span>.
            </p>
          </Reveal>

          <Reveal delay={240}>
            <Link
              href="/ledger"
              className="group mt-8 inline-flex items-center gap-3 text-[0.9375rem] text-oxide transition-colors hover:text-oxide-bright"
            >
              Put your own numbers in
              <Arrow />
            </Link>
          </Reveal>
        </Beat>

        {/* ---------------------------------------------------- 03 proof -- */}
        <section className="relative flex min-h-[100svh] items-center py-28">
          <div className="shell relative z-10 w-full">
            <Reveal>
              <Tag index="02" label="The proof" />
            </Reveal>
            <Reveal delay={70}>
              <h2 className="type-settle mt-8 max-w-[18ch] text-major text-bone">
                This is what renting actually means.
              </h2>
            </Reveal>
            <Reveal delay={130}>
              <p className="mt-6 max-w-[52ch] text-lede text-quarry-300">
                Two identical systems. Both running. Flip the switch.
              </p>
            </Reveal>

            <div className="pane mt-12 p-6 sm:p-8">
              <LandlordSwitch />
            </div>
          </div>
        </section>

        {/* ----------------------------------------------------- 04 core -- */}
        <Beat>
          <Reveal>
            <Tag index="03" label="The alternative" />
          </Reveal>
          <Reveal delay={70}>
            <h2 className="type-settle mt-8 max-w-[12ch] text-major text-bone">
              One core. Everything reads from it.
            </h2>
          </Reveal>
          <Reveal delay={130}>
            <p className="mt-8 max-w-[44ch] text-lede text-quarry-300">
              Not fourteen tools holding fourteen versions of the truth. One
              place your business is described, and every surface — operations,
              automation, intelligence, the customer&apos;s view — reading
              directly from it.
            </p>
          </Reveal>
          <Reveal delay={190}>
            <Link
              href="/capabilities"
              className="group mt-8 inline-flex items-center gap-3 text-[0.9375rem] text-oxide transition-colors hover:text-oxide-bright"
            >
              The five layers
              <Arrow />
            </Link>
          </Reveal>
        </Beat>

        {/* ----------------------------------------------------- 05 deed -- */}
        <Beat align="end">
          <Reveal>
            <Tag index="04" label="The ending" />
          </Reveal>
          <Reveal delay={70}>
            <h2 className="type-settle mt-8 max-w-[14ch] text-major text-bone">
              You get the deed. Not a login.
            </h2>
          </Reveal>
          <Reveal delay={130}>
            <p className="mt-8 max-w-[44ch] text-lede text-quarry-300">
              The code in your repository. The data in your accounts. The
              documentation to run it without us.
            </p>
          </Reveal>
          <Reveal delay={190}>
            <p className="mt-8 font-mono text-sm tracking-[0.04em] text-oxide">
              No licences. No lock-in. No landlord.
            </p>
          </Reveal>
          <Reveal delay={240}>
            <Link
              href="/method#hand-over"
              className="group mt-8 inline-flex items-center gap-3 text-[0.9375rem] text-oxide transition-colors hover:text-oxide-bright"
            >
              What changes hands
              <Arrow />
            </Link>
          </Reveal>
        </Beat>
      </div>

      {/* ================================================ 06 the method === */}
      <section className="relative z-10 border-t border-quarry-800 bg-quarry-950">
        <div className="shell py-28 md:py-36">
          <Reveal>
            <Tag index="05" label="The method" />
          </Reveal>
          <Reveal delay={70}>
            <h2 className="type-settle mt-8 max-w-[16ch] text-major text-bone">
              We never start by building.
            </h2>
          </Reveal>
          <Reveal delay={130}>
            <p className="mt-6 max-w-[52ch] text-lede text-quarry-400">
              Five stages, same order, every time. The first two exist to decide
              whether the last three should happen at all.
            </p>
          </Reveal>

          <ol className="mt-16 grid gap-px border border-quarry-800 bg-quarry-800 sm:grid-cols-2 lg:grid-cols-5">
            {stages.map((stage, i) => (
              <Reveal
                as="li"
                key={stage.code}
                delay={i * 60}
                className="group bg-quarry-950 p-6 transition-colors duration-300 hover:bg-quarry-900 lg:p-7"
              >
                <span className="tag text-oxide">{stage.index}</span>
                <p className="mt-5 text-lg tracking-[-0.02em] text-bone">
                  {stage.code}
                </p>
                <p className="mt-2 font-mono text-xs text-quarry-500">
                  {stage.duration}
                </p>
                <p className="mt-4 text-[0.9375rem] leading-relaxed text-quarry-400">
                  {stage.question}
                </p>
              </Reveal>
            ))}
          </ol>

          <Reveal delay={80}>
            <Link
              href="/method"
              className="group mt-12 inline-flex items-center gap-3 text-[0.9375rem] text-oxide transition-colors hover:text-oxide-bright"
            >
              Walk through it in full
              <Arrow />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ==================================================== 07 the ask === */}
      <section className="relative z-10 overflow-hidden border-t border-quarry-800 bg-quarry-900">
        <div className="gridfilm" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-oxide/50"
        />
        <div className="shell relative py-28 md:py-36">
          <div className="grid gap-14 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <Reveal>
                <Tag index="06" label="The next step" />
              </Reveal>
              <Reveal delay={70}>
                <h2 className="type-settle mt-8 max-w-[15ch] text-major text-bone">
                  Find out what you&apos;re actually renting.
                </h2>
              </Reveal>
              <Reveal delay={130}>
                <p className="mt-8 max-w-[50ch] text-lede text-quarry-300">
                  Every engagement starts with an audit. A real share of them
                  end with us telling a company to change nothing — which is on
                  the table before you write to us.
                </p>
              </Reveal>
              <Reveal delay={190}>
                <div className="mt-12 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <ButtonLink href={ctaHref} size="lg" trailing={<Arrow />}>
                    {ctaLabel}
                  </ButtonLink>
                  <ButtonLink href="/manifesto" size="lg" variant="secondary">
                    Read the manifesto
                  </ButtonLink>
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-4 lg:col-start-9">
              <Reveal delay={150}>
                <p className="tag text-quarry-500">If you want the depth</p>
                <ul className="mt-7 border-t border-quarry-800">
                  {[
                    ["A worked audit, published in full", "/specimen"],
                    ["Build it or rent it — 43 verdicts", "/register"],
                    ["Our commitments and terms", "/standard"],
                    ["The five layers we build", "/capabilities"],
                    ["This site's own specification", "/system"],
                    ["العربية — Arabic edition", "/ar"],
                  ].map(([label, href]) => (
                    <li key={href}>
                      <Link
                        href={href}
                        className="group flex items-center justify-between gap-4 border-b border-quarry-800 py-3.5 text-[0.9375rem] text-quarry-300 transition-colors hover:text-bone"
                      >
                        {label}
                        <Arrow className="text-quarry-600 transition-colors group-hover:text-oxide" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
