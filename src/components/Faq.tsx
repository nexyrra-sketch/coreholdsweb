import { Reveal } from "./Reveal";
import type { FaqItem } from "@/data/faq";

/**
 * Native <details>/<summary>. Keyboard-operable and screen-reader-correct in
 * every engine without a single line of JavaScript, which matters more here
 * than a bespoke accordion animation would.
 */
export function Faq({ items }: { items: FaqItem[] }) {
  return (
    <div className="mt-14 border-t border-quarry-800 lg:mt-16">
      {items.map((item, i) => (
        <Reveal key={item.question} delay={Math.min(i, 4) * 40}>
          <details className="group border-b border-quarry-800">
            <summary className="flex cursor-pointer list-none items-start gap-6 py-6 [&::-webkit-details-marker]:hidden">
              <span className="tag mt-1.5 shrink-0 text-quarry-500 transition-colors group-open:text-oxide">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="flex-1 text-[1.0625rem] leading-snug font-medium tracking-[-0.015em] text-bone sm:text-lg">
                {item.question}
              </span>
              <span
                aria-hidden="true"
                className="relative mt-2.5 h-3 w-3 shrink-0 text-quarry-400 transition-colors group-open:text-oxide"
              >
                <span className="absolute top-1/2 left-0 h-px w-3 -translate-y-1/2 bg-current" />
                <span className="absolute top-0 left-1/2 h-3 w-px -translate-x-1/2 bg-current transition-transform duration-300 ease-[cubic-bezier(0.22,0.68,0.24,1)] group-open:scale-y-0" />
              </span>
            </summary>
            <div className="grid grid-cols-[2.75rem_1fr] pb-8">
              <span aria-hidden="true" />
              <p className="max-w-[68ch] text-[0.9375rem] leading-relaxed text-quarry-300 sm:text-base">
                {item.answer}
              </p>
            </div>
          </details>
        </Reveal>
      ))}
    </div>
  );
}
