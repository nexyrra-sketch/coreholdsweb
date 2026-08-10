"use client";

import { useEffect, useState } from "react";
import { onSoundChange, soundEnabled, toggleSound } from "@/lib/audio";

/**
 * The only control on the site that makes a noise, and it starts off.
 *
 * Three bars that animate when the room is on and sit flat when it is off — so
 * the state is legible without reading the label, and the label is there anyway
 * for anyone who cannot see the bars.
 */
export function SoundToggle({ className }: { className?: string }) {
  const [on, setOn] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
    setOn(soundEnabled());
    const unsubscribe = onSoundChange(setOn);
    return () => {
      unsubscribe();
    };
  }, []);

  if (!ready) return null;

  return (
    <button
      type="button"
      onClick={() => void toggleSound()}
      aria-pressed={on}
      className={`group inline-flex items-center gap-2.5 text-quarry-400 transition-colors hover:text-bone ${className ?? ""}`}
    >
      <span
        aria-hidden="true"
        className="flex h-3.5 w-3.5 items-end justify-between"
      >
        {[5, 12, 7].map((rest, i) => (
          <span
            key={i}
            className={`w-[2px] bg-current transition-[height] duration-300 ease-[cubic-bezier(0.22,0.68,0.24,1)] ${
              on ? "sound-bar" : ""
            }`}
            style={
              on
                ? { animationDelay: `${i * 160}ms` }
                : { height: `${rest}px` }
            }
          />
        ))}
      </span>
      <span className="tag">{on ? "Sound on" : "Sound"}</span>
    </button>
  );
}
