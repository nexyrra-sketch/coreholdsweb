"use client";

import { useEffect, useState } from "react";

/**
 * FIRST CONTACT
 * ----------------------------------------------------------------------------
 * One second, once per session. The ground is laid, the grid is scribed, the
 * two brackets swing onto the core, and the sheet lifts.
 *
 * Rules it obeys, because an intro that breaks them is an intro that should
 * not exist: it never runs twice in a session, it never runs under
 * prefers-reduced-motion, it can be dismissed by any key or click, it does not
 * trap focus, and the page underneath is fully rendered and interactive the
 * whole time — this is a curtain, not a loader.
 */

const KEY = "corehold:booted";
const LOG = [
  ["GROUND", "ESTABLISHED"],
  ["GRID", "SCRIBED"],
  ["CORE", "HELD"],
];

export function BootSequence() {
  const [state, setState] = useState<"idle" | "playing" | "lifting" | "gone">(
    "idle",
  );

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    try {
      if (window.sessionStorage.getItem(KEY)) return;
      window.sessionStorage.setItem(KEY, "1");
    } catch {
      // Private mode or storage disabled: play once and move on.
    }

    setState("playing");
    const lift = window.setTimeout(() => setState("lifting"), 1250);
    const gone = window.setTimeout(() => setState("gone"), 1950);
    return () => {
      window.clearTimeout(lift);
      window.clearTimeout(gone);
    };
  }, []);

  useEffect(() => {
    if (state !== "playing") return;
    const dismiss = () => setState("lifting");
    window.addEventListener("keydown", dismiss, { once: true });
    window.addEventListener("pointerdown", dismiss, { once: true });
    return () => {
      window.removeEventListener("keydown", dismiss);
      window.removeEventListener("pointerdown", dismiss);
    };
  }, [state]);

  useEffect(() => {
    if (state !== "lifting") return;
    const id = window.setTimeout(() => setState("gone"), 700);
    return () => window.clearTimeout(id);
  }, [state]);

  if (state === "idle" || state === "gone") return null;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-[80] bg-quarry-950 transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.22,0.68,0.24,1)] ${
        state === "lifting"
          ? "-translate-y-full opacity-0"
          : "translate-y-0 opacity-100"
      }`}
    >
      <div className="gridfilm boot-grid" />

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-9">
        <svg viewBox="0 0 32 32" className="h-16 w-16" fill="none">
          <path
            d="M3 13.5V3h10.5"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="square"
            className="boot-bracket text-quarry-500"
            style={{ animationDelay: "80ms" }}
          />
          <path
            d="M29 18.5V29H18.5"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="square"
            className="boot-bracket text-quarry-500"
            style={{ animationDelay: "240ms" }}
          />
          <rect
            x="11"
            y="11"
            width="10"
            height="10"
            fill="currentColor"
            className="boot-core text-oxide"
          />
        </svg>

        <ul className="space-y-2">
          {LOG.map(([term, value], i) => (
            <li
              key={term}
              className="boot-line tag flex items-center gap-3 text-quarry-500"
              style={{ animationDelay: `${420 + i * 150}ms` }}
            >
              <span className="w-14">{term}</span>
              <span className="h-px w-10 bg-quarry-700" />
              <span className="text-quarry-300">{value}</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="tag absolute inset-x-0 bottom-8 text-center text-quarry-700">
        Corehold
      </p>
    </div>
  );
}
