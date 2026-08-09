import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

const base =
  "group relative inline-flex items-center justify-center gap-2.5 rounded-[2px] font-medium tracking-[-0.01em] transition-[background-color,border-color,color,transform] duration-200 ease-[cubic-bezier(0.22,0.68,0.24,1)] active:translate-y-px disabled:cursor-not-allowed disabled:opacity-55";

const sizes: Record<Size, string> = {
  md: "h-11 px-5 text-[0.9375rem]",
  lg: "h-[3.25rem] px-7 text-base",
};

const variants: Record<Variant, string> = {
  // Dark on oxide, the way site signage is set. Also the only pairing that
  // clears WCAG AA on this accent at body size (6.2:1 against 3.7:1 for white).
  primary:
    "bg-oxide text-quarry-950 font-semibold hover:bg-oxide-bright focus-visible:outline-offset-4",
  secondary:
    "border border-quarry-600 bg-transparent text-bone hover:border-quarry-400 hover:bg-quarry-800",
  ghost: "text-quarry-200 hover:text-bone",
};

const lightVariants: Partial<Record<Variant, string>> = {
  secondary:
    "border border-limestone-line bg-transparent text-quarry-900 hover:border-quarry-600 hover:bg-limestone-dim",
  ghost: "text-quarry-700 hover:text-quarry-950",
};

type Common = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  /** Adjusts secondary/ghost styling for limestone sections. */
  ground?: "dark" | "light";
  trailing?: ReactNode;
};

function classesFor({
  variant = "primary",
  size = "md",
  ground = "dark",
  className,
}: Omit<Common, "children" | "trailing">) {
  const variantClass =
    ground === "light" ? (lightVariants[variant] ?? variants[variant]) : variants[variant];
  return `${base} ${sizes[size]} ${variantClass} ${className ?? ""}`;
}

export function ButtonLink({
  href,
  children,
  trailing,
  ...rest
}: Common & { href: string }) {
  const external = href.startsWith("http") || href.startsWith("mailto:");
  const cls = classesFor(rest);

  if (external) {
    return (
      <a
        href={href}
        className={cls}
        rel="noopener noreferrer"
        target={href.startsWith("mailto:") ? undefined : "_blank"}
      >
        {children}
        {trailing}
      </a>
    );
  }

  return (
    <Link href={href} className={cls}>
      {children}
      {trailing}
    </Link>
  );
}

export function Button({
  children,
  trailing,
  variant,
  size,
  ground,
  className,
  ...rest
}: Common & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      className={classesFor({ variant, size, ground, className })}
    >
      {children}
      {trailing}
    </button>
  );
}

/** The one arrow used across the site: a short, flat trajectory. */
export function Arrow({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={`h-3.5 w-3.5 shrink-0 transition-transform duration-200 ease-[cubic-bezier(0.22,0.68,0.24,1)] group-hover:translate-x-1 ${className ?? ""}`}
    >
      <path
        d="M1 8h13M9.5 3.5 14 8l-4.5 4.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="square"
      />
    </svg>
  );
}
