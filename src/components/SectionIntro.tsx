import type { ReactNode } from "react";
import { Reveal } from "./Reveal";
import { Decode } from "./Decode";

type Props = {
  /** Sheet number. Sections are numbered like drawings, not like blog posts. */
  index: string;
  label: string;
  heading: ReactNode;
  lede?: ReactNode;
  /** A margin annotation, set in the technical face — a drawing-sheet note. */
  note?: ReactNode;
  ground?: "dark" | "light";
  align?: "left" | "wide";
  headingLevel?: "h1" | "h2";
  className?: string;
};

export function SectionIntro({
  index,
  label,
  heading,
  lede,
  note,
  ground = "dark",
  align = "left",
  headingLevel: Heading = "h2",
  className,
}: Props) {
  const dim = ground === "light" ? "text-quarry-600" : "text-quarry-400";
  const strong = ground === "light" ? "text-quarry-950" : "text-bone";
  const accent = ground === "light" ? "text-oxide-deep" : "text-oxide";
  const line = ground === "light" ? "bg-limestone-line" : "bg-quarry-700";

  return (
    <div className={`lg:grid lg:grid-cols-12 lg:gap-10 ${className ?? ""}`}>
      <div className="lg:col-span-8">
        <Reveal className="flex items-center gap-4">
          <span className={`tag ${accent}`}>{index}</span>
          <span className={`h-px flex-1 max-w-[7rem] ${line}`} />
          <span className={`tag ${dim}`}>
            <Decode text={label.toUpperCase()} delay={120} />
          </span>
        </Reveal>

        <Reveal delay={80}>
          <Heading
            className={`type-settle mt-7 text-major ${strong} ${
              align === "wide" ? "max-w-[22ch]" : "max-w-[16ch]"
            }`}
          >
            {heading}
          </Heading>
        </Reveal>

        {lede ? (
          <Reveal delay={140}>
            <div className={`mt-6 max-w-[58ch] text-lede ${dim}`}>{lede}</div>
          </Reveal>
        ) : null}
      </div>

      {note ? (
        <Reveal
          delay={200}
          className="mt-10 lg:col-span-3 lg:col-start-10 lg:mt-0 lg:self-end"
        >
          <div className={`h-px w-full ${line}`} />
          <p
            className={`mt-4 font-mono text-xs leading-relaxed tracking-[0.01em] ${dim}`}
          >
            {note}
          </p>
        </Reveal>
      ) : null}
    </div>
  );
}
