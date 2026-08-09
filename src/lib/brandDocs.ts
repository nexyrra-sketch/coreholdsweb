import { PdfPage, buildPdf, downloadBlob, PAGE } from "./pdf";
import {
  INK,
  MARGIN,
  RIGHT,
  COLUMN,
  drawMark,
  masthead,
  pageFooter,
  sectionLabel,
} from "./pdfChrome";
import { site } from "./site";

/**
 * The business system: brand book, letterhead and proposal, all produced by the
 * same writer that builds the audit. One engine, one set of inks, one masthead —
 * so a Corehold document is recognisable whatever it happens to say.
 */

const SWATCHES: [string, string, [number, number, number], string][] = [
  ["quarry-950", "#0B0D0C", [0.043, 0.051, 0.047], "Base ground"],
  ["quarry-900", "#101312", [0.063, 0.075, 0.071], "Raised ground"],
  ["quarry-700", "#232927", [0.137, 0.161, 0.153], "Hairlines"],
  ["quarry-500", "#7A827D", [0.478, 0.51, 0.49], "Technical labels"],
  ["quarry-300", "#AEB4AF", [0.682, 0.706, 0.686], "Secondary prose"],
  ["bone", "#E8E7E1", [0.91, 0.906, 0.882], "Primary text on dark"],
  ["limestone", "#EFEDE8", [0.937, 0.929, 0.91], "Paper ground"],
  ["oxide", "#D9622B", [0.851, 0.384, 0.169], "The only accent"],
  ["oxide-deep", "#A8461B", [0.659, 0.275, 0.106], "Accent on paper"],
];

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

/* ------------------------------------------------------------ brand book -- */

export function generateBrandBook(stampDate: Date) {
  const date = stampDate.toISOString().slice(0, 10);
  const total = 5;
  const pages: PdfPage[] = [];
  const sheet = (i: number) => {
    const p = new PdfPage();
    pageFooter(p, `COREHOLD BRAND STANDARD v1.0 - ${date}`, `${String(i).padStart(2, "0")} / 0${total}`);
    return p;
  };

  /* cover */
  {
    const p = sheet(1);
    drawMark(p, MARGIN, 100, 48);
    p.text(MARGIN, 200, "BRAND STANDARD", {
      size: 9,
      font: "mono",
      color: INK.mid,
      charSpace: 2.2,
    });
    p.text(MARGIN, 250, "Corehold", { size: 44, font: "bold", color: INK.black });
    p.text(MARGIN, 292, "Version 1.0", { size: 16, color: INK.mid });
    p.rule(MARGIN, 320, RIGHT, { color: INK.black, width: 1.2 });
    p.paragraph(
      MARGIN,
      348,
      "Every decision in this document traces back to one idea: software you rent is a cost, and systems you own are a position. If a future change contradicts a page in here, either the change is wrong or this document needs updating first. There is no third option.",
      { width: COLUMN, size: 11, color: INK.black, leading: 16 },
    );
    let y = 460;
    for (const [k, v] of [
      ["ISSUED", date],
      ["OWNER", "Corehold, Dubai"],
      ["CONTACT", site.email],
      ["SUPERSEDES", "Nothing. This is the first."],
    ] as [string, string][]) {
      p.text(MARGIN, y, k, { size: 7.5, font: "mono", color: INK.mid, charSpace: 1.3 });
      p.text(MARGIN + 120, y, v, { size: 10, color: INK.black });
      p.rule(MARGIN, y + 8, RIGHT, { color: INK.hair, width: 0.4 });
      y += 22;
    }
    pages.push(p);
  }

  /* the mark */
  {
    const p = sheet(2);
    masthead(p, "BRAND STANDARD", "01 / THE MARK");
    let y = 128;
    sectionLabel(p, y, "01", "The mark");
    y += 30;
    p.text(MARGIN, y, "Two brackets and a core.", { size: 22, font: "bold", color: INK.black });
    y += 30;
    y = p.paragraph(
      MARGIN,
      y,
      "An interrupted square: a bracket at the upper-left and its exact 180-degree twin at the lower-right, so the mark carries the same weight whichever way you look at it. Inside sits a solid block, dead centre, fully enclosed and touching neither. That is the whole brand in one glyph - the core, and the thing that holds it.",
      { width: COLUMN, size: 10, color: INK.mid, leading: 14.5 },
    );

    y += 40;
    drawMark(p, MARGIN, y, 120);
    // construction grid
    for (let i = 0; i <= 4; i += 1) {
      const gx = MARGIN + (120 * i) / 4;
      p.path([[gx, y - 10], [gx, y + 130]], { color: INK.hair, width: 0.4 });
      const gy = y + (120 * i) / 4;
      p.path([[MARGIN - 10, gy], [MARGIN + 130, gy]], { color: INK.hair, width: 0.4 });
    }
    p.text(MARGIN + 150, y + 20, "CONSTRUCTION", {
      size: 7.5,
      font: "mono",
      color: INK.mid,
      charSpace: 1.3,
    });
    p.paragraph(
      MARGIN + 150,
      y + 38,
      "Drawn on a 32-unit grid. Bracket stroke is 3 units. The core is 10 x 10, centred. Clear space on all sides equals the core's width. Never rotate, never outline the core, never split the wordmark across two colours.",
      { width: COLUMN - 150, size: 9, color: INK.black, leading: 13 },
    );

    y += 180;
    sectionLabel(p, y, "--", "Wordmark");
    y += 26;
    p.text(MARGIN, y, "Corehold", { size: 26, font: "bold", color: INK.black });
    p.paragraph(
      MARGIN + 180,
      y - 12,
      "Set in Archivo SemiBold at -0.03em tracking, sentence case. No colour split across 'core' and 'hold' - that is the cheap move. The mark carries the idea.",
      { width: COLUMN - 180, size: 9, color: INK.mid, leading: 13 },
    );
    pages.push(p);
  }

  /* colour */
  {
    const p = sheet(3);
    masthead(p, "BRAND STANDARD", "02 / COLOUR");
    let y = 128;
    sectionLabel(p, y, "02", "Colour");
    y += 30;
    p.text(MARGIN, y, "One ground, one paper, one accent.", {
      size: 20,
      font: "bold",
      color: INK.black,
    });
    y += 28;
    y = p.paragraph(
      MARGIN,
      y,
      "There is no gradient anywhere in this system. Gradients imply transition; Corehold sells permanence. The accent is applied only to load-bearing elements: the thing that acts, the number that matters, the state that is live.",
      { width: COLUMN, size: 10, color: INK.mid, leading: 14.5 },
    );
    y += 40;

    for (const [name, hex, rgb, role] of SWATCHES) {
      p.box(MARGIN, y - 10, 42, 26, { color: rgb });
      p.box(MARGIN, y - 10, 42, 26, { color: INK.hair, mode: "stroke", width: 0.4 });
      p.text(MARGIN + 56, y, name, { size: 10, font: "bold", color: INK.black });
      p.text(MARGIN + 170, y, hex, { size: 9.5, font: "mono", color: INK.mid });
      p.text(MARGIN + 250, y, role, { size: 9.5, color: INK.mid });
      p.rule(MARGIN, y + 18, RIGHT, { color: INK.hair, width: 0.4 });
      y += 34;
    }

    y += 10;
    p.paragraph(
      MARGIN,
      y,
      "Primary buttons are dark text on oxide, the way site and hazard signage is set. It is also the only pairing that clears WCAG AA on this accent at body size: 6.2:1, against 3.7:1 for white on the same orange.",
      { width: COLUMN, size: 10, color: INK.black, leading: 14.5 },
    );
    pages.push(p);
  }

  /* type */
  {
    const p = sheet(4);
    masthead(p, "BRAND STANDARD", "03 / TYPE");
    let y = 128;
    sectionLabel(p, y, "03", "Typography");
    y += 30;
    p.text(MARGIN, y, "Archivo, and one technical register.", {
      size: 20,
      font: "bold",
      color: INK.black,
    });
    y += 32;
    y = p.paragraph(
      MARGIN,
      y,
      "Archivo carries display, interface and body. It is a grotesque drawn for signage and high-impact print: tight apertures, low contrast between thick and thin, and it holds together at 96px as a masthead and at 15px as body copy. Running the whole identity on one family is the point - it does not borrow authority from a second display face.",
      { width: COLUMN, size: 10, color: INK.mid, leading: 14.5 },
    );
    y += 44;

    const scale: [string, string, string][] = [
      ["Mega", "clamp(2.75rem, 7.4vw, 6.5rem)", "-0.035em / 0.92"],
      ["Major", "clamp(2rem, 4.6vw, 3.75rem)", "-0.030em / 0.98"],
      ["Minor", "clamp(1.5rem, 2.6vw, 2.25rem)", "-0.022em / 1.08"],
      ["Lede", "clamp(1.06rem, 1.55vw, 1.31rem)", "-0.011em / 1.55"],
      ["Body", "0.9375rem", "0 / 1.6"],
      ["Label", "0.6875rem mono", "+0.16em / 1.2, uppercase"],
    ];
    p.text(MARGIN, y, "STEP", { size: 7, font: "mono", color: INK.mid, charSpace: 1.2 });
    p.text(MARGIN + 120, y, "SIZE", { size: 7, font: "mono", color: INK.mid, charSpace: 1.2 });
    p.text(MARGIN + 330, y, "TRACKING / LEADING", {
      size: 7,
      font: "mono",
      color: INK.mid,
      charSpace: 1.2,
    });
    y += 8;
    p.rule(MARGIN, y, RIGHT, { color: INK.black, width: 0.8 });
    y += 18;
    for (const [step, size, tracking] of scale) {
      p.text(MARGIN, y, step, { size: 10, color: INK.black });
      p.text(MARGIN + 120, y, size, { size: 9, font: "mono", color: INK.mid });
      p.text(MARGIN + 330, y, tracking, { size: 9, font: "mono", color: INK.mid });
      p.rule(MARGIN, y + 7, RIGHT, { color: INK.hair, width: 0.4 });
      y += 20;
    }

    y += 20;
    sectionLabel(p, y, "--", "The technical register");
    y += 24;
    p.paragraph(
      MARGIN,
      y,
      "IBM Plex Mono carries sheet numbers, stage codes, field labels, manifest lines and margin notes. Monospace here is not a developer affectation: it is the typography of specification documents, and it does the work of separating what Corehold claims from what Corehold records.",
      { width: COLUMN, size: 10, color: INK.black, leading: 14.5 },
    );
    pages.push(p);
  }

  /* voice + motion */
  {
    const p = sheet(5);
    masthead(p, "BRAND STANDARD", "04 / VOICE & MOTION");
    let y = 128;
    sectionLabel(p, y, "04", "Voice");
    y += 30;
    p.text(MARGIN, y, "Confident, technical, a little blunt.", {
      size: 20,
      font: "bold",
      color: INK.black,
    });
    y += 34;

    const voice: [string, string][] = [
      ["Say", "Own the system your business runs on. Stop renting it."],
      ["Not", "We help businesses scale with innovative solutions."],
      ["Say", "Sometimes the audit says: build nothing."],
      ["Not", "We work closely with you to understand your needs."],
      ["Say", "After five years of paying, you own nothing you run on."],
      ["Not", "Digital transformation for the modern enterprise."],
    ];
    for (const [kind, line] of voice) {
      const good = kind === "Say";
      p.text(MARGIN, y, good ? "SAY" : "NEVER", {
        size: 7.5,
        font: "mono",
        color: good ? INK.oxide : INK.mid,
        charSpace: 1.3,
      });
      p.text(MARGIN + 56, y, line, {
        size: 10.5,
        font: good ? "bold" : "sans",
        color: good ? INK.black : INK.mid,
      });
      p.rule(MARGIN, y + 8, RIGHT, { color: INK.hair, width: 0.4 });
      y += 24;
    }

    y += 16;
    p.paragraph(
      MARGIN,
      y,
      "The test: if a line could be pasted onto any other agency's website and still make sense, it is wrong. Rewrite it until it could only have come from here.",
      { width: COLUMN, size: 10, color: INK.black, leading: 14.5 },
    );

    y += 60;
    sectionLabel(p, y, "05", "Motion");
    y += 26;
    const motion: [string, string][] = [
      ["Curve", "cubic-bezier(0.22, 0.68, 0.24, 1) - the only easing in the system"],
      ["Reveal", "Rise 14px and resolve over 720ms. Nothing bounces, scales or blurs."],
      ["Rules", "Hairlines scribe left to right over 900ms."],
      ["Accent", "Oxide arrives last and moves least."],
      ["Off switch", "prefers-reduced-motion disables all of it, properly, not partially."],
    ];
    for (const [k, v] of motion) {
      p.text(MARGIN, y, k, { size: 9.5, font: "bold", color: INK.black });
      p.text(MARGIN + 90, y, v, { size: 9.5, color: INK.mid });
      p.rule(MARGIN, y + 7, RIGHT, { color: INK.hair, width: 0.4 });
      y += 21;
    }
    pages.push(p);
  }

  downloadBlob(
    buildPdf(pages, {
      title: "Corehold — Brand Standard v1.0",
      author: "Corehold",
      subject: "Identity, colour, typography, voice and motion.",
    }),
    `corehold-brand-standard-${date}.pdf`,
  );
}

/* ------------------------------------------------------------ letterhead -- */

export function generateLetterhead(stampDate: Date) {
  const date = stampDate.toISOString().slice(0, 10);
  const p = new PdfPage();

  drawMark(p, MARGIN, 52, 22);
  p.text(MARGIN + 32, 70, "COREHOLD", {
    size: 13,
    font: "bold",
    color: INK.black,
    charSpace: 0.6,
  });
  p.textRight(RIGHT, 62, site.email, { size: 8.5, font: "mono", color: INK.mid });
  p.textRight(RIGHT, 76, "Dubai, United Arab Emirates", {
    size: 8.5,
    font: "mono",
    color: INK.mid,
  });
  p.rule(MARGIN, 96, RIGHT, { color: INK.black, width: 1.2 });

  p.text(MARGIN, 140, date, { size: 9, font: "mono", color: INK.mid });
  p.text(MARGIN, 180, "[ Recipient name ]", { size: 10, color: INK.hair });
  p.text(MARGIN, 196, "[ Company ]", { size: 10, color: INK.hair });

  p.text(MARGIN, 246, "Dear [ name ],", { size: 11, color: INK.black });
  p.paragraph(
    MARGIN,
    282,
    "[ Body copy sits here. Keep it short. Corehold writes the way it builds: one idea per paragraph, no hedging, and nothing that could have been written by any other studio. ]",
    { width: COLUMN, size: 10.5, color: INK.hair, leading: 16 },
  );

  p.text(MARGIN, 420, "Yours,", { size: 10.5, color: INK.black });
  p.text(MARGIN, 470, "[ Name ]", { size: 10.5, color: INK.hair });
  p.text(MARGIN, 486, "Corehold", { size: 10.5, font: "bold", color: INK.black });

  const foot = PAGE.height - 56;
  p.rule(MARGIN, foot - 16, RIGHT, { color: INK.hair, width: 0.5 });
  p.text(MARGIN, foot, "Own the system your business runs on. Stop renting it.", {
    size: 8,
    font: "mono",
    color: INK.mid,
    charSpace: 0.8,
  });
  p.textRight(RIGHT, foot, "corehold.com", { size: 8, font: "mono", color: INK.mid });

  downloadBlob(
    buildPdf(p, {
      title: "Corehold — Letterhead",
      author: "Corehold",
      subject: "Letterhead template",
    }),
    `corehold-letterhead-${date}.pdf`,
  );
}

/* -------------------------------------------------------------- proposal -- */

export function generateProposal(stampDate: Date) {
  const date = stampDate.toISOString().slice(0, 10);
  const pages: PdfPage[] = [];
  const sheet = (i: number, n: number) => {
    const p = new PdfPage();
    pageFooter(p, `COREHOLD - ENGAGEMENT PROPOSAL - TEMPLATE`, `${String(i).padStart(2, "0")} / 0${n}`);
    return p;
  };

  {
    const p = sheet(1, 3);
    drawMark(p, MARGIN, 96, 40);
    p.text(MARGIN, 172, "ENGAGEMENT PROPOSAL", {
      size: 9,
      font: "mono",
      color: INK.mid,
      charSpace: 2.2,
    });
    p.text(MARGIN, 224, "[ Client name ]", { size: 34, font: "bold", color: INK.hair });
    p.rule(MARGIN, 258, RIGHT, { color: INK.black, width: 1.2 });
    let y = 288;
    for (const [k, v] of [
      ["PREPARED FOR", "[ Name, role ]"],
      ["ISSUED", date],
      ["VALID FOR", "30 days"],
      ["STAGE", "Following the system audit"],
    ] as [string, string][]) {
      p.text(MARGIN, y, k, { size: 7.5, font: "mono", color: INK.mid, charSpace: 1.3 });
      p.text(MARGIN + 130, y, v, { size: 10, color: INK.black });
      p.rule(MARGIN, y + 8, RIGHT, { color: INK.hair, width: 0.4 });
      y += 24;
    }
    y += 30;
    p.paragraph(
      MARGIN,
      y,
      "This proposal follows an audit. Corehold does not quote work before one, because a price set without knowing how a business actually operates is a guess with a number attached.",
      { width: COLUMN, size: 11, color: INK.black, leading: 16 },
    );
    pages.push(p);
  }

  {
    const p = sheet(2, 3);
    masthead(p, "ENGAGEMENT PROPOSAL", "SCOPE");
    let y = 128;
    sectionLabel(p, y, "01", "What we will build");
    y += 26;
    for (let i = 1; i <= 4; i += 1) {
      p.text(MARGIN, y, `[ Component ${i} ]`, { size: 11, font: "bold", color: INK.hair });
      p.text(MARGIN, y + 15, "[ One sentence on what it is and why the audit called for it. ]", {
        size: 9.5,
        color: INK.hair,
      });
      p.rule(MARGIN, y + 26, RIGHT, { color: INK.hair, width: 0.4 });
      y += 42;
    }

    y += 14;
    sectionLabel(p, y, "02", "Explicit non-scope");
    y += 26;
    p.paragraph(
      MARGIN,
      y,
      "List here what we are deliberately not building and why. On a well-run engagement this section is longer than the one above it. Do not delete this page to make the proposal look bigger.",
      { width: COLUMN, size: 10, color: INK.mid, leading: 14.5 },
    );
    y += 60;
    for (let i = 1; i <= 4; i += 1) {
      p.box(MARGIN + 1, y - 4, 6, 1.4, { color: INK.oxide });
      p.text(MARGIN + 16, y, `[ Not building: ... because ... ]`, {
        size: 9.5,
        color: INK.hair,
      });
      y += 20;
    }
    pages.push(p);
  }

  {
    const p = sheet(3, 3);
    masthead(p, "ENGAGEMENT PROPOSAL", "TERMS");
    let y = 128;
    sectionLabel(p, y, "03", "Stages, fee and window");
    y += 26;
    for (const stage of ["ARCHITECT", "BUILD", "HAND OVER"]) {
      p.text(MARGIN, y, stage, { size: 11, font: "bold", color: INK.black });
      p.text(MARGIN + 160, y, "[ window ]", { size: 9.5, font: "mono", color: INK.hair });
      p.textRight(RIGHT, y, "[ fee ]", { size: 10, font: "mono", color: INK.hair });
      p.rule(MARGIN, y + 8, RIGHT, { color: INK.hair, width: 0.4 });
      y += 26;
    }

    y += 20;
    sectionLabel(p, y, "04", "What you own, and when");
    y += 26;
    for (const line of [
      "Source code, in your repository, from the first commit - not on completion",
      "Infrastructure and domains registered to you and billed to you directly",
      "All operating data in open formats, in accounts you control",
      "Architecture documentation, runbooks and recorded walkthroughs at handover",
      "A written exit describing how to move the system to any other studio",
      "No Corehold licence, no proprietary runtime, no mandatory retainer",
    ]) {
      p.box(MARGIN + 1, y - 4, 6, 1.4, { color: INK.oxide });
      p.text(MARGIN + 16, y, line, { size: 9.5, color: INK.black });
      y += 20;
    }

    y += 30;
    p.rule(MARGIN, y, RIGHT, { color: INK.black, width: 1.2 });
    y += 24;
    p.text(MARGIN, y, "Own the system your business runs on.", {
      size: 13,
      font: "bold",
      color: INK.black,
    });
    p.text(MARGIN, y + 18, "Stop renting it.", { size: 13, color: INK.mid });
    p.textRight(RIGHT, y, site.email, { size: 9, font: "mono", color: INK.oxide });
    pages.push(p);
  }

  downloadBlob(
    buildPdf(pages, {
      title: "Corehold — Engagement Proposal (template)",
      author: "Corehold",
      subject: "Proposal template",
    }),
    `corehold-proposal-template-${date}.pdf`,
  );
}

export { hexToRgb };
