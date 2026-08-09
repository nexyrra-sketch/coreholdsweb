import { Reveal } from "./Reveal";
import { stages } from "@/data/method";

/**
 * The method drawn as a single continuous rail. Five stages, one line, no
 * gaps — because the argument is that this is one protocol, not five services
 * a client can pick from. Each node fills as its stage resolves into view.
 */
export function MethodRail({ compact = false }: { compact?: boolean }) {
  return (
    <ol className="relative mt-14 lg:mt-16">
      <span
        aria-hidden="true"
        className="absolute top-2 bottom-2 left-[7px] w-px bg-quarry-700 sm:left-[calc(4rem+7px)]"
      />
      {stages.map((stage, i) => (
        <Reveal
          as="li"
          key={stage.code}
          delay={i * 60}
          className="group relative pb-12 last:pb-0"
        >
          <div className="sm:grid sm:grid-cols-[4rem_1fr] sm:gap-0">
            <div className="hidden sm:block">
              <span className="tag text-quarry-500">{stage.index}</span>
            </div>

            <div className="relative pl-8 sm:pl-8">
              <span
                aria-hidden="true"
                className="absolute top-1.5 left-0 h-[15px] w-[15px] border border-quarry-600 bg-quarry-950 transition-colors duration-700 ease-[cubic-bezier(0.22,0.68,0.24,1)] group-data-[reveal=in]:border-oxide group-data-[reveal=in]:bg-oxide"
              />

              <h3 className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <span className="tag text-oxide sm:hidden">{stage.index}</span>
                <span className="text-2xl font-semibold tracking-[-0.03em] text-bone sm:text-[1.75rem]">
                  {stage.code}
                </span>
                <span className="font-mono text-xs tracking-[0.1em] text-quarry-500 uppercase">
                  {stage.duration}
                </span>
              </h3>

              <p className="mt-3 max-w-[46ch] text-lede text-quarry-200">
                {stage.title}
              </p>

              {!compact && (
                <p className="mt-4 max-w-[62ch] text-[0.9375rem] leading-relaxed text-quarry-400">
                  {stage.body}
                </p>
              )}

              <p className="mt-5 max-w-[58ch] border-l border-quarry-700 pl-4 font-mono text-xs leading-relaxed text-quarry-400">
                {stage.edge}
              </p>
            </div>
          </div>
        </Reveal>
      ))}
    </ol>
  );
}
