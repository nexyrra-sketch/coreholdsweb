# Corehold

Marketing site for Corehold — an intelligent systems studio in Dubai.

This README doubles as the brand rationale. Every visual decision on the site
traces back to something in here; if a future change contradicts a section
below, either the change is wrong or this document needs updating first.

---

## 1. The argument the site makes

> Every subscription you pay is rent on infrastructure someone else owns. Rent
> buys access; it never buys equity. Corehold builds the core your company
> operates on, once and properly, and then hands you the deed.

Everything on the site serves that one argument, in this order:

1. **You are already paying for a system** — the visitor prices their own stack
   (`RentLedger`). Their numbers, not ours.
2. **And you don't own it** — own vs. rent across seven dimensions
   (`PositionTable`).
3. **Here is what owning one looks like** — one foundation, five layers
   (`StrataSystem`).
4. **Here is how we get there** — the five-stage method (`MethodRail`).
5. **Here is what actually changes hands** — the handover manifest, including
   what is deliberately *not* included.
6. **And here is the reason to believe us** — we will tell you to build nothing
   (`RefusalBand`).
7. **Do this next** — request a system audit.

The single call to action is **Request a System Audit**, deliberately chosen
over "book a call" or "get in touch": the CTA *is* stage one of the method, so
the site's ask and the studio's process are the same object.

## 2. Colour

No gradients anywhere in the system. Gradients imply transition; Corehold sells
permanence.

| Token | Value | Role |
| --- | --- | --- |
| `quarry-950 … quarry-200` | `#0b0d0c` → `#c9cdc8` | The ground. A mineral near-black with a green-grey cast — cut stone and cured concrete. Not blue (the default tech tell), not pure black (fashion). |
| `bone` / `limestone` | `#e8e7e1` / `#efede8` | Warm paper. The colour of drawing sheets and title deeds. |
| `oxide` | `#d9622b` | The only accent. Iron oxide: rebar primer, survey paint, the mark a site engineer leaves on a structure. |
| `oxide-deep` | `#a8461b` | The accent on light grounds, where the brighter oxide would fail contrast. |

**The light ground appears exactly twice on the homepage**, and both times it is
a document: the ledger of what you rent, and the deed of what you own. That
rhyme is the reason for the alternation — not visual variety.

**Primary buttons are dark text on oxide**, the way site and hazard signage is
set. It is also the only pairing that clears WCAG AA on this accent at body
size (6.2:1, against 3.7:1 for white on the same orange).

## 3. Typography

- **Archivo** — display, UI and body. A grotesque drawn for signage and
  high-impact print: tight apertures, low thick/thin contrast, holds together
  at 96px as a masthead and at 15px as body copy. Running the whole site on one
  family is itself the point — the design does not borrow authority from a
  second display face.
- **IBM Plex Mono** — the technical register. Sheet numbers, stage codes, field
  labels, manifest lines, margin notes. Monospace here is not a developer
  affectation: it is the typography of specification documents, and it does the
  work of separating what Corehold *claims* from what Corehold *records*.

Both are vendored into `src/fonts/` and served from this origin. Nothing is
fetched from Google Fonts at runtime — a studio arguing against renting your
infrastructure should not hot-link its own typography.

## 4. The mark

Two brackets and a core, in `src/components/Logo.tsx`.

An interrupted square: a bracket at the upper-left and its exact 180° twin at
the lower-right, so the mark carries the same weight whichever way you look at
it. Inside sits a solid block, dead centre, fully enclosed and touching
neither. That is the brand in one glyph — the core, and the thing that holds
it. It reads, deliberately, as three things an engineer already knows: a
registration target on a drawing sheet, a footing detail in plan, and a pair of
clamps under load.

The wordmark is set in Archivo 600 at `-0.03em`, sentence case. No colour split
across "core" and "hold" — that is the cheap move; the mark carries the idea.

`HeroDiagram.tsx` renders the mark at architectural scale, dimensioned and
annotated as a detail on a drawing sheet, rather than using stock illustration.

## 5. The four set pieces

Four things on this site do the arguing. Each is hand-written; none of them
pulled in a dependency.

**The Dependency Graph** (`components/DependencyGraph.tsx`) — a scroll-driven
canvas on the homepage. Fourteen rented providers jitter in a cross-wired mess,
with orange marks crawling along the broken bridges between them: those are
people, moving data by hand. Scroll, and the whole thing collapses into one
core with clean radial reads. Seeded PRNG so the mess is identical on every
load; the rAF loop is gated by an IntersectionObserver; scroll position is read
into a ref, never into state. Under reduced motion the section stops being
scroll-driven and renders one composed frame of the resolved state.

**The Landlord Switch** (`components/LandlordSwitch.tsx`) — two identical
systems, both running. The visitor stops paying. The rented one goes out row by
row and stamps itself ACCESS TERMINATED; the owned one does not react. The
staging is the point, so it is timed rather than instant — except under reduced
motion, where the same end state arrives immediately. The outcome is announced
to assistive technology either way.

**The Core Sample** (`components/MethodCore.tsx`) — the method drawn as a
borehole. A sticky column is cut through five strata as the stages scroll past
a datum line at 42% of the viewport. Depth is *measured* against the real
section geometry rather than interpolated from scroll, so the readout, the bore
and the highlighted stage never disagree.

**The Ownership Model** (`components/RentLedger.tsx`, `OwnershipChart.tsx`,
`lib/pdf.ts`, `lib/rentSheet.ts`) — the ledger extends into a five-year model
with a self-drawing plot and a marked break-even point, then hands the visitor
a real PDF: a one-page **Rent Exposure Sheet** built in the browser by ~120
lines of hand-written PDF writer, with the mark drawn as vector paths and a
vector chart of both curves. Nothing is uploaded, nothing is stored, and no
Corehold price appears anywhere on it.

## 6. The craft layer

- **Boot sequence** — one second, once per session. The brackets draw, the core
  seats, the sheet lifts. Never under reduced motion, dismissible by any key or
  click, and the page underneath is interactive throughout.
- **⌘K command palette** — every page, method stage, system layer and question,
  addressable from the keyboard. A proper combobox/listbox with
  `aria-activedescendant`, arrow keys, Home/End and focus restoration.
- **Route transition** — a single oxide rule sweeping the top edge, like a
  plotter starting the next sheet. Deliberately CSS rather than the View
  Transitions API, so every engine gets the same result.
- **Datum reticle** — two hairlines at 5% opacity tracking the pointer with a
  live coordinate readout. Fine pointers only, never a cursor replacement,
  written straight to the DOM from a rAF loop.
- **Decode labels** — monospace labels resolving character by character, like an
  instrument settling. The real text is always in the accessibility tree via a
  visually hidden sibling, so nothing ever reads a half-scrambled string aloud.
- **Variable-font landing** — headlines arrive at weight 470 and tracking
  −0.010em and settle to 600 / −0.032em. Nothing about it touches opacity, so it
  never delays a largest-contentful paint. We ship the weight axis only; the
  width axis would have cost a second 35 kB file for a subtler effect.
- **Shareable stacks** — the rent ledger encodes its whole state into the URL
  fragment. No account, no cookie, no database: on a site arguing that you
  should hold your own data, that was the only defensible way to build a share
  button.
- **Live Web Vitals** on `/system` — LCP, CLS, INP, FCP and TTFB measured in the
  reader's own browser via three `PerformanceObserver`s and published as they
  arrive. On a slow phone it will not flatter us; publishing it anyway is the
  point.

## 7. Layout language

- A faint 88px structural grid (`.gridfilm`) sits behind the grounds — the
  drawing sheet under the drawing.
- Sections are numbered like drawings, not like blog posts: `01 ——— THE LEDGER`.
- Margin notes set in mono sit in the right-hand columns, the way annotations
  sit in a drawing's margin.
- Rules are hairlines. Corners are square (2px at most). There is no rounded
  card-with-icon grid anywhere on the site.
- Motion is structural: elements rise a short, even distance and resolve; rules
  scribe themselves left to right. Nothing bounces, scales or blurs. The whole
  motion system is one CSS file plus one `IntersectionObserver` hook — no
  animation library.

## 8. What the site publishes

The studio's credibility problem is that it has no client work to show. Rather
than paper over it, the site publishes five things that can be judged directly.

**`/specimen` — a complete worked audit.** The deliverable, in full, as an
eight-page PDF generated in the browser. Meridian Freight is a composite: not a
client, never a client, does not exist — stated on the page, on the cover, and
in the running footer of every page of the document. A prospect can look at
exactly what they would be buying before they commit to anything.

**`/register` — build it or rent it, across 43 categories.** A versioned index
with a verdict, a lock-in rating, the reasoning, and — the column that makes it
useful — the threshold at which each verdict flips. Most entries say *rent*,
which is the point: the argument is about which part of the stack to own, not
about avoiding software. Carries `Dataset` schema and is the natural link
target on the whole site.

**`/standard` — Corehold Standard v1.0.** Six commitments, each with what it
means in practice and how a client can verify it mid-engagement, plus the
engagement terms as ten plain-English answers. Versioned, dated, and explicitly
never quietly edited.

**`/manifesto` — the argument as a title sequence.** Eight chapters, each held
for a scroll, grounds inverting between quarry and limestone, closing on oxide.
One rAF loop writes opacity, translate and letter-spacing directly; statements
arrive fractionally loose and tighten as they land.

**`/brand` — the identity, in the open.** Mark construction, colour with
contrast ratios, type scale, motion spec and voice guide — plus the brand book,
letterhead and proposal template as downloadable PDFs from the same engine.

## 9. The Arabic edition

`/ar` is not the English site flipped. The argument is re-made in Modern
Standard Arabic across five pages (home, method, ownership, capabilities,
audit), matching the English voice rather than translating it literally.

Typographic decisions that matter, all in `globals.css` under `[dir="rtl"]`:

- **Arabic is never tracked.** Letter-spacing breaks the joins, so every
  tracked class in the system — including the monospace `.tag` and the
  variable-font landing — is neutralised under RTL.
- **IBM Plex Sans Arabic** carries the edition, chosen to share the Plex
  family's specification-document heritage with the mono face already in use.
  It loads only on Arabic pages and never blocks a Latin one.
- **Leading opens up**, because Arabic carries taller ascenders and deeper
  descenders than Latin at the same optical size.
- Latin fragments inside Arabic prose get `.latin`, which isolates their
  direction and sets them in the mono face.

Direction is settled by an inline script in `<head>` before first paint, so an
Arabic page never renders left-to-right for a frame, and re-applied on client
navigation. `hreflang` alternates are declared in metadata and in the sitemap.

## 10. Honesty constraints

Corehold is early and has no published clients. **Nothing on this site invents
proof.**

- No client names, logos, testimonials or outcome statistics appear anywhere.
- The `RentLedger` figures are the visitor's own, and the defaults are labelled
  in the interface as placeholders rather than as Corehold data.
- Where social proof would normally sit, `Standards.tsx` renders the six
  standards every engagement is held to, followed by an explicitly marked
  **reserved** block that stays empty until there is real, named,
  client-approved evidence to put in it.

If you add proof later, replace that reserved block — do not quietly delete the
honesty note and drop logos in.

## 11. Stack

- Next.js 15 (App Router) · React 19 · TypeScript (strict)
- Tailwind CSS v4, with the design system defined as `@theme` tokens in
  `src/app/globals.css`
- Self-hosted fonts via `next/font/local`
- Zero runtime dependencies beyond React and Next — no UI kit, no animation
  library, no icon package

Every page is statically prerendered except the one API route. Shared
first-load JavaScript is ~103 kB; the homepage — graph, switch, model, chart and
PDF writer included — adds 15.9 kB on top of that.

The site publishes its own specification at **/system**: measured budgets, the
reasoning behind each engineering decision, the full token table, and the
commands to verify all of it. When the build changes, `src/data/system.ts`
changes with it.

## 12. Running it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run start      # serve the production build
npm run typecheck  # tsc --noEmit
```

Deploys as-is to Vercel, or to any Node host via `npm run build && npm run start`.

Set the production origin in `src/lib/site.ts` (`site.url`) before launch — it
feeds canonical URLs, `sitemap.xml`, `robots.txt`, and the Open Graph tags.

## 13. Wiring the audit form

The form flow — validation, states, confirmation, error handling — is complete,
and submissions genuinely reach `src/app/api/audit-request/route.ts`. That route
validates and shapes the payload and then logs it. One TODO remains at the
bottom of the file: deliver the submission to an inbox, a CRM, or a database.
Nothing in `AuditForm.tsx` needs to change when you connect it.

## 14. SEO

- Per-page `title` / `description`, canonical URLs, Open Graph and Twitter cards
- `public/og.png` (1200×630), generated from the site's own tokens by
  `scripts/og.mjs`
- JSON-LD: `Organization` + `ProfessionalService`, `WebSite`, `HowTo` (the
  method), `FAQPage`, and `BreadcrumbList` on interior pages
- `sitemap.xml` and `robots.txt` generated from `src/app/sitemap.ts` /
  `robots.ts`
- One `<h1>` per page, ordered heading hierarchy, semantic landmarks throughout

## 15. Accessibility & QA

The site passes **axe-core with zero violations** across all seventeen pages at
both 1440px and 390px, under `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa` and
`best-practice` rule sets — set pieces and the Arabic edition included.

- All text meets AA contrast on both grounds
- Full keyboard operation, including the strata tablist (arrow keys, Home/End,
  roving tabindex) and the FAQ (native `<details>`)
- Visible oxide focus rings on every interactive element, on both grounds
- `prefers-reduced-motion` is honoured properly, not tokenistically: the graph
  collapses to one composed frame, the core sample renders complete, the boot
  sequence never plays, the route sweep is skipped, the reticle never appears,
  and every reveal resolves instantly
- Reveals are a progressive enhancement — a `<noscript>` rule makes everything
  visible without JavaScript

The QA scripts live in `scripts/` and are not wired into the dependency tree, so
a normal install stays light. To run them:

```bash
npm i -D playwright @axe-core/playwright && npx playwright install chromium
node scripts/a11y.mjs     # axe audit, all pages, two viewports
node scripts/slices.mjs   # scroll-slice screenshots for visual review
node scripts/qa.mjs       # focus states, keyboard nav, form success flow
node scripts/og.mjs       # regenerate public/og.png
```

## 16. Where things are

```
src/
  app/
    page.tsx              home
    method/               the five-stage method, in full
    ownership/            the own-vs-rent argument, with its own limits stated
    capabilities/         the five layers, in detail
    register/             build-or-rent verdicts, 43 categories, versioned
    specimen/             a complete worked audit, published
    standard/             commitments and terms, v1.0
    manifesto/            the argument as a scroll-driven title sequence
    brand/                the identity, published
    system/               this site's own specification, with live vitals
    audit/                the audit request page and form
    ar/                   the Arabic edition, five pages, RTL
    api/audit-request/    the one integration seam
    globals.css           the entire design system, including RTL rules
  components/             one concern per file
  data/                   all site copy, English and Arabic
  fonts/                  vendored woff2, Latin and Arabic
  lib/
    motion.ts             seeded PRNG, easing, scroll progress, rAF loop
    pdf.ts                the PDF writer, with AFM metrics and multi-page
    pdfChrome.ts          shared document furniture
    rentSheet.ts          the Rent Exposure Sheet
    sampleAuditPdf.ts     the eight-page specimen audit
    brandDocs.ts          brand book, letterhead, proposal
    site.ts, useReveal.ts
scripts/                  QA and asset generation (dev-only)
```

Copy lives in `src/data/*` wherever it is repeated or structured, so editing the
method or the FAQ never means editing layout.
