"use client";

import { useEffect, useMemo, useRef, useState } from "react";

/**
 * Two cumulative cost curves over the horizon, drawn as an engineering plot
 * rather than a dashboard chart: hairline grid, monospace annotation, no fills,
 * no rounded corners, no tooltip chrome. The lines draw themselves once when
 * the plot first enters view and then hold — they are a statement, not a toy.
 *
 * Everything plotted comes from numbers the visitor typed. There is no Corehold
 * figure anywhere in this component.
 */

const W = 920;
const H = 360;
const PAD = { top: 28, right: 118, bottom: 46, left: 74 };

export type Series = { rent: number[]; own: number[] };

export function OwnershipChart({
  series,
  years,
  currency,
  crossover,
}: {
  series: Series;
  years: number;
  currency: string;
  crossover: number | null;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const node = svgRef.current;
    if (!node) return;
    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setDrawn(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setDrawn(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const geometry = useMemo(() => {
    const max = Math.max(...series.rent, ...series.own, 1);
    const niceMax = niceCeil(max);
    const plotW = W - PAD.left - PAD.right;
    const plotH = H - PAD.top - PAD.bottom;

    const x = (i: number) => PAD.left + (i / years) * plotW;
    const y = (v: number) => PAD.top + plotH - (v / niceMax) * plotH;

    const toPath = (values: number[]) =>
      values.map((v, i) => `${i === 0 ? "M" : "L"}${x(i)} ${y(v)}`).join(" ");

    const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => ({
      value: niceMax * f,
      y: y(niceMax * f),
    }));

    return {
      niceMax,
      x,
      y,
      rentPath: toPath(series.rent),
      ownPath: toPath(series.own),
      ticks,
      plotH,
    };
  }, [series, years]);

  const compact = (v: number) =>
    v >= 1_000_000
      ? `${(v / 1_000_000).toFixed(1)}M`
      : v >= 1000
        ? `${Math.round(v / 1000)}k`
        : String(Math.round(v));

  const endRent = series.rent[years];
  const endOwn = series.own[years];

  return (
    <figure className="mt-10">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`Cumulative cost over ${years} years. Renting reaches ${currency} ${Math.round(endRent).toLocaleString("en-US")}. The ownership scenario you set reaches ${currency} ${Math.round(endOwn).toLocaleString("en-US")}.${crossover ? ` The two cross in year ${crossover}.` : " The two do not cross inside the horizon."}`}
        className="w-full"
      >
        {/* grid */}
        {geometry.ticks.map((tick) => (
          <g key={tick.value}>
            <line
              x1={PAD.left}
              x2={W - PAD.right}
              y1={tick.y}
              y2={tick.y}
              stroke="currentColor"
              strokeWidth="1"
              className="text-limestone-line"
            />
            <text
              x={PAD.left - 12}
              y={tick.y + 4}
              textAnchor="end"
              className="fill-current font-mono text-[11px] text-quarry-600"
            >
              {compact(tick.value)}
            </text>
          </g>
        ))}

        {/* year axis */}
        {Array.from({ length: years + 1 }, (_, i) => (
          <g key={i}>
            <line
              x1={geometry.x(i)}
              x2={geometry.x(i)}
              y1={PAD.top}
              y2={H - PAD.bottom}
              stroke="currentColor"
              strokeWidth="1"
              className="text-limestone-line"
              opacity={i === 0 ? 1 : 0.5}
            />
            <text
              x={geometry.x(i)}
              y={H - PAD.bottom + 22}
              textAnchor="middle"
              className="fill-current font-mono text-[11px] text-quarry-600"
            >
              {i === 0 ? "NOW" : `YR ${i}`}
            </text>
          </g>
        ))}

        {/* crossover */}
        {crossover !== null && (
          <g>
            <line
              x1={geometry.x(crossover)}
              x2={geometry.x(crossover)}
              y1={PAD.top - 10}
              y2={H - PAD.bottom}
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="3 4"
              className="text-oxide-deep"
            />
            <text
              x={geometry.x(crossover) + 8}
              y={PAD.top - 14}
              className="fill-current font-mono text-[11px] tracking-[0.12em] text-oxide-deep"
            >
              BREAK-EVEN
            </text>
          </g>
        )}

        {/* curves */}
        <path
          d={geometry.rentPath}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          className="text-oxide-deep"
          style={{
            strokeDasharray: 3000,
            strokeDashoffset: drawn ? 0 : 3000,
            transition: "stroke-dashoffset 1.6s cubic-bezier(0.22,0.68,0.24,1)",
          }}
        />
        <path
          d={geometry.ownPath}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeDasharray="7 5"
          className="text-quarry-800"
          style={{
            opacity: drawn ? 1 : 0,
            transition: "opacity 0.9s 0.7s cubic-bezier(0.22,0.68,0.24,1)",
          }}
        />

        {/* end markers */}
        <g style={{ opacity: drawn ? 1 : 0, transition: "opacity 0.5s 1.5s" }}>
          <rect
            x={geometry.x(years) - 4}
            y={geometry.y(endRent) - 4}
            width="8"
            height="8"
            className="fill-current text-oxide-deep"
          />
          <text
            x={geometry.x(years) + 12}
            y={geometry.y(endRent) - 2}
            className="fill-current font-mono text-[11px] tracking-[0.1em] text-oxide-deep"
          >
            RENTED
          </text>
          <text
            x={geometry.x(years) + 12}
            y={geometry.y(endRent) + 13}
            className="fill-current font-mono text-[12px] text-quarry-900"
          >
            {compact(endRent)}
          </text>

          <rect
            x={geometry.x(years) - 4}
            y={geometry.y(endOwn) - 4}
            width="8"
            height="8"
            className="fill-current text-quarry-800"
          />
          <text
            x={geometry.x(years) + 12}
            y={geometry.y(endOwn) - 2}
            className="fill-current font-mono text-[11px] tracking-[0.1em] text-quarry-600"
          >
            OWNED
          </text>
          <text
            x={geometry.x(years) + 12}
            y={geometry.y(endOwn) + 13}
            className="fill-current font-mono text-[12px] text-quarry-900"
          >
            {compact(endOwn)}
          </text>
        </g>
      </svg>

      <figcaption className="mt-4 font-mono text-xs leading-relaxed text-quarry-600">
        Cumulative outlay in {currency}. Renting compounds at the escalation you
        set; ownership is the build plus upkeep you set. Both curves are your
        assumptions — Corehold quotes nothing before an audit.
      </figcaption>
    </figure>
  );
}

function niceCeil(value: number) {
  if (value <= 0) return 1;
  const magnitude = 10 ** Math.floor(Math.log10(value));
  const scaled = value / magnitude;
  const step = scaled <= 1 ? 1 : scaled <= 2 ? 2 : scaled <= 5 ? 5 : 10;
  return step * magnitude;
}
