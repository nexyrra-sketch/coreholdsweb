"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * The primary call to action leans toward the pointer as it approaches, then
 * releases. Used exactly once on the site — the moment it appears on more than
 * one element it stops being a detail and starts being a gimmick.
 */
export function Magnetic({
  children,
  strength = 0.28,
  radius = 130,
  className,
}: {
  children: ReactNode;
  strength?: number;
  radius?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

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

    const onMove = (event: PointerEvent) => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const rect = node.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = event.clientX - cx;
        const dy = event.clientY - cy;
        const distance = Math.hypot(dx, dy);

        if (distance > radius + Math.max(rect.width, rect.height) / 2) {
          node.style.transform = "translate3d(0,0,0)";
          return;
        }
        node.style.transform = `translate3d(${dx * strength}px, ${dy * strength}px, 0)`;
      });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [strength, radius]);

  return (
    <span ref={ref} className={`magnet inline-block ${className ?? ""}`}>
      {children}
    </span>
  );
}
