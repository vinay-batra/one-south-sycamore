"use client";

import { Suspense, useState, useSyncExternalStore } from "react";
import { Canvas } from "@react-three/fiber";
import { GlobeScene } from "@/components/globe/globe-scene";
import { CountUp, Reveal } from "@/components/reveal";
import { ORIGINS, milesFrom } from "@/lib/globe/origins";

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
 * The sourcing story, as the thing you land on.
 *
 * Four growing regions arced to Newtown. Selecting a region turns the globe
 * to it and then hands control straight back, so it never feels locked.
 */
export function FlowerGlobe() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const reduced = usePrefersReducedMotion();
  const active = ORIGINS.find((origin) => origin.id === activeId) ?? null;

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-8">
      <div className="lg:col-span-7">
        <div className="relative mx-auto aspect-square w-full max-w-[36rem] lg:max-w-none">
          {/* The list beside this is the text equivalent, so the canvas
              itself has nothing to offer assistive technology. */}
          <Canvas
            aria-hidden="true"
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

        <p className="mt-5 text-center text-[0.65rem] uppercase tracking-[0.18em] text-muted">
          Drag to rotate, click dots for info
        </p>
      </div>

      <div className="lg:col-span-4 lg:col-start-9">
        <ul className="border-t border-ink/15">
          {ORIGINS.map((origin, index) => {
            const isActive = origin.id === activeId;
            return (
              <li key={origin.id} className="border-b border-ink/15">
                <Reveal motion="left" delay={index * 90} duration={700}>
                  <button
                    type="button"
                    onClick={() => setActiveId(isActive ? null : origin.id)}
                    aria-pressed={isActive}
                    aria-label={`${origin.name}, ${milesFrom(
                      origin.lat,
                      origin.lng,
                    ).toLocaleString()} miles away`}
                    className="flex w-full items-baseline justify-between gap-4 py-4 text-left transition-colors hover:text-ink"
                  >
                    <span
                      className={`font-display text-[1.5rem] leading-none tracking-tight transition-colors ${
                        isActive ? "text-forest" : "text-ink"
                      }`}
                    >
                      {origin.name}
                    </span>
                    {/* Hidden from AT: the figure animates, which would
                        rewrite the button's name on every frame. The label
                        above carries the final number. */}
                    <span
                      aria-hidden="true"
                      className="shrink-0 font-sans text-[0.7rem] uppercase tracking-[0.14em] text-muted"
                    >
                      <CountUp to={milesFrom(origin.lat, origin.lng)} /> mi
                    </span>
                  </button>
                </Reveal>
              </li>
            );
          })}
        </ul>

        {/* Live on the stable wrapper, not the paragraph: the paragraph is
            keyed and replaced, and a live region inserted along with its
            own content is usually not announced. */}
        <div aria-live="polite" className="mt-6 min-h-[4rem]">
          {active && (
            <p
              key={active.id}
              className="animate-[fade-up_500ms_cubic-bezier(0.16,1,0.3,1)_both] text-[0.95rem] leading-relaxed text-ink-soft motion-reduce:animate-none"
            >
              {active.note}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
