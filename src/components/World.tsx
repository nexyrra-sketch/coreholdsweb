"use client";

import { useEffect, useRef, useState } from "react";
import {
  bindTarget,
  compile,
  context,
  createTarget,
  cubeMesh,
  disposeTarget,
  drawFullscreen,
  enableFloatTargets,
  FULLSCREEN_VERT,
  identity,
  lookAt,
  multiply,
  normalMatrix,
  perspective,
  rotationX,
  rotationY,
  rotationZ,
  scaling,
  translation,
  type Mat4,
  type Target,
} from "@/lib/gl";
import {
  BLUR_FRAG,
  COMPOSITE_FRAG,
  DOWNSAMPLE_FRAG,
  SCENE_FRAG,
  SCENE_VERT,
} from "@/lib/shaders";
import { QUARRY_FRAGMENT } from "@/lib/quarryShader";
import { PARTICLE_RENDER_FRAG, PARTICLE_RENDER_VERT, PARTICLE_SIM_VERT } from "@/lib/particles";
import { buildParticleTargets } from "@/lib/particleTargets";
import { clamp, easeStructural, lerp, mulberry32, range } from "@/lib/motion";
import { subscribeShader } from "@/lib/shaderBus";
import { playCut, playLock } from "@/lib/audio";

/**
 * THE WORLD
 * ----------------------------------------------------------------------------
 * One canvas, one camera, one continuous space that the whole page moves
 * through. Nothing here is a widget dropped into a section — the scroll
 * position *is* the camera, and the beats of the page are places in the scene.
 *
 * Six things happen in it, in order:
 *
 *   1. Fourteen units tumble in deep space.
 *   2. Two hundred thousand particles churn — the rented stack, simulated on
 *      the GPU by transform feedback, one draw call.
 *   3. The scene withdraws so the kill-switch panel can hold the screen.
 *   4. The units find their axes and lock into the mark.
 *   5. A block of stone is machined down and the mark is carved out of it,
 *      raymarched from a distance field with no geometry at all.
 *   6. The core settles and holds.
 *
 * Everything then goes through a film pass: velocity-buffer motion blur, bloom,
 * depth of field, chromatic aberration, grain and vignette. Written here,
 * because /system publishes the dependency count and importing an engine to do
 * this would make that page a lie.
 */

type Unit = {
  target: [number, number, number];
  chaos: [number, number, number];
  spin: [number, number, number];
  drift: number;
  phase: number;
  order: number;
  tint: number;
  prevModel: Mat4;
};

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
    prevModel: identity(),
  }));
}

const UNITS = buildUnits();

/** Where the object sits on screen at each point in the scroll. */
const STAGING: [number, number, number][] = [
  [0.0, 2.7, 0],
  [0.2, 2.7, 0],
  [0.31, -2.7, 0],
  [0.42, -2.7, 0],
  [0.5, 0, 3.6],
  [0.58, 0, 3.6],
  [0.68, 0.4, 0],
  [0.78, 0.4, 0],
  [0.89, -2.4, 0],
  [1.0, -2.7, 0],
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

/** Fewer particles where there is less GPU to spend. */
function particleCount(): number {
  const wide = window.innerWidth >= 900;
  const cores = navigator.hardwareConcurrency ?? 4;
  if (!wide) return 48_000;
  if (cores <= 4) return 96_000;
  return 200_000;
}

export function World({ stageId = "stage" }: { stageId?: string }) {
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
    if (!gl) {
      setMode("static");
      return;
    }

    const hdr = enableFloatTargets(gl);

    const sceneProgram = compile(gl, SCENE_VERT, SCENE_FRAG);
    let quarryProgram = compile(gl, FULLSCREEN_VERT, QUARRY_FRAGMENT);
    const downProgram = compile(gl, FULLSCREEN_VERT, DOWNSAMPLE_FRAG);
    const blurProgram = compile(gl, FULLSCREEN_VERT, BLUR_FRAG);
    const compositeProgram = compile(gl, FULLSCREEN_VERT, COMPOSITE_FRAG);
    const simProgram = compile(gl, PARTICLE_SIM_VERT, MINIMAL_FRAG, [
      "vPosition",
      "vVelocity",
    ]);
    const pointProgram = compile(gl, PARTICLE_RENDER_VERT, PARTICLE_RENDER_FRAG);

    if (
      !sceneProgram ||
      !quarryProgram ||
      !downProgram ||
      !blurProgram ||
      !compositeProgram
    ) {
      setMode("static");
      return;
    }
    setMode("gl");

    /* ------------------------------------------------------------ geometry */
    const mesh = cubeMesh();
    const cubeVao = gl.createVertexArray();
    gl.bindVertexArray(cubeVao);

    const posBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
    gl.bufferData(gl.ARRAY_BUFFER, mesh.positions, gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(sceneProgram, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 0, 0);

    const normBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normBuf);
    gl.bufferData(gl.ARRAY_BUFFER, mesh.normals, gl.STATIC_DRAW);
    const aNormal = gl.getAttribLocation(sceneProgram, "aNormal");
    gl.enableVertexAttribArray(aNormal);
    gl.vertexAttribPointer(aNormal, 3, gl.FLOAT, false, 0, 0);

    const idxBuf = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, idxBuf);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, mesh.indices, gl.STATIC_DRAW);
    gl.bindVertexArray(null);

    /* ----------------------------------------------------------- particles */
    const COUNT = simProgram && pointProgram ? particleCount() : 0;
    const swarm = COUNT ? createSwarm(gl, simProgram!, pointProgram!, COUNT) : null;

    /* ------------------------------------------------------------ uniforms */
    const u = (program: WebGLProgram, name: string) =>
      gl.getUniformLocation(program, name);

    const su = {
      proj: u(sceneProgram, "uProj"),
      view: u(sceneProgram, "uView"),
      model: u(sceneProgram, "uModel"),
      prevViewProj: u(sceneProgram, "uPrevViewProj"),
      prevModel: u(sceneProgram, "uPrevModel"),
      normalMatrix: u(sceneProgram, "uNormalMatrix"),
      albedo: u(sceneProgram, "uAlbedo"),
      roughness: u(sceneProgram, "uRoughness"),
      metallic: u(sceneProgram, "uMetallic"),
      emissive: u(sceneProgram, "uEmissive"),
      cursor: u(sceneProgram, "uCursor"),
      eye: u(sceneProgram, "uEye"),
      fogNear: u(sceneProgram, "uFogNear"),
      fogFar: u(sceneProgram, "uFogFar"),
      opacity: u(sceneProgram, "uOpacity"),
    };

    let qu = quarryUniforms(gl, quarryProgram);

    const du = {
      source: u(downProgram, "uSource"),
      texel: u(downProgram, "uTexel"),
    };
    const bu = {
      source: u(blurProgram, "uSource"),
      direction: u(blurProgram, "uDirection"),
    };
    const cu = {
      scene: u(compositeProgram, "uScene"),
      blurred: u(compositeProgram, "uBlurred"),
      data: u(compositeProgram, "uData"),
      resolution: u(compositeProgram, "uResolution"),
      time: u(compositeProgram, "uTime"),
      blurStrength: u(compositeProgram, "uBlurStrength"),
      focus: u(compositeProgram, "uFocus"),
      focusRange: u(compositeProgram, "uFocusRange"),
      dof: u(compositeProgram, "uDof"),
      bloom: u(compositeProgram, "uBloom"),
      grain: u(compositeProgram, "uGrain"),
      aberration: u(compositeProgram, "uAberration"),
      vignette: u(compositeProgram, "uVignette"),
      distortion: u(compositeProgram, "uDistortion"),
      exposure: u(compositeProgram, "uExposure"),
    };

    /* --------------------------------------------------------------- state */
    let sceneTarget: Target | null = null;
    let halfA: Target | null = null;
    let halfB: Target | null = null;
    let width = 0;
    let height = 0;
    let pixelWidth = 0;
    let pixelHeight = 0;
    let progress = 0;
    let visible = false;
    let pointerX = 0;
    let pointerY = 0;
    let targetPX = 0;
    let targetPY = 0;
    let frame = 0;
    let running = true;
    let last = 0;
    // Sound is cued off the same numbers that drive the picture, so a reader
    // with the room on hears the mark lock and the stone give way at the exact
    // frame those things happen. Latched, so scrubbing back and forth does not
    // machine-gun the events.
    let lockedFired = false;
    let cutFired = false;

    const emptyVao = gl.createVertexArray();

    const allocate = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      pixelWidth = Math.max(1, Math.round(width * dpr));
      pixelHeight = Math.max(1, Math.round(height * dpr));
      canvas.width = pixelWidth;
      canvas.height = pixelHeight;

      disposeTarget(gl, sceneTarget);
      disposeTarget(gl, halfA);
      disposeTarget(gl, halfB);

      sceneTarget = createTarget(gl, pixelWidth, pixelHeight, {
        attachments: 2,
        float: hdr,
        depth: true,
      });
      const qw = Math.max(1, pixelWidth >> 2);
      const qh = Math.max(1, pixelHeight >> 2);
      halfA = createTarget(gl, qw, qh, { float: hdr });
      halfB = createTarget(gl, qw, qh, { float: hdr });
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
      targetPX = (event.clientX / window.innerWidth - 0.5) * 2;
      targetPY = (event.clientY / window.innerHeight - 0.5) * 2;
    };

    allocate();
    measure();
    window.addEventListener("resize", allocate, { passive: true });
    window.addEventListener("resize", measure, { passive: true });
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("pointermove", onPointer, { passive: true });

    // The shader lab on /system recompiles the carve while it is running.
    const unsubscribe = subscribeShader((source) => {
      const next = compile(gl, FULLSCREEN_VERT, source);
      if (!next) return false;
      if (quarryProgram) gl.deleteProgram(quarryProgram);
      quarryProgram = next;
      qu = quarryUniforms(gl, next);
      return true;
    });

    /* ---------------------------------------------------------------- loop */
    const prevViewProj = identity();
    const viewProj = identity();
    const modelScratch = identity();
    const mv = identity();

    const render = (time: number) => {
      if (!running) return;
      frame = window.requestAnimationFrame(render);
      if (!visible || !width || !height || !sceneTarget || !halfA || !halfB) return;

      const t = time / 1000;
      const dt = Math.min(last ? t - last : 0.016, 0.05);
      last = t;

      pointerX += (targetPX - pointerX) * 0.045;
      pointerY += (targetPY - pointerY) * 0.045;

      const assembly = easeStructural(range(progress, 0.02, 0.62));
      const carve = easeStructural(range(progress, 0.78, 0.99));
      const carveIn = easeStructural(range(progress, 0.755, 0.83));
      const staging = stageAt(progress);
      const dolly = lerp(12.4, 9.2, assembly) + staging.z;

      if (!lockedFired && progress > 0.70) {
        lockedFired = true;
        playLock();
      } else if (lockedFired && progress < 0.60) {
        lockedFired = false;
      }
      if (!cutFired && progress > 0.80) {
        cutFired = true;
        playCut();
      } else if (cutFired && progress < 0.74) {
        cutFired = false;
      }

      const aspect = width / Math.max(height, 1);
      const fov = (42 * Math.PI) / 180;
      const near = 0.1;
      const far = 60;
      const proj = perspective(fov, aspect, near, far);

      const sway = Math.sin(t * 0.24) * 0.32 + pointerX * 0.34;
      const tilt = Math.sin(t * 0.19) * 0.1 - pointerY * 0.22;
      const worldRot = multiply(rotationY(sway), rotationX(tilt));
      const view = multiply(translation(staging.x, 0, -dolly), worldRot, identity());
      multiply(proj, view, viewProj);

      const eye: [number, number, number] = [-staging.x, 0, dolly];
      const cursor: [number, number, number] = [
        pointerX * 7.5,
        -pointerY * 5.0,
        4.2,
      ];

      /* ---- pass one: the scene ------------------------------------------ */
      bindTarget(gl, sceneTarget);
      gl.drawBuffers([gl.COLOR_ATTACHMENT0, gl.COLOR_ATTACHMENT1]);
      gl.clearColor(0, 0, 0, 0);
      gl.enable(gl.DEPTH_TEST);
      gl.depthMask(true);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

      // The carve. One triangle, one distance field, no geometry.
      if (carveIn > 0.002 && quarryProgram) {
        gl.useProgram(quarryProgram);
        gl.bindVertexArray(emptyVao);
        gl.uniform2f(qu.resolution, pixelWidth, pixelHeight);
        gl.uniform1f(qu.time, t);
        gl.uniform1f(qu.carve, carve);
        gl.uniform1f(qu.near, near);
        gl.uniform1f(qu.far, far);
        gl.uniform1f(qu.fov, fov);
        gl.uniform1f(qu.opacity, carveIn);
        gl.uniform3f(qu.eye, eye[0], eye[1], eye[2]);
        gl.uniform3f(qu.cursor, cursor[0], cursor[1], cursor[2]);
        gl.uniformMatrix4fv(qu.invView, false, inverseRigid(view));
        drawFullscreen(gl);
      }

      // The units.
      gl.useProgram(sceneProgram);
      gl.bindVertexArray(cubeVao);
      gl.uniformMatrix4fv(su.proj, false, proj);
      gl.uniformMatrix4fv(su.view, false, view);
      gl.uniformMatrix4fv(su.prevViewProj, false, prevViewProj);
      gl.uniform3f(su.cursor, cursor[0], cursor[1], cursor[2]);
      gl.uniform3f(su.eye, eye[0], eye[1], eye[2]);
      gl.uniform1f(su.fogNear, 7.5);
      gl.uniform1f(su.fogFar, 21);

      const unitsOpacity = 1 - carveIn;

      const drawMesh = (
        model: Mat4,
        prev: Mat4,
        colour: [number, number, number],
        roughness: number,
        metallic: number,
        emissive: number,
        opacity: number,
      ) => {
        gl.uniformMatrix4fv(su.model, false, model);
        gl.uniformMatrix4fv(su.prevModel, false, prev);
        multiply(view, model, mv);
        gl.uniformMatrix3fv(su.normalMatrix, false, normalMatrix(model));
        gl.uniform3f(su.albedo, colour[0], colour[1], colour[2]);
        gl.uniform1f(su.roughness, roughness);
        gl.uniform1f(su.metallic, metallic);
        gl.uniform1f(su.emissive, emissive);
        gl.uniform1f(su.opacity, opacity);
        gl.drawElements(gl.TRIANGLES, mesh.indices.length, gl.UNSIGNED_SHORT, 0);
      };

      if (unitsOpacity > 0.002) {
        for (const unit of UNITS) {
          const settle = easeStructural(clamp((progress - unit.order * 0.14) / 0.55));
          const wander = (1 - settle) * 0.55;
          const cx = unit.chaos[0] + Math.sin(t * 0.32 * unit.drift + unit.phase) * wander;
          const cy = unit.chaos[1] + Math.cos(t * 0.27 * unit.drift + unit.phase) * wander;
          const cz =
            unit.chaos[2] + Math.sin(t * 0.19 * unit.drift + unit.phase * 1.7) * wander;

          const position: [number, number, number] = [
            lerp(cx, unit.target[0], settle),
            lerp(cy, unit.target[1], settle),
            lerp(cz, unit.target[2], settle),
          ];

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

          const size = lerp(0.5, 0.56, settle);
          const model = multiply(
            translation(position[0], position[1], position[2]),
            multiply(rot, scaling(size), modelScratch),
            identity(),
          );

          const shade = lerp(unit.tint, 1, settle * 0.8);
          drawMesh(
            model,
            unit.prevModel,
            [BASE[0] * shade, BASE[1] * shade, BASE[2] * shade],
            lerp(0.72, 0.42, settle),
            lerp(0.05, 0.55, settle),
            0,
            unitsOpacity,
          );
          unit.prevModel.set(model);
        }

        const coreIn = easeStructural(range(progress, 0.52, 0.72));
        if (coreIn > 0.001) {
          const breath = 1 + Math.sin(t * 0.9) * 0.018;
          const model = multiply(
            translation(0, 0, 0),
            scaling(1.05 * coreIn * breath),
            identity(),
          );
          drawMesh(model, model, OXIDE, 0.34, 0.30, 0.42, unitsOpacity);
        }
      }

      /* ---- the swarm ----------------------------------------------------- */
      if (swarm) {
        const gather = easeStructural(range(progress, 0.10, 0.50));
        const swarmOpacity =
          easeStructural(range(progress, 0.03, 0.12)) *
          (1 - easeStructural(range(progress, 0.50, 0.62)));
        swarm.step(dt, t, gather);
        if (swarmOpacity > 0.004) {
          swarm.draw(proj, view, swarmOpacity, gather);
        }
      }

      /* ---- pass two: one blurred copy, for bloom and for the far field --- */
      gl.disable(gl.DEPTH_TEST);
      gl.disable(gl.BLEND);
      gl.bindVertexArray(emptyVao);

      bindTarget(gl, halfA);
      gl.drawBuffers([gl.COLOR_ATTACHMENT0]);
      gl.useProgram(downProgram);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, sceneTarget.textures[0]);
      gl.uniform1i(du.source, 0);
      gl.uniform2f(du.texel, 1 / pixelWidth, 1 / pixelHeight);
      drawFullscreen(gl);

      gl.useProgram(blurProgram);
      for (let pass = 0; pass < 2; pass += 1) {
        bindTarget(gl, halfB);
        gl.bindTexture(gl.TEXTURE_2D, halfA.textures[0]);
        gl.uniform1i(bu.source, 0);
        gl.uniform2f(bu.direction, (1 / halfA.width) * (1 + pass), 0);
        drawFullscreen(gl);

        bindTarget(gl, halfA);
        gl.bindTexture(gl.TEXTURE_2D, halfB.textures[0]);
        gl.uniform1i(bu.source, 0);
        gl.uniform2f(bu.direction, 0, (1 / halfA.height) * (1 + pass));
        drawFullscreen(gl);
      }

      /* ---- pass three: the film ------------------------------------------ */
      bindTarget(gl, null);
      gl.viewport(0, 0, pixelWidth, pixelHeight);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(compositeProgram);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, sceneTarget.textures[0]);
      gl.uniform1i(cu.scene, 0);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, halfA.textures[0]);
      gl.uniform1i(cu.blurred, 1);
      gl.activeTexture(gl.TEXTURE2);
      gl.bindTexture(gl.TEXTURE_2D, sceneTarget.textures[1]);
      gl.uniform1i(cu.data, 2);

      gl.uniform2f(cu.resolution, pixelWidth, pixelHeight);
      gl.uniform1f(cu.time, t);
      gl.uniform1f(cu.blurStrength, 0.75);
      gl.uniform1f(cu.focus, dolly);
      gl.uniform1f(cu.focusRange, 9.5);
      gl.uniform1f(cu.dof, 0.52);
      gl.uniform1f(cu.bloom, hdr ? 0.62 : 0.42);
      gl.uniform1f(cu.grain, 0.024);
      gl.uniform1f(cu.aberration, 0.0016);
      gl.uniform1f(cu.vignette, 0.38);
      gl.uniform1f(cu.distortion, 0.035);
      gl.uniform1f(cu.exposure, 1.0);
      drawFullscreen(gl);

      prevViewProj.set(viewProj);
    };

    frame = window.requestAnimationFrame(render);

    return () => {
      running = false;
      window.cancelAnimationFrame(frame);
      unsubscribe();
      window.removeEventListener("resize", allocate);
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure);
      window.removeEventListener("pointermove", onPointer);
      swarm?.dispose();
      disposeTarget(gl, sceneTarget);
      disposeTarget(gl, halfA);
      disposeTarget(gl, halfB);
      gl.deleteBuffer(posBuf);
      gl.deleteBuffer(normBuf);
      gl.deleteBuffer(idxBuf);
      gl.deleteVertexArray(cubeVao);
      gl.deleteVertexArray(emptyVao);
      gl.deleteProgram(sceneProgram);
      if (quarryProgram) gl.deleteProgram(quarryProgram);
      gl.deleteProgram(downProgram);
      gl.deleteProgram(blurProgram);
      gl.deleteProgram(compositeProgram);
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

/* -------------------------------------------------------------------------- */

const MINIMAL_FRAG = `#version 300 es
precision highp float;
out vec4 frag;
void main() { frag = vec4(0.0); }`;

function quarryUniforms(gl: WebGL2RenderingContext, program: WebGLProgram) {
  const u = (name: string) => gl.getUniformLocation(program, name);
  return {
    resolution: u("uResolution"),
    time: u("uTime"),
    carve: u("uCarve"),
    near: u("uNear"),
    far: u("uFar"),
    eye: u("uEye"),
    invView: u("uInvView"),
    fov: u("uFov"),
    cursor: u("uCursor"),
    opacity: u("uOpacity"),
  };
}

/** Inverse of a rotation-plus-translation matrix. No general solve needed. */
function inverseRigid(m: Mat4): Mat4 {
  const out = identity();
  out[0] = m[0]; out[1] = m[4]; out[2] = m[8];
  out[4] = m[1]; out[5] = m[5]; out[6] = m[9];
  out[8] = m[2]; out[9] = m[6]; out[10] = m[10];
  out[12] = -(m[0] * m[12] + m[1] * m[13] + m[2] * m[14]);
  out[13] = -(m[4] * m[12] + m[5] * m[13] + m[6] * m[14]);
  out[14] = -(m[8] * m[12] + m[9] * m[13] + m[10] * m[14]);
  return out;
}

/* ---------------------------------------------------------------- the swarm */

type Swarm = {
  step: (dt: number, time: number, gather: number) => void;
  draw: (proj: Mat4, view: Mat4, opacity: number, gather: number) => void;
  dispose: () => void;
};

/**
 * Two hundred thousand particles, simulated entirely on the GPU.
 *
 * WebGL2's transform feedback lets a vertex shader write its results back into
 * a buffer instead of rasterising them, so the simulation is a draw call with
 * the rasteriser switched off. Two sets of buffers, swapped each frame. No
 * readback, no CPU work per particle, one draw call to simulate and one to
 * render.
 */
function createSwarm(
  gl: WebGL2RenderingContext,
  simProgram: WebGLProgram,
  pointProgram: WebGLProgram,
  count: number,
): Swarm {
  const positions = new Float32Array(count * 3);
  const velocities = new Float32Array(count * 3);
  const seeds = new Float32Array(count);
  const targets = buildParticleTargets(count);

  const rand = mulberry32(0xc0e401);
  for (let i = 0; i < count; i += 1) {
    positions[i * 3] = (rand() - 0.5) * 17;
    positions[i * 3 + 1] = (rand() - 0.5) * 10.5;
    positions[i * 3 + 2] = (rand() - 0.5) * 9 - 2;
    velocities[i * 3] = (rand() - 0.5) * 0.5;
    velocities[i * 3 + 1] = (rand() - 0.5) * 0.5;
    velocities[i * 3 + 2] = (rand() - 0.5) * 0.5;
    seeds[i] = rand();
  }

  const buffer = (data: Float32Array, usage: number) => {
    const b = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, b);
    gl.bufferData(gl.ARRAY_BUFFER, data, usage);
    return b;
  };

  const posA = buffer(positions, gl.DYNAMIC_COPY);
  const posB = buffer(positions, gl.DYNAMIC_COPY);
  const velA = buffer(velocities, gl.DYNAMIC_COPY);
  const velB = buffer(velocities, gl.DYNAMIC_COPY);
  const targetBuf = buffer(targets, gl.STATIC_DRAW);
  const seedBuf = buffer(seeds, gl.STATIC_DRAW);

  const bind = (program: WebGLProgram, pos: WebGLBuffer, vel: WebGLBuffer) => {
    const vao = gl.createVertexArray()!;
    gl.bindVertexArray(vao);
    const attach = (name: string, buf: WebGLBuffer, size: number) => {
      const loc = gl.getAttribLocation(program, name);
      if (loc < 0) return;
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
    };
    attach("aPosition", pos, 3);
    attach("aVelocity", vel, 3);
    attach("aTarget", targetBuf, 3);
    attach("aSeed", seedBuf, 1);
    gl.bindVertexArray(null);
    return vao;
  };

  let simVaos = [bind(simProgram, posA, velA), bind(simProgram, posB, velB)];
  let drawVaos = [bind(pointProgram, posA, velA), bind(pointProgram, posB, velB)];
  let source = 0;

  const feedback = gl.createTransformFeedback()!;
  const su = {
    dt: gl.getUniformLocation(simProgram, "uDt"),
    time: gl.getUniformLocation(simProgram, "uTime"),
    gather: gl.getUniformLocation(simProgram, "uGather"),
  };
  const pu = {
    proj: gl.getUniformLocation(pointProgram, "uProj"),
    view: gl.getUniformLocation(pointProgram, "uView"),
    opacity: gl.getUniformLocation(pointProgram, "uOpacity"),
    gather: gl.getUniformLocation(pointProgram, "uGather"),
    scale: gl.getUniformLocation(pointProgram, "uScale"),
  };

  return {
    step(dt, time, gather) {
      const destPos = source === 0 ? posB : posA;
      const destVel = source === 0 ? velB : velA;

      gl.useProgram(simProgram);
      gl.uniform1f(su.dt, dt);
      gl.uniform1f(su.time, time);
      gl.uniform1f(su.gather, gather);

      gl.bindVertexArray(simVaos[source]);
      gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, feedback);
      gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, destPos);
      gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 1, destVel);
      gl.enable(gl.RASTERIZER_DISCARD);
      gl.beginTransformFeedback(gl.POINTS);
      gl.drawArrays(gl.POINTS, 0, count);
      gl.endTransformFeedback();
      gl.disable(gl.RASTERIZER_DISCARD);
      gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, null);
      gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 1, null);
      gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, null);
      gl.bindVertexArray(null);

      source = source === 0 ? 1 : 0;
    },
    draw(proj, view, opacity, gather) {
      gl.useProgram(pointProgram);
      gl.uniformMatrix4fv(pu.proj, false, proj);
      gl.uniformMatrix4fv(pu.view, false, view);
      gl.uniform1f(pu.opacity, opacity);
      gl.uniform1f(pu.gather, gather);
      gl.uniform1f(pu.scale, Math.min(window.devicePixelRatio || 1, 1.5));
      gl.depthMask(false);
      gl.bindVertexArray(drawVaos[source]);
      gl.drawArrays(gl.POINTS, 0, count);
      gl.bindVertexArray(null);
      gl.depthMask(true);
    },
    dispose() {
      [posA, posB, velA, velB, targetBuf, seedBuf].forEach((b) => gl.deleteBuffer(b));
      [...simVaos, ...drawVaos].forEach((v) => gl.deleteVertexArray(v));
      gl.deleteTransformFeedback(feedback);
      gl.deleteProgram(simProgram);
      gl.deleteProgram(pointProgram);
      simVaos = [];
      drawVaos = [];
    },
  };
}

/* -------------------------------------------------------------------------- */

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
