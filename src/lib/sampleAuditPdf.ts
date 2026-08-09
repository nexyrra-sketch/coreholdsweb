import { PdfPage, buildPdf, downloadBlob, PAGE, widthOf } from "./pdf";
import {
  INK,
  MARGIN,
  RIGHT,
  COLUMN,
  drawMark,
  masthead,
  pageFooter,
  sectionLabel,
  stamp,
} from "./pdfChrome";
import { site } from "./site";
import {
  specimen,
  summary,
  verdict,
  register,
  leaks,
  lockIn,
  horizon,
  architecture,
  handover,
  contents,
} from "@/data/sampleAudit";

/**
 * The specimen audit, rendered as an eight-page document.
 *
 * This is the deliverable a client actually receives, produced by the same
 * engine that runs the website — which is the point. A studio whose product is
 * a document should be able to typeset one.
 *
 * Every page carries a SPECIMEN mark in the running footer. Nothing in here
 * describes a real engagement.
 */

const money = (v: number) => `${specimen.currency} ${Math.round(v).toLocaleString("en-US")}`;
const compact = (v: number) =>
  v >= 1_000_000 ? `${(v / 1_000_000).toFixed(2)}M` : `${Math.round(v / 1000)}k`;

function sheet(index: number, total: number) {
  const page = new PdfPage();
  pageFooter(
    page,
    `SPECIMEN - COMPOSITE SCENARIO - NOT A CLIENT ENGAGEMENT`,
    `${String(index).padStart(2, "0")} / ${String(total).padStart(2, "0")}`,
  );
  return page;
}

export function generateSampleAudit(stampDate: Date) {
  const date = stampDate.toISOString().slice(0, 10);
  const total = 8;
  const pages: PdfPage[] = [];

  /* ------------------------------------------------------------- cover -- */
  {
    const p = sheet(1, total);
    drawMark(p, MARGIN, 92, 40);
    p.text(MARGIN, 168, "SYSTEM AUDIT", {
      size: 9,
      font: "mono",
      color: INK.mid,
      charSpace: 2.2,
    });
    p.text(MARGIN, 216, "What is actually", { size: 34, font: "bold", color: INK.black });
    p.text(MARGIN, 252, "running this company?", { size: 34, font: "bold", color: INK.black });

    p.rule(MARGIN, 288, RIGHT, { color: INK.black, width: 1.2 });

    let y = 316;
    const facts: [string, string][] = [
      ["SUBJECT", `${specimen.subject} (${specimen.subjectNote})`],
      ["SECTOR", specimen.sector],
      ["SIZE", specimen.size],
      ["AUDIT WINDOW", specimen.window],
      ["ISSUED", date],
      ["DOCUMENT", `Corehold specimen audit v${specimen.version}`],
    ];
    for (const [k, v] of facts) {
      p.text(MARGIN, y, k, { size: 7.5, font: "mono", color: INK.mid, charSpace: 1.3 });
      p.text(MARGIN + 130, y, v, { size: 10, color: INK.black });
      p.rule(MARGIN, y + 8, RIGHT, { color: INK.hair, width: 0.4 });
      y += 24;
    }

    y += 22;
    stamp(p, y, "SPECIMEN");
    y += 26;
    p.paragraph(
      MARGIN,
      y,
      "Meridian Freight is a composite. It is not a Corehold client, has never been one, and does not exist. This document is published so that a company considering an audit can see precisely what the deliverable is, rather than imagining it. Every figure inside is an illustrative worked example, assembled from the shape these engagements typically take.",
      { width: COLUMN, size: 9.5, color: INK.mid, leading: 14 },
    );

    y = 600;
    sectionLabel(p, y, "--", "Contents");
    y += 22;
    for (const [n, label] of contents) {
      p.text(MARGIN, y, n, { size: 9, font: "mono", color: INK.oxide, charSpace: 1.2 });
      p.text(MARGIN + 32, y, label, { size: 10, color: INK.black });
      p.rule(MARGIN, y + 7, RIGHT, { color: INK.hair, width: 0.4 });
      y += 20;
    }
    pages.push(p);
  }

  /* --------------------------------------------------- 01 summary ------- */
  {
    const p = sheet(2, total);
    masthead(p, "SYSTEM AUDIT", `SPECIMEN ${date}`);
    let y = 128;
    sectionLabel(p, y, "01", "Executive summary");
    y += 34;
    p.text(MARGIN, y, "Five findings.", { size: 22, font: "bold", color: INK.black });
    y += 30;

    for (const [head, body] of summary) {
      p.text(MARGIN, y, head, { size: 11, font: "bold", color: INK.black });
      y = p.paragraph(MARGIN, y + 15, body, {
        width: COLUMN,
        size: 9.5,
        color: INK.mid,
        leading: 13.5,
      });
      y += 16;
      p.rule(MARGIN, y - 6, RIGHT, { color: INK.hair, width: 0.4 });
      y += 12;
    }

    y += 10;
    sectionLabel(p, y, "--", "The recommendation");
    y += 26;
    p.paragraph(MARGIN, y, verdict.headline, {
      width: COLUMN,
      size: 14,
      font: "bold",
      color: INK.oxide,
      leading: 19,
    });
    y += 44;
    p.paragraph(MARGIN, y, verdict.body, {
      width: COLUMN,
      size: 9.5,
      color: INK.black,
      leading: 14,
    });
    pages.push(p);
  }

  /* --------------------------------------------------- 02 system map ---- */
  {
    const p = sheet(3, total);
    masthead(p, "SYSTEM AUDIT", `SPECIMEN ${date}`);
    let y = 128;
    sectionLabel(p, y, "02", "The system as it stands");
    y += 34;
    p.text(MARGIN, y, "Fourteen providers, three", { size: 22, font: "bold", color: INK.black });
    p.text(MARGIN, y + 28, "versions of the same truth.", { size: 22, font: "bold", color: INK.black });
    y += 62;

    y = p.paragraph(
      MARGIN,
      y,
      "The map below is the first time this business has existed in one drawing. Solid lines are real integrations. Dashed lines are people: an operator opening two tabs and typing the same shipment twice.",
      { width: COLUMN, size: 9.5, color: INK.mid, leading: 14 },
    );
    y += 42;

    // --- the map, drawn -----------------------------------------------
    const cx = PAGE.width / 2;
    const top = y;
    const nodes: [string, number, number, boolean][] = [
      ["CRM", cx - 170, top + 20, false],
      ["OPS SHEET", cx, top + 0, true],
      ["INVOICING", cx + 170, top + 20, false],
      ["HELPDESK", cx - 210, top + 110, false],
      ["CUSTOMS", cx + 210, top + 110, false],
      ["ACCOUNTING", cx + 150, top + 190, false],
      ["ANALYTICS", cx - 150, top + 190, false],
      ["WEBSITE", cx, top + 220, false],
    ];

    const at = (i: number) => ({ x: nodes[i][1], y: nodes[i][2] });
    const manual: [number, number][] = [
      [0, 1],
      [1, 2],
      [0, 3],
      [1, 6],
      [2, 5],
    ];
    const wired: [number, number][] = [
      [2, 4],
      [1, 4],
      [0, 7],
    ];

    for (const [a, b] of wired) {
      p.path([[at(a).x, at(a).y], [at(b).x, at(b).y]], { color: INK.hair, width: 0.9 });
    }
    for (const [a, b] of manual) {
      const A = at(a);
      const B = at(b);
      const mx = (A.x + B.x) / 2;
      const my = (A.y + B.y) / 2;
      p.path([[A.x, A.y], [mx - (mx - A.x) * 0.22, my - (my - A.y) * 0.22]], {
        color: INK.mid,
        width: 0.9,
      });
      p.path([[B.x, B.y], [mx - (mx - B.x) * 0.22, my - (my - B.y) * 0.22]], {
        color: INK.mid,
        width: 0.9,
      });
      p.box(mx - 2, my - 2, 4, 4, { color: INK.oxide });
    }

    for (const [label, nx, ny, isCore] of nodes) {
      const w = widthOf(label, 7.5, "mono", 1.2) + 14;
      // Knock the label out of the paper first so no connector crosses it.
      p.box(nx - w / 2, ny - 8, w, 16, { color: [1, 1, 1] });
      p.box(nx - w / 2, ny - 8, w, 16, {
        color: isCore ? INK.oxide : INK.black,
        mode: "stroke",
        width: isCore ? 1.2 : 0.7,
      });
      p.text(nx - w / 2 + 7, ny + 3, label, {
        size: 7.5,
        font: "mono",
        color: INK.black,
        charSpace: 1.2,
      });
    }

    y = top + 262;
    p.box(MARGIN, y - 4, 8, 8, { color: INK.oxide });
    p.text(MARGIN + 16, y + 3, "= a person, moving data by hand", {
      size: 8.5,
      color: INK.mid,
    });
    p.text(MARGIN + 210, y + 3, "Bold outline = treated as the source of truth by operations", {
      size: 8.5,
      color: INK.mid,
    });

    y += 40;
    p.paragraph(
      MARGIN,
      y,
      "Note that the tool operations actually trusts is a spreadsheet. That is not a failure of discipline — it is the only place the whole shipment is visible at once, which is exactly the gap the recommended build closes.",
      { width: COLUMN, size: 9.5, color: INK.black, leading: 14 },
    );
    pages.push(p);
  }

  /* --------------------------------------------------- 03 register ------ */
  {
    const p = sheet(4, total);
    masthead(p, "SYSTEM AUDIT", `SPECIMEN ${date}`);
    let y = 128;
    sectionLabel(p, y, "03", "Subscription register");
    y += 34;
    p.text(MARGIN, y, "Everything, in one number.", {
      size: 22,
      font: "bold",
      color: INK.black,
    });
    y += 34;

    p.text(MARGIN, y, "CATEGORY", { size: 7, font: "mono", color: INK.mid, charSpace: 1.2 });
    p.text(MARGIN + 200, y, "PLAN", { size: 7, font: "mono", color: INK.mid, charSpace: 1.2 });
    p.textRight(MARGIN + 366, y, "ANNUAL", {
      size: 7,
      font: "mono",
      color: INK.mid,
      charSpace: 1.2,
    });
    p.text(MARGIN + 380, y, "NOTE", { size: 7, font: "mono", color: INK.mid, charSpace: 1.2 });
    y += 8;
    p.rule(MARGIN, y, RIGHT, { color: INK.black, width: 0.8 });
    y += 16;

    let totalAnnual = 0;
    for (const [category, plan, annual, note] of register) {
      totalAnnual += Number(annual.replace(/,/g, ""));
      p.text(MARGIN, y, category, { size: 9.5, color: INK.black });
      p.text(MARGIN + 200, y, plan, { size: 8.5, font: "mono", color: INK.mid });
      p.textRight(MARGIN + 366, y, annual, { size: 9.5, font: "mono", color: INK.black });
      p.text(MARGIN + 380, y, note, { size: 8.5, color: INK.mid });
      p.rule(MARGIN, y + 7, RIGHT, { color: INK.hair, width: 0.4 });
      y += 20;
    }

    y += 8;
    p.rule(MARGIN, y - 10, RIGHT, { color: INK.black, width: 1 });
    p.text(MARGIN, y + 8, "TOTAL ANNUAL RENT", {
      size: 8,
      font: "mono",
      color: INK.mid,
      charSpace: 1.3,
    });
    p.textRight(RIGHT, y + 12, money(totalAnnual), {
      size: 18,
      font: "bold",
      color: INK.oxide,
    });

    y += 44;
    p.paragraph(
      MARGIN,
      y,
      "Of that total, the audit recommends keeping AED 249,200 of it. The argument is never that subscriptions are bad — it is that the ones holding your operating data hostage should not be among them.",
      { width: COLUMN, size: 9.5, color: INK.black, leading: 14 },
    );
    pages.push(p);
  }

  /* --------------------------------------------------- 04 leaks --------- */
  {
    const p = sheet(5, total);
    masthead(p, "SYSTEM AUDIT", `SPECIMEN ${date}`);
    let y = 128;
    sectionLabel(p, y, "04", "Where the money and time leak");
    y += 34;
    p.text(MARGIN, y, "Ranked by what they cost.", {
      size: 22,
      font: "bold",
      color: INK.black,
    });
    y += 36;

    leaks.forEach(([title, cost, note], i) => {
      p.text(MARGIN, y, String(i + 1).padStart(2, "0"), {
        size: 8,
        font: "mono",
        color: INK.oxide,
        charSpace: 1.2,
      });
      p.text(MARGIN + 28, y, title, { size: 11, font: "bold", color: INK.black });
      p.textRight(RIGHT, y, cost, { size: 10, font: "mono", color: INK.oxide });
      y = p.paragraph(MARGIN + 28, y + 16, note, {
        width: COLUMN - 28,
        size: 9.5,
        color: INK.mid,
        leading: 13.5,
      });
      y += 14;
      p.rule(MARGIN, y - 6, RIGHT, { color: INK.hair, width: 0.4 });
      y += 14;
    });

    y += 6;
    p.paragraph(
      MARGIN,
      y,
      "Two of these are fixable this week without any project at all: cancel the dormant tools, and choose between the CRM and the helpdesk. We would rather you did those before deciding anything about a build.",
      { width: COLUMN, size: 10, color: INK.black, leading: 14.5 },
    );
    pages.push(p);
  }

  /* --------------------------------------------------- 05 lock-in ------- */
  {
    const p = sheet(6, total);
    masthead(p, "SYSTEM AUDIT", `SPECIMEN ${date}`);
    let y = 128;
    sectionLabel(p, y, "05", "Dependency and lock-in");
    y += 34;
    p.text(MARGIN, y, "How hard would it be to leave?", {
      size: 22,
      font: "bold",
      color: INK.black,
    });
    y += 32;
    y = p.paragraph(
      MARGIN,
      y,
      "Cost is the visible half of renting. The other half is what happens if a provider changes its pricing, its terms or its mind. Note that high lock-in is not automatically a problem — on the customs platform it is simply the price of a real regulatory capability, and we say so.",
      { width: COLUMN, size: 9.5, color: INK.mid, leading: 14 },
    );
    y += 40;

    p.text(MARGIN, y, "PROVIDER", { size: 7, font: "mono", color: INK.mid, charSpace: 1.2 });
    p.text(MARGIN + 190, y, "EXIT DIFFICULTY", {
      size: 7,
      font: "mono",
      color: INK.mid,
      charSpace: 1.2,
    });
    y += 8;
    p.rule(MARGIN, y, RIGHT, { color: INK.black, width: 0.8 });
    y += 18;

    for (const [provider, level, note] of lockIn) {
      p.text(MARGIN, y, provider, { size: 10, color: INK.black });
      p.text(MARGIN + 190, y, level, {
        size: 9,
        font: "mono",
        color: level.startsWith("High") ? INK.oxide : INK.mid,
      });
      y = p.paragraph(MARGIN, y + 15, note, {
        width: COLUMN,
        size: 9,
        color: INK.mid,
        leading: 13,
      });
      p.rule(MARGIN, y + 9, RIGHT, { color: INK.hair, width: 0.4 });
      y += 26;
    }

    y += 10;
    stamp(p, y, "THE HONEST NOTE");
    y += 24;
    p.paragraph(
      MARGIN,
      y,
      "The website retainer is the cheapest thing on this list to fix and the one nobody raised. Meridian cannot publish a page without asking permission. That is a small, permanent tax on how fast the company can speak.",
      { width: COLUMN, size: 10, color: INK.black, leading: 14.5 },
    );
    pages.push(p);
  }

  /* --------------------------------------------------- 06 horizon ------- */
  {
    const p = sheet(7, total);
    masthead(p, "SYSTEM AUDIT", `SPECIMEN ${date}`);
    let y = 128;
    sectionLabel(p, y, "06", "Five-year comparison");
    y += 34;
    p.text(MARGIN, y, "Rent compounds. Ownership flattens.", {
      size: 20,
      font: "bold",
      color: INK.black,
    });
    y += 30;
    y = p.paragraph(MARGIN, y, `${horizon.rentNote} ${horizon.ownNote}`, {
      width: COLUMN,
      size: 9.5,
      color: INK.mid,
      leading: 14,
    });
    y += 44;

    const plot = { top: y, height: 150, left: MARGIN + 30, right: RIGHT - 70 };
    const max = Math.max(...horizon.rent, ...horizon.own);
    const px = (i: number) => plot.left + (i / horizon.years) * (plot.right - plot.left);
    const py = (v: number) => plot.top + plot.height - (v / max) * plot.height;

    for (let g = 0; g <= 4; g += 1) {
      const gy = plot.top + (plot.height * g) / 4;
      p.rule(plot.left, gy, plot.right, { color: INK.hair, width: 0.4 });
      p.textRight(plot.left - 8, gy + 3, compact((max * (4 - g)) / 4), {
        size: 7,
        font: "mono",
        color: INK.mid,
      });
    }

    p.rule(plot.left, plot.top + plot.height, plot.right, { color: INK.black, width: 0.9 });
    for (let i = 0; i <= horizon.years; i += 1) {
      p.text(px(i) - 10, plot.top + plot.height + 16, i === 0 ? "NOW" : `YR ${i}`, {
        size: 7,
        font: "mono",
        color: INK.mid,
        charSpace: 0.8,
      });
    }

    p.path([[px(horizon.crossover), plot.top - 8], [px(horizon.crossover), plot.top + plot.height]], {
      color: INK.hair,
      width: 0.6,
    });
    p.text(px(horizon.crossover) + 5, plot.top - 10, "BREAK-EVEN", {
      size: 7,
      font: "mono",
      color: INK.oxide,
      charSpace: 0.9,
    });

    p.path(horizon.rent.map((v, i) => [px(i), py(v)] as [number, number]), {
      color: INK.oxide,
      width: 1.8,
    });
    p.path(horizon.own.map((v, i) => [px(i), py(v)] as [number, number]), {
      color: INK.mid,
      width: 1.8,
    });

    p.box(plot.right + 8, py(horizon.rent[horizon.years]) - 2, 4, 4, { color: INK.oxide });
    p.text(plot.right + 16, py(horizon.rent[horizon.years]) + 2, "RENTED", {
      size: 7,
      font: "mono",
      color: INK.oxide,
      charSpace: 0.8,
    });
    p.box(plot.right + 8, py(horizon.own[horizon.years]) - 2, 4, 4, { color: INK.mid });
    p.text(plot.right + 16, py(horizon.own[horizon.years]) + 2, "OWNED", {
      size: 7,
      font: "mono",
      color: INK.mid,
      charSpace: 0.8,
    });

    y = plot.top + plot.height + 48;
    const cells: [string, string][] = [
      ["BREAK-EVEN", `Year ${horizon.crossover}`],
      ["RENTED, 5 YR", compact(horizon.rent[horizon.years])],
      ["OWNED, 5 YR", compact(horizon.own[horizon.years])],
    ];
    cells.forEach(([k, v], i) => {
      const x = MARGIN + i * (COLUMN / 3);
      p.text(x, y, k, { size: 7.5, font: "mono", color: INK.mid, charSpace: 1.2 });
      p.text(x, y + 22, v, {
        size: 16,
        font: "bold",
        color: i === 1 ? INK.oxide : INK.black,
      });
    });

    y += 54;
    p.paragraph(
      MARGIN,
      y,
      `${horizon.retainedNote} A further ${money(horizon.retained)} a year stays on subscription in both scenarios, because those tools are worth renting.`,
      { width: COLUMN, size: 9.5, color: INK.mid, leading: 14 },
    );
    pages.push(p);
  }

  /* --------------------------------------------------- 07 + 08 ---------- */
  {
    const p = sheet(8, total);
    masthead(p, "SYSTEM AUDIT", `SPECIMEN ${date}`);
    let y = 128;
    sectionLabel(p, y, "07", "Proposed architecture");
    y += 30;

    for (const [title, body] of architecture) {
      p.text(MARGIN, y, title, { size: 10.5, font: "bold", color: INK.black });
      y = p.paragraph(MARGIN, y + 14, body, {
        width: COLUMN,
        size: 9,
        color: INK.mid,
        leading: 12.8,
      });
      p.rule(MARGIN, y + 9, RIGHT, { color: INK.hair, width: 0.4 });
      y += 24;
    }

    y += 8;
    sectionLabel(p, y, "--", "Explicit non-scope");
    y += 22;
    for (const item of verdict.notBuilding) {
      p.box(MARGIN + 1, y - 4, 6, 1.4, { color: INK.oxide });
      p.text(MARGIN + 16, y, item, { size: 9.5, color: INK.black });
      y += 17;
    }

    y += 18;
    sectionLabel(p, y, "08", "What Meridian would own");
    y += 22;
    for (const item of handover) {
      p.box(MARGIN + 1, y - 4, 6, 1.4, { color: INK.oxide });
      p.text(MARGIN + 16, y, item, { size: 9.5, color: INK.black });
      y += 17;
    }

    y += 24;
    p.rule(MARGIN, y, RIGHT, { color: INK.black, width: 1.2 });
    y += 24;
    p.text(MARGIN, y, "Own the system your business runs on.", {
      size: 13,
      font: "bold",
      color: INK.black,
    });
    p.text(MARGIN, y + 18, "Stop renting it.", { size: 13, color: INK.mid });
    p.textRight(RIGHT, y, site.email, { size: 9, font: "mono", color: INK.oxide });
    p.textRight(RIGHT, y + 16, "corehold.com/audit", { size: 9, font: "mono", color: INK.mid });
    p.textRight(RIGHT, y + 32, "Dubai, United Arab Emirates", {
      size: 9,
      font: "mono",
      color: INK.mid,
    });
    pages.push(p);
  }

  const blob = buildPdf(pages, {
    title: "Corehold — Specimen System Audit",
    author: "Corehold",
    subject:
      "An illustrative worked audit built from a composite scenario. Not a real client engagement.",
  });

  downloadBlob(blob, `corehold-specimen-audit-${date}.pdf`);
}
