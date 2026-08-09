import type { SVGProps } from "react";

/**
 * THE MARK
 * ----------------------------------------------------------------------------
 * Two brackets and a core.
 *
 * The outer form is an interrupted square: a bracket at the upper-left and its
 * exact 180° twin at the lower-right. Rotationally symmetric, so it sits with
 * the same weight whichever way you look at it — structure, not decoration.
 * Inside sits a solid block, dead centre, fully enclosed by the brackets and
 * touching neither. That is the whole brand in one glyph: the core, and the
 * thing that holds it.
 *
 * It also reads, deliberately, as three things an engineer already knows: a
 * registration target on a drawing sheet, a footing detail in plan view, and a
 * pair of clamps under load.
 */
export function Mark({
  title,
  ...props
}: SVGProps<SVGSVGElement> & { title?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      role={title ? "img" : "presentation"}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      {...props}
    >
      {title ? <title>{title}</title> : null}
      <path
        d="M3 13.5V3h10.5"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="square"
      />
      <path
        d="M29 18.5V29H18.5"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="square"
      />
      <rect x="11" y="11" width="10" height="10" fill="currentColor" />
    </svg>
  );
}

type LogoProps = {
  className?: string;
  markClassName?: string;
  wordClassName?: string;
  /** Renders the mark alone — used in tight furniture like the mobile bar. */
  markOnly?: boolean;
};

export function Logo({
  className,
  markClassName,
  wordClassName,
  markOnly = false,
}: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className ?? ""}`}>
      <Mark className={markClassName ?? "h-[22px] w-[22px] text-oxide"} />
      {markOnly ? (
        <span className="sr-only">Corehold</span>
      ) : (
        <span
          className={
            wordClassName ??
            "text-[1.0625rem] font-semibold tracking-[-0.03em] text-bone"
          }
        >
          Corehold
        </span>
      )}
    </span>
  );
}
