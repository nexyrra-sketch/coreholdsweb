"use client";

import { useRef, useState, type ReactNode } from "react";
import {
  clamp,
  useRafLoop,
  useScrollProgress,
  usePrefersReducedMotion,
} from "@/lib/motion";
import { stages } from "@/data/method";

/**
 * THE CORE SAMPLE
 * ----------------------------------------------------------------------------
 * The method drawn as a borehole. A sticky column on the left is cut through
 * five strata as the stages scroll past it: the bore descends, the depth
 * readout counts, and each stratum takes on weight as it crosses the datum
 * line — the same way you would read a site investigation log.
 *
 * The bore itself is written straight to the DOM from a rAF loop, so scrolling
 * this page never re-renders React. Only the active stratum index is state,
 * and that changes five times in the whole scroll.
 */
export function MethodCore({ children }: { children: ReactNode }) {
  const reduced = usePrefersReducedMotion();
  const { ref, active } = useScrollProgress<HTMLDivElement>();
  const boreRef = useRef<HTMLDivElement>(null);
  const depthRef = useRef<HTMLSpanElement>(null);
  const [index, setIndex] = useState(0);
  const indexRef = useRef(0);

  /**
   * Depth is measured, not interpolated: the datum sits at 42% of the viewport
   * and we ask which stratum is actually crossing it, plus how far through.
   * That keeps the readout, the bore and the highlighted stage in exact
   * agreement — a gauge that disagrees with the thing it is gauging would be
   * a strange feature on this particular website.
   */
  useRafLoop(
    () => {
      const root = ref.current;
      if (!root) return;

      const sections = root.querySelectorAll<HTMLElement>("[data-stage]");
      if (!sections.length) return;

      const datum = window.innerHeight * 0.42;
      let depth = 0;

      for (let i = 0; i < sections.length; i += 1) {
        const rect = sections[i].getBoundingClientRect();
        if (rect.bottom <= datum) {
          depth = i + 1;
        } else if (rect.top <= datum) {
          depth = i + clamp((datum - rect.top) / Math.max(rect.height, 1));
          break;
        } else {
          break;
        }
      }

      depth = Math.min(depth, sections.length);

      if (boreRef.current) {
        boreRef.current.style.height = `${(depth / sections.length) * 100}%`;
      }
      if (depthRef.current) {
        depthRef.current.textContent = `${depth.toFixed(2)} / ${sections.length}.00`;
      }

      const next = Math.min(sections.length - 1, Math.floor(depth));
      if (next !== indexRef.current) {
        indexRef.current = next;
        setIndex(next);
      }
    },
    active,
    !reduced,
  );

  return (
    <div ref={ref} className="shell relative">
      <div className="lg:grid lg:grid-cols-12 lg:gap-14">
        {/* ------------------------------------------------- the borehole -- */}
        <aside
          aria-hidden="true"
          className="pointer-events-none hidden lg:col-span-3 lg:block"
        >
          <div className="sticky top-28 h-[calc(100vh-14rem)] max-h-[38rem] min-h-[24rem] py-4">
            <div className="flex h-full gap-5">
              {/* the cut */}
              <div className="relative w-16 shrink-0 border border-quarry-800 bg-quarry-900/60">
                {/* strata divisions */}
                {stages.map((stage, i) => (
                  <div
                    key={stage.code}
                    className="absolute inset-x-0 border-b border-quarry-800 last:border-b-0"
                    style={{
                      top: `${(i / stages.length) * 100}%`,
                      height: `${100 / stages.length}%`,
                    }}
                  >
                    <span
                      className={`absolute top-1.5 left-1.5 font-mono text-[9px] tracking-[0.14em] transition-colors duration-500 ${
                        i === index ? "text-bone" : "text-quarry-500"
                      }`}
                    >
                      {stage.index}
                    </span>
                  </div>
                ))}

                {/* the bore, filling downward */}
                <div
                  ref={boreRef}
                  className="absolute inset-x-0 top-0 bg-oxide/12"
                  style={{ height: reduced ? "100%" : "0%" }}
                >
                  <span className="absolute inset-x-0 bottom-0 h-px bg-oxide" />
                  <span className="absolute right-0 bottom-0 h-2 w-2 translate-x-1/2 translate-y-1/2 bg-oxide" />
                </div>
              </div>

              {/* the log */}
              <div className="flex min-w-0 flex-1 flex-col justify-between py-1">
                <div>
                  <p className="tag text-quarry-500">Core sample</p>
                  <p className="tag mt-2 tabular text-oxide">
                    <span ref={depthRef}>0.00 / {stages.length}.00</span>
                  </p>
                </div>

                <ol className="space-y-3">
                  {stages.map((stage, i) => (
                    <li
                      key={stage.code}
                      className={`flex items-baseline gap-3 transition-colors duration-500 ${
                        i === index ? "text-bone" : "text-quarry-500"
                      }`}
                    >
                      <span
                        className={`h-px w-4 shrink-0 transition-colors duration-500 ${
                          i <= index ? "bg-oxide" : "bg-quarry-700"
                        }`}
                      />
                      <span className="tag">{stage.code}</span>
                    </li>
                  ))}
                </ol>

                <p className="font-mono text-[10px] leading-relaxed text-quarry-500">
                  Every engagement is cut in this order.
                  <br />
                  No stratum is skipped for speed.
                </p>
              </div>
            </div>
          </div>
        </aside>

        <div className="lg:col-span-9">{children}</div>
      </div>
    </div>
  );
}
