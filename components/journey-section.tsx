"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { FieldFade } from "@/components/field-fade";
import { SOURCING_PARAGRAPHS } from "@/lib/content";

/**
 * The globe is the heaviest thing on the site, so it loads on its own and
 * never blocks the phone number. The skeleton holds the exact layout height
 * to keep the section from jumping when it arrives.
 */
const FlowerGlobe = dynamic(
  () => import("@/components/globe/flower-globe").then((m) => m.FlowerGlobe),
  {
    ssr: false,
    loading: () => <GlobeSkeleton />,
  },
);

function GlobeSkeleton() {
  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-6">
      <div className="lg:col-span-7">
        <div className="relative mx-auto aspect-square w-full max-w-[34rem] lg:max-w-none">
          <div className="absolute inset-0 grid place-items-center">
            <div className="h-[72%] w-[72%] animate-pulse rounded-full border border-chalk/10 bg-chalk/[0.03]" />
          </div>
        </div>
      </div>
      <div className="lg:col-span-4 lg:col-start-9">
        <div className="border-t border-chalk/15">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-[3.75rem] border-b border-chalk/15" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function JourneySection() {
  // three.js is by far the heaviest thing here. Hold it back until the
  // section is near the viewport so a phone on cell data paints the shop's
  // number first and downloads the globe only if the visitor scrolls.
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
      { rootMargin: "600px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <FieldFade to="dark" />
      <section className="bg-board text-chalk">
      <div className="mx-auto max-w-[1180px] px-6 py-20 sm:py-28">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="text-[0.7rem] uppercase tracking-[0.2em] text-chalk/60">
              Where they come from
            </p>
            <h2 className="mt-5 font-display text-[2.5rem] leading-[1.0] tracking-[-0.02em] sm:text-[3.25rem]">
              Cut a world away.
              <br />
              On Sycamore Street
              <br />
              this week.
            </h2>
          </div>
          <div className="lg:col-span-6 lg:col-start-7 lg:pt-4">
            {SOURCING_PARAGRAPHS.map((para) => (
              <p
                key={para}
                className="mt-4 max-w-xl leading-relaxed text-chalk/65 first:mt-0"
              >
                {para}
              </p>
            ))}
          </div>
        </div>

        <div ref={ref} className="mt-16">
          {near ? <FlowerGlobe /> : <GlobeSkeleton />}
        </div>
      </div>
      </section>
      <FieldFade to="paper" />
    </>
  );
}
