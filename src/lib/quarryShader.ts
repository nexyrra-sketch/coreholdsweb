/**
 * THE QUARRY
 * ----------------------------------------------------------------------------
 * The mark is not modelled here. It is *carved*.
 *
 * A signed distance field describes a solid block of stone and, separately, the
 * Corehold mark. A cutting plane sweeps down the block, and every point it has
 * passed is evaluated against the mark instead of the block — so material is
 * removed from the top down and the glyph is left standing in what remains.
 *
 * There is no geometry in this pass. The whole image is one triangle and the
 * function below, raymarched: distance to the nearest surface, stepped along the
 * view ray until it lands. Soft shadows come from marching a second ray toward
 * the light and keeping the closest approach; ambient occlusion from sampling
 * the field at five points along the normal.
 *
 * This shader is published, editable and recompiled live on /system. Breaking it
 * there breaks it only for you.
 */

export const QUARRY_FRAGMENT = `#version 300 es
precision highp float;

in vec2 vUv;

uniform vec2  uResolution;
uniform float uTime;
uniform float uCarve;      // 0 solid block, 1 fully machined
uniform float uNear;
uniform float uFar;
uniform vec3  uEye;
uniform mat4  uInvView;
uniform float uFov;
uniform vec3  uCursor;     // the light that follows the pointer
uniform float uOpacity;

layout(location = 0) out vec4 outColor;
layout(location = 1) out vec4 outData;   // xy velocity, z linear depth, w bloom

const vec3 OXIDE = vec3(0.851, 0.384, 0.169);
const vec3 STONE = vec3(0.086, 0.096, 0.091);

/* ------------------------------------------------------------- primitives */

float sdRoundBox(vec3 p, vec3 b, float r) {
  vec3 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0) - r;
}

float smoothUnion(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}

/* value noise, three octaves — the grain of the stone */
float hash(vec3 p) {
  p = fract(p * 0.3183099 + vec3(0.71, 0.113, 0.419));
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}

float noise(vec3 x) {
  vec3 i = floor(x);
  vec3 f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(mix(hash(i + vec3(0,0,0)), hash(i + vec3(1,0,0)), f.x),
        mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
    mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
        mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y),
    f.z);
}

float fbm(vec3 p) {
  return 0.5 * noise(p) + 0.25 * noise(p * 2.03) + 0.125 * noise(p * 4.01);
}

/* ------------------------------------------------------------------ mark  */
/*
 * Taken straight off the 32-unit drawing grid the logo is built on, mapped to
 * [-1,1]: two square-capped bracket arms, their 180 degree twins, and the core.
 */
float sdMark(vec3 p) {
  float t = 0.085;                       // half-depth of the plate
  float d = sdRoundBox(p - vec3(-0.484,  0.8125, 0.0), vec3(0.422, 0.094, t), 0.012);
  d = min(d, sdRoundBox(p - vec3(-0.8125, 0.531, 0.0), vec3(0.094, 0.375, t), 0.012));
  d = min(d, sdRoundBox(p - vec3( 0.484, -0.8125, 0.0), vec3(0.422, 0.094, t), 0.012));
  d = min(d, sdRoundBox(p - vec3( 0.8125,-0.531, 0.0), vec3(0.094, 0.375, t), 0.012));
  return d;
}

float sdCore(vec3 p) {
  return sdRoundBox(p, vec3(0.3125, 0.3125, 0.115), 0.02);
}

/* ------------------------------------------------------------------ field */

float map(vec3 p, out float material) {
  // The cutting plane. It starts above the block and travels down through it.
  float cutY = mix(1.45, -1.45, uCarve);
  // Above the plane the material is already gone; below it, still block.
  float k = smoothstep(cutY - 0.22, cutY + 0.22, p.y);

  float block = sdRoundBox(p, vec3(1.16, 1.02, 0.46), 0.05);
  // Chipped, quarried surface — the roughness resolves as the cut passes.
  block -= (fbm(p * 5.6 + vec3(0.0, uTime * 0.02, 0.0)) - 0.5) * 0.042 * (1.0 - uCarve * 0.6);

  float mark = sdMark(p);
  float core = sdCore(p);

  float carved = smoothUnion(mark, core, 0.05);
  float d = mix(block, carved, k);

  // Material 1 is the core, so the composite can make it glow.
  material = (k > 0.5 && core < mark) ? 1.0 : 0.0;

  // The swarf: a thin band of loose material at the cut, thrown outward.
  float band = exp(-pow((p.y - cutY) * 6.0, 2.0));
  d -= band * 0.02 * (1.0 - uCarve);

  return d;
}

float mapD(vec3 p) {
  float m;
  return map(p, m);
}

vec3 normalAt(vec3 p) {
  vec2 e = vec2(0.0016, 0.0);
  return normalize(vec3(
    mapD(p + e.xyy) - mapD(p - e.xyy),
    mapD(p + e.yxy) - mapD(p - e.yxy),
    mapD(p + e.yyx) - mapD(p - e.yyx)));
}

float softShadow(vec3 origin, vec3 dir) {
  float res = 1.0;
  float t = 0.03;
  for (int i = 0; i < 24; i++) {
    float h = mapD(origin + dir * t);
    if (h < 0.001) return 0.0;
    res = min(res, 9.0 * h / t);
    t += clamp(h, 0.012, 0.22);
    if (t > 4.0) break;
  }
  return clamp(res, 0.0, 1.0);
}

float occlusion(vec3 p, vec3 n) {
  float occ = 0.0;
  float sca = 1.0;
  for (int i = 0; i < 5; i++) {
    float h = 0.012 + 0.06 * float(i);
    occ += (h - mapD(p + n * h)) * sca;
    sca *= 0.72;
  }
  return clamp(1.0 - 2.4 * occ, 0.0, 1.0);
}

/* ---------------------------------------------------------------- shading */

vec3 environment(vec3 d) {
  float up = d.y * 0.5 + 0.5;
  vec3 sky = mix(vec3(0.050, 0.058, 0.056), vec3(0.26, 0.29, 0.30), smoothstep(0.34, 1.0, up));
  vec3 ground = vec3(0.026, 0.030, 0.028);
  vec3 c = mix(ground, sky, smoothstep(0.0, 0.55, up));
  float warm = pow(max(dot(d, normalize(vec3(-0.45, -0.2, 0.62))), 0.0), 3.0);
  return c + OXIDE * warm * 0.09;
}

void main() {
  vec2 uv = vUv * 2.0 - 1.0;
  uv.x *= uResolution.x / uResolution.y;

  vec3 rd = normalize((uInvView * vec4(uv * tan(uFov * 0.5), -1.0, 0.0)).xyz);
  vec3 ro = uEye;

  float t = 0.0;
  float material = 0.0;
  bool hit = false;

  for (int i = 0; i < 84; i++) {
    vec3 p = ro + rd * t;
    float m;
    float d = map(p, m);
    if (d < 0.0016 * t) { hit = true; material = m; break; }
    t += d * 0.86;
    if (t > 26.0) break;
  }

  if (!hit) {
    outColor = vec4(0.0);
    outData = vec4(0.0, 0.0, uFar, 0.0);
    gl_FragDepth = 1.0;
    return;
  }

  vec3 p = ro + rd * t;
  vec3 n = normalAt(p);
  vec3 v = -rd;

  vec3 key = normalize(vec3(0.45, 0.78, 0.55));
  vec3 cursorDir = normalize(uCursor - p);
  float cursorFall = 1.0 / (1.0 + 0.30 * dot(uCursor - p, uCursor - p));

  float sh = softShadow(p + n * 0.01, key);
  float ao = occlusion(p, n);

  float rough = mix(0.62, 0.46, material);
  vec3 albedo = mix(STONE, OXIDE, material);

  // GGX, single term. Enough for stone and anodised metal; no more than that.
  vec3 h = normalize(key + v);
  float a = rough * rough;
  float ndh = max(dot(n, h), 0.0);
  float ndv = max(dot(n, v), 0.0);
  float ndl = max(dot(n, key), 0.0);
  // Clamped. An unbounded GGX lobe on a face square-on to the key light is
  // how a dark mineral ends up looking like polished cream.
  float dTerm = min(a * a / (3.14159 * pow(ndh * ndh * (a * a - 1.0) + 1.0, 2.0)), 8.0);
  float g = ndl / (ndl * (1.0 - a * 0.5) + a * 0.5);
  float fres = 0.04 + 0.96 * pow(1.0 - ndv, 5.0);

  vec3 lit = albedo * ndl * sh * mix(1.45, 0.85, material);
  lit += vec3(1.0, 0.94, 0.88) * dTerm * g * fres * sh * 0.22;
  lit += environment(n) * ao * (0.78 + material * 0.35);
  lit += OXIDE * cursorFall * max(dot(n, cursorDir), 0.0) * 0.10;
  lit += albedo * material * 0.38;

  float depth = t;
  float fade = 1.0 - smoothstep(9.0, 22.0, depth);

  outColor = vec4(lit * fade * uOpacity, fade * uOpacity);
  outData = vec4(0.0, 0.0, depth, material * 0.9 + fres * 0.15);

  // Write depth so rasterised geometry intersects the carve correctly.
  float ndcDepth = (uFar + uNear - 2.0 * uNear * uFar / depth) / (uFar - uNear);
  gl_FragDepth = clamp(ndcDepth * 0.5 + 0.5, 0.0, 1.0);
}`;
