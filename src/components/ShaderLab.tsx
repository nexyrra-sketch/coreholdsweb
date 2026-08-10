"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { QUARRY_FRAGMENT } from "@/lib/quarryShader";
import { applyShader, currentShader } from "@/lib/shaderBus";
import {
  compileVerbose,
  context,
  drawFullscreen,
  FULLSCREEN_VERT,
  identity,
  multiply,
  rotationX,
  rotationY,
  translation,
} from "@/lib/gl";
import { Button } from "./Button";

/**
 * THE LAB
 * ----------------------------------------------------------------------------
 * This is not a picture of the shader. It is the shader.
 *
 * The text below is the exact GLSL the carve on the home page is raymarched
 * from, and the panel beside it is a real WebGL2 context running whatever is
 * currently in the box. Compile and the preview is replaced in place; if the
 * driver rejects it, the driver's own error comes back and the previous program
 * keeps drawing. A successful compile is also pushed to the home page, so the
 * carve there runs your version for the rest of the session.
 *
 * You cannot break the site from here — only your copy of it, and only until
 * you reload. Publishing this is the point: a studio that argues you should own
 * what runs your business should be willing to hand over what runs its own
 * front page.
 */

const HINTS: [string, string][] = [
  ["uCarve", "0 is solid stone, 1 is fully machined. Scroll drives it on the home page."],
  ["sdMark", "The five boxes the logo is drawn from, on its own 32-unit grid."],
  ["cutY", "The cutting plane. Change the range and the cut sweeps differently."],
  ["STONE", "Albedo of the block. Try swapping it for the OXIDE constant."],
];

/** Inverse of a rotation-plus-translation matrix. */
function inverseRigid(m: Float32Array): Float32Array {
  const out = identity();
  out[0] = m[0]; out[1] = m[4]; out[2] = m[8];
  out[4] = m[1]; out[5] = m[5]; out[6] = m[9];
  out[8] = m[2]; out[9] = m[6]; out[10] = m[10];
  out[12] = -(m[0] * m[12] + m[1] * m[13] + m[2] * m[14]);
  out[13] = -(m[4] * m[12] + m[5] * m[13] + m[6] * m[14]);
  out[14] = -(m[8] * m[12] + m[9] * m[13] + m[10] * m[14]);
  return out;
}

/**
 * The preview writes to two colour attachments in the world, but here there is
 * only one. A short prologue rewrites the second output away so the same source
 * links in both places without the reader having to think about it.
 */
function forPreview(source: string) {
  return source.replace(
    "layout(location = 1) out vec4 outData;",
    "vec4 outData;",
  );
}

export function ShaderLab() {
  const [source, setSource] = useState(QUARRY_FRAGMENT);
  const [status, setStatus] = useState<"published" | "live" | "error">("published");
  const [log, setLog] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const compileRef = useRef<((src: string) => string | null) | null>(null);
  const id = useId();

  useEffect(() => {
    setSource(currentShader());
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = context(canvas);
    if (!gl) {
      setLog("This browser has no WebGL2, so the preview cannot run.");
      return;
    }

    let program: WebGLProgram | null = null;
    let uniforms: Record<string, WebGLUniformLocation | null> = {};
    let frame = 0;
    let running = true;

    const vao = gl.createVertexArray();

    const build = (src: string): string | null => {
      const { program: next, log: driverLog } = compileVerbose(
        gl,
        FULLSCREEN_VERT,
        forPreview(src),
      );
      if (!next) return driverLog || "compile failed";
      if (program) gl.deleteProgram(program);
      program = next;
      const u = (name: string) => gl.getUniformLocation(next, name);
      uniforms = {
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
      return null;
    };

    build(QUARRY_FRAGMENT);
    compileRef.current = build;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.max(1, Math.round(canvas.clientWidth * dpr));
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * dpr));
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    const render = (time: number) => {
      if (!running) return;
      frame = window.requestAnimationFrame(render);
      if (!program || !canvas.width) return;

      const t = time / 1000;
      // The preview cycles the cut on its own so the reader sees the whole
      // move without having to scroll anything.
      const carve = 0.5 - 0.5 * Math.cos(t * 0.34);
      const dolly = 8.4;

      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.useProgram(program);
      gl.bindVertexArray(vao);

      const view = multiply(
        translation(0, 0, -dolly),
        multiply(rotationY(Math.sin(t * 0.22) * 0.34), rotationX(0.06)),
        identity(),
      );

      gl.uniform2f(uniforms.resolution, canvas.width, canvas.height);
      gl.uniform1f(uniforms.time, t);
      gl.uniform1f(uniforms.carve, carve);
      gl.uniform1f(uniforms.near, 0.1);
      gl.uniform1f(uniforms.far, 60);
      gl.uniform1f(uniforms.fov, (42 * Math.PI) / 180);
      gl.uniform1f(uniforms.opacity, 1);
      gl.uniform3f(uniforms.eye, 0, 0, dolly);
      gl.uniform3f(uniforms.cursor, 2.5, 1.5, 4.0);
      gl.uniformMatrix4fv(uniforms.invView, false, inverseRigid(view));
      drawFullscreen(gl);
    };

    frame = window.requestAnimationFrame(render);

    return () => {
      running = false;
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      compileRef.current = null;
      if (program) gl.deleteProgram(program);
      gl.deleteVertexArray(vao);
    };
  }, []);

  const compileNow = useCallback(() => {
    const build = compileRef.current;
    if (!build) {
      setStatus("error");
      setLog("No preview context, so there is nothing to compile against.");
      return;
    }
    const error = build(source);
    if (error) {
      setStatus("error");
      setLog(error.trim());
      return;
    }
    applyShader(source);
    setStatus("live");
    setLog(
      "Compiled. The preview and the carve on the home page are both running this now.",
    );
  }, [source]);

  const revert = useCallback(() => {
    compileRef.current?.(QUARRY_FRAGMENT);
    applyShader(QUARRY_FRAGMENT);
    setSource(QUARRY_FRAGMENT);
    setStatus("published");
    setLog("Back to the published shader.");
  }, []);

  return (
    <div className="border border-quarry-800 bg-quarry-900">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-quarry-800 px-5 py-4">
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className={`h-1.5 w-1.5 ${
              status === "error"
                ? "bg-quarry-500"
                : status === "live"
                  ? "datum-pulse bg-oxide"
                  : "bg-quarry-600"
            }`}
          />
          <span className="tag text-quarry-400">
            {status === "error"
              ? "Not compiled"
              : status === "live"
                ? "Your build is running"
                : "Published build"}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Button size="md" variant="ghost" onClick={revert}>
            Revert
          </Button>
          <Button size="md" onClick={compileNow}>
            Compile
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2">
        <div className="border-b border-quarry-800 lg:border-b-0 lg:border-r">
          <label htmlFor={id} className="sr-only">
            Fragment shader source for the carve on the home page
          </label>
          <textarea
            id={id}
            spellCheck={false}
            value={source}
            onChange={(e) => setSource(e.target.value)}
            rows={20}
            className="block w-full resize-y bg-quarry-950 px-5 py-4 font-mono text-[0.6875rem] leading-relaxed text-quarry-200 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-oxide"
          />
        </div>
        <div className="relative min-h-[18rem] bg-quarry-950">
          <canvas
            ref={canvasRef}
            aria-hidden="true"
            className="absolute inset-0 h-full w-full"
          />
          <p className="tag pointer-events-none absolute bottom-4 left-5 text-quarry-500">
            Live preview
          </p>
        </div>
      </div>

      <p
        role="status"
        className={`border-t border-quarry-800 px-5 py-4 font-mono text-xs leading-relaxed ${
          status === "error" ? "text-oxide-bright" : "text-quarry-400"
        }`}
      >
        {log ||
          "Edit the source, then compile. The preview swaps immediately and the home page picks it up on its next frame."}
      </p>

      <dl className="grid gap-x-8 gap-y-4 border-t border-quarry-800 px-5 py-5 sm:grid-cols-2">
        {HINTS.map(([name, note]) => (
          <div key={name} className="flex gap-3">
            <dt className="shrink-0 font-mono text-xs text-oxide">{name}</dt>
            <dd className="text-xs leading-relaxed text-quarry-400">{note}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
