/**
 * A minimal PDF writer — no dependencies, runs in the browser.
 * ----------------------------------------------------------------------------
 * The studio generates real PDFs rather than screenshots because a company that
 * argues for owning your own tooling should not reach for a 300 kB library to
 * lay out text and hairlines.
 *
 * It writes PDF 1.4 with the base-14 Type 1 fonts, which every reader has built
 * in, so nothing is embedded and documents land at a few kilobytes. Real AFM
 * width tables are included for Helvetica, Helvetica-Bold and Courier, so text
 * can be measured — which means genuine right-alignment, centring and paragraph
 * wrapping rather than the eyeballed approximations most hand-rolled writers
 * settle for.
 */

export const PAGE = { width: 595.28, height: 841.89 } as const;

export type Font = "sans" | "bold" | "mono";

const FONT_REF: Record<Font, string> = {
  sans: "/F1",
  bold: "/F2",
  mono: "/F3",
};

/* -------------------------------------------------------------- metrics -- */
/* AFM advance widths, units per 1000 em, for ASCII 0x20–0x7E. */

const HELVETICA = [
  278, 278, 355, 556, 556, 889, 667, 191, 333, 333, 389, 584, 278, 333, 278,
  278, 556, 556, 556, 556, 556, 556, 556, 556, 556, 556, 278, 278, 584, 584,
  584, 556, 1015, 667, 667, 722, 722, 667, 611, 778, 722, 278, 500, 667, 556,
  833, 722, 778, 667, 778, 722, 667, 611, 722, 667, 944, 667, 667, 611, 278,
  278, 278, 469, 556, 333, 556, 556, 500, 556, 556, 278, 556, 556, 222, 222,
  500, 222, 833, 556, 556, 556, 556, 333, 500, 278, 556, 500, 722, 500, 500,
  500, 334, 260, 334, 584,
];

const HELVETICA_BOLD = [
  278, 333, 474, 556, 556, 889, 722, 238, 333, 333, 389, 584, 278, 333, 278,
  278, 556, 556, 556, 556, 556, 556, 556, 556, 556, 556, 333, 333, 584, 584,
  584, 611, 975, 722, 722, 722, 722, 667, 611, 778, 722, 278, 556, 722, 611,
  833, 722, 778, 667, 778, 722, 667, 611, 722, 667, 944, 667, 667, 611, 333,
  278, 333, 584, 556, 333, 556, 611, 556, 611, 556, 333, 611, 611, 278, 278,
  556, 278, 889, 611, 611, 611, 611, 389, 556, 333, 611, 556, 778, 556, 556,
  500, 389, 280, 389, 584,
];

const METRICS: Record<Font, number[] | null> = {
  sans: HELVETICA,
  bold: HELVETICA_BOLD,
  mono: null, // Courier is monospaced at 600/1000
};

/** PDF strings here are ASCII; anything typographic is folded to its plain form. */
export function asciiFold(input: string) {
  return input
    .replace(/[‘’′]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, "-")
    .replace(/…/g, "...")
    .replace(/[  ]/g, " ")
    .replace(/[→]/g, "->")
    .replace(/[×]/g, "x")
    .replace(/[·•]/g, "-")
    .replace(/[£]/g, "GBP ")
    .replace(/[€]/g, "EUR ")
    .replace(/[^\x20-\x7e]/g, "");
}

function escapeText(input: string) {
  return input.replace(/([\\()])/g, "\\$1");
}

/** Advance width of `text` at `size`, in points. */
export function widthOf(text: string, size: number, font: Font = "sans", charSpace = 0) {
  const folded = asciiFold(text);
  const table = METRICS[font];
  let units = 0;
  for (let i = 0; i < folded.length; i += 1) {
    const code = folded.charCodeAt(i) - 32;
    units += table ? (table[code] ?? 500) : 600;
  }
  return (units / 1000) * size + charSpace * folded.length;
}

/** Greedy line breaking against a measured column width. */
export function wrapText(
  text: string,
  width: number,
  size: number,
  font: Font = "sans",
) {
  const words = asciiFold(text).split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";

  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (widthOf(candidate, size, font) <= width || !line) {
      line = candidate;
    } else {
      lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

type Rgb = [number, number, number];

type TextOptions = {
  size?: number;
  font?: Font;
  color?: Rgb;
  charSpace?: number;
};

export class PdfPage {
  private ops: string[] = [];

  /** y is measured from the top of the page, because humans read downward. */
  private y(top: number) {
    return PAGE.height - top;
  }

  fill(color: Rgb) {
    this.ops.push(`${color.map((c) => c.toFixed(3)).join(" ")} rg`);
    return this;
  }

  stroke(color: Rgb) {
    this.ops.push(`${color.map((c) => c.toFixed(3)).join(" ")} RG`);
    return this;
  }

  text(x: number, top: number, value: string, options: TextOptions = {}) {
    const { size = 10, font = "sans", color, charSpace = 0 } = options;
    if (color) this.fill(color);
    this.ops.push(
      `BT ${FONT_REF[font]} ${size} Tf ${charSpace} Tc 1 0 0 1 ${x.toFixed(2)} ${this.y(top).toFixed(2)} Tm (${escapeText(asciiFold(value))}) Tj ET`,
    );
    return this;
  }

  /** Right-aligns to `x`, using real metrics. */
  textRight(x: number, top: number, value: string, options: TextOptions = {}) {
    const { size = 10, font = "sans", charSpace = 0 } = options;
    return this.text(
      x - widthOf(value, size, font, charSpace),
      top,
      value,
      options,
    );
  }

  /** Wrapped paragraph. Returns the top coordinate after the last line. */
  paragraph(
    x: number,
    top: number,
    value: string,
    options: TextOptions & { width: number; leading?: number } = { width: 400 },
  ) {
    const { width, size = 10, font = "sans", leading = size * 1.45 } = options;
    const lines = wrapText(value, width, size, font);
    lines.forEach((line, i) => {
      this.text(x, top + i * leading, line, options);
    });
    return top + Math.max(0, lines.length - 1) * leading;
  }

  rule(x1: number, top: number, x2: number, options: { color?: Rgb; width?: number } = {}) {
    const { color, width = 0.6 } = options;
    if (color) this.stroke(color);
    this.ops.push(
      `${width} w ${x1.toFixed(2)} ${this.y(top).toFixed(2)} m ${x2.toFixed(2)} ${this.y(top).toFixed(2)} l S`,
    );
    return this;
  }

  box(
    x: number,
    top: number,
    w: number,
    h: number,
    options: { color?: Rgb; mode?: "fill" | "stroke"; width?: number } = {},
  ) {
    const { color, mode = "fill", width = 0.6 } = options;
    if (color) (mode === "fill" ? this.fill(color) : this.stroke(color));
    if (mode === "stroke") this.ops.push(`${width} w`);
    this.ops.push(
      `${x.toFixed(2)} ${this.y(top + h).toFixed(2)} ${w.toFixed(2)} ${h.toFixed(2)} re ${mode === "fill" ? "f" : "S"}`,
    );
    return this;
  }

  /** Polyline in top-down coordinates. */
  path(points: [number, number][], options: { color?: Rgb; width?: number } = {}) {
    if (points.length < 2) return this;
    const { color, width = 1 } = options;
    if (color) this.stroke(color);
    const [first, ...rest] = points;
    this.ops.push(
      `${width} w ${first[0].toFixed(2)} ${this.y(first[1]).toFixed(2)} m ${rest
        .map(([x, t]) => `${x.toFixed(2)} ${this.y(t).toFixed(2)} l`)
        .join(" ")} S`,
    );
    return this;
  }

  toString() {
    return this.ops.join("\n");
  }
}

export type PdfMeta = { title: string; author: string; subject: string };

export function buildPdf(input: PdfPage | PdfPage[], meta: PdfMeta) {
  const pages = Array.isArray(input) ? input : [input];

  // Object numbering: 1 catalog, 2 pages, then per page [page, contents],
  // then the three fonts, then the info dictionary.
  const firstPageObj = 3;
  const kids = pages.map((_, i) => `${firstPageObj + i * 2} 0 R`).join(" ");
  const fontBase = firstPageObj + pages.length * 2;

  const objects: string[] = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    `<< /Type /Pages /Kids [${kids}] /Count ${pages.length} >>`,
  ];

  pages.forEach((page, i) => {
    const contentObj = firstPageObj + i * 2 + 1;
    const content = page.toString();
    objects.push(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE.width} ${PAGE.height}] /Resources << /Font << /F1 ${fontBase} 0 R /F2 ${fontBase + 1} 0 R /F3 ${fontBase + 2} 0 R >> >> /Contents ${contentObj} 0 R >>`,
    );
    objects.push(`<< /Length ${content.length} >>\nstream\n${content}\nendstream`);
  });

  objects.push(
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Courier /Encoding /WinAnsiEncoding >>",
    `<< /Title (${escapeText(asciiFold(meta.title))}) /Author (${escapeText(asciiFold(meta.author))}) /Subject (${escapeText(asciiFold(meta.subject))}) /Creator (Corehold) /Producer (Corehold) >>`,
  );

  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [];

  objects.forEach((body, i) => {
    offsets.push(pdf.length);
    pdf += `${i + 1} 0 obj\n${body}\nendobj\n`;
  });

  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (const offset of offsets) {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R /Info ${objects.length} 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  const bytes = new Uint8Array(pdf.length);
  for (let i = 0; i < pdf.length; i += 1) bytes[i] = pdf.charCodeAt(i) & 0xff;
  return new Blob([bytes], { type: "application/pdf" });
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
