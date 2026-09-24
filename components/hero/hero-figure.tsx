"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { HERO_FRAMES } from "@/lib/hero-frames";
import { DWELL, MELT } from "@/components/hero/liquid-canvas";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

const LiquidCanvas = dynamic(
  () => import("@/components/hero/liquid-canvas").then((m) => m.LiquidCanvas),
  { ssr: false },
);

const FIRST = HERO_FRAMES[0];

/**
 * The figure beside the headline.
 *
 * A real <img> paints first and holds the layout, and WebGL fades in over
 * it once the textures are up. Both use the same file, so the texture is a
 * cache hit rather than a second download. A failed context, a slow phone
 * and reduced motion all land on the same good-looking still.
 */
export function HeroFigure() {
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const [mounted, setMounted] = useState(false);
  const [ready, setReady] = useState(false);
  const [inView, setInView] = useState(false);
  const [hover, setHover] = useState(false);
  const [index, setIndex] = useState(0);
  /* What the caption and the dots say. The melt takes MELT seconds, so
     naming the new photograph the instant it is asked for puts the label
     ahead of the picture; it changes over at the halfway point instead. */
  const [shown, setShown] = useState(0);

  const frame = HERO_FRAMES[shown];

  useEffect(() => {
    if (reduced) return;
    // After first paint: the headline and the photograph matter first.
    const id = window.setTimeout(() => setMounted(true), 300);
    return () => window.clearTimeout(id);
  }, [reduced]);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  /* A self-restarting timeout rather than an interval, so a click resets
     the dwell instead of landing halfway through one. Nothing advances
     while the figure is off screen. */
  useEffect(() => {
    if (reduced || !ready || !inView) return;
    const id = window.setTimeout(
      () => setIndex((i) => (i + 1) % HERO_FRAMES.length),
      DWELL * 1000,
    );
    return () => window.clearTimeout(id);
  }, [index, ready, inView, reduced]);

  useEffect(() => {
    if (shown === index) return;
    const id = window.setTimeout(() => setShown(index), MELT * 500);
    return () => window.clearTimeout(id);
  }, [index, shown]);

  const onReady = useCallback(() => setReady(true), []);
  const advance = useCallback(() => setIndex((i) => (i + 1) % HERO_FRAMES.length), []);

  const still = (
    // Plain img, not next/image: this exact file is what WebGL uploads as a
    // texture, and routing it through the optimizer would fetch it twice.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={FIRST.src}
      alt=""
      width={FIRST.width}
      height={FIRST.height}
      fetchPriority="high"
      decoding="async"
      className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
        ready ? "opacity-0" : "opacity-100"
      }`}
    />
  );

  const box = (
    <span
      className="absolute inset-0 block overflow-hidden bg-sage/50 bg-cover bg-center"
      style={{ backgroundImage: `url(${FIRST.blurDataURL})` }}
    >
      {still}
      {mounted && (
        <span
          className={`absolute inset-0 block transition-opacity duration-700 ${
            ready ? "opacity-100" : "opacity-0"
          }`}
        >
          <LiquidCanvas index={index} hover={hover} onReady={onReady} />
        </span>
      )}
    </span>
  );

  return (
    <figure
      ref={ref}
      className="group animate-[fade-up_900ms_cubic-bezier(0.16,1,0.3,1)_200ms_both] motion-reduce:animate-none"
    >
      {reduced ? (
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-sage/50">{still}</div>
      ) : (
        <button
          type="button"
          onClick={advance}
          onPointerEnter={() => setHover(true)}
          onPointerLeave={() => setHover(false)}
          aria-label="Show the next photograph from the shop"
          className="relative block aspect-[3/4] w-full cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-forest"
        >
          {box}
        </button>
      )}

      {/* Fixed height: the caption changes with the photograph, and a wrap
          here would nudge the whole hero down a line. */}
      <figcaption className="mt-4 flex min-h-[1.1rem] items-center justify-between gap-x-6">
        <span aria-live="polite" className="text-[0.7rem] uppercase tracking-[0.14em] text-muted">
          {reduced ? FIRST.caption : frame.caption}
        </span>
        {!reduced && (
          <span aria-hidden="true" className="flex items-center gap-1.5">
            {HERO_FRAMES.map((entry, i) => (
              <span
                key={entry.slug}
                className={`h-1 w-1 rounded-full transition-colors duration-500 ${
                  i === shown ? "bg-forest" : "bg-ink/20"
                }`}
              />
            ))}
          </span>
        )}
      </figcaption>
    </figure>
  );
}
