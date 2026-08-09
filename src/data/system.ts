/**
 * The site's own specification.
 *
 * Every number in here is measured from the production build in this
 * repository, not estimated. When the build changes, this file changes with
 * it — publishing a stale spec sheet would be worse than publishing none.
 */

export const measured = {
  buildDate: "2026-08-09",
  routes: 22,
  nextVersion: "15.5",
  reactVersion: "19.2",
  sharedJs: "103 kB",
  heaviestRoute: { path: "/ledger", value: "117 kB" },
  lightestRoute: { path: "/ar", value: "107 kB" },
  runtimeDependencies: 3,
  totalDependencies: 3,
  fontFiles: 6,
  fontWeight: "198 kB across two scripts",
  thirdPartyRequests: 0,
  cookies: 0,
  trackers: 0,
  images: 1,
  prerenderedRoutes: 21,
  axeViolations: 0,
  axeRuleSets: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"],
  axePages: 18,
  axeViewports: ["1440px", "390px"],
} as const;

export const budgets: [string, string, string][] = [
  [
    "Runtime dependencies",
    `${measured.runtimeDependencies}`,
    "next, react, react-dom. No UI kit, no animation library, no icon package, no charting library, no PDF library.",
  ],
  [
    "Shared first-load JavaScript",
    measured.sharedJs,
    "Framework and router. Everything this site adds on top of that — the graph, the switch, the palette, the model — is measured in single-digit kilobytes.",
  ],
  [
    "Third-party requests at runtime",
    `${measured.thirdPartyRequests}`,
    "No font CDN, no analytics, no tag manager, no embedded widgets. The page is served entirely from its own origin.",
  ],
  [
    "Cookies set",
    `${measured.cookies}`,
    "There is no consent banner on this site because there is nothing to consent to.",
  ],
  [
    "Raster images in the layout",
    `${measured.images}`,
    "One: the Open Graph card, which never loads in the page. Every mark, diagram and chart is vector or canvas.",
  ],
  [
    "The homepage, in full",
    "7.3 kB",
    "Including the live 3D scene, the kill-switch demonstration and both counters. The 3D costs about four kilobytes of that, because it is written against WebGL2 directly rather than imported.",
  ],
  [
    "Latin critical font weight",
    "64 kB",
    "Three files, self-hosted. The Arabic face loads only on the Arabic edition and never blocks a Latin page.",
  ],
  [
    "axe-core violations",
    `${measured.axeViolations}`,
    `Across ${measured.axePages} pages at ${measured.axeViewports.join(" and ")}, under ${measured.axeRuleSets.join(", ")}.`,
  ],
];

export const decisions: [string, string][] = [
  [
    "WebGL2 by hand, not a 3D library",
    "The homepage runs a real 3D scene: fourteen cubes tumbling in space that lock into the mark as you scroll. There is an excellent library for this and the site does not use it, because importing six hundred kilobytes to draw fifteen lit cubes would make the dependency count on this page a lie. Roughly 200 lines of matrix maths, one shader, one cube mesh, fifteen draw calls a frame.",
  ],
  [
    "The homepage argues once, then stops",
    "An earlier version of this page carried every section the site has. It was complete and it was exhausting. The homepage now runs six beats — one idea each, one screen each — and every piece of depth lives on the page built for it. Nothing was deleted; it was moved somewhere a reader arrives on purpose.",
  ],
  [
    "Seeded randomness",
    "The 'mess' in the graph is generated from a fixed seed, so it is identical on every load, every device and every screenshot. A brand built on determinism should not shuffle itself per visitor.",
  ],
  [
    "Scroll read into refs, never state",
    "Scroll-driven pieces write transforms straight to the DOM from a single requestAnimationFrame loop that is gated by an IntersectionObserver. Scrolling this site does not re-render React, and nothing animates off-screen.",
  ],
  [
    "A hand-written PDF writer",
    "The rent exposure sheet is a real PDF, produced by about 120 lines in the browser using the base-14 fonts. Pulling in a 300 kB library to lay out one page of text and hairlines would have contradicted the argument on the rest of the site.",
  ],
  [
    "Native disclosure for the FAQ",
    "Details and summary elements, styled. Correct in every screen reader and every engine at zero JavaScript cost, which a bespoke accordion cannot claim.",
  ],
  [
    "No View Transitions API",
    "It is still unevenly implemented across engines. The route transition here is CSS, so Firefox, Safari, Chrome, Edge and Brave all get the same result rather than two of them getting a nicer one.",
  ],
  [
    "Fonts vendored into the repository",
    "Nothing is fetched from a font CDN at runtime. One less third party in the critical path, and one fewer contradiction for a studio that argues against renting your infrastructure.",
  ],
  [
    "Motion has an off switch that we honour",
    "prefers-reduced-motion is not a token gesture here: the dependency graph collapses to a single composed frame, the core sample renders complete, the boot sequence never plays, and every reveal resolves instantly.",
  ],
];

export const tokens: { group: string; rows: [string, string, string][] }[] = [
  {
    group: "Ground",
    rows: [
      ["quarry-950", "#0b0d0c", "Base ground. Mineral near-black, green-grey cast."],
      ["quarry-900", "#101312", "Raised ground for alternating sections."],
      ["quarry-800", "#191e1c", "Hairline rules and panel borders."],
      ["quarry-500", "#7a827d", "Technical labels. 4.9:1 on the base ground."],
      ["quarry-300", "#aeb4af", "Secondary prose. 9.1:1."],
      ["bone", "#e8e7e1", "Primary text on dark. 15.9:1."],
    ],
  },
  {
    group: "Paper",
    rows: [
      ["limestone", "#efede8", "Light ground. Used twice, both times for a document."],
      ["limestone-line", "#cbc6bc", "Hairlines on paper."],
      ["quarry-600", "#313835", "Labels on paper. 10.2:1."],
    ],
  },
  {
    group: "Signal",
    rows: [
      ["oxide", "#d9622b", "The only accent. Load-bearing elements only."],
      ["oxide-deep", "#a8461b", "The accent on paper, where the brighter one would fail contrast."],
      ["oxide-bright", "#ee7a41", "Hover state."],
    ],
  },
  {
    group: "Type & motion",
    rows: [
      ["--font-display", "Archivo", "Display, UI and body. One family, whole site."],
      ["--font-mono", "IBM Plex Mono", "Sheet numbers, labels, readouts, manifests."],
      ["--ease-structural", "cubic-bezier(.22,.68,.24,1)", "The single easing curve. Nothing bounces."],
    ],
  },
];
