/**
 * A minimal WebGL2 layer — about 200 lines, no dependency.
 * ----------------------------------------------------------------------------
 * There is a very good 3D library available and this site does not use it. That
 * is not stubbornness: /system publishes this project's dependency count as
 * evidence that Corehold builds rather than assembles, and importing six
 * hundred kilobytes to draw fifteen lit cubes would have made that page a lie.
 *
 * So: matrices, a shader, a cube, and fog. Everything the scene needs and
 * nothing it does not.
 */

export type Mat4 = Float32Array;

export function identity(): Mat4 {
  // prettier-ignore
  return new Float32Array([1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]);
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

export function scaling(s: number): Mat4 {
  const m = identity();
  m[0] = s;
  m[5] = s;
  m[10] = s;
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

/* ------------------------------------------------------------------ mesh -- */

/** A unit cube with flat per-face normals, ready for a lit shader. */
export function cubeMesh() {
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

export function compile(
  gl: WebGL2RenderingContext,
  vertexSource: string,
  fragmentSource: string,
) {
  const build = (type: number, source: string) => {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  };

  const vs = build(gl.VERTEX_SHADER, vertexSource);
  const fs = build(gl.FRAGMENT_SHADER, fragmentSource);
  if (!vs || !fs) return null;

  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  gl.deleteShader(vs);
  gl.deleteShader(fs);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

/** Best-effort context. Returns null on anything older than WebGL2. */
export function context(canvas: HTMLCanvasElement) {
  try {
    return canvas.getContext("webgl2", {
      alpha: true,
      antialias: true,
      depth: true,
      premultipliedAlpha: false,
      powerPreference: "high-performance",
    });
  } catch {
    return null;
  }
}
