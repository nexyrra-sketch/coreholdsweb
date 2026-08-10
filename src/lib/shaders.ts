/**
 * The world's shaders.
 * ----------------------------------------------------------------------------
 * Three stages, all written here rather than imported:
 *
 *   1. SCENE   — rasterised geometry, physically-based, writing colour into one
 *                attachment and screen-space velocity plus linear depth into a
 *                second. The second attachment is what makes motion blur and
 *                depth of field possible later without re-rendering anything.
 *   2. BLUR    — a separable Gaussian at quarter resolution. One blurred copy of
 *                the frame serves both the bloom and the out-of-focus field.
 *   3. COMPOSITE — the film pass. Lens distortion, chromatic aberration,
 *                velocity-driven motion blur, depth of field, bloom, ACES tone
 *                mapping, grain and vignette, in that order, because that is the
 *                order a lens and a stock actually apply them.
 *
 * Everything is premultiplied: the canvas sits behind the page and has to
 * composite against it honestly.
 */

/* ------------------------------------------------------------------ scene -- */

export const SCENE_VERT = `#version 300 es
in vec3 aPos;
in vec3 aNormal;

uniform mat4 uProj;
uniform mat4 uView;
uniform mat4 uModel;
uniform mat4 uPrevViewProj;
uniform mat4 uPrevModel;
uniform mat3 uNormalMatrix;

out vec3 vNormal;
out vec3 vWorld;
out vec3 vView;
out vec4 vClip;
out vec4 vPrevClip;

void main() {
  vec4 world = uModel * vec4(aPos, 1.0);
  vec4 view = uView * world;

  vWorld = world.xyz;
  vView = view.xyz;
  vNormal = normalize(uNormalMatrix * aNormal);

  vClip = uProj * view;
  vPrevClip = uPrevViewProj * uPrevModel * vec4(aPos, 1.0);
  gl_Position = vClip;
}`;

export const SCENE_FRAG = `#version 300 es
precision highp float;

in vec3 vNormal;
in vec3 vWorld;
in vec3 vView;
in vec4 vClip;
in vec4 vPrevClip;

uniform vec3  uAlbedo;
uniform float uRoughness;
uniform float uMetallic;
uniform float uEmissive;
uniform vec3  uCursor;
uniform vec3  uEye;
uniform float uFogNear;
uniform float uFogFar;
uniform float uOpacity;

layout(location = 0) out vec4 outColor;
layout(location = 1) out vec4 outData;

const vec3 OXIDE = vec3(0.851, 0.384, 0.169);

vec3 environment(vec3 d, float rough) {
  float up = d.y * 0.5 + 0.5;
  vec3 sky = mix(vec3(0.050, 0.058, 0.056), vec3(0.27, 0.30, 0.31), smoothstep(0.34, 1.0, up));
  vec3 ground = vec3(0.026, 0.030, 0.028);
  vec3 c = mix(ground, sky, smoothstep(0.0, 0.55, up));
  float warm = pow(max(dot(d, normalize(vec3(-0.45, -0.2, 0.62))), 0.0), 3.0);
  c += OXIDE * warm * 0.10;
  return mix(c, vec3(dot(c, vec3(0.333))), rough * 0.55);
}

void main() {
  vec3 N = normalize(vNormal);
  vec3 V = normalize(uEye - vWorld);
  vec3 L = normalize(vec3(0.45, 0.78, 0.55));

  float a = max(uRoughness * uRoughness, 0.002);
  vec3 H = normalize(L + V);
  float ndl = max(dot(N, L), 0.0);
  float ndv = max(dot(N, V), 0.0);
  float ndh = max(dot(N, H), 0.0);

  float dTerm = min(a * a / (3.14159265 * pow(ndh * ndh * (a * a - 1.0) + 1.0, 2.0)), 8.0);
  float g = ndl / (ndl * (1.0 - a * 0.5) + a * 0.5);
  vec3 f0 = mix(vec3(0.045), uAlbedo, uMetallic);
  vec3 fres = f0 + (1.0 - f0) * pow(1.0 - ndv, 5.0);

  vec3 diffuse = uAlbedo * (1.0 - uMetallic) * ndl * 1.05;
  vec3 spec = dTerm * g * fres * 0.55;

  // Reflected environment. The only "image based" lighting here is a function.
  vec3 R = reflect(-V, N);
  vec3 ibl = environment(R, uRoughness) * mix(vec3(1.0), uAlbedo, uMetallic);

  // The light that follows the pointer.
  vec3 toCursor = uCursor - vWorld;
  float fall = 1.0 / (1.0 + 0.10 * dot(toCursor, toCursor));
  vec3 cursorLight = OXIDE * max(dot(N, normalize(toCursor)), 0.0) * fall * 0.30;

  vec3 lit = diffuse + spec + ibl * 0.62 + cursorLight;
  lit = mix(lit, uAlbedo * 1.35, uEmissive);

  float depth = -vView.z;
  float fog = smoothstep(uFogNear, uFogFar, depth);
  float alpha = (1.0 - fog) * uOpacity;

  vec2 ndc = vClip.xy / max(vClip.w, 0.0001);
  vec2 prevNdc = vPrevClip.xy / max(vPrevClip.w, 0.0001);
  vec2 velocity = (ndc - prevNdc) * 0.5;

  float bloomMask = uEmissive * 0.85 + max(max(spec.r, spec.g), spec.b) * 0.5;

  outColor = vec4(lit * alpha, alpha);
  outData = vec4(velocity, depth, bloomMask);
}`;

/* ------------------------------------------------------------------- blur -- */

export const DOWNSAMPLE_FRAG = `#version 300 es
precision highp float;
in vec2 vUv;
uniform sampler2D uSource;
uniform vec2 uTexel;
out vec4 frag;
void main() {
  // 4-tap box, sampled on the half-texel diagonal — a clean 2x reduction.
  vec4 c = texture(uSource, vUv + uTexel * vec2( 0.5,  0.5));
  c += texture(uSource, vUv + uTexel * vec2(-0.5,  0.5));
  c += texture(uSource, vUv + uTexel * vec2( 0.5, -0.5));
  c += texture(uSource, vUv + uTexel * vec2(-0.5, -0.5));
  frag = c * 0.25;
}`;

export const BLUR_FRAG = `#version 300 es
precision highp float;
in vec2 vUv;
uniform sampler2D uSource;
uniform vec2 uDirection;   // texel-sized step, one axis at a time
out vec4 frag;

void main() {
  // Nine-tap Gaussian folded to five samples using linear filtering.
  vec4 c = texture(uSource, vUv) * 0.2270270270;
  c += texture(uSource, vUv + uDirection * 1.3846153846) * 0.3162162162;
  c += texture(uSource, vUv - uDirection * 1.3846153846) * 0.3162162162;
  c += texture(uSource, vUv + uDirection * 3.2307692308) * 0.0702702703;
  c += texture(uSource, vUv - uDirection * 3.2307692308) * 0.0702702703;
  frag = c;
}`;

/* -------------------------------------------------------------- composite -- */

export const COMPOSITE_FRAG = `#version 300 es
precision highp float;

in vec2 vUv;

uniform sampler2D uScene;
uniform sampler2D uBlurred;
uniform sampler2D uData;

uniform vec2  uResolution;
uniform float uTime;
uniform float uBlurStrength;   // motion blur
uniform float uFocus;
uniform float uFocusRange;
uniform float uDof;
uniform float uBloom;
uniform float uGrain;
uniform float uAberration;
uniform float uVignette;
uniform float uDistortion;
uniform float uExposure;

out vec4 frag;

/* ACES filmic, Narkowicz's fit. Cheap, and it rolls the highlights off the way
   a stock does rather than clipping them the way a monitor does. */
vec3 aces(vec3 x) {
  return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0);
}

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

/* Every read is clamped. Motion blur and aberration both reach past the pixel
   they belong to, and an unclamped reach at the frame edge is how you get the
   smeared border that gives a post chain away. */
vec4 sampleClamped(sampler2D tex, vec2 uv) {
  return texture(tex, clamp(uv, vec2(0.001), vec2(0.999)));
}

void main() {
  vec2 centred = vUv - 0.5;
  float r2 = dot(centred, centred);

  // Lens distortion first, because every later sample should read the distorted
  // frame, not the flat one.
  // Pincushion, not barrel: the frame is squeezed inward, so every later
  // sample lands inside the rendered image and no edge is smeared outward.
  vec2 uv = 0.5 + centred * (1.0 - uDistortion * r2);

  vec4 data = sampleClamped(uData, uv);
  vec2 velocity = data.xy * uBlurStrength;
  float depth = data.z;

  // Motion blur. Eight taps along the screen-space velocity of whatever is
  // under this pixel — so a fast cube smears and the static frame does not.
  vec4 accum = vec4(0.0);
  float total = 0.0;
  for (int i = 0; i < 8; i++) {
    float f = (float(i) / 7.0 - 0.5);
    vec2 offset = velocity * f;
    float w = 1.0 - abs(f) * 0.7;
    accum += sampleClamped(uScene, uv + offset) * w;
    total += w;
  }
  vec4 scene = accum / max(total, 0.0001);

  // Chromatic aberration, radial and strongest at the frame edge.
  vec2 ca = centred * uAberration * (0.3 + r2 * 2.4);
  float cr = sampleClamped(uScene, uv + ca).r;
  float cb = sampleClamped(uScene, uv - ca).b;
  scene.r = mix(scene.r, cr, 0.75);
  scene.b = mix(scene.b, cb, 0.75);

  vec4 blurred = sampleClamped(uBlurred, uv);

  // Depth of field. Focus sits on the mark; everything in front of and behind it
  // resolves toward the blurred copy.
  float coc = clamp(abs(depth - uFocus) / max(uFocusRange, 0.001), 0.0, 1.0);
  coc = pow(coc, 1.4) * uDof;
  vec4 focused = mix(scene, blurred, coc);

  // Bloom, taken from the same blurred copy above a soft threshold.
  vec3 bright = max(blurred.rgb - vec3(0.34), vec3(0.0));
  vec3 colour = focused.rgb + bright * uBloom * (0.55 + data.w);
  float alpha = clamp(focused.a + (bright.r + bright.g + bright.b) * 0.22 * uBloom, 0.0, 1.0);

  // Tone map in straight alpha, then premultiply again on the way out.
  vec3 straight = colour / max(alpha, 0.0001);
  straight = aces(straight * uExposure);

  // Grain. Animated, and heavier in the shadows where a real stock shows it.
  float n = hash(gl_FragCoord.xy + fract(uTime) * 331.7) - 0.5;
  straight += n * uGrain * (1.25 - dot(straight, vec3(0.333)));

  // Vignette.
  float vig = 1.0 - uVignette * smoothstep(0.18, 0.78, r2);
  straight *= vig;

  frag = vec4(max(straight, 0.0) * alpha, alpha);
}`;
