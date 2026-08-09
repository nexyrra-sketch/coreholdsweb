import { PdfPage, PAGE, widthOf } from "./pdf";

/**
 * Shared furniture for every Corehold document. One masthead, one footer, one
 * mark, one set of inks — so the rent sheet, the specimen audit, the brand book
 * and the letterhead are recognisably the same object family.
 */

export const INK = {
  oxide: [0.749, 0.275, 0.106] as [number, number, number],
  oxideDeep: [0.659, 0.275, 0.106] as [number, number, number],
  black: [0.09, 0.1, 0.098] as [number, number, number],
  mid: [0.42, 0.44, 0.43] as [number, number, number],
  hair: [0.78, 0.76, 0.72] as [number, number, number],
  paper: [0.937, 0.929, 0.91] as [number, number, number],
};

export const MARGIN = 56;
export const RIGHT = PAGE.width - MARGIN;
export const COLUMN = RIGHT - MARGIN;

/** The mark, drawn as vector paths. No raster asset ever enters a document. */
export function drawMark(page: PdfPage, x: number, top: number, s: number) {
  const t = s / 32;
  page.path(
    [
      [x + 3 * t, top + 13.5 * t],
      [x + 3 * t, top + 3 * t],
      [x + 13.5 * t, top + 3 * t],
    ],
    { color: INK.mid, width: 3 * t },
  );
  page.path(
    [
      [x + 29 * t, top + 18.5 * t],
      [x + 29 * t, top + 29 * t],
      [x + 18.5 * t, top + 29 * t],
    ],
    { color: INK.mid, width: 3 * t },
  );
  page.box(x + 11 * t, top + 11 * t, 10 * t, 10 * t, { color: INK.oxide });
}

export function masthead(page: PdfPage, right: string, sub?: string) {
  drawMark(page, MARGIN, 46, 22);
  page.text(MARGIN + 32, 64, "COREHOLD", {
    size: 13,
    font: "bold",
    color: INK.black,
    charSpace: 0.6,
  });
  page.textRight(RIGHT, 56, right, {
    size: 8,
    font: "mono",
    color: INK.mid,
    charSpace: 1.4,
  });
  if (sub) {
    page.textRight(RIGHT, 70, sub, {
      size: 8,
      font: "mono",
      color: INK.mid,
      charSpace: 1.4,
    });
  }
  page.rule(MARGIN, 88, RIGHT, { color: INK.black, width: 1.2 });
}

export function pageFooter(
  page: PdfPage,
  left: string,
  number: string,
) {
  const top = PAGE.height - 46;
  page.rule(MARGIN, top - 14, RIGHT, { color: INK.hair, width: 0.5 });
  page.text(MARGIN, top, left, {
    size: 7,
    font: "mono",
    color: INK.mid,
    charSpace: 1,
  });
  page.textRight(RIGHT, top, number, {
    size: 7,
    font: "mono",
    color: INK.mid,
    charSpace: 1,
  });
}

/** A sheet-number heading: `01 ——— THE LEDGER`. */
export function sectionLabel(page: PdfPage, top: number, index: string, label: string) {
  page.text(MARGIN, top, index, {
    size: 8,
    font: "mono",
    color: INK.oxide,
    charSpace: 1.4,
  });
  const indexWidth = widthOf(index, 8, "mono", 1.4);
  page.rule(MARGIN + indexWidth + 10, top - 3, MARGIN + indexWidth + 52, {
    color: INK.hair,
  });
  page.text(MARGIN + indexWidth + 62, top, label.toUpperCase(), {
    size: 8,
    font: "mono",
    color: INK.mid,
    charSpace: 1.4,
  });
}

/** A two-column key/value row with a hairline beneath. */
export function row(
  page: PdfPage,
  top: number,
  label: string,
  value: string,
  options: { valueFont?: "sans" | "bold" | "mono"; size?: number } = {},
) {
  const { valueFont = "mono", size = 10 } = options;
  page.text(MARGIN, top, label, { size, color: INK.black });
  page.textRight(RIGHT, top, value, { size, font: valueFont, color: INK.black });
  page.rule(MARGIN, top + 7, RIGHT, { color: INK.hair, width: 0.4 });
  return top + 21;
}

export function stamp(page: PdfPage, top: number, text: string) {
  const w = widthOf(text, 7, "mono", 1.4) + 16;
  page.box(MARGIN, top - 9, w, 15, { color: INK.oxide, mode: "stroke", width: 0.8 });
  page.text(MARGIN + 8, top, text, {
    size: 7,
    font: "mono",
    color: INK.oxide,
    charSpace: 1.4,
  });
}
