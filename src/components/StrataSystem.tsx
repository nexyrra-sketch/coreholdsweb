"use client";

import { useRef, useState } from "react";
import { layers } from "@/data/capabilities";

/**
 * ONE FOUNDATION, FIVE LAYERS
 * ----------------------------------------------------------------------------
 * Drawn as a section through the ground: the core at the base carrying real
 * weight, the customer-facing surface at the top. Read it bottom-up, the way
 * you would read a foundation detail. Implemented as an ARIA tablist with
 * roving focus and arrow-key traversal — the interaction is as deliberate as
 * the drawing.
 */

const strata = [...layers].reverse();

export function StrataSystem() {
  const [active, setActive] = useState(strata.length - 1); // start at the core
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const last = strata.length - 1;
    let next = active;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") next = active === last ? 0 : active + 1;
    else if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = active === 0 ? last : active - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = last;
    else return;
    e.preventDefault();
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  const current = strata[active];

  return (
    <div className="mt-14 grid gap-10 lg:mt-16 lg:grid-cols-12 lg:gap-14">
      <div
        role="tablist"
        aria-label="System layers, from surface to core"
        aria-orientation="vertical"
        onKeyDown={onKeyDown}
        className="lg:col-span-5"
      >
        {strata.map((layer, i) => {
          const selected = i === active;
          const isCore = layer.index === "L1";
          return (
            <button
              key={layer.index}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              role="tab"
              id={`strata-tab-${layer.index}`}
              aria-selected={selected}
              aria-controls={`strata-panel-${layer.index}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(i)}
              className={`group relative block w-full border-l-2 border-t border-t-quarry-800 px-5 text-left transition-[background-color,border-color,padding] duration-300 ease-[cubic-bezier(0.22,0.68,0.24,1)] last:border-b last:border-b-quarry-800 ${
                isCore ? "py-7" : "py-5"
              } ${
                selected
                  ? "border-l-oxide bg-quarry-850"
                  : "border-l-quarry-700 hover:border-l-quarry-500 hover:bg-quarry-900"
              }`}
            >
              <span className="flex items-baseline gap-4">
                <span
                  className={`tag w-7 shrink-0 ${
                    selected ? "text-oxide" : "text-quarry-500"
                  }`}
                >
                  {layer.index}
                </span>
                <span className="min-w-0 flex-1">
                  <span
                    className={`block text-lg tracking-[-0.02em] transition-colors ${
                      selected ? "text-bone" : "text-quarry-200"
                    }`}
                  >
                    {layer.name}
                  </span>
                  <span className="mt-1 block text-sm text-quarry-400">
                    {layer.role}
                  </span>
                </span>
              </span>
              {isCore && (
                <span
                  aria-hidden="true"
                  className="tag absolute right-5 bottom-3 text-quarry-400"
                >
                  Foundation
                </span>
              )}
            </button>
          );
        })}
        <p className="tag mt-4 pl-5 text-quarry-400">
          ↑ Surface · Core ↓ — everything above reads from the layer below
        </p>
      </div>

      {strata.map((layer, i) => (
        <div
          key={layer.index}
          role="tabpanel"
          id={`strata-panel-${layer.index}`}
          aria-labelledby={`strata-tab-${layer.index}`}
          hidden={i !== active}
          tabIndex={0}
          className="lg:col-span-7 lg:col-start-6"
        >
          {i === active && (
            <div className="settle border-t border-quarry-700 pt-8 lg:border-t-0 lg:pt-0">
              <p className="tag text-oxide">
                {layer.index} / {layer.code}
              </p>
              <h3 className="mt-5 text-minor text-bone">{current.name}</h3>
              <p className="mt-5 max-w-[54ch] text-lede text-quarry-300">
                {layer.body}
              </p>

              <ul className="mt-9 space-y-0">
                {layer.examples.map((example) => (
                  <li
                    key={example}
                    className="flex gap-4 border-t border-quarry-800 py-3.5 text-[0.9375rem] text-quarry-200"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-2 h-1.5 w-1.5 shrink-0 bg-oxide"
                    />
                    {example}
                  </li>
                ))}
              </ul>

              <p className="mt-8 border-l-2 border-quarry-700 pl-5 font-mono text-xs leading-relaxed tracking-[0.02em] text-quarry-400">
                <span className="text-quarry-500">TYPICALLY REPLACES — </span>
                {layer.replaces}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
