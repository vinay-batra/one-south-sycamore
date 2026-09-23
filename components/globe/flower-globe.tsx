"use client";

import { Suspense, useState, useSyncExternalStore } from "react";
import { Canvas } from "@react-three/fiber";
import { GlobeScene } from "@/components/globe/globe-scene";
import { DESTINATION, ORIGINS, milesFrom } from "@/lib/globe/origins";

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(callback: () => void) {
  const query = window.matchMedia(REDUCED_QUERY);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

/** External store rather than an effect, so the first paint is already correct. */
function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(REDUCED_QUERY).matches,
    () => false,
  );
}

/**
 * The journey, as the shop's actual selling point: four growing regions,
 * one corner in Newtown. Drag to turn it; pick a region to read it.
 */
export function FlowerGlobe() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const reduced = usePrefersReducedMotion();
  const active = ORIGINS.find((origin) => origin.id === activeId) ?? null;

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-6">
      <div className="lg:col-span-7">
        <div className="relative mx-auto aspect-square w-full max-w-[34rem] lg:max-w-none">
          <Canvas
            camera={{ position: [0, 0, 2.75], fov: 45 }}
            dpr={[1, 2]}
            gl={{ antialias: true, alpha: true }}
          >
            <Suspense fallback={null}>
              <GlobeScene
                activeId={activeId}
                onSelect={setActiveId}
                reduced={reduced}
              />
            </Suspense>
          </Canvas>
        </div>

        {/* Outside the square, so it clears the globe rather than sitting on it. */}
        <p className="mt-6 text-center text-[0.65rem] uppercase tracking-[0.18em] text-chalk/50">
          Drag to turn · Tap an origin
        </p>
      </div>

      <div className="lg:col-span-4 lg:col-start-9">
        <ul className="border-t border-chalk/15">
          {ORIGINS.map((origin) => {
            const isActive = origin.id === activeId;
            return (
              <li key={origin.id} className="border-b border-chalk/15">
                <button
                  type="button"
                  onClick={() => setActiveId(isActive ? null : origin.id)}
                  aria-pressed={isActive}
                  className="flex w-full items-baseline justify-between gap-4 py-4 text-left transition-colors hover:text-chalk"
                >
                  <span
                    className={`font-display text-[1.5rem] leading-none tracking-tight transition-colors ${
                      isActive ? "text-chalk" : "text-chalk/70"
                    }`}
                  >
                    {origin.name}
                  </span>
                  <span className="shrink-0 font-sans text-[0.7rem] uppercase tracking-[0.14em] text-chalk/50">
                    {milesFrom(origin.lat, origin.lng).toLocaleString()} mi
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <div className="mt-6 min-h-[5.5rem]">
          {active ? (
            <p className="text-[0.95rem] leading-relaxed text-chalk/65">
              {active.note}
            </p>
          ) : (
            <p className="text-[0.95rem] leading-relaxed text-chalk/50">
              Four growing regions, one cooler on {DESTINATION.name}. Pick one to
              see how far it came.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
