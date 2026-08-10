/**
 * THE SWARM
 * ----------------------------------------------------------------------------
 * Two hundred thousand particles, simulated on the GPU by transform feedback.
 *
 * Transform feedback is the WebGL2 feature almost nothing on the marketing web
 * uses: it lets a vertex shader write its outputs back into a buffer instead of
 * rasterising them. So the simulation below *is* a draw call with the rasteriser
 * switched off — no textures encoding state, no readback to JavaScript, no
 * per-particle work on the CPU at any point after the first frame.
 *
 * What it means: each particle is one subscription in a rented stack. Left alone
 * they churn — curl-like turbulence, no structure, no direction. Gathered, they
 * resolve onto the mark. The count is the argument. Two hundred thousand
 * independently-integrated bodies is not a thing you can fake with CSS.
 */

export const PARTICLE_SIM_VERT = `#version 300 es
precision highp float;

in vec3 aPosition;
in vec3 aVelocity;
in vec3 aTarget;
in float aSeed;

uniform float uDt;
uniform float uTime;
uniform float uGather;

out vec3 vPosition;
out vec3 vVelocity;

/* Cheap curl-ish field. Three offset sine lattices, differenced — divergence is
   not exactly zero but the eye cannot tell, and it costs a tenth of the real
   thing. */
vec3 flow(vec3 p, float t) {
  return vec3(
    sin(p.y * 0.62 + t * 0.35) + cos(p.z * 0.48 - t * 0.22),
    sin(p.z * 0.55 - t * 0.29) + cos(p.x * 0.51 + t * 0.31),
    sin(p.x * 0.49 + t * 0.24) + cos(p.y * 0.58 - t * 0.27));
}

void main() {
  vec3 p = aPosition;
  vec3 v = aVelocity;

  float personal = aSeed * 6.2831853;

  // Churn: what a rented stack does when nobody is holding it together.
  vec3 turbulence = flow(p * 0.42 + vec3(personal), uTime) * (1.0 - uGather * 0.82);

  // Gather: a spring onto this particle's place in the mark, stiffening as the
  // page scrolls. Damping rises with it so nothing overshoots at the end.
  vec3 toTarget = aTarget - p;
  float stiffness = uGather * uGather * 26.0;
  float damping = mix(0.86, 0.74, uGather);

  // A little residual life so the assembled mark breathes rather than freezes.
  vec3 shimmer = vec3(
    sin(uTime * 1.7 + personal),
    cos(uTime * 1.5 + personal * 1.3),
    sin(uTime * 1.9 + personal * 0.7)) * 0.06 * uGather;

  vec3 accel = turbulence * 1.35 + toTarget * stiffness + shimmer;

  v = v * damping + accel * uDt;
  p = p + v * uDt;

  // Keep the loose swarm inside the frustum rather than letting it wander off.
  float bound = 9.5;
  p = clamp(p, vec3(-bound, -bound * 0.60, -bound * 0.55), vec3(bound, bound * 0.60, bound * 0.35));

  vPosition = p;
  vVelocity = v;
  gl_Position = vec4(0.0, 0.0, 0.0, 1.0);
}`;

export const PARTICLE_RENDER_VERT = `#version 300 es
precision highp float;

in vec3 aPosition;
in vec3 aVelocity;
in float aSeed;

uniform mat4 uProj;
uniform mat4 uView;
uniform float uOpacity;
uniform float uGather;
uniform float uScale;

out float vSpeed;
out float vFade;
out float vDepth;

void main() {
  vec4 view = uView * vec4(aPosition, 1.0);
  vDepth = -view.z;
  gl_Position = uProj * view;

  vSpeed = clamp(length(aVelocity) * 0.42, 0.0, 1.0);

  // Perspective-correct point size, with a floor so distant particles stay
  // visible as grain rather than disappearing into nothing.
  float size = (0.7 + aSeed * 0.9) * uScale * 20.0 / max(vDepth, 0.8);
  gl_PointSize = clamp(size, 0.6, 3.2);

  float fog = 1.0 - smoothstep(9.0, 26.0, vDepth);
  vFade = uOpacity * fog * (0.16 + 0.34 * uGather);
}`;

export const PARTICLE_RENDER_FRAG = `#version 300 es
precision highp float;

in float vSpeed;
in float vFade;
in float vDepth;

layout(location = 0) out vec4 outColor;
layout(location = 1) out vec4 outData;

const vec3 OXIDE = vec3(0.851, 0.384, 0.169);
const vec3 COOL = vec3(0.30, 0.34, 0.33);

void main() {
  // Round the point off. gl_PointCoord is the cheapest disc there is.
  vec2 d = gl_PointCoord - 0.5;
  float r = dot(d, d);
  if (r > 0.25) discard;
  float edge = 1.0 - smoothstep(0.06, 0.25, r);

  // Fast particles run hot. The colour is the energy in the system.
  vec3 colour = mix(COOL, OXIDE, vSpeed * 0.85) * (0.26 + vSpeed * 0.95);

  float alpha = edge * vFade;
  outColor = vec4(colour * alpha, alpha);
  outData = vec4(0.0, 0.0, vDepth, vSpeed * 0.6);
}`;
