"use client";

import { useEffect, useRef, useState } from "react";
import {
  cubeMesh,
  compile,
  context,
  identity,
  multiply,
  normalMatrix,
  perspective,
  rotationX,
  rotationY,
  rotationZ,
  scaling,
  translation,
  type Mat4,
} from "@/lib/gl";
import { clamp, easeStructural, lerp, mulberry32, range } from "@/lib/motion";

/**
 * THE CORE
 * ----------------------------------------------------------------------------
 * Fourteen cubes tumbling in space. As the page scrolls they stop tumbling,
 * find their axes, and lock into the two brackets that hold the core.
 *
 * This is the whole company in one object: a rented stack is fourteen pieces
 * moving independently, and what Corehold delivers is those pieces resolved
 * into one structure. Nothing here is decoration — the geometry is the pitch.
 *
 * Written directly against WebGL2. No 3D library, because /system publishes
 * this project's dependency count as evidence and a 600 kB import would make
 * that page dishonest. Fifteen draw calls, one shader, one cube.
 */

const VERT = `#version 300 es
in vec3 aPos;
in vec3 aNormal;
uniform mat4 uProj;
uniform mat4 uMV;
uniform mat3 uNorm;
out vec3 vNormal;
out vec3 vView;
void main() {
  vec4 view = uMV * vec4(aPos, 1.0);
  vView = view.xyz;
  vNormal = normalize(uNorm * aNormal);
  gl_Position = uProj * view;
}`;

const FRAG = `#version 300 es
precision highp float;
in vec3 vNormal;
in vec3 vView;
uniform vec3 uColor;
uniform float uEmissive;
uniform float uFogNear;
uniform float uFogFar;
out vec4 frag;

void main() {
  vec3 N = normalize(vNormal);
  vec3 V = normalize(-vView);
  vec3 L = normalize(vec3(0.45, 0.78, 0.55));
  vec3 K = normalize(vec3(-0.6, -0.2, 0.4));

  float key = max(dot(N, L), 0.0);
  float fill = max(dot(N, K), 0.0) * 0.22;
  float rim = pow(1.0 - max(dot(N, V), 0.0), 2.6);

  vec3 lit = uColor * (0.18 + key * 0.95 + fill);
  lit += vec3(0.851, 0.384, 0.169) * rim * 0.42;
  lit = mix(lit, uColor * 1.9 + vec3(0.10, 0.03, 0.0), uEmissive);

  float depth = -vView.z;
  float fog = smoothstep(uFogNear, uFogFar, depth);
  frag = vec4(lit, 1.0 - fog);
}`;

type Unit = {
  /** Resolved position in the assembled mark. */
  target: [number, number, number];
  /** Where it drifts before the structure exists. */
  chaos: [number, number, number];
  spin: [number, number, number];
  drift: number;
  phase: number;
  order: number;
  tint: number;
};

/**
 * The assembled formation: two seven-cube L-brackets, 180° twins of each
 * other, with the core between them. The same glyph as the flat mark, given
 * a third dimension.
 */
function buildUnits(): Unit[] {
  const rand = mulberry32(0x50f1d);
  const S = 0.62;

  const bracket: [number, number][] = [
    [-3, 3],
    [-2, 3],
    [-1, 3],
    [-3, 2],
    [-3, 1],
    [-3, 0],
    [-3, -1],
  ];

  // The two brackets sit on different planes. Face-on the glyph is exact;
  // a few degrees either side and you can see it is a real object.
  const targets: [number, number, number][] = [];
  for (const [x, y] of bracket) targets.push([x * S, y * S, 0.4]);
  for (const [x, y] of bracket) targets.push([-x * S, -y * S, -0.4]);

  return targets.map((target, i) => ({
    target,
    chaos: [
      (rand() - 0.5) * 11,
      (rand() - 0.5) * 7.5,
      (rand() - 0.5) * 7 - 1.5,
    ],
    spin: [rand() * 0.9 - 0.45, rand() * 0.9 - 0.45, rand() * 0.9 - 0.45],
    drift: 0.4 + rand() * 0.9,
    phase: rand() * Math.PI * 2,
    order: i / targets.length,
    tint: 0.82 + rand() * 0.36,
  }));
}

const UNITS = buildUnits();

/**
 * Where the object sits on screen at each point in the scroll. The copy
 * alternates sides down the page, so the object walks the other way and the
 * two never fight for the same column. During the switch demonstration it
 * withdraws into the distance instead of competing with the panel.
 */
const STAGING: [number, number, number][] = [
  // [progress, x offset, z push-back]
  [0.0, 2.7, 0],
  [0.2, 2.7, 0],
  [0.31, -2.7, 0],
  [0.42, -2.7, 0],
  [0.5, 0, 3.6],
  [0.58, 0, 3.6],
  [0.68, 2.5, 0],
  [0.78, 2.5, 0],
  [0.89, -2.5, 0],
  [1.0, -2.5, 0],
];

function stageAt(p: number) {
  for (let i = 0; i < STAGING.length - 1; i += 1) {
    const [a, ax, az] = STAGING[i];
    const [b, bx, bz] = STAGING[i + 1];
    if (p >= a && p <= b) {
      const k = easeStructural(clamp((p - a) / Math.max(b - a, 0.0001)));
      return { x: lerp(ax, bx, k), z: lerp(az, bz, k) };
    }
  }
  const last = STAGING[STAGING.length - 1];
  return { x: last[1], z: last[2] };
}
const BASE: [number, number, number] = [0.135, 0.158, 0.15];
const OXIDE: [number, number, number] = [0.851, 0.384, 0.169];

export function CoreScene({ stageId = "stage" }: { stageId?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mode, setMode] = useState<"pending" | "gl" | "static">("pending");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setMode("static");
      return;
    }

    const gl = context(canvas);
    const program = gl ? compile(gl, VERT, FRAG) : null;
    if (!gl || !program) {
      setMode("static");
      return;
    }
    setMode("gl");

    /* ---------------------------------------------------------- buffers -- */
    const mesh = cubeMesh();
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    const posBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
    gl.bufferData(gl.ARRAY_BUFFER, mesh.positions, gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 0, 0);

    const normBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normBuf);
    gl.bufferData(gl.ARRAY_BUFFER, mesh.normals, gl.STATIC_DRAW);
    const aNormal = gl.getAttribLocation(program, "aNormal");
    gl.enableVertexAttribArray(aNormal);
    gl.vertexAttribPointer(aNormal, 3, gl.FLOAT, false, 0, 0);

    const idxBuf = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, idxBuf);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, mesh.indices, gl.STATIC_DRAW);

    const uProj = gl.getUniformLocation(program, "uProj");
    const uMV = gl.getUniformLocation(program, "uMV");
    const uNorm = gl.getUniformLocation(program, "uNorm");
    const uColor = gl.getUniformLocation(program, "uColor");
    const uEmissive = gl.getUniformLocation(program, "uEmissive");
    const uFogNear = gl.getUniformLocation(program, "uFogNear");
    const uFogFar = gl.getUniformLocation(program, "uFogFar");

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);

    /* ------------------------------------------------------------ state -- */
    let width = 0;
    let height = 0;
    let progress = 0;
    let visible = false;
    let pointerX = 0;
    let pointerY = 0;
    let targetX = 0;
    let targetY = 0;
    let frame = 0;
    let running = true;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const measure = () => {
      const stage = document.getElementById(stageId);
      if (!stage) return;
      const rect = stage.getBoundingClientRect();
      const travel = Math.max(1, rect.height - window.innerHeight);
      progress = clamp(-rect.top / travel);
      visible = rect.top < window.innerHeight && rect.bottom > 0;
      canvas.style.opacity = visible ? "1" : "0";
    };

    const onPointer = (event: PointerEvent) => {
      targetX = (event.clientX / window.innerWidth - 0.5) * 2;
      targetY = (event.clientY / window.innerHeight - 0.5) * 2;
    };

    resize();
    measure();
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("pointermove", onPointer, { passive: true });

    /* ------------------------------------------------------------- loop -- */
    const mv = identity();
    const scratch = identity();

    const render = (time: number) => {
      if (!running) return;
      frame = window.requestAnimationFrame(render);
      if (!visible || !width || !height) return;

      const t = time / 1000;
      pointerX += (targetX - pointerX) * 0.045;
      pointerY += (targetY - pointerY) * 0.045;

      // The dolly: the camera closes in as the structure resolves.
      const assembly = easeStructural(range(progress, 0.02, 0.72));
      const staging = stageAt(progress);
      const dolly = lerp(12.4, 9.2, assembly) + staging.z;

      const proj = perspective(
        (42 * Math.PI) / 180,
        width / Math.max(height, 1),
        0.1,
        60,
      );
      gl.useProgram(program);
      gl.uniformMatrix4fv(uProj, false, proj);
      gl.uniform1f(uFogNear, 7.5);
      gl.uniform1f(uFogFar, 21);

      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.bindVertexArray(vao);

      // The assembly sways rather than spins. A planar glyph turned ninety
      // degrees is a line, and the payoff here is recognising the mark — so
      // the rotation is bounded and the object stays broadly face-on.
      const sway = Math.sin(t * 0.24) * 0.32 + pointerX * 0.34;
      const tilt = Math.sin(t * 0.19) * 0.1 - pointerY * 0.22;
      const worldRot = multiply(rotationY(sway), rotationX(tilt));
      const view = multiply(
        translation(staging.x, 0, -dolly),
        worldRot,
        identity(),
      );

      const drawCube = (
        position: [number, number, number],
        rot: Mat4,
        size: number,
        color: [number, number, number],
        emissive: number,
      ) => {
        const model = multiply(
          translation(position[0], position[1], position[2]),
          multiply(rot, scaling(size), scratch),
          identity(),
        );
        multiply(view, model, mv);
        gl.uniformMatrix4fv(uMV, false, mv);
        gl.uniformMatrix3fv(uNorm, false, normalMatrix(mv));
        gl.uniform3f(uColor, color[0], color[1], color[2]);
        gl.uniform1f(uEmissive, emissive);
        gl.drawElements(gl.TRIANGLES, mesh.indices.length, gl.UNSIGNED_SHORT, 0);
      };

      for (const unit of UNITS) {
        // Each cube settles on its own beat, so the structure builds rather
        // than snapping into place all at once.
        const settle = easeStructural(
          clamp((progress - unit.order * 0.16) / 0.62),
        );

        const wander = (1 - settle) * 0.55;
        const cx =
          unit.chaos[0] + Math.sin(t * 0.32 * unit.drift + unit.phase) * wander;
        const cy =
          unit.chaos[1] + Math.cos(t * 0.27 * unit.drift + unit.phase) * wander;
        const cz =
          unit.chaos[2] + Math.sin(t * 0.19 * unit.drift + unit.phase * 1.7) * wander;

        const position: [number, number, number] = [
          lerp(cx, unit.target[0], settle),
          lerp(cy, unit.target[1], settle),
          lerp(cz, unit.target[2], settle),
        ];

        // Tumbling decays to zero: alignment is the payoff.
        const tumble = 1 - settle;
        const rot = multiply(
          rotationX(t * unit.spin[0] * tumble + unit.phase * tumble),
          multiply(
            rotationY(t * unit.spin[1] * tumble + unit.phase * tumble),
            rotationZ(t * unit.spin[2] * tumble),
            identity(),
          ),
          identity(),
        );

        const shade = lerp(unit.tint, 1, settle * 0.8);
        drawCube(
          position,
          rot,
          lerp(0.5, 0.56, settle),
          [BASE[0] * shade, BASE[1] * shade, BASE[2] * shade],
          0,
        );
      }

      // The core arrives last, and only once there is something to hold it.
      const coreIn = easeStructural(range(progress, 0.5, 0.88));
      if (coreIn > 0.001) {
        const breath = 1 + Math.sin(t * 0.9) * 0.018;
        drawCube([0, 0, 0], identity(), 1.05 * coreIn * breath, OXIDE, 0.55);
      }
    };

    frame = window.requestAnimationFrame(render);

    return () => {
      running = false;
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", measure);
      window.removeEventListener("pointermove", onPointer);
      gl.deleteBuffer(posBuf);
      gl.deleteBuffer(normBuf);
      gl.deleteBuffer(idxBuf);
      gl.deleteVertexArray(vao);
      gl.deleteProgram(program);
    };
  }, [stageId]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <canvas
        ref={canvasRef}
        className="h-full w-full transition-opacity duration-700 ease-[cubic-bezier(0.22,0.68,0.24,1)]"
        style={{ opacity: 0 }}
      />
      {mode === "static" && <StaticCore />}
    </div>
  );
}

/**
 * The frame the scene resolves to, for readers who have asked for stillness or
 * whose browser has no WebGL2. Same geometry, no motion, no context.
 */
function StaticCore() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <svg viewBox="0 0 32 32" className="w-[46vmin] opacity-70" fill="none">
        <path
          d="M3 13.5V3h10.5"
          stroke="currentColor"
          strokeWidth="2.6"
          strokeLinecap="square"
          className="text-quarry-700"
        />
        <path
          d="M29 18.5V29H18.5"
          stroke="currentColor"
          strokeWidth="2.6"
          strokeLinecap="square"
          className="text-quarry-700"
        />
        <rect x="11.5" y="11.5" width="9" height="9" className="fill-current text-oxide" />
      </svg>
    </div>
  );
}
