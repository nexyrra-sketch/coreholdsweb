"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

/**
 * Navigation, drawn.
 *
 * Rather than fade the page, a single oxide rule sweeps across the top edge —
 * a plotter starting the next sheet. It is 620ms, it never blocks input, and
 * it is skipped entirely on first paint and under prefers-reduced-motion.
 *
 * This is deliberately hand-rolled rather than built on the View Transitions
 * API: that API is still unevenly implemented across engines, and a studio
 * that promises the same result in every browser should not ship a headline
 * behaviour that only two of them can perform.
 */
export function RouteTransition() {
  const pathname = usePathname();
  const first = useRef(true);
  const [key, setKey] = useState(0);

  useEffect(() => {
    const arabic = pathname === "/ar" || pathname.startsWith("/ar/");
    document.documentElement.lang = arabic ? "ar" : "en";
    document.documentElement.dir = arabic ? "rtl" : "ltr";
  }, [pathname]);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setKey((k) => k + 1);
  }, [pathname]);

  if (key === 0) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-px"
    >
      <span key={key} className="route-sweep block h-px w-full bg-oxide" />
    </div>
  );
}
