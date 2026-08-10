import { QUARRY_FRAGMENT } from "./quarryShader";

/**
 * A one-wire channel between the shader lab on /system and the running world.
 *
 * The lab is not a picture of a shader. It is the shader: edit it, press
 * compile, and the distance field the mark is carved from is replaced in the
 * live GL context on the next frame. If it does not compile, the driver's own
 * log comes back and the old program keeps running.
 *
 * Module scope is the right home for this. There is exactly one world and
 * exactly one lab, and neither should have to find the other through the React
 * tree.
 */

type Compiler = (source: string) => boolean;

let compiler: Compiler | null = null;
let current = QUARRY_FRAGMENT;

export function subscribeShader(fn: Compiler): () => void {
  compiler = fn;
  // A lab left open across a route change gets its edit applied to the new world.
  if (current !== QUARRY_FRAGMENT) fn(current);
  return () => {
    if (compiler === fn) compiler = null;
  };
}

/** Returns true when the source compiled and is now running. */
export function applyShader(source: string): boolean {
  if (!compiler) {
    current = source;
    return true;
  }
  const ok = compiler(source);
  if (ok) current = source;
  return ok;
}

export function resetShader(): boolean {
  return applyShader(QUARRY_FRAGMENT);
}

export function currentShader(): string {
  return current;
}
