"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Mark } from "./Logo";
import { ButtonLink, Arrow } from "./Button";
import { clamp, usePrefersReducedMotion } from "@/lib/motion";
import { ctaHref, ctaLabel } from "@/lib/site";

/**
 * THE MANIFESTO
 * ----------------------------------------------------------------------------
 * A title sequence, not a landing page. Eight chapters, each held for the
 * length of a scroll, the ground inverting between quarry and limestone as the
 * argument turns. Typography is the only visual element on the page.
 *
 * One rAF loop measures every chapter and writes opacity, translate and — the
 * part worth noticing — letter-spacing straight to the DOM. Statements arrive
 * fractionally loose and tighten as they settle, the way a word looks when it
 * finally lands. No React render happens while scrolling.
 *
 * Under prefers-reduced-motion the whole thing degrades to exactly what it is
 * underneath: a short, well-set document you can read top to bottom.
 */

type Chapter = {
  index: string;
  ground: "dark" | "light" | "signal";
  lead?: string;
  lines: string[];
  tail?: string;
};

const CHAPTERS: Chapter[] = [
  {
    index: "01",
    ground: "dark",
    lead: "Start here",
    lines: ["Every month,", "the bills renew."],
    tail: "And every year, the total is larger than the year before.",
  },
  {
    index: "02",
    ground: "dark",
    lead: "How it happens",
    lines: ["Nobody decides", "to become a tenant."],
    tail: "It accumulates. One reasonable decision at a time, each defensible on the day it was made.",
  },
  {
    index: "03",
    ground: "light",
    lead: "The distinction",
    lines: ["A subscription", "buys access.", "It never buys equity."],
    tail: "You can pay for a decade and hold nothing at the end of it.",
  },
  {
    index: "04",
    ground: "dark",
    lead: "The position you end up in",
    lines: ["Stop paying,", "and it switches off."],
    tail: "Your data is still there. It is simply not yours to reach.",
  },
  {
    index: "05",
    ground: "light",
    lead: "The comparison that matters",
    lines: ["Two companies.", "Same market.", "Same price."],
    tail: "One of them owns the machinery underneath. That one moves faster, spends less over time, and waits for nobody's roadmap.",
  },
  {
    index: "06",
    ground: "dark",
    lead: "The whole argument",
    lines: ["Renting keeps", "you average.", "Owning compounds."],
    tail: "Software you rent is a cost. Systems you own are a position.",
  },
  {
    index: "07",
    ground: "dark",
    lead: "What we do about it",
    lines: ["We build the core.", "You hold it."],
    tail: "The code, the data, the infrastructure and the documentation. No licences. No lock-in. No landlord.",
  },
  {
    index: "08",
    ground: "signal",
    lines: ["Own the system", "your business runs on.", "Stop renting it."],
  },
];

export function Manifesto() {
  const reduced = usePrefersReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);

  useEffect(() => {
    if (reduced) return;
    const root = rootRef.current;
    if (!root) return;

    let frame = 0;
    let running = true;

    const tick = () => {
      if (!running) return;
      const vh = window.innerHeight;
      const chapters = root.querySelectorAll<HTMLElement>("[data-chapter]");
      let current = 0;

      chapters.forEach((chapter, i) => {
        const rect = chapter.getBoundingClientRect();
        const travel = Math.max(1, rect.height - vh);
        const q = clamp(-rect.top / travel);
        const onScreen = rect.top < vh && rect.bottom > 0;

        if (rect.top <= vh * 0.5 && rect.bottom > vh * 0.5) current = i;
        if (!onScreen) return;

        // In over the first sixth, out over the last sixth, held in between.
        const enter = clamp(q / 0.16);
        const exit = 1 - clamp((q - 0.84) / 0.16);
        const presence = Math.min(enter, exit);

        const stage = chapter.querySelector<HTMLElement>("[data-stage]");
        if (stage) {
          stage.style.opacity = String(presence);
          stage.style.transform = `translate3d(0, ${(1 - presence) * 18}px, 0)`;
        }

        // The typographic move: statements arrive fractionally loose and
        // tighten as they land.
        const lines = chapter.querySelectorAll<HTMLElement>("[data-line]");
        lines.forEach((line, k) => {
          const stagger = clamp((q - k * 0.045) / 0.2);
          line.style.letterSpacing = `${(-0.035 + (1 - stagger) * 0.05).toFixed(4)}em`;
          line.style.opacity = String(Math.min(presence, 0.25 + stagger * 0.75));
        });
      });

      if (current !== activeRef.current) {
        activeRef.current = current;
        setActive(current);
      }

      const total = root.scrollHeight - window.innerHeight;
      const scrolled = clamp(-root.getBoundingClientRect().top / Math.max(total, 1));
      if (railRef.current) {
        railRef.current.style.transform = `scaleY(${scrolled})`;
      }

      frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);
    return () => {
      running = false;
      window.cancelAnimationFrame(frame);
    };
  }, [reduced]);

  return (
    <div ref={rootRef} className="relative">
      {/* chapter rail — desktop only, decorative */}
      {!reduced && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed top-1/2 left-6 z-30 hidden -translate-y-1/2 lg:block xl:left-10"
        >
          <div className="relative h-56 w-px bg-current text-quarry-700">
            <span
              ref={railRef}
              className="absolute inset-x-0 top-0 h-full origin-top bg-oxide"
              style={{ transform: "scaleY(0)" }}
            />
          </div>
          <p className="tag mt-5 -rotate-90 origin-left translate-y-8 whitespace-nowrap text-quarry-500">
            {CHAPTERS[active].index} / {CHAPTERS.length}
          </p>
        </div>
      )}

      {CHAPTERS.map((chapter, chapterIndex) => {
        const isSignal = chapter.ground === "signal";
        const isLight = chapter.ground === "light";
        // The opening statement is the page's h1; the rest are h2s, so the
        // document has one outline rather than eight orphaned headings.
        const Heading = chapterIndex === 0 ? "h1" : "h2";
        return (
          <section
            key={chapter.index}
            {...(isSignal ? {} : { "data-chapter": chapter.index })}
            data-ground={isLight ? "light" : "dark"}
            aria-label={`Chapter ${chapter.index}`}
            className={`relative ${reduced || isSignal ? "" : "h-[220vh]"} ${
              isSignal
                ? "bg-oxide text-quarry-950"
                : isLight
                  ? "bg-limestone text-quarry-950"
                  : "bg-quarry-950 text-bone"
            }`}
          >
            <div
              className={`${
                reduced
                  ? "py-24"
                  : isSignal
                    ? "flex min-h-[86vh] items-center py-28"
                    : "sticky top-0 flex h-screen min-h-[34rem] items-center overflow-hidden"
              }`}
            >
              {!isSignal && (
                <div
                  className={`gridfilm ${isLight ? "gridfilm--light" : ""} opacity-70`}
                />
              )}

              <div className="shell relative w-full">
                <div
                  data-stage
                  style={reduced || isSignal ? undefined : { opacity: 0 }}
                  className="max-w-[24ch]"
                >
                  {chapter.lead && (
                    <p
                      className={`tag mb-8 flex items-center gap-3 ${
                        isLight ? "text-quarry-600" : isSignal ? "text-quarry-950" : "text-quarry-500"
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className={`inline-block h-1.5 w-1.5 ${
                          isSignal ? "bg-quarry-950" : "bg-oxide"
                        }`}
                      />
                      {chapter.index} — {chapter.lead}
                    </p>
                  )}

                  <Heading className="text-mega">
                    {chapter.lines.map((line, i) => (
                      <span
                        key={line}
                        data-line
                        className="block"
                        style={
                          reduced || isSignal
                            ? undefined
                            : { letterSpacing: "0.015em", opacity: 0.25 }
                        }
                      >
                        {i === chapter.lines.length - 1 && !isSignal ? (
                          <span className={isLight ? "text-quarry-600" : "text-quarry-500"}>
                            {line}
                          </span>
                        ) : (
                          line
                        )}
                      </span>
                    ))}
                  </Heading>

                  {chapter.tail && (
                    <p
                      className={`mt-10 max-w-[46ch] text-lede ${
                        isLight ? "text-quarry-700" : "text-quarry-300"
                      }`}
                    >
                      {chapter.tail}
                    </p>
                  )}

                  {isSignal && (
                    <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center">
                      <ButtonLink
                        href={ctaHref}
                        size="lg"
                        variant="secondary"
                        ground="light"
                        className="border-quarry-950/40 text-quarry-950 hover:border-quarry-950 hover:bg-quarry-950/10"
                      >
                        {ctaLabel}
                        <Arrow />
                      </ButtonLink>
                      <Link
                        href="/specimen"
                        className="text-[0.9375rem] text-quarry-950 underline underline-offset-4 hover:no-underline"
                      >
                        Or see a worked audit first
                      </Link>
                    </div>
                  )}

                  {isSignal && (
                    <Mark
                      className="mt-16 h-8 w-8 text-quarry-950"
                      title="Corehold"
                    />
                  )}
                </div>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
