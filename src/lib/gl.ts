/**
 * A WebGL2 layer written by hand — no dependency.
 * ----------------------------------------------------------------------------
 * There is a very good 3D library available and this site does not use it. That
 * is not stubbornness: /system publishes this project's dependency count as
 * evidence that Corehold builds rather than assembles, and importing six
 * hundred kilobytes of engine to draw this scene would have made that page a
 * lie.
 *
 * So: matrices, shaders, meshes, render targets and a full-screen pass.
 * Everything the world needs and nothing it does not.
 */

export type Mat4 = Float32Array;

export function identity(): Mat4 {
  // prettier-ignore
  return new Float32Array([1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]);
}

export function copy(m: Mat4, out: Mat4 = identity()): Mat4 {
  out.set(m);
  return out;
}

export function perspective(fovY: number, aspect: number, near: number, far: number): Mat4 {
  const f = 1 / Math.tan(fovY / 2);
  const nf = 1 / (near - far);
  // prettier-ignore
  return new Float32Array([
    f / aspect, 0, 0, 0,
    0, f, 0, 0,
    0, 0, (far + near) * nf, -1,
    0, 0, 2 * far * near * nf, 0,
  ]);
}

export function multiply(a: Mat4, b: Mat4, out: Mat4 = identity()): Mat4 {
  for (let i = 0; i < 4; i += 1) {
    const ai0 = a[i], ai1 = a[i + 4], ai2 = a[i + 8], ai3 = a[i + 12];
    out[i] = ai0 * b[0] + ai1 * b[1] + ai2 * b[2] + ai3 * b[3];
    out[i + 4] = ai0 * b[4] + ai1 * b[5] + ai2 * b[6] + ai3 * b[7];
    out[i + 8] = ai0 * b[8] + ai1 * b[9] + ai2 * b[10] + ai3 * b[11];
    out[i + 12] = ai0 * b[12] + ai1 * b[13] + ai2 * b[14] + ai3 * b[15];
  }
  return out;
}

export function translation(x: number, y: number, z: number): Mat4 {
  const m = identity();
  m[12] = x;
  m[13] = y;
  m[14] = z;
  return m;
}

export function scaling(s: number, sy = s, sz = s): Mat4 {
  const m = identity();
  m[0] = s;
  m[5] = sy;
  m[10] = sz;
  return m;
}

export function rotationX(r: number): Mat4 {
  const m = identity();
  const c = Math.cos(r);
  const s = Math.sin(r);
  m[5] = c;
  m[6] = s;
  m[9] = -s;
  m[10] = c;
  return m;
}

export function rotationY(r: number): Mat4 {
  const m = identity();
  const c = Math.cos(r);
  const s = Math.sin(r);
  m[0] = c;
  m[2] = -s;
  m[8] = s;
  m[10] = c;
  return m;
}

export function rotationZ(r: number): Mat4 {
  const m = identity();
  const c = Math.cos(r);
  const s = Math.sin(r);
  m[0] = c;
  m[1] = s;
  m[4] = -s;
  m[5] = c;
  return m;
}

/** Upper-left 3×3 of a rigid transform, for transforming normals. */
export function normalMatrix(m: Mat4): Float32Array {
  // prettier-ignore
  return new Float32Array([
    m[0], m[1], m[2],
    m[4], m[5], m[6],
    m[8], m[9], m[10],
  ]);
}

/** Right-handed look-at. Used by the world camera. */
export function lookAt(
  eye: [number, number, number],
  at: [number, number, number],
  up: [number, number, number] = [0, 1, 0],
): Mat4 {
  let zx = eye[0] - at[0];
  let zy = eye[1] - at[1];
  let zz = eye[2] - at[2];
  let len = Math.hypot(zx, zy, zz) || 1;
  zx /= len;
  zy /= len;
  zz /= len;

  let xx = up[1] * zz - up[2] * zy;
  let xy = up[2] * zx - up[0] * zz;
  let xz = up[0] * zy - up[1] * zx;
  len = Math.hypot(xx, xy, xz) || 1;
  xx /= len;
  xy /= len;
  xz /= len;

  const yx = zy * xz - zz * xy;
  const yy = zz * xx - zx * xz;
  const yz = zx * xy - zy * xx;

  // prettier-ignore
  return new Float32Array([
    xx, yx, zx, 0,
    xy, yy, zy, 0,
    xz, yz, zz, 0,
    -(xx * eye[0] + xy * eye[1] + xz * eye[2]),
    -(yx * eye[0] + yy * eye[1] + yz * eye[2]),
    -(zx * eye[0] + zy * eye[1] + zz * eye[2]),
    1,
  ]);
}

/* ------------------------------------------------------------------ mesh -- */

export type Mesh = {
  positions: Float32Array;
  normals: Float32Array;
  indices: Uint16Array | Uint32Array;
};

/** A unit cube with flat per-face normals, ready for a lit shader. */
export function cubeMesh(): Mesh {
  const faces: [number[], number[]][] = [
    [[0, 0, 1], [-1, -1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1]],
    [[0, 0, -1], [1, -1, -1, -1, -1, -1, -1, 1, -1, 1, 1, -1]],
    [[0, 1, 0], [-1, 1, 1, 1, 1, 1, 1, 1, -1, -1, 1, -1]],
    [[0, -1, 0], [-1, -1, -1, 1, -1, -1, 1, -1, 1, -1, -1, 1]],
    [[1, 0, 0], [1, -1, 1, 1, -1, -1, 1, 1, -1, 1, 1, 1]],
    [[-1, 0, 0], [-1, -1, -1, -1, -1, 1, -1, 1, 1, -1, 1, -1]],
  ];

  const positions: number[] = [];
  const normals: number[] = [];
  const indices: number[] = [];

  faces.forEach(([normal, quad], f) => {
    for (let v = 0; v < 4; v += 1) {
      positions.push(quad[v * 3] * 0.5, quad[v * 3 + 1] * 0.5, quad[v * 3 + 2] * 0.5);
      normals.push(normal[0], normal[1], normal[2]);
    }
    const o = f * 4;
    indices.push(o, o + 1, o + 2, o, o + 2, o + 3);
  });

  return {
    positions: new Float32Array(positions),
    normals: new Float32Array(normals),
    indices: new Uint16Array(indices),
  };
}

/* ---------------------------------------------------------------- shader -- */

export type CompileResult = { program: WebGLProgram | null; log: string };

/**
 * Compile and link, returning the driver's log on failure. The log is not
 * decoration: the shader lab on /system shows it to the reader when they break
 * the shader themselves.
 */
export function compileVerbose(
  gl: WebGL2RenderingContext,
  vertexSource: string,
  fragmentSource: string,
  transformFeedbackVaryings?: string[],
): CompileResult {
  const build = (type: number, source: string): [WebGLShader | null, string] => {
    const shader = gl.createShader(type);
    if (!shader) return [null, "could not create shader"];
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const log = gl.getShaderInfoLog(shader) ?? "unknown compile error";
      gl.deleteShader(shader);
      return [null, log];
    }
    return [shader, ""];
  };

  const [vs, vlog] = build(gl.VERTEX_SHADER, vertexSource);
  if (!vs) return { program: null, log: vlog };
  const [fs, flog] = build(gl.FRAGMENT_SHADER, fragmentSource);
  if (!fs) {
    gl.deleteShader(vs);
    return { program: null, log: flog };
  }

  const program = gl.createProgram();
  if (!program) return { program: null, log: "could not create program" };
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  if (transformFeedbackVaryings?.length) {
    gl.transformFeedbackVaryings(program, transformFeedbackVaryings, gl.SEPARATE_ATTRIBS);
  }
  gl.linkProgram(program);
  gl.deleteShader(vs);
  gl.deleteShader(fs);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(program) ?? "unknown link error";
    gl.deleteProgram(program);
    return { program: null, log };
  }
  return { program, log: "" };
}

export function compile(
  gl: WebGL2RenderingContext,
  vertexSource: string,
  fragmentSource: string,
  transformFeedbackVaryings?: string[],
) {
  return compileVerbose(gl, vertexSource, fragmentSource, transformFeedbackVaryings).program;
}

/** Best-effort context. Returns null on anything older than WebGL2. */
export function context(canvas: HTMLCanvasElement) {
  try {
    return canvas.getContext("webgl2", {
      alpha: true,
      antialias: false, // we resolve our own edges in the composite pass
      depth: true,
      premultipliedAlpha: false,
      powerPreference: "high-performance",
    });
  } catch {
    return null;
  }
}

/* --------------------------------------------------------- render targets -- */

export type Target = {
  fbo: WebGLFramebuffer;
  textures: WebGLTexture[];
  depth: WebGLRenderbuffer | null;
  width: number;
  height: number;
};

export type TargetOptions = {
  /** Number of colour attachments. Two gives colour + velocity. */
  attachments?: number;
  /** Half-float storage, for highlights above 1.0. */
  float?: boolean;
  depth?: boolean;
  filter?: number;
};

export function createTarget(
  gl: WebGL2RenderingContext,
  width: number,
  height: number,
  options: TargetOptions = {},
): Target | null {
  const {
    attachments = 1,
    float = false,
    depth = false,
    filter = gl.LINEAR,
  } = options;

  const fbo = gl.createFramebuffer();
  if (!fbo) return null;
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);

  const textures: WebGLTexture[] = [];
  const buffers: number[] = [];

  for (let i = 0; i < attachments; i += 1) {
    const tex = gl.createTexture();
    if (!tex) return null;
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      float ? gl.RGBA16F : gl.RGBA8,
      width,
      height,
      0,
      gl.RGBA,
      float ? gl.HALF_FLOAT : gl.UNSIGNED_BYTE,
      null,
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0 + i,
      gl.TEXTURE_2D,
      tex,
      0,
    );
    textures.push(tex);
    buffers.push(gl.COLOR_ATTACHMENT0 + i);
  }

  if (attachments > 1) gl.drawBuffers(buffers);

  let depthBuffer: WebGLRenderbuffer | null = null;
  if (depth) {
    depthBuffer = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT24, width, height);
    gl.framebufferRenderbuffer(
      gl.FRAMEBUFFER,
      gl.DEPTH_ATTACHMENT,
      gl.RENDERBUFFER,
      depthBuffer,
    );
  }

  const ok = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  if (!ok) return null;

  return { fbo, textures, depth: depthBuffer, width, height };
}

export function disposeTarget(gl: WebGL2RenderingContext, target: Target | null) {
  if (!target) return;
  target.textures.forEach((t) => gl.deleteTexture(t));
  if (target.depth) gl.deleteRenderbuffer(target.depth);
  gl.deleteFramebuffer(target.fbo);
}

export function bindTarget(gl: WebGL2RenderingContext, target: Target | null) {
  if (target) {
    gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
    gl.viewport(0, 0, target.width, target.height);
  } else {
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }
}

/* ------------------------------------------------------------ full screen -- */

/**
 * One oversized triangle rather than a quad. It covers the viewport with three
 * vertices instead of six and avoids the diagonal seam where two triangles meet,
 * which matters once you are sampling neighbours in the post chain.
 */
export const FULLSCREEN_VERT = `#version 300 es
out vec2 vUv;
void main() {
  vec2 p = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
  vUv = p;
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;

export function drawFullscreen(gl: WebGL2RenderingContext) {
  gl.drawArrays(gl.TRIANGLES, 0, 3);
}

/** Half-float colour attachments. Without it the post chain runs in 8-bit. */
export function enableFloatTargets(gl: WebGL2RenderingContext): boolean {
  return Boolean(gl.getExtension("EXT_color_buffer_float"));
}
