import type { ReactNode } from "react";

type Ground = "dark" | "raised" | "light";

const grounds: Record<Ground, string> = {
  dark: "bg-quarry-950 text-bone border-t border-quarry-800",
  raised: "bg-quarry-900 text-bone border-t border-quarry-800",
  light: "bg-limestone text-quarry-950",
};

export function Section({
  id,
  ground = "dark",
  children,
  className,
  film = false,
  labelledBy,
}: {
  id?: string;
  ground?: Ground;
  children: ReactNode;
  className?: string;
  film?: boolean;
  labelledBy?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      data-ground={ground === "light" ? "light" : "dark"}
      className={`relative overflow-hidden ${grounds[ground]} ${className ?? ""}`}
    >
      {film && (
        <div
          className={`gridfilm ${ground === "light" ? "gridfilm--light" : ""}`}
        />
      )}
      <div className="shell relative py-24 md:py-32 lg:py-36">{children}</div>
    </section>
  );
}
