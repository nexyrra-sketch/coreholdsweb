"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  clamp,
  easeStructural,
  lerp,
  mulberry32,
  range,
  resolvedFont,
  useCanvasSize,
  usePrefersReducedMotion,
  useRafLoop,
  useScrollProgress,
} from "@/lib/motion";

/**
 * THE DEPENDENCY GRAPH
 * ----------------------------------------------------------------------------
 * The argument of this entire site, drawn rather than written.
 *
 * The visitor scrolls and watches fourteen rented providers — jittering,
 * cross-wired, with manual work visibly crawling along the bridges between
 * them — collapse into a single core with clean radial reads. No copy is doing
 * the work here; the geometry is.
 *
 * Implementation notes, since this is the part people open the source for:
 *   · Hand-written canvas 2D. No animation library, no physics engine, no
 *     WebGL. The whole piece costs about four kilobytes.
 *   · Seeded PRNG, so the "mess" is identical on every load and every device.
 *     A brand built on determinism should not shuffle itself per visitor.
 *   · The rAF loop is gated by an IntersectionObserver: off-screen, it stops.
 *     Scroll position is read into a ref, never into state, so scrolling never
 *     triggers a React render.
 *   · prefers-reduced-motion collapses the whole thing to a single composed
 *     frame of the resolved state, and the section stops being scroll-driven.
 */

const NODES = [
  "CRM",
  "BILLING",
  "DOCS",
  "CHAT",
  "FORMS",
  "ANALYTICS",
  "AI ASSIST",
  "CALENDAR",
  "HR",
  "INVENTORY",
  "EMAIL",
  "STORAGE",
  "SUPPORT",
  "AUTOMATION",
];

type Node = {
  label: string;
  chaosX: number;
  chaosY: number;
  orderAngle: number;
  phase: number;
  drift: number;
};

type Edge = { a: number; b: number; broken: boolean; carrier: number };

function buildModel() {
  const rand = mulberry32(0xc0e40d);
  const n = NODES.length;

  const nodes: Node[] = NODES.map((label, i) => {
    // A deliberately uneven scatter: real stacks cluster and leave holes.
    const a = rand() * Math.PI * 2;
    const r = 0.34 + rand() * 0.62;
    return {
      label,
      chaosX: Math.cos(a) * r * (1.32 + rand() * 0.24),
      chaosY: Math.sin(a) * r * (0.92 + rand() * 0.2),
      orderAngle: (i / n) * Math.PI * 2 - Math.PI / 2,
      phase: rand() * Math.PI * 2,
      drift: 0.5 + rand(),
    };
  });

  const edges: Edge[] = [];
  const seen = new Set<string>();
  for (let i = 0; i < 26; i += 1) {
    const a = Math.floor(rand() * n);
    let b = Math.floor(rand() * n);
    if (b === a) b = (b + 1 + Math.floor(rand() * (n - 1))) % n;
    const key = a < b ? `${a}:${b}` : `${b}:${a}`;
    if (seen.has(key)) continue;
    seen.add(key);
    edges.push({ a, b, broken: rand() < 0.34, carrier: rand() });
  }

  return { nodes, edges };
}

const MODEL = buildModel();

const INK = {
  ground: "#0b0d0c",
  hair: "#3d4642",
  node: "#8d948f",
  nodeLive: "#e8e7e1",
  label: "#949b95",
  oxide: "#d9622b",
};

export function DependencyGraph({ index = "02" }: { index?: string }) {
  const reduced = usePrefersReducedMotion();
  const { ref: sectionRef, progress, active } = useScrollProgress<HTMLDivElement>();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fontProbe = useRef<HTMLSpanElement>(null);
  const readout = useRef<HTMLSpanElement>(null);
  const size = useCanvasSize(canvasRef);
  const [phase, setPhase] = useState<"stack" | "system">("stack");
  const phaseRef = useRef<"stack" | "system">("stack");

  const draw = useCallback(
    (p: number, time: number) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;

      const { width: w, height: h, dpr } = size.current;
      if (!w || !h) return;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      // The composition is deliberately off-centre on wide screens: the left
      // third belongs to the argument, the right two thirds to the drawing.
      const wide = w >= 1024;
      const cx = wide ? w * 0.63 : w * 0.5;
      const cy = wide ? h * 0.5 : h * 0.34;
      const scale = wide
        ? Math.min(w * 0.34, h * 0.42)
        : Math.min(w * 0.35, h * 0.26);
      const mono = resolvedFont(fontProbe.current, "monospace");

      // Motion budget: everything downstream reads from these three numbers.
      const settle = easeStructural(range(p, 0.18, 0.66));
      const chaos = 1 - settle;
      const spokes = range(p, 0.48, 0.78);
      const coreSize = easeStructural(range(p, 0.38, 0.7));
      const t = reduced ? 0 : time / 1000;

      const positions = MODEL.nodes.map((node) => {
        const jitter = chaos * 7;
        const jx = Math.sin(t * 0.7 * node.drift + node.phase) * jitter;
        const jy = Math.cos(t * 0.55 * node.drift + node.phase * 1.7) * jitter;
        const chaosX = cx + node.chaosX * scale + jx;
        const chaosY = cy + node.chaosY * scale + jy;
        const orderX = cx + Math.cos(node.orderAngle) * scale * 1.08;
        const orderY = cy + Math.sin(node.orderAngle) * scale * 1.08;
        return {
          x: lerp(chaosX, orderX, settle),
          y: lerp(chaosY, orderY, settle),
        };
      });

      // ---- the tangle -------------------------------------------------------
      const tangle = clamp(1 - range(p, 0.14, 0.5));
      if (tangle > 0.01) {
        for (const edge of MODEL.edges) {
          const a = positions[edge.a];
          const b = positions[edge.b];
          ctx.globalAlpha = tangle * (edge.broken ? 0.72 : 1);
          ctx.strokeStyle = INK.hair;
          ctx.lineWidth = 1;

          if (edge.broken) {
            // A bridge that does not actually connect: the manual step.
            const gap = 0.13 + Math.sin(t * 1.4 + edge.carrier * 9) * 0.03;
            const mx = lerp(a.x, b.x, 0.5);
            const my = lerp(a.y, b.y, 0.5);
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(lerp(a.x, mx, 1 - gap), lerp(a.y, my, 1 - gap));
            ctx.moveTo(lerp(b.x, mx, 1 - gap), lerp(b.y, my, 1 - gap));
            ctx.lineTo(b.x, b.y);
            ctx.stroke();

            // The person carrying the data across the gap, by hand.
            const carry = (t * 0.22 + edge.carrier) % 1;
            const px = lerp(a.x, b.x, carry);
            const py = lerp(a.y, b.y, carry);
            ctx.globalAlpha = tangle * 0.85;
            ctx.fillStyle = INK.oxide;
            ctx.fillRect(px - 1.5, py - 1.5, 3, 3);
          } else {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // ---- the resolved reads ----------------------------------------------
      if (spokes > 0.01) {
        ctx.globalAlpha = spokes * 0.55;
        ctx.strokeStyle = INK.node;
        ctx.lineWidth = 1;
        for (const pos of positions) {
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(pos.x, pos.y);
          ctx.stroke();
        }

        // Live reads travelling in from every surface to the core.
        const beat = (time / 2600) % 1;
        ctx.fillStyle = INK.oxide;
        positions.forEach((pos, i) => {
          const travel = (beat + i / positions.length) % 1;
          const px = lerp(pos.x, cx, travel);
          const py = lerp(pos.y, cy, travel);
          ctx.globalAlpha = spokes * (1 - Math.abs(travel - 0.5) * 1.6) * 0.9;
          if (ctx.globalAlpha > 0) ctx.fillRect(px - 1.5, py - 1.5, 3, 3);
        });

        // The orbit the surfaces settle onto.
        ctx.globalAlpha = spokes * 0.25;
        ctx.strokeStyle = INK.hair;
        ctx.beginPath();
        ctx.arc(cx, cy, scale * 1.08, 0, Math.PI * 2);
        ctx.stroke();
      }

      // ---- the core ---------------------------------------------------------
      if (coreSize > 0.001) {
        const s = 30 * coreSize;
        ctx.globalAlpha = 1;
        ctx.fillStyle = INK.oxide;
        ctx.fillRect(cx - s / 2, cy - s / 2, s, s);

        const brace = 24 + s;
        ctx.globalAlpha = coreSize * 0.85;
        ctx.strokeStyle = INK.node;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx - brace / 2, cy - brace / 2 + 12);
        ctx.lineTo(cx - brace / 2, cy - brace / 2);
        ctx.lineTo(cx - brace / 2 + 12, cy - brace / 2);
        ctx.moveTo(cx + brace / 2, cy + brace / 2 - 12);
        ctx.lineTo(cx + brace / 2, cy + brace / 2);
        ctx.lineTo(cx + brace / 2 - 12, cy + brace / 2);
        ctx.stroke();
      }

      // ---- the providers ----------------------------------------------------
      ctx.font = `500 9px ${mono}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      if ("letterSpacing" in ctx) {
        (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing =
          "1.4px";
      }

      MODEL.nodes.forEach((node, i) => {
        const pos = positions[i];
        const box = 9;
        ctx.globalAlpha = 1;
        ctx.strokeStyle = settle > 0.6 ? INK.nodeLive : INK.node;
        ctx.lineWidth = 1;
        ctx.strokeRect(pos.x - box / 2, pos.y - box / 2, box, box);

        ctx.globalAlpha = 0.55 + settle * 0.45;
        ctx.fillStyle = settle > 0.6 ? INK.nodeLive : INK.label;
        ctx.fillText(node.label, pos.x, pos.y + 17);
      });

      ctx.globalAlpha = 1;

      if (readout.current) {
        const pct = Math.round(clamp(p) * 100);
        const filled = Math.round(clamp(p) * 16);
        readout.current.textContent = `${"▓".repeat(filled)}${"░".repeat(16 - filled)}  ${String(pct).padStart(3, " ")}%`;
      }

      const next = p > 0.52 ? "system" : "stack";
      if (next !== phaseRef.current) {
        phaseRef.current = next;
        setPhase(next);
      }
    },
    [reduced, size],
  );

  useRafLoop(
    (time) => draw(progress.current, time),
    active,
    !reduced,
  );

  // Reduced motion, or first paint before any scroll: one composed frame.
  useEffect(() => {
    if (reduced) {
      const id = window.setTimeout(() => draw(1, 0), 60);
      return () => window.clearTimeout(id);
    }
    const id = window.setTimeout(() => draw(progress.current, 0), 60);
    return () => window.clearTimeout(id);
  }, [reduced, draw, progress]);

  useEffect(() => {
    if (reduced) setPhase("system");
  }, [reduced]);

  return (
    <section
      className="relative border-t border-quarry-800 bg-quarry-950"
      aria-labelledby="graph-heading"
    >
      <span
        ref={fontProbe}
        aria-hidden="true"
        className="pointer-events-none absolute font-mono opacity-0"
      >
        .
      </span>

      <div
        ref={sectionRef}
        className={reduced ? "relative" : "relative h-[300vh]"}
      >
        <div
          className={`${reduced ? "" : "sticky top-0 flex h-screen min-h-[40rem] flex-col justify-center"} overflow-hidden`}
        >
          <div className="gridfilm opacity-60" />

          <canvas
            ref={canvasRef}
            role="img"
            aria-label="A diagram of fourteen rented software providers cross-wired to each other, with manual work crawling along the broken bridges between them, resolving into a single owned core that every surface reads from directly."
            className={`absolute inset-0 h-full w-full ${reduced ? "relative h-[34rem]" : ""}`}
          />

          <div className="shell relative pointer-events-none">
            <div className="flex min-h-[24rem] flex-col justify-between gap-10 py-16 md:min-h-[30rem]">
              <div className="max-w-[26rem]">
                <p className="tag flex items-center gap-3 text-oxide">
                  <span
                    aria-hidden="true"
                    className="inline-block h-1.5 w-1.5 bg-oxide"
                  />
                  {index} / {phase === "stack" ? "Observed" : "Proposed"}
                </p>

                <h2
                  id="graph-heading"
                  className="mt-6 text-major text-bone"
                  aria-live="off"
                >
                  {phase === "stack" ? "This is a stack." : "This is a system."}
                </h2>

                <p className="mt-6 max-w-[36ch] text-[0.9375rem] leading-relaxed text-quarry-300">
                  {phase === "stack"
                    ? "Fourteen providers. Nine of them hold a piece of the same customer record. The orange marks are people, carrying data across the gaps by hand, every week, forever."
                    : "One core the business is described in. Every surface reads from it directly. There are no gaps left to carry anything across."}
                </p>
              </div>

              <div className="flex flex-wrap items-end justify-between gap-6">
                <p className="tag max-w-[26ch] text-quarry-500">
                  Scroll to collapse the stack
                </p>
                <p className="tag tabular text-quarry-500">
                  <span className="text-quarry-600">COLLAPSE&nbsp;&nbsp;</span>
                  <span ref={readout}>░░░░░░░░░░░░░░░░&nbsp;&nbsp;&nbsp;&nbsp;0%</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
