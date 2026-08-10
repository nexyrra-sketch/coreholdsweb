/**
 * A QR encoder, written here.
 * ----------------------------------------------------------------------------
 * There are perfectly good QR libraries. This site does not use one, for the
 * same reason it does not use a 3D engine or a PDF library: /system publishes
 * the dependency count as evidence, and a business card that quietly added an
 * npm package to draw a square would undercut the argument it is printed on.
 *
 * What is actually involved, in order:
 *
 *   1. Byte-mode encoding with a four-bit mode indicator and a length header.
 *   2. Reed–Solomon error correction over GF(256) — log and antilog tables,
 *      a generator polynomial per block length, polynomial long division.
 *   3. Block interleaving, because the standard splits longer payloads into
 *      groups and shuffles the codewords so a coffee ring destroys a little of
 *      every block rather than all of one.
 *   4. Function patterns: finders, separators, timing, alignment, the dark
 *      module, and the reserved format and version areas.
 *   5. A zigzag walk placing the payload two columns at a time from the bottom
 *      right, skipping the vertical timing column.
 *   6. All eight masks applied, each scored against the four penalty rules in
 *      the specification, and the best one kept.
 *
 * Error correction is set to H — thirty percent recoverable — so the mark can
 * be punched through the middle of the code and it still scans.
 */

export type Ecc = "L" | "M" | "Q" | "H";

/* ------------------------------------------------------------------ tables */

/**
 * Per version and level: [ecCodewordsPerBlock, blocksInGroup1,
 * dataCodewordsInGroup1, blocksInGroup2, dataCodewordsInGroup2].
 */
const BLOCKS: Record<Ecc, number[][]> = {
  L: [
    [], [7, 1, 19, 0, 0], [10, 1, 34, 0, 0], [15, 1, 55, 0, 0], [20, 1, 80, 0, 0],
    [26, 1, 108, 0, 0], [18, 2, 68, 0, 0], [20, 2, 78, 0, 0], [24, 2, 97, 0, 0],
    [30, 2, 116, 0, 0], [18, 2, 68, 2, 69],
  ],
  M: [
    [], [10, 1, 16, 0, 0], [16, 1, 28, 0, 0], [26, 1, 44, 0, 0], [18, 2, 32, 0, 0],
    [24, 2, 43, 0, 0], [16, 4, 27, 0, 0], [18, 4, 31, 0, 0], [22, 2, 38, 2, 39],
    [22, 3, 36, 2, 37], [26, 4, 43, 1, 44],
  ],
  Q: [
    [], [13, 1, 13, 0, 0], [22, 1, 22, 0, 0], [18, 2, 17, 0, 0], [26, 2, 24, 0, 0],
    [18, 2, 15, 2, 16], [24, 4, 19, 0, 0], [18, 2, 14, 4, 15], [22, 4, 18, 2, 19],
    [20, 4, 16, 4, 17], [24, 6, 19, 2, 20],
  ],
  H: [
    [], [17, 1, 9, 0, 0], [28, 1, 16, 0, 0], [22, 2, 13, 0, 0], [16, 4, 9, 0, 0],
    [22, 2, 11, 2, 12], [28, 4, 15, 0, 0], [26, 4, 13, 1, 14], [26, 4, 14, 2, 15],
    [24, 4, 12, 4, 13], [28, 6, 15, 2, 16],
  ],
};

/** Row and column centres of the alignment patterns, per version. */
const ALIGNMENT: number[][] = [
  [], [], [6, 18], [6, 22], [6, 26], [6, 30], [6, 34],
  [6, 22, 38], [6, 24, 42], [6, 26, 46], [6, 28, 50],
];

const ECC_BITS: Record<Ecc, number> = { L: 0b01, M: 0b00, Q: 0b11, H: 0b10 };

/* --------------------------------------------------------------- GF(256) -- */

const EXP = new Uint8Array(512);
const LOG = new Uint8Array(256);
(function buildTables() {
  let x = 1;
  for (let i = 0; i < 255; i += 1) {
    EXP[i] = x;
    LOG[x] = i;
    x <<= 1;
    // 0x11d is the primitive polynomial the specification fixes for QR.
    if (x & 0x100) x ^= 0x11d;
  }
  for (let i = 255; i < 512; i += 1) EXP[i] = EXP[i - 255];
})();

function gfMul(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return EXP[LOG[a] + LOG[b]];
}

/** Generator polynomial for `degree` error-correction codewords. */
function generator(degree: number): number[] {
  let poly = [1];
  for (let i = 0; i < degree; i += 1) {
    const next = new Array<number>(poly.length + 1).fill(0);
    for (let j = 0; j < poly.length; j += 1) {
      next[j] ^= poly[j];
      next[j + 1] ^= gfMul(poly[j], EXP[i]);
    }
    poly = next;
  }
  return poly;
}

/** Polynomial long division; the remainder is the error correction. */
function remainder(data: number[], degree: number): number[] {
  const gen = generator(degree);
  const buffer = data.concat(new Array<number>(degree).fill(0));
  for (let i = 0; i < data.length; i += 1) {
    const factor = buffer[i];
    if (factor === 0) continue;
    for (let j = 0; j < gen.length; j += 1) {
      buffer[i + j] ^= gfMul(gen[j], factor);
    }
  }
  return buffer.slice(data.length);
}

/* --------------------------------------------------------------- encoding */

function utf8Bytes(text: string): number[] {
  const out: number[] = [];
  for (const byte of new TextEncoder().encode(text)) out.push(byte);
  return out;
}

function pickVersion(byteLength: number, ecc: Ecc): number {
  for (let version = 1; version <= 10; version += 1) {
    const [ecPerBlock, g1, d1, g2, d2] = BLOCKS[ecc][version];
    const dataCodewords = g1 * d1 + g2 * d2;
    void ecPerBlock;
    // Mode indicator (4) + character count (8 for versions 1–9) + payload.
    const needed = 4 + (version < 10 ? 8 : 16) + byteLength * 8;
    if (needed <= dataCodewords * 8) return version;
  }
  throw new Error("payload too long for a version 10 code");
}

function buildCodewords(text: string, ecc: Ecc, version: number): number[] {
  const bytes = utf8Bytes(text);
  const [ecPerBlock, g1, d1, g2, d2] = BLOCKS[ecc][version];
  const dataCodewords = g1 * d1 + g2 * d2;

  const bits: number[] = [];
  const push = (value: number, width: number) => {
    for (let i = width - 1; i >= 0; i -= 1) bits.push((value >> i) & 1);
  };

  push(0b0100, 4); // byte mode
  push(bytes.length, version < 10 ? 8 : 16);
  for (const byte of bytes) push(byte, 8);

  // Terminator, then pad to a byte boundary.
  const capacity = dataCodewords * 8;
  for (let i = 0; i < 4 && bits.length < capacity; i += 1) bits.push(0);
  while (bits.length % 8 !== 0) bits.push(0);

  const data: number[] = [];
  for (let i = 0; i < bits.length; i += 8) {
    let byte = 0;
    for (let j = 0; j < 8; j += 1) byte = (byte << 1) | bits[i + j];
    data.push(byte);
  }
  // The two alternating pad bytes the specification names.
  const PAD = [0xec, 0x11];
  for (let i = 0; data.length < dataCodewords; i += 1) data.push(PAD[i % 2]);

  /* Split into blocks, compute error correction, then interleave. */
  const blocks: number[][] = [];
  const eccBlocks: number[][] = [];
  let offset = 0;
  for (let i = 0; i < g1; i += 1) {
    const block = data.slice(offset, offset + d1);
    offset += d1;
    blocks.push(block);
    eccBlocks.push(remainder(block, ecPerBlock));
  }
  for (let i = 0; i < g2; i += 1) {
    const block = data.slice(offset, offset + d2);
    offset += d2;
    blocks.push(block);
    eccBlocks.push(remainder(block, ecPerBlock));
  }

  const out: number[] = [];
  const longest = Math.max(d1, d2);
  for (let i = 0; i < longest; i += 1) {
    for (const block of blocks) if (i < block.length) out.push(block[i]);
  }
  for (let i = 0; i < ecPerBlock; i += 1) {
    for (const block of eccBlocks) out.push(block[i]);
  }
  return out;
}

/* ---------------------------------------------------------------- matrix -- */

type Grid = {
  modules: (0 | 1 | null)[][];
  reserved: boolean[][];
  size: number;
};

function blankGrid(version: number): Grid {
  const size = version * 4 + 17;
  return {
    size,
    modules: Array.from({ length: size }, () => new Array(size).fill(null)),
    reserved: Array.from({ length: size }, () => new Array(size).fill(false)),
  };
}

function place(grid: Grid, row: number, col: number, value: 0 | 1) {
  grid.modules[row][col] = value;
  grid.reserved[row][col] = true;
}

function drawFinder(grid: Grid, row: number, col: number) {
  for (let r = -1; r <= 7; r += 1) {
    for (let c = -1; c <= 7; c += 1) {
      const rr = row + r;
      const cc = col + c;
      if (rr < 0 || cc < 0 || rr >= grid.size || cc >= grid.size) continue;
      const inRing =
        (r >= 0 && r <= 6 && (c === 0 || c === 6)) ||
        (c >= 0 && c <= 6 && (r === 0 || r === 6));
      const inCore = r >= 2 && r <= 4 && c >= 2 && c <= 4;
      place(grid, rr, cc, inRing || inCore ? 1 : 0);
    }
  }
}

function drawFunctionPatterns(grid: Grid, version: number) {
  const size = grid.size;

  drawFinder(grid, 0, 0);
  drawFinder(grid, 0, size - 7);
  drawFinder(grid, size - 7, 0);

  // Timing.
  for (let i = 8; i < size - 8; i += 1) {
    const bit: 0 | 1 = i % 2 === 0 ? 1 : 0;
    place(grid, 6, i, bit);
    place(grid, i, 6, bit);
  }

  // Alignment, skipping the three that would sit on a finder.
  const centres = ALIGNMENT[version];
  for (const r of centres) {
    for (const c of centres) {
      const nearFinder =
        (r <= 8 && c <= 8) ||
        (r <= 8 && c >= size - 9) ||
        (r >= size - 9 && c <= 8);
      if (nearFinder) continue;
      for (let dr = -2; dr <= 2; dr += 1) {
        for (let dc = -2; dc <= 2; dc += 1) {
          const ring = Math.max(Math.abs(dr), Math.abs(dc));
          place(grid, r + dr, c + dc, ring === 1 ? 0 : 1);
        }
      }
    }
  }

  // The dark module, always.
  place(grid, size - 8, 8, 1);

  // Reserve the format areas so the payload walk steps over them.
  for (let i = 0; i < 9; i += 1) {
    if (grid.modules[8][i] === null) place(grid, 8, i, 0);
    if (grid.modules[i][8] === null) place(grid, i, 8, 0);
  }
  for (let i = 0; i < 8; i += 1) {
    if (grid.modules[8][size - 1 - i] === null) place(grid, 8, size - 1 - i, 0);
    if (grid.modules[size - 1 - i][8] === null) place(grid, size - 1 - i, 8, 0);
  }

  // Version information, versions 7 and up.
  if (version >= 7) {
    const bits = versionBits(version);
    for (let i = 0; i < 18; i += 1) {
      const bit: 0 | 1 = ((bits >> i) & 1) as 0 | 1;
      const r = Math.floor(i / 3);
      const c = size - 11 + (i % 3);
      place(grid, r, c, bit);
      place(grid, c, r, bit);
    }
  }
}

function versionBits(version: number): number {
  let value = version << 12;
  for (let i = 0; i < 6; i += 1) {
    if (value & (1 << (17 - i))) value ^= 0x1f25 << (5 - i);
  }
  return (version << 12) | value;
}

function formatBits(ecc: Ecc, mask: number): number {
  const data = (ECC_BITS[ecc] << 3) | mask;
  let value = data << 10;
  for (let i = 0; i < 5; i += 1) {
    if (value & (1 << (14 - i))) value ^= 0x537 << (4 - i);
  }
  return ((data << 10) | value) ^ 0x5412;
}

function placeFormat(grid: Grid, ecc: Ecc, mask: number) {
  const size = grid.size;
  const bits = formatBits(ecc, mask);
  for (let i = 0; i < 15; i += 1) {
    // The placement sequence runs most-significant bit first, which is the
    // detail every from-scratch implementation gets wrong once.
    const bit: 0 | 1 = ((bits >> (14 - i)) & 1) as 0 | 1;
    // First copy, around the top-left finder.
    if (i < 6) grid.modules[8][i] = bit;
    else if (i === 6) grid.modules[8][7] = bit;
    else if (i === 7) grid.modules[8][8] = bit;
    else if (i === 8) grid.modules[7][8] = bit;
    else grid.modules[14 - i][8] = bit;

    // Second copy, split between the other two finders.
    if (i < 8) grid.modules[size - 1 - i][8] = bit;
    else grid.modules[8][size - 15 + i] = bit;
  }
}

const MASKS: ((r: number, c: number) => boolean)[] = [
  (r, c) => (r + c) % 2 === 0,
  (r) => r % 2 === 0,
  (_r, c) => c % 3 === 0,
  (r, c) => (r + c) % 3 === 0,
  (r, c) => (Math.floor(r / 2) + Math.floor(c / 3)) % 2 === 0,
  (r, c) => ((r * c) % 2) + ((r * c) % 3) === 0,
  (r, c) => (((r * c) % 2) + ((r * c) % 3)) % 2 === 0,
  (r, c) => (((r + c) % 2) + ((r * c) % 3)) % 2 === 0,
];

function placePayload(grid: Grid, codewords: number[], mask: number) {
  const size = grid.size;
  const bits: number[] = [];
  for (const byte of codewords) {
    for (let i = 7; i >= 0; i -= 1) bits.push((byte >> i) & 1);
  }

  let index = 0;
  let upward = true;
  for (let right = size - 1; right > 0; right -= 2) {
    if (right === 6) right -= 1; // step over the vertical timing column
    for (let step = 0; step < size; step += 1) {
      const row = upward ? size - 1 - step : step;
      for (const col of [right, right - 1]) {
        if (grid.reserved[row][col]) continue;
        let bit = index < bits.length ? bits[index] : 0;
        index += 1;
        if (MASKS[mask](row, col)) bit ^= 1;
        grid.modules[row][col] = bit as 0 | 1;
      }
    }
    upward = !upward;
  }
}

/* --------------------------------------------------------------- penalty -- */

function penalty(grid: Grid): number {
  const size = grid.size;
  const at = (r: number, c: number) => grid.modules[r][c] === 1;
  let score = 0;

  // Rule 1: runs of five or more of the same colour, each direction.
  for (let i = 0; i < size; i += 1) {
    for (const horizontal of [true, false]) {
      let run = 1;
      for (let j = 1; j < size; j += 1) {
        const a = horizontal ? at(i, j) : at(j, i);
        const b = horizontal ? at(i, j - 1) : at(j - 1, i);
        if (a === b) {
          run += 1;
        } else {
          if (run >= 5) score += run - 2;
          run = 1;
        }
      }
      if (run >= 5) score += run - 2;
    }
  }

  // Rule 2: every 2×2 block of one colour.
  for (let r = 0; r < size - 1; r += 1) {
    for (let c = 0; c < size - 1; c += 1) {
      const v = at(r, c);
      if (v === at(r, c + 1) && v === at(r + 1, c) && v === at(r + 1, c + 1)) {
        score += 3;
      }
    }
  }

  // Rule 3: the finder-like sequence, in either orientation.
  const PATTERN = [1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0];
  const REVERSED = [0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1];
  for (let r = 0; r < size; r += 1) {
    for (let c = 0; c <= size - 11; c += 1) {
      let matchA = true;
      let matchB = true;
      let matchC = true;
      let matchD = true;
      for (let k = 0; k < 11; k += 1) {
        const h = at(r, c + k) ? 1 : 0;
        const v = at(c + k, r) ? 1 : 0;
        if (h !== PATTERN[k]) matchA = false;
        if (h !== REVERSED[k]) matchB = false;
        if (v !== PATTERN[k]) matchC = false;
        if (v !== REVERSED[k]) matchD = false;
      }
      if (matchA) score += 40;
      if (matchB) score += 40;
      if (matchC) score += 40;
      if (matchD) score += 40;
    }
  }

  // Rule 4: deviation from an even split of dark and light.
  let dark = 0;
  for (let r = 0; r < size; r += 1) {
    for (let c = 0; c < size; c += 1) if (at(r, c)) dark += 1;
  }
  const percent = (dark * 100) / (size * size);
  score += Math.floor(Math.abs(percent - 50) / 5) * 10;

  return score;
}

/* ------------------------------------------------------------------- api -- */

/** True is a dark module. Row-major, no quiet zone. */
export function qrMatrix(
  text: string,
  ecc: Ecc = "H",
  /** Forces a mask instead of scoring all eight. Only the tests use this. */
  forcedMask?: number,
): boolean[][] {
  const bytes = utf8Bytes(text);
  const version = pickVersion(bytes.length, ecc);
  const codewords = buildCodewords(text, ecc, version);

  let best: Grid | null = null;
  let bestScore = Infinity;

  const masks = forcedMask === undefined ? [0, 1, 2, 3, 4, 5, 6, 7] : [forcedMask];
  for (const mask of masks) {
    const grid = blankGrid(version);
    drawFunctionPatterns(grid, version);
    placePayload(grid, codewords, mask);
    placeFormat(grid, ecc, mask);
    const score = penalty(grid);
    if (score < bestScore) {
      bestScore = score;
      best = grid;
    }
  }

  const grid = best!;
  return grid.modules.map((row) => row.map((v) => v === 1));
}

/**
 * One SVG path for every dark module, with an optional square knocked out of
 * the middle for the mark. At error correction H the code tolerates losing
 * thirty percent of itself, so a hole this size still scans everywhere.
 */
export function qrPath(
  matrix: boolean[][],
  options: { knockout?: number } = {},
): string {
  const size = matrix.length;
  const { knockout = 0 } = options;
  const half = knockout / 2;
  const centre = size / 2;

  let d = "";
  for (let r = 0; r < size; r += 1) {
    for (let c = 0; c < size; c += 1) {
      if (!matrix[r][c]) continue;
      if (
        knockout > 0 &&
        r + 1 > centre - half &&
        r < centre + half &&
        c + 1 > centre - half &&
        c < centre + half
      ) {
        continue;
      }
      d += `M${c} ${r}h1v1h-1z`;
    }
  }
  return d;
}
