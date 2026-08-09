"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useId } from "react";
import { Reveal } from "./Reveal";
import { ButtonLink, Button, Arrow } from "./Button";
import { OwnershipChart } from "./OwnershipChart";
import { ctaHref } from "@/lib/site";
import { generateRentSheet } from "@/lib/rentSheet";

/**
 * THE RENT LEDGER & OWNERSHIP MODEL
 * ----------------------------------------------------------------------------
 * The site makes no claims about other people's results, because Corehold has
 * no published case studies yet and inventing them would be dishonest. So the
 * proof on this page is arithmetic the visitor performs on their own numbers.
 *
 * Every figure below starts as an editable placeholder and is labelled as one.
 * The ownership scenario is likewise the visitor's own assumption, not a
 * Corehold price — the studio quotes nothing before an audit, and the copy
 * says so at every step.
 *
 * At the end the visitor can take the whole thing away as a real PDF, generated
 * in the browser by ~120 lines of hand-written writer in `lib/pdf.ts`. No
 * server round trip, no third-party library, nothing uploaded anywhere.
 */

type Line = { id: string; label: string; note: string; amount: number };

const DEFAULT_LINES: Line[] = [
  {
    id: "web",
    label: "Website & content platform",
    note: "Site builder, hosting, CMS, plugins",
    amount: 1200,
  },
  {
    id: "crm",
    label: "Customer & sales tools",
    note: "CRM, pipeline, per-seat licences",
    amount: 3200,
  },
  {
    id: "auto",
    label: "Automation & integrations",
    note: "Workflow runs, connectors, sync jobs",
    amount: 1500,
  },
  {
    id: "ai",
    label: "AI tools & assistants",
    note: "Per-seat AI, copilots, credits",
    amount: 2200,
  },
  {
    id: "data",
    label: "Analytics & reporting",
    note: "Dashboards, warehouse, BI seats",
    amount: 900,
  },
  {
    id: "comms",
    label: "Communication & support desk",
    note: "Helpdesk, inbox, ticketing, telephony",
    amount: 1600,
  },
  {
    id: "misc",
    label: "Storage, forms, signatures, the rest",
    note: "The subscriptions nobody remembers approving",
    amount: 1100,
  },
];

const CURRENCIES = ["AED", "USD", "EUR", "GBP", "SAR"] as const;
const YEARS = 5;

/**
 * The whole model is encoded into the URL fragment and nowhere else — no
 * account, no cookie, no database, nothing sent anywhere. A visitor can send
 * their stack to their CFO as a link, and the link is the entire storage layer.
 * On a site arguing that you should hold your own data, that felt like the only
 * defensible way to build a share button.
 */
function encodeState(
  lines: Line[],
  currency: string,
  growth: number,
  build: number,
  upkeep: number,
) {
  return [currency, growth, build, upkeep, ...lines.map((l) => l.amount)].join(
    ".",
  );
}

function decodeState(raw: string) {
  const parts = raw.split(".");
  if (parts.length !== 4 + DEFAULT_LINES.length) return null;
  const [currency, growth, build, upkeep, ...amounts] = parts;
  if (!CURRENCIES.includes(currency as (typeof CURRENCIES)[number])) return null;
  const numbers = [growth, build, upkeep, ...amounts].map(Number);
  if (numbers.some((n) => !Number.isFinite(n) || n < 0)) return null;
  return {
    currency: currency as (typeof CURRENCIES)[number],
    growth: Math.min(40, numbers[0]),
    build: Math.min(50_000_000, numbers[1]),
    upkeep: Math.min(60, numbers[2]),
    lines: DEFAULT_LINES.map((line, i) => ({
      ...line,
      amount: Math.min(10_000_000, numbers[3 + i]),
    })),
  };
}

export function RentLedger() {
  const [lines, setLines] = useState<Line[]>(DEFAULT_LINES);
  const [currency, setCurrency] = useState<(typeof CURRENCIES)[number]>("AED");
  const [growth, setGrowth] = useState(6);
  const [buildOverride, setBuildOverride] = useState<number | null>(null);
  const [upkeepPct, setUpkeepPct] = useState(15);
  const [sheetState, setSheetState] = useState<"idle" | "done">("idle");
  const [copied, setCopied] = useState(false);
  const hydrated = useRef(false);

  const currencyId = useId();
  const growthId = useId();
  const buildId = useId();
  const upkeepId = useId();

  const fmt = useMemo(
    () =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
        currencyDisplay: "code",
      }),
    [currency],
  );

  const monthly = lines.reduce((sum, l) => sum + (l.amount || 0), 0);
  const annual = monthly * 12;

  /** Eighteen months of current rent, as a starting scenario the visitor edits. */
  const build = buildOverride ?? Math.round(monthly * 18);
  const upkeep = Math.round((build * upkeepPct) / 100);

  const model = useMemo(() => {
    const g = growth / 100;
    const rent: number[] = [0];
    const own: number[] = [build];

    for (let k = 1; k <= YEARS; k += 1) {
      rent.push(rent[k - 1] + annual * (1 + g) ** (k - 1));
      own.push(build + upkeep * k);
    }

    let crossover: number | null = null;
    for (let k = 1; k <= YEARS; k += 1) {
      if (own[k] <= rent[k]) {
        crossover = k;
        break;
      }
    }

    return { rent, own, crossover, horizon: rent[YEARS], ownedTotal: own[YEARS] };
  }, [annual, growth, build, upkeep]);

  useEffect(() => {
    const raw = window.location.hash.replace(/^#stack=/, "");
    if (raw && raw !== window.location.hash) {
      const decoded = decodeState(decodeURIComponent(raw));
      if (decoded) {
        setCurrency(decoded.currency);
        setGrowth(decoded.growth);
        setBuildOverride(decoded.build);
        setUpkeepPct(decoded.upkeep);
        setLines(decoded.lines);
      }
    }
    hydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    const id = window.setTimeout(() => {
      const encoded = encodeState(lines, currency, growth, build, upkeepPct);
      window.history.replaceState(null, "", `#stack=${encoded}`);
    }, 400);
    return () => window.clearTimeout(id);
  }, [lines, currency, growth, build, upkeepPct]);

  const copyLink = useCallback(async () => {
    const encoded = encodeState(lines, currency, growth, build, upkeepPct);
    const url = `${window.location.origin}${window.location.pathname}#stack=${encoded}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      window.prompt("Copy this link", url);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2600);
  }, [lines, currency, growth, build, upkeepPct]);

  const update = (id: string, raw: string) => {
    const value = Math.max(0, Math.min(10_000_000, Number(raw) || 0));
    setLines((prev) =>
      prev.map((l) => (l.id === id ? { ...l, amount: value } : l)),
    );
    setSheetState("idle");
  };

  const downloadSheet = () => {
    generateRentSheet(
      {
        currency,
        growth,
        years: YEARS,
        lines: lines.map(({ label, amount }) => ({ label, amount })),
        monthly,
        annual,
        horizon: model.horizon,
        build,
        upkeep,
        ownedTotal: model.ownedTotal,
        crossover: model.crossover,
        rentSeries: model.rent,
        ownSeries: model.own,
      },
      new Date(),
    );
    setSheetState("done");
  };

  const numberField =
    "tabular h-10 rounded-[2px] border border-limestone-line bg-white/45 px-3 text-right text-[0.9375rem] text-quarry-950 transition-colors hover:border-quarry-500 focus:border-oxide-deep";

  return (
    <div className="mt-14 lg:mt-16">
      <Reveal className="flex flex-wrap items-end justify-between gap-6 border-b border-quarry-700/40 pb-5">
        <p className="max-w-[46ch] text-sm leading-relaxed text-quarry-600">
          The amounts below are placeholders, not Corehold statistics. Replace
          them with what you actually pay. The arithmetic is the point.
        </p>

        <div className="flex flex-wrap items-end gap-6">
          <div>
            <label htmlFor={currencyId} className="tag block text-quarry-600">
              Currency
            </label>
            <select
              id={currencyId}
              value={currency}
              onChange={(e) =>
                setCurrency(e.target.value as (typeof CURRENCIES)[number])
              }
              className="mt-2 h-10 rounded-[2px] border border-limestone-line bg-transparent px-3 font-mono text-sm text-quarry-900 transition-colors hover:border-quarry-500"
            >
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor={growthId} className="tag block text-quarry-600">
              Assumed yearly increase
            </label>
            <div className="mt-2 flex items-center gap-2">
              <input
                id={growthId}
                type="number"
                min={0}
                max={40}
                step={1}
                value={growth}
                onChange={(e) =>
                  setGrowth(
                    Math.max(0, Math.min(40, Number(e.target.value) || 0)),
                  )
                }
                className="tabular h-10 w-20 rounded-[2px] border border-limestone-line bg-transparent px-3 text-right font-mono text-sm text-quarry-900 transition-colors hover:border-quarry-500"
              />
              <span className="font-mono text-sm text-quarry-600">%</span>
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal>
        <fieldset className="mt-2">
          <legend className="sr-only">
            Your current monthly software subscriptions
          </legend>

          <ul className="divide-y divide-limestone-line/70">
            {lines.map((line) => (
              <li
                key={line.id}
                className="flex flex-wrap items-center gap-x-6 gap-y-2 py-4 transition-colors hover:bg-limestone-dim/45 sm:py-3.5"
              >
                <label
                  htmlFor={`ledger-${line.id}`}
                  className="min-w-0 flex-1 basis-[16rem]"
                >
                  <span className="block text-[0.9375rem] text-quarry-900">
                    {line.label}
                  </span>
                  <span className="mt-0.5 block font-mono text-xs text-quarry-600">
                    {line.note}
                  </span>
                </label>

                <div className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="font-mono text-xs tracking-[0.12em] text-quarry-600"
                  >
                    {currency}
                  </span>
                  <input
                    id={`ledger-${line.id}`}
                    type="number"
                    inputMode="numeric"
                    min={0}
                    step={50}
                    value={line.amount}
                    onChange={(e) => update(line.id, e.target.value)}
                    aria-label={`${line.label} — monthly cost in ${currency}`}
                    className={`${numberField} w-32`}
                  />
                  <span className="w-16 font-mono text-xs text-quarry-600">
                    / month
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </fieldset>
      </Reveal>

      <Reveal>
        <div aria-live="polite" className="mt-10 border-t-2 border-quarry-950 pt-8">
          <dl className="grid gap-8 sm:grid-cols-3">
            <div>
              <dt className="tag text-quarry-600">Rented / month</dt>
              <dd className="tabular mt-3 text-minor text-quarry-950">
                {fmt.format(monthly)}
              </dd>
            </div>
            <div className="sm:border-l sm:border-limestone-line sm:pl-8">
              <dt className="tag text-quarry-600">Rented / year</dt>
              <dd className="tabular mt-3 text-minor text-quarry-950">
                {fmt.format(annual)}
              </dd>
            </div>
            <div className="sm:border-l sm:border-limestone-line sm:pl-8">
              <dt className="tag text-oxide-deep">
                Over {YEARS} years, at {growth}% / yr
              </dt>
              <dd className="tabular mt-3 text-major leading-none text-oxide-deep">
                {fmt.format(model.horizon)}
              </dd>
            </div>
          </dl>

          <p className="mt-9 max-w-[46ch] text-lede text-quarry-900">
            Equity acquired at the end of those {YEARS} years:{" "}
            <span className="font-mono text-quarry-950">nothing</span>. Stop
            paying and it all switches off.
          </p>
        </div>
      </Reveal>

      {/* ------------------------------------------------ ownership model --- */}
      <Reveal>
        <div className="mt-16 border-t border-limestone-line pt-12">
          <div className="flex flex-wrap items-start justify-between gap-8">
            <div className="max-w-[44ch]">
              <p className="tag text-oxide-deep">Now set the other side</p>
              <h2 className="mt-5 text-minor text-quarry-950">
                What would owning it cost instead?
              </h2>
              <p className="mt-4 text-[0.9375rem] leading-relaxed text-quarry-700">
                We will not put a Corehold number here — we do not have one
                until we have audited your business. So set your own. The
                default is eighteen months of your current rent, which is a
                reasonable place to start an argument and a poor place to end
                one.
              </p>
            </div>

            <div className="flex flex-wrap gap-6">
              <div>
                <label htmlFor={buildId} className="tag block text-quarry-600">
                  One-time build
                </label>
                <div className="mt-2 flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="font-mono text-xs tracking-[0.12em] text-quarry-600"
                  >
                    {currency}
                  </span>
                  <input
                    id={buildId}
                    type="number"
                    inputMode="numeric"
                    min={0}
                    step={5000}
                    value={build}
                    onChange={(e) => {
                      setBuildOverride(
                        Math.max(0, Math.min(50_000_000, Number(e.target.value) || 0)),
                      );
                      setSheetState("idle");
                    }}
                    className={`${numberField} w-40`}
                  />
                </div>
              </div>

              <div>
                <label htmlFor={upkeepId} className="tag block text-quarry-600">
                  Annual upkeep
                </label>
                <div className="mt-2 flex items-center gap-2">
                  <input
                    id={upkeepId}
                    type="number"
                    min={0}
                    max={60}
                    step={1}
                    value={upkeepPct}
                    onChange={(e) => {
                      setUpkeepPct(
                        Math.max(0, Math.min(60, Number(e.target.value) || 0)),
                      );
                      setSheetState("idle");
                    }}
                    className={`${numberField} w-20 text-right font-mono text-sm`}
                  />
                  <span className="font-mono text-sm text-quarry-600">
                    % of build
                  </span>
                </div>
              </div>
            </div>
          </div>

          <OwnershipChart
            series={{ rent: model.rent, own: model.own }}
            years={YEARS}
            currency={currency}
            crossover={model.crossover}
          />

          <div
            aria-live="polite"
            className="mt-10 flex flex-wrap items-end justify-between gap-8 border-t border-limestone-line pt-8"
          >
            <p className="max-w-[48ch] text-lede text-quarry-900">
              {model.crossover
                ? `On your own figures, ownership costs less from year ${model.crossover} — and the gap widens every year after that.`
                : `On your own figures, ownership does not pay back inside ${YEARS} years. If an audit found that, we would tell you not to build.`}
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                type="button"
                onClick={copyLink}
                variant="secondary"
                ground="light"
                size="lg"
                trailing={<LinkGlyph />}
              >
                {copied ? "Link copied" : "Copy this stack as a link"}
              </Button>
              <Button
                type="button"
                onClick={downloadSheet}
                variant="secondary"
                ground="light"
                size="lg"
                trailing={<DownloadGlyph />}
              >
                {sheetState === "done" ? "Sheet downloaded" : "Download the sheet"}
              </Button>
              <ButtonLink href={ctaHref} size="lg" trailing={<Arrow />}>
                Find out what yours really costs
              </ButtonLink>
            </div>
          </div>

          <p className="mt-5 max-w-[76ch] font-mono text-xs leading-relaxed text-quarry-600">
            The sheet is a one-page PDF built in your browser from the figures
            above. The link encodes those figures in the address itself — there
            is no account, no cookie and no database behind it. Nothing you type
            here is uploaded anywhere, which felt like the only defensible way to
            build a share button on this particular website.
          </p>
        </div>
      </Reveal>
    </div>
  );
}

function LinkGlyph() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className="h-3.5 w-3.5 shrink-0 transition-transform duration-200 ease-[cubic-bezier(0.22,0.68,0.24,1)] group-hover:translate-x-0.5"
    >
      <path
        d="M6.5 9.5 9.5 6.5M6 4.5 7.8 2.7a2.8 2.8 0 0 1 4 4L10 8.5M10 11.5l-1.8 1.8a2.8 2.8 0 0 1-4-4L6 7.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
    </svg>
  );
}

function DownloadGlyph() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className="h-3.5 w-3.5 shrink-0 transition-transform duration-200 ease-[cubic-bezier(0.22,0.68,0.24,1)] group-hover:translate-y-0.5"
    >
      <path
        d="M8 1v9M4.5 6.5 8 10l3.5-3.5M2 14h12"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="square"
      />
    </svg>
  );
}
