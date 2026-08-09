/**
 * A specification drawing of the mark itself, at architectural scale.
 *
 * The hero does not get a stock illustration or a floating 3D object. It gets
 * the brand's own geometry, dimensioned and annotated the way a detail would be
 * on a drawing sheet — because the argument of this site is that the structure
 * is the product.
 */
export function HeroDiagram({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 340 340"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      {/* construction field */}
      <g stroke="currentColor" strokeWidth="1" className="text-quarry-800">
        <path d="M20 0v340M320 0v340M0 20h340M0 320h340" opacity="0.55" />
        <path d="M170 0v340M0 170h340" opacity="0.3" strokeDasharray="3 7" />
      </g>

      {/* the hold — two brackets, 180° twins */}
      <g
        stroke="currentColor"
        strokeWidth="10"
        strokeLinecap="square"
        className="text-quarry-600"
      >
        {/* Two animations, two elements: the group fades the bracket into
            place, the path underneath carries the load. Stacking both on one
            node would have the shorthand overwrite the other. */}
        <g className="settle" style={{ animationDelay: "220ms" }}>
          <path d="M25 138V25h113" className="bearing-a" />
        </g>
        <g className="settle" style={{ animationDelay: "340ms" }}>
          <path d="M315 202v113H202" className="bearing-b" />
        </g>
      </g>

      {/* dimension leaders */}
      <g stroke="currentColor" strokeWidth="1" className="text-quarry-700">
        <path d="M25 25h-14M25 138h-14M11 25v113" />
        <path d="M138 25v-14M25 25v-14M25 11h113" />
      </g>

      {/* the core */}
      <rect
        x="130"
        y="130"
        width="80"
        height="80"
        fill="currentColor"
        className="settle text-oxide"
        style={{ animationDelay: "460ms" }}
      />

      {/* annotations */}
      <g
        className="fill-current text-quarry-500"
        fontSize="9"
        letterSpacing="1.6"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        <text x="232" y="97">
          HOLD
        </text>
        <text x="232" y="176">
          CORE
        </text>
        <text x="14" y="336">
          COREHOLD / MARK / DETAIL 01
        </text>
      </g>
      <g stroke="currentColor" strokeWidth="1" className="text-quarry-700">
        <path d="M228 93h-40M188 93V60M228 172h-14" />
      </g>
    </svg>
  );
}
