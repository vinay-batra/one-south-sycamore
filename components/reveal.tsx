"use client";

import { useEffect, useRef, useState } from "react";

type Motion = "up" | "fade" | "scale" | "left";

const HIDDEN: Record<Motion, string> = {
  up: "translate-y-6 opacity-0",
  fade: "opacity-0",
  scale: "scale-[0.97] opacity-0",
  left: "-translate-x-5 opacity-0",
};

const SHOWN: Record<Motion, string> = {
  up: "translate-y-0 opacity-100",
  fade: "opacity-100",
  scale: "scale-100 opacity-100",
  left: "translate-x-0 opacity-100",
};

/**
 * Entrance animation, played once as the element comes into view.
 *
 * Reduced-motion visitors get the same content with the transition
 * switched off, so nothing is ever hidden behind an animation that will
 * not run.
 */
export function Reveal({
  children,
  delay = 0,
  motion = "up",
  duration = 900,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  motion?: Motion;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // No observer support: show it rather than stranding the content.
    if (typeof IntersectionObserver === "undefined") {
      const frame = requestAnimationFrame(() => setShown(true));
      return () => cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-[opacity,transform] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
        shown ? SHOWN[motion] : HIDDEN[motion]
      } ${className}`}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: shown ? `${delay}ms` : "0ms",
      }}
    >
      {children}
    </div>
  );
}

/**
 * Counts up to a number once it scrolls into view. Used for the distances
 * on the globe, where watching the figure climb makes the point about how
 * far the flowers travel better than printing it does.
 */
export function CountUp({
  to,
  duration = 1400,
  className = "",
}: {
  to: number;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || typeof IntersectionObserver === "undefined") {
      const frame = requestAnimationFrame(() => setValue(to));
      return () => cancelAnimationFrame(frame);
    }

    let raf = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          // Ease out, so it decelerates into the final figure.
          setValue(Math.round(to * (1 - Math.pow(1 - t, 3))));
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { rootMargin: "0px 0px -15% 0px" },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to, duration]);

  return (
    <span ref={ref} className={className}>
      {value.toLocaleString()}
    </span>
  );
}
