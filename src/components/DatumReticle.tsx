"use client";

import { useEffect, useRef } from "react";

/**
 * A surveyor's reticle over the whole page: two hairlines tracking the pointer,
 * with a live coordinate readout in the corner.
 *
 * It sits at 5% opacity and never replaces the system cursor — the point is
 * ambient instrumentation, not a novelty pointer. It appears only for fine
 * pointers (so never on touch), never under prefers-reduced-motion, and writes
 * transforms straight to the DOM from a rAF loop, so it costs no React renders
 * and no layout.
 */
export function DatumReticle() {
  const wrap = useRef<HTMLDivElement>(null);
  const hx = useRef<HTMLSpanElement>(null);
  const vy = useRef<HTMLSpanElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    let x = -1;
    let y = -1;
    let frame = 0;
    let live = false;

    const paint = () => {
      frame = 0;
      if (hx.current) hx.current.style.transform = `translate3d(0, ${y}px, 0)`;
      if (vy.current) vy.current.style.transform = `translate3d(${x}px, 0, 0)`;
      if (label.current) {
        label.current.textContent = `X ${String(Math.round(x)).padStart(4, "0")}  Y ${String(Math.round(y)).padStart(4, "0")}`;
      }
    };

    const onMove = (event: PointerEvent) => {
      x = event.clientX;
      y = event.clientY;
      if (!live) {
        live = true;
        wrap.current?.setAttribute("data-live", "true");
      }
      if (!frame) frame = window.requestAnimationFrame(paint);
    };

    const onLeave = () => {
      live = false;
      wrap.current?.setAttribute("data-live", "false");
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={wrap} className="reticle" data-live="false" aria-hidden="true">
      <span ref={hx} className="rx" />
      <span ref={vy} className="ry" />
      <span
        ref={label}
        className="tag absolute bottom-6 left-6 hidden text-quarry-700 lg:block"
      />
    </div>
  );
}
