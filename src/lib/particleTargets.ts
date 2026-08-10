import { mulberry32 } from "./motion";

/**
 * Where every particle in the swarm is going.
 *
 * The mark is five boxes on a 32-unit drawing grid — two bracket arms, their
 * 180° twins, and the core — mapped here into the same space the assembled
 * units occupy, so the swarm resolves onto exactly the silhouette the geometry
 * later locks into. Points are distributed by volume, so the core reads solid
 * and the arms read like arms rather than every box getting the same crowd.
 *
 * Seeded, so the formation is identical on every load, every device and every
 * screenshot. A brand built on determinism should not shuffle itself per
 * visitor.
 */

type Box = {
  centre: [number, number, number];
  half: [number, number, number];
};

const SCALE = 1.9; // matches the assembled unit formation

const BOXES: Box[] = [
  { centre: [-0.484, 0.8125, 0], half: [0.422, 0.094, 0.085] },
  { centre: [-0.8125, 0.531, 0], half: [0.094, 0.375, 0.085] },
  { centre: [0.484, -0.8125, 0], half: [0.422, 0.094, 0.085] },
  { centre: [0.8125, -0.531, 0], half: [0.094, 0.375, 0.085] },
  { centre: [0, 0, 0], half: [0.3125, 0.3125, 0.115] },
];

export function buildParticleTargets(count: number): Float32Array {
  const rand = mulberry32(0x4d1ce1);
  const out = new Float32Array(count * 3);

  const volumes = BOXES.map((b) => b.half[0] * b.half[1] * b.half[2]);
  const total = volumes.reduce((a, b) => a + b, 0);
  const cumulative: number[] = [];
  let running = 0;
  for (const v of volumes) {
    running += v / total;
    cumulative.push(running);
  }

  for (let i = 0; i < count; i += 1) {
    const pick = rand();
    let b = 0;
    while (b < cumulative.length - 1 && pick > cumulative[b]) b += 1;
    const box = BOXES[b];

    out[i * 3] = (box.centre[0] + (rand() * 2 - 1) * box.half[0]) * SCALE;
    out[i * 3 + 1] = (box.centre[1] + (rand() * 2 - 1) * box.half[1]) * SCALE;
    out[i * 3 + 2] = (box.centre[2] + (rand() * 2 - 1) * box.half[2]) * SCALE;
  }

  return out;
}
