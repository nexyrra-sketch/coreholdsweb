"use client";

import { useEffect, useRef } from "react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/#—·";

/**
 * Instrument readout: a technical label resolving character by character, the
 * way a plotter or a departure board settles. Used only on monospace labels,
 * never on prose — the effect is a register, not a decoration.
 *
 * The real text is always in the accessibility tree via a visually hidden
 * sibling, so nothing ever reads a half-scrambled string aloud. Under
 * prefers-reduced-motion the animated copy simply renders resolved.
 */
export function Decode({
  text,
  className,
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      typeof IntersectionObserver === "undefined"
    ) {
      node.textContent = text;
      return;
    }

    let raf = 0;
    let timer = 0;
    let start = 0;
    const duration = 120 + text.length * 34;

    const step = (now: number) => {
      if (!start) start = now;
      const t = Math.min(1, (now - start) / duration);
      const settled = Math.floor(t * text.length);
      let out = "";
      for (let i = 0; i < text.length; i += 1) {
        const char = text[i];
        if (i < settled || char === " ") out += char;
        else out += GLYPHS[(i * 7 + Math.floor(now / 40)) % GLYPHS.length];
      }
      node.textContent = out;
      if (t < 1) raf = window.requestAnimationFrame(step);
      else node.textContent = text;
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        timer = window.setTimeout(() => {
          raf = window.requestAnimationFrame(step);
        }, delay);
      },
      { threshold: 0.6 },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [text, delay]);

  return (
    <>
      <span className="sr-only">{text}</span>
      <span ref={ref} aria-hidden="true" className={className}>
        {text}
      </span>
    </>
  );
}
