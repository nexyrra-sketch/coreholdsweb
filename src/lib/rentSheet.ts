import { PdfPage, buildPdf, downloadBlob, PAGE } from "./pdf";
import { site } from "./site";

const OXIDE: [number, number, number] = [0.749, 0.275, 0.106];
const INK: [number, number, number] = [0.09, 0.1, 0.098];
const MID: [number, number, number] = [0.42, 0.44, 0.43];
const HAIR: [number, number, number] = [0.78, 0.76, 0.72];

const M = 56; // page margin
const RIGHT = PAGE.width - M;

export type SheetInput = {
  currency: string;
  growth: number;
  years: number;
  lines: { label: string; amount: number }[];
  monthly: number;
  annual: number;
  horizon: number;
  build: number;
  upkeep: number;
  ownedTotal: number;
  crossover: number | null;
  rentSeries: number[];
  ownSeries: number[];
};

const money = (currency: string, value: number) =>
  `${currency} ${Math.round(value).toLocaleString("en-US")}`;

/** Draws the Corehold mark as vector paths — no raster asset in the file. */
function mark(page: PdfPage, x: number, top: number, s: number) {
  const t = s / 32;
  page.stroke(MID);
  page.path(
    [
      [x + 3 * t, top + 13.5 * t],
      [x + 3 * t, top + 3 * t],
      [x + 13.5 * t, top + 3 * t],
    ],
    { color: MID, width: 3 * t },
  );
  page.path(
    [
      [x + 29 * t, top + 18.5 * t],
      [x + 29 * t, top + 29 * t],
      [x + 18.5 * t, top + 29 * t],
    ],
    { color: MID, width: 3 * t },
  );
  page.box(x + 11 * t, top + 11 * t, 10 * t, 10 * t, { color: OXIDE });
}

export function generateRentSheet(input: SheetInput, stamp: Date) {
  const page = new PdfPage();
  const date = stamp.toISOString().slice(0, 10);

  // ------------------------------------------------------------- masthead --
  mark(page, M, 46, 22);
  page.text(M + 32, 64, "COREHOLD", { size: 13, font: "bold", color: INK, charSpace: 0.6 });
  page.text(RIGHT - 150, 56, "RENT EXPOSURE SHEET", {
    size: 8,
    font: "mono",
    color: MID,
    charSpace: 1.4,
  });
  page.text(RIGHT - 150, 70, `GENERATED ${date}`, {
    size: 8,
    font: "mono",
    color: MID,
    charSpace: 1.4,
  });

  page.rule(M, 88, RIGHT, { color: INK, width: 1.2 });

  // ----------------------------------------------------------------- lede --
  page.text(M, 122, "What you are currently renting.", {
    size: 22,
    font: "bold",
    color: INK,
  });
  page.text(
    M,
    146,
    "Compiled from the figures you entered on corehold.com. These are your numbers, not ours.",
    { size: 9.5, color: MID },
  );
  page.text(
    M,
    160,
    "This is arithmetic, not a quotation. Corehold prices work only after an audit.",
    { size: 9.5, color: MID },
  );

  // -------------------------------------------------------------- ledger ---
  let y = 200;
  page.text(M, y, "THE LEDGER", { size: 8, font: "mono", color: OXIDE, charSpace: 1.4 });
  page.text(RIGHT - 90, y, "PER MONTH", {
    size: 8,
    font: "mono",
    color: MID,
    charSpace: 1.4,
  });
  y += 8;
  page.rule(M, y, RIGHT, { color: HAIR });

  for (const line of input.lines) {
    y += 21;
    page.text(M, y, line.label, { size: 10, color: INK });
    page.text(RIGHT - 90, y, money(input.currency, line.amount), {
      size: 10,
      font: "mono",
      color: INK,
    });
    page.rule(M, y + 7, RIGHT, { color: HAIR, width: 0.4 });
  }

  // -------------------------------------------------------------- totals ---
  y += 34;
  page.rule(M, y - 12, RIGHT, { color: INK, width: 1.2 });

  const totals: [string, string][] = [
    ["RENTED / MONTH", money(input.currency, input.monthly)],
    ["RENTED / YEAR", money(input.currency, input.annual)],
    [
      `OVER ${input.years} YEARS AT ${input.growth}% / YR`,
      money(input.currency, input.horizon),
    ],
  ];

  const colWidth = (RIGHT - M) / 3;
  totals.forEach(([label, value], i) => {
    const x = M + i * colWidth;
    page.text(x, y, label, { size: 7.5, font: "mono", color: MID, charSpace: 1.2 });
    page.text(x, y + 22, value, {
      size: 15,
      font: "bold",
      color: i === 2 ? OXIDE : INK,
    });
  });

  y += 52;
  page.text(
    M,
    y,
    `Equity acquired at the end of those ${input.years} years: nothing. Stop paying and it switches off.`,
    { size: 10, color: INK },
  );

  // ------------------------------------------------------------- scenario --
  y += 40;
  page.rule(M, y - 14, RIGHT, { color: HAIR });
  page.text(M, y, "THE OWNERSHIP SCENARIO YOU SET", {
    size: 8,
    font: "mono",
    color: OXIDE,
    charSpace: 1.4,
  });

  y += 20;
  const scenario: [string, string][] = [
    ["One-time build", money(input.currency, input.build)],
    ["Annual upkeep", money(input.currency, input.upkeep)],
    [`Owned, over ${input.years} years`, money(input.currency, input.ownedTotal)],
    [
      "Break-even",
      input.crossover
        ? `Year ${input.crossover} of ${input.years}`
        : `Not inside ${input.years} years`,
    ],
  ];

  for (const [label, value] of scenario) {
    page.text(M, y, label, { size: 10, color: INK });
    page.text(RIGHT - 160, y, value, { size: 10, font: "mono", color: INK });
    page.rule(M, y + 7, RIGHT, { color: HAIR, width: 0.4 });
    y += 21;
  }

  y += 14;
  page.text(
    M,
    y,
    input.crossover
      ? `On your own figures, ownership costs less from year ${input.crossover} onward - and keeps costing less.`
      : `On your own figures, ownership does not pay back inside ${input.years} years. We would tell you that.`,
    { size: 10, color: INK },
  );

  // ---------------------------------------------------------------- plot --
  y += 30;
  page.text(M, y - 8, "CUMULATIVE OUTLAY", {
    size: 6.5,
    font: "mono",
    color: MID,
    charSpace: 0.8,
  });
  const plot = { top: y, height: 68, left: M + 4, right: RIGHT - 74 };
  const maxValue = Math.max(...input.rentSeries, ...input.ownSeries, 1);
  const px = (i: number) =>
    plot.left + (i / input.years) * (plot.right - plot.left);
  const py = (v: number) => plot.top + plot.height - (v / maxValue) * plot.height;

  page.rule(plot.left, plot.top + plot.height, plot.right, { color: INK, width: 0.8 });
  for (let i = 0; i <= input.years; i += 1) {
    page.path(
      [
        [px(i), plot.top + plot.height],
        [px(i), plot.top + plot.height + 4],
      ],
      { color: HAIR, width: 0.6 },
    );
    page.text(px(i) - 8, plot.top + plot.height + 15, i === 0 ? "NOW" : `YR ${i}`, {
      size: 6.5,
      font: "mono",
      color: MID,
      charSpace: 0.8,
    });
  }

  if (input.crossover !== null) {
    page.path(
      [
        [px(input.crossover), plot.top - 6],
        [px(input.crossover), plot.top + plot.height],
      ],
      { color: HAIR, width: 0.6 },
    );
    page.text(px(input.crossover) + 4, plot.top - 8, "BREAK-EVEN", {
      size: 6.5,
      font: "mono",
      color: OXIDE,
      charSpace: 0.8,
    });
  }

  page.path(
    input.rentSeries.map((v, i) => [px(i), py(v)] as [number, number]),
    { color: OXIDE, width: 1.6 },
  );
  page.path(
    input.ownSeries.map((v, i) => [px(i), py(v)] as [number, number]),
    { color: MID, width: 1.6 },
  );

  page.box(plot.right + 8, py(input.rentSeries[input.years]) - 2, 4, 4, { color: OXIDE });
  page.text(plot.right + 16, py(input.rentSeries[input.years]) + 2, "RENTED", {
    size: 6.5,
    font: "mono",
    color: OXIDE,
    charSpace: 0.8,
  });
  page.box(plot.right + 8, py(input.ownSeries[input.years]) - 2, 4, 4, { color: MID });
  page.text(plot.right + 16, py(input.ownSeries[input.years]) + 2, "OWNED", {
    size: 6.5,
    font: "mono",
    color: MID,
    charSpace: 0.8,
  });

  // --------------------------------------------------------------- footer --
  const footTop = PAGE.height - 118;
  page.rule(M, footTop, RIGHT, { color: INK, width: 1.2 });
  page.text(M, footTop + 24, "Own the system your business runs on.", {
    size: 12,
    font: "bold",
    color: INK,
  });
  page.text(M, footTop + 40, "Stop renting it.", { size: 12, color: MID });
  page.text(
    M,
    footTop + 62,
    "Every engagement begins with an audit. Some of them end there.",
    { size: 9, color: MID },
  );
  page.text(RIGHT - 190, footTop + 24, `${site.email}`, {
    size: 9,
    font: "mono",
    color: OXIDE,
  });
  page.text(RIGHT - 190, footTop + 40, "corehold.com/audit", {
    size: 9,
    font: "mono",
    color: MID,
  });
  page.text(RIGHT - 190, footTop + 56, "Dubai, United Arab Emirates", {
    size: 9,
    font: "mono",
    color: MID,
  });

  const blob = buildPdf(page, {
    title: "Corehold — Rent Exposure Sheet",
    author: "Corehold",
    subject: "A five-year view of current software subscription spend",
  });

  downloadBlob(blob, `corehold-rent-exposure-${date}.pdf`);
}
