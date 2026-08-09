"use client";

import { useEffect, useState } from "react";

/**
 * MEASURED, NOT CLAIMED
 * ----------------------------------------------------------------------------
 * Every other performance number on the internet is a screenshot of somebody
 * else's lab run. These are taken from the browser you are reading this in,
 * right now, on whatever connection and device you happen to have.
 *
 * That is a genuinely risky thing to publish — on a slow phone on hotel wifi it
 * will not flatter us. Publishing it anyway is the point.
 *
 * Uses PerformanceObserver directly rather than the web-vitals library: three
 * observers, no dependency, and nothing leaves the page.
 */

type Metric = {
  key: string;
  label: string;
  unit: string;
  value: number | null;
  good: number;
  poor: number;
  note: string;
};

const INITIAL: Metric[] = [
  {
    key: "ttfb",
    label: "Time to first byte",
    unit: "ms",
    value: null,
    good: 800,
    poor: 1800,
    note: "How long the server took to start answering.",
  },
  {
    key: "fcp",
    label: "First contentful paint",
    unit: "ms",
    value: null,
    good: 1800,
    poor: 3000,
    note: "When something other than a blank page appeared.",
  },
  {
    key: "lcp",
    label: "Largest contentful paint",
    unit: "ms",
    value: null,
    good: 2500,
    poor: 4000,
    note: "When the main content of this page finished rendering.",
  },
  {
    key: "cls",
    label: "Cumulative layout shift",
    unit: "",
    value: null,
    good: 0.1,
    poor: 0.25,
    note: "How much the page moved under you while it loaded.",
  },
  {
    key: "inp",
    label: "Longest interaction",
    unit: "ms",
    value: null,
    good: 200,
    poor: 500,
    note: "The slowest response to anything you have done on this page.",
  },
];

function grade(metric: Metric) {
  if (metric.value === null) return { label: "—", tone: "text-quarry-500" };
  if (metric.value <= metric.good) return { label: "Good", tone: "text-oxide" };
  if (metric.value <= metric.poor)
    return { label: "Needs work", tone: "text-quarry-300" };
  return { label: "Poor", tone: "text-quarry-300" };
}

function format(metric: Metric) {
  if (metric.value === null) return "—";
  if (metric.key === "cls") return metric.value.toFixed(3);
  return `${Math.round(metric.value)}`;
}

export function LiveVitals() {
  const [metrics, setMetrics] = useState<Metric[]>(INITIAL);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    if (typeof PerformanceObserver === "undefined") {
      setSupported(false);
      return;
    }

    const set = (key: string, value: number) =>
      setMetrics((prev) =>
        prev.map((m) => (m.key === key ? { ...m, value } : m)),
      );

    const observers: PerformanceObserver[] = [];
    const observe = (type: string, handler: (list: PerformanceObserverEntryList) => void) => {
      try {
        const observer = new PerformanceObserver(handler);
        observer.observe({ type, buffered: true } as PerformanceObserverInit);
        observers.push(observer);
      } catch {
        /* This entry type is not supported in this engine. Fine. */
      }
    };

    const nav = performance.getEntriesByType(
      "navigation",
    )[0] as PerformanceNavigationTiming | undefined;
    if (nav) set("ttfb", nav.responseStart);

    observe("paint", (list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === "first-contentful-paint") set("fcp", entry.startTime);
      }
    });

    observe("largest-contentful-paint", (list) => {
      const entries = list.getEntries();
      const last = entries[entries.length - 1];
      if (last) set("lcp", last.startTime);
    });

    let cls = 0;
    observe("layout-shift", (list) => {
      for (const entry of list.getEntries() as (PerformanceEntry & {
        value: number;
        hadRecentInput: boolean;
      })[]) {
        if (!entry.hadRecentInput) cls += entry.value;
      }
      set("cls", cls);
    });

    let longest = 0;
    observe("event", (list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > longest) longest = entry.duration;
      }
      if (longest > 0) set("inp", longest);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <div className="mt-14">
      <div className="grid gap-px border border-quarry-800 bg-quarry-800 sm:grid-cols-2 lg:grid-cols-5">
        {metrics.map((metric) => {
          const g = grade(metric);
          return (
            <div key={metric.key} className="bg-quarry-950 p-6">
              <p className="tag text-quarry-500">{metric.label}</p>
              <p className="tabular mt-4 font-mono text-2xl text-bone">
                {format(metric)}
                {metric.unit && (
                  <span className="ml-1 text-sm text-quarry-500">
                    {metric.unit}
                  </span>
                )}
              </p>
              <p className={`tag mt-3 ${g.tone}`}>{g.label}</p>
              <p className="mt-4 text-[0.8125rem] leading-relaxed text-quarry-400">
                {metric.note}
              </p>
            </div>
          );
        })}
      </div>

      <p aria-live="polite" className="sr-only">
        {metrics
          .filter((m) => m.value !== null)
          .map((m) => `${m.label}: ${format(m)} ${m.unit}`)
          .join(". ")}
      </p>

      <p className="mt-6 max-w-[74ch] font-mono text-xs leading-relaxed text-quarry-500">
        {supported
          ? "Measured in your browser, on your connection, on this page load. Nothing is sent anywhere — these numbers exist only in this tab. Interact with the page and the last figure will update."
          : "Your browser does not expose the performance observers these figures come from, so there is nothing honest to display here."}
      </p>
    </div>
  );
}
