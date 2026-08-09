"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * A few pixels of pointer-linked depth, and no more.
 *
 * The hero drawing shifts by at most `depth` pixels against the cursor, which
 * is enough to make the sheet feel like it has thickness and not enough for
 * anyone to consciously notice. Fine pointers only, off under reduced motion,
 * and the transform is written straight to the node.
 */
export function Parallax({
  children,
  depth = 10,
  className,
}: {
  children: ReactNode;
  depth?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (
      !window.matchMedia("(pointer: fine)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    let frame = 0;
    let x = 0;
    let y = 0;

    const paint = () => {
      frame = 0;
      node.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
    };

    const onMove = (event: PointerEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      x = ((event.clientX - cx) / cx) * -depth;
      y = ((event.clientY - cy) / cy) * -depth * 0.6;
      if (!frame) frame = window.requestAnimationFrame(paint);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [depth]);

  return (
    <div ref={ref} className={`parallax ${className ?? ""}`}>
      {children}
    </div>
  );
}
