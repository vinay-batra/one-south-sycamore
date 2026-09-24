"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { BLOOM_FRAMES } from "@/lib/bloom";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

const BloomCanvas = dynamic(
  () => import("@/components/bloom/bloom-canvas").then((m) => m.BloomCanvas),
  { ssr: false },
);

const POSTER = BLOOM_FRAMES[0];

/**
 * The figure beside the headline.
 *
 * A real photograph paints first and carries the layout. three.js is held
 * back until after that paint, and the point cloud crossfades over the
 * photograph once it has sampled it, so a slow phone, a failed WebGL
 * context and reduced motion all land on the same good-looking still.
 */
export function HeroBloom() {
  const reduced = usePrefersReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [ready, setReady] = useState(false);
  const [index, setIndex] = useState(0);
  const [burst, setBurst] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const id = window.setTimeout(() => setMounted(true), 300);
    return () => window.clearTimeout(id);
  }, [reduced]);

  const onReady = useCallback(() => setReady(true), []);

  const scatter = useCallback(() => {
    setBurst((n) => n + 1);
    setIndex((n) => (n + 1) % BLOOM_FRAMES.length);
  }, []);

  const frame = BLOOM_FRAMES[reduced ? 0 : index];

  /* Pinned to the first frame: it is only ever seen before the cloud
     arrives, and swapping it would pull down a second poster. It is cut
     from the same crop the cloud samples, so the crossfade holds still. */
  const still = (opacity: string) => (
    <Image
      src={POSTER.poster}
      alt=""
      fill
      priority
      sizes="(min-width: 1024px) 38vw, 90vw"
      placeholder="blur"
      blurDataURL={POSTER.blurDataURL}
      className={`object-cover transition-opacity duration-700 ${opacity}`}
    />
  );

  return (
    <figure className="group animate-[fade-up_900ms_cubic-bezier(0.16,1,0.3,1)_200ms_both] motion-reduce:animate-none">
      {reduced ? (
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-sage/50">
          {still("opacity-100")}
        </div>
      ) : (
        <button
          type="button"
          onClick={scatter}
          aria-label="Scatter the flowers and show another photograph from the shop"
          className="relative block aspect-[3/4] w-full cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-forest"
        >
          <span className="absolute inset-0 block overflow-hidden bg-sage/50">
            {still(ready ? "opacity-0" : "opacity-100")}
          </span>
          {/* Deliberately larger than the photograph and unclipped, so a
              throw crosses the page instead of piling up against an edge.
              The insets are paired with FRAME_SCALE_X and FRAME_SCALE_Y in
              bloom-canvas, which pull the camera back to match. Clicks fall
              through to the button underneath. */}
          {mounted && (
            <span
              className={`pointer-events-none absolute -inset-x-[55%] -inset-y-[30%] block transition-opacity duration-700 ${
                ready ? "opacity-100" : "opacity-0"
              }`}
            >
              <BloomCanvas index={index} burst={burst} onReady={onReady} />
            </span>
          )}
        </button>
      )}

      {/* Fixed height: the caption changes with the photograph, and a
          wrap here would nudge the whole hero down a line. */}
      <figcaption className="mt-4 flex min-h-[1.1rem] flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <span
          aria-live="polite"
          className="text-[0.7rem] uppercase tracking-[0.14em] text-muted"
        >
          {frame.caption}
        </span>
        {!reduced && (
          <span
            aria-hidden="true"
            className="text-[0.65rem] uppercase tracking-[0.18em] text-muted transition-colors duration-300 group-hover:text-forest"
          >
            Click to scatter
          </span>
        )}
      </figcaption>
    </figure>
  );
}
