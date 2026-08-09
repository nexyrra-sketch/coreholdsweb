"use client";

import { useEffect, useRef } from "react";

/**
 * THE METER
 * ----------------------------------------------------------------------------
 * A rented stack does not bill you in moments you notice. It bills you
 * continuously, in the background, while you do something else — so this runs
 * continuously, in the background, while you read.
 *
 * The rate is the placeholder stack from our own ledger, and the clock is
 * compressed to one second per day, both stated on the page. It is not a
 * Corehold statistic and it is not pretending to be: it is arithmetic you can
 * check, running in front of you.
 */
export function CostMeter({
  monthly = 11700,
  currency = "AED",
  className,
}: {
  monthly?: number;
  currency?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const perSecond = (monthly * 12) / 365; // one second stands for one day
    const start = performance.now();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const format = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

    if (reduced) {
      node.textContent = `${currency} ${format.format(monthly)}`;
      return;
    }

    let frame = 0;
    let running = true;

    const tick = (now: number) => {
      if (!running) return;
      const elapsed = (now - start) / 1000;
      node.textContent = `${currency} ${format.format(elapsed * perSecond)}`;
      frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);
    return () => {
      running = false;
      window.cancelAnimationFrame(frame);
    };
  }, [monthly, currency]);

  return (
    <span ref={ref} className={`tabular ${className ?? ""}`}>
      {currency} 0
    </span>
  );
}

/**
 * A figure that counts up once, the first time it is looked at. Deliberately
 * not scroll-scrubbed: a number that runs backwards when you scroll up reads
 * as a toy, and this one is meant to land.
 */
export function CountTo({
  value,
  prefix = "",
  duration = 1600,
  className,
}: {
  value: number;
  prefix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const format = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
    const settle = () => {
      node.textContent = `${prefix}${format.format(value)}`;
    };

    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      typeof IntersectionObserver === "undefined"
    ) {
      settle();
      return;
    }

    let frame = 0;
    let start = 0;

    const step = (now: number) => {
      if (!start) start = now;
      const p = Math.min(1, (now - start) / duration);
      // Ease out hard: it sprints, then arrives.
      const eased = 1 - (1 - p) ** 4;
      node.textContent = `${prefix}${format.format(value * eased)}`;
      if (p < 1) frame = window.requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        frame = window.requestAnimationFrame(step);
      },
      { threshold: 0.5 },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [value, prefix, duration]);

  return (
    <span ref={ref} className={`tabular ${className ?? ""}`}>
      {prefix}0
    </span>
  );
}
