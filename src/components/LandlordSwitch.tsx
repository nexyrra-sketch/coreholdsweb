"use client";

import { useEffect, useRef, useState } from "react";
import { playDrop } from "@/lib/audio";
import { usePrefersReducedMotion } from "@/lib/motion";

/**
 * THE LANDLORD SWITCH
 * ----------------------------------------------------------------------------
 * One gesture that makes the whole argument physical.
 *
 * Two identical systems are running. The visitor stops paying. One of them
 * goes out, line by line, and stamps itself REVOKED. The other does not react,
 * because there is nobody on the outside with a switch to throw.
 *
 * The sequence is staged rather than instant on purpose — watching it happen
 * row by row is the point. Under prefers-reduced-motion the same end state is
 * reached immediately, and the outcome is announced to assistive technology
 * either way.
 */

const ROWS = [
  { label: "Customer records", value: "12,480", dead: "— — —" },
  { label: "Automations running", value: "36 active", dead: "halted" },
  { label: "Documents & history", value: "8.2 GB", dead: "withheld" },
  { label: "Team seats", value: "24", dead: "locked" },
  { label: "Live integrations", value: "9 connected", dead: "severed" },
];

const STEP_MS = 420;

export function LandlordSwitch() {
  const reduced = usePrefersReducedMotion();
  const [killed, setKilled] = useState(false);
  const [step, setStep] = useState(0);
  const timers = useRef<number[]>([]);

  const clearTimers = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };

  useEffect(() => clearTimers, []);

  const toggle = () => {
    clearTimers();

    if (killed) {
      setKilled(false);
      setStep(0);
      return;
    }

    setKilled(true);
    playDrop();

    if (reduced) {
      setStep(ROWS.length + 1);
      return;
    }

    for (let i = 1; i <= ROWS.length + 1; i += 1) {
      timers.current.push(
        window.setTimeout(() => setStep(i), i * STEP_MS),
      );
    }
  };

  const terminated = step > ROWS.length;

  return (
    <div className="mt-14 lg:mt-16">
      <div className="grid gap-px border border-quarry-800 bg-quarry-800 lg:grid-cols-2">
        {/* ------------------------------------------------------ RENTED ---- */}
        <div
          className={`relative overflow-hidden bg-quarry-950 p-7 transition-colors duration-700 ease-[cubic-bezier(0.22,0.68,0.24,1)] sm:p-9 ${
            terminated ? "bg-quarry-900/40" : ""
          }`}
        >
          <div className="flex items-center justify-between gap-4">
            <p className="tag text-quarry-400">Rented</p>
            <p
              className={`tag flex items-center gap-2 transition-colors duration-500 ${
                killed ? "text-quarry-600" : "text-oxide"
              }`}
            >
              <span
                aria-hidden="true"
                className={`inline-block h-1.5 w-1.5 transition-colors duration-500 ${
                  killed ? "bg-quarry-600" : "datum-pulse bg-oxide"
                }`}
              />
              {killed ? "Offline" : "Live"}
            </p>
          </div>

          <ul className="mt-7 border-t border-quarry-800">
            {ROWS.map((row, i) => {
              const down = step > i;
              return (
                <li
                  key={row.label}
                  className="relative flex items-baseline justify-between gap-6 border-b border-quarry-800 py-4"
                >
                  <span
                    className={`text-[0.9375rem] transition-all duration-500 ease-[cubic-bezier(0.22,0.68,0.24,1)] ${
                      down
                        ? "translate-x-1 text-quarry-600 line-through decoration-quarry-700"
                        : "text-quarry-200"
                    }`}
                  >
                    {row.label}
                  </span>
                  <span
                    className={`tabular font-mono text-sm transition-colors duration-500 ${
                      down ? "text-quarry-600" : "text-bone"
                    }`}
                  >
                    {down ? row.dead : row.value}
                  </span>
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none absolute inset-y-0 left-0 w-full origin-left bg-quarry-950/70 transition-transform duration-500 ease-[cubic-bezier(0.22,0.68,0.24,1)] ${
                      down ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                </li>
              );
            })}
          </ul>

          <div
            className={`mt-7 border transition-all duration-700 ease-[cubic-bezier(0.22,0.68,0.24,1)] ${
              terminated
                ? "border-oxide/60 bg-oxide/8 opacity-100"
                : "border-transparent opacity-0"
            }`}
          >
            <p className="tag px-4 py-3 text-oxide">Access terminated</p>
            <p className="border-t border-oxide/25 px-4 py-3 font-mono text-xs leading-relaxed text-quarry-300">
              Your data is still there. It is simply not yours to reach. Years
              of payments bought access, and access is what just ended.
            </p>
          </div>
        </div>

        {/* ------------------------------------------------------- OWNED ---- */}
        <div className="relative overflow-hidden bg-quarry-950 p-7 sm:p-9">
          <div className="flex items-center justify-between gap-4">
            <p className="tag text-quarry-400">Owned</p>
            <p className="tag flex items-center gap-2 text-oxide">
              <span
                aria-hidden="true"
                className="datum-pulse inline-block h-1.5 w-1.5 bg-oxide"
              />
              Live
            </p>
          </div>

          <ul className="mt-7 border-t border-quarry-800">
            {ROWS.map((row) => (
              <li
                key={row.label}
                className="flex items-baseline justify-between gap-6 border-b border-quarry-800 py-4"
              >
                <span className="text-[0.9375rem] text-quarry-200">
                  {row.label}
                </span>
                <span className="tabular font-mono text-sm text-bone">
                  {row.value}
                </span>
              </li>
            ))}
          </ul>

          <div
            className={`mt-7 border transition-all duration-700 ease-[cubic-bezier(0.22,0.68,0.24,1)] ${
              terminated
                ? "border-quarry-700 opacity-100"
                : "border-transparent opacity-0"
            }`}
          >
            <p className="tag px-4 py-3 text-quarry-300">Unaffected</p>
            <p className="border-t border-quarry-800 px-4 py-3 font-mono text-xs leading-relaxed text-quarry-400">
              Nothing happened here. There is no licence to lapse, no account to
              suspend, and nobody outside the company holding a switch.
            </p>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------- CONTROL --- */}
      <div className="flex flex-col items-start gap-5 border border-t-0 border-quarry-800 bg-quarry-900 px-7 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-9">
        <div>
          <p className="text-[0.9375rem] text-bone">
            {killed
              ? "That is the whole difference, in one switch."
              : "Both systems are running. Now stop paying."}
          </p>
          <p className="mt-1.5 font-mono text-xs text-quarry-400">
            {killed
              ? "Nothing on the right needed your subscription to keep working."
              : "Nobody plans for this. Everybody is exposed to it."}
          </p>
        </div>

        <button
          type="button"
          onClick={toggle}
          aria-pressed={killed}
          className="group inline-flex shrink-0 items-center gap-4 rounded-[2px] border border-quarry-600 bg-quarry-950 py-3 pr-5 pl-4 transition-colors duration-200 hover:border-oxide"
        >
          <span
            aria-hidden="true"
            className={`relative inline-flex h-6 w-11 items-center rounded-[2px] border transition-colors duration-300 ${
              killed ? "border-oxide bg-oxide/20" : "border-quarry-600"
            }`}
          >
            <span
              className={`absolute top-1/2 h-4 w-4 -translate-y-1/2 transition-all duration-300 ease-[cubic-bezier(0.22,0.68,0.24,1)] ${
                killed ? "left-[calc(100%-1.125rem)] bg-oxide" : "left-0.5 bg-quarry-500"
              }`}
            />
          </span>
          <span className="tag text-bone">
            {killed ? "Resume payment" : "Stop paying"}
          </span>
        </button>
      </div>

      <p role="status" aria-live="polite" className="sr-only">
        {terminated
          ? "Payment stopped. The rented system has revoked access to customer records, automations, documents, seats and integrations. The owned system is unaffected and still running."
          : killed
            ? "Payment stopped. The rented system is shutting down."
            : "Both systems are running normally."}
      </p>
    </div>
  );
}
