"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { SOURCING_PARAGRAPHS } from "@/lib/content";

function GlobeSkeleton() {
  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-8">
      <div className="lg:col-span-7">
        <div className="relative mx-auto aspect-square w-full max-w-[36rem] lg:max-w-none">
          <div className="absolute inset-0 grid place-items-center">
            <div className="h-[72%] w-[72%] rounded-full border border-ink/5 bg-sage/40" />
          </div>
        </div>
      </div>
      <div className="lg:col-span-4 lg:col-start-9">
        <div className="border-t border-ink/15">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-[3.5rem] border-b border-ink/15" />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * three.js is by far the heaviest thing on this site, so it is held back
 * until the section is near the viewport. The skeleton holds the exact
 * layout height so nothing jumps when it arrives.
 */
const FlowerGlobe = dynamic(
  () => import("@/components/globe/flower-globe").then((m) => m.FlowerGlobe),
  { ssr: false, loading: () => <GlobeSkeleton /> },
);

/**
 * The globe sits on the paper background rather than in a dark band.
 *
 * It used to live in a full-bleed dark section, which meant two hard
 * colour changes on the way past it however gently they were ramped. The
 * globe is dark enough on its own to anchor the page.
 */
export function HeroGlobe() {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      const frame = requestAnimationFrame(() => setNear(true));
      return () => cancelAnimationFrame(frame);
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          observer.disconnect();
        }
      },
      { rootMargin: "700px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="mx-auto max-w-[1180px] px-6 pt-12 sm:pt-16">
      <div ref={ref}>{near ? <FlowerGlobe /> : <GlobeSkeleton />}</div>

      <div className="mt-14 grid gap-8 border-t hairline pt-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="text-[0.7rem] uppercase tracking-[0.16em] text-muted">
            Where they come from
          </p>
          <h2 className="mt-4 font-display text-[2.25rem] leading-[1.03] tracking-[-0.02em] sm:text-[2.75rem]">
            Cut a world away.
            <br />
            On Sycamore Street this week.
          </h2>
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          {SOURCING_PARAGRAPHS.map((para) => (
            <p
              key={para}
              className="mt-4 max-w-xl leading-relaxed text-ink-soft first:mt-0"
            >
              {para}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
