/**
 * Draft mark: the V is drawn as two cut stems meeting at a point, with a
 * single leaf on the right arm. Vector, so it works on a sign or a favicon.
 */
export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M7 6.5L16 25.5L25 6.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21.2 14.5c2.6.5 4.6-.6 5.6-3.2-2.7-.7-4.7.3-5.6 3.2z"
        fill="currentColor"
        opacity="0.85"
      />
    </svg>
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-baseline gap-2 ${className}`}>
      <LogoMark className="h-5 w-5 shrink-0 translate-y-[3px] text-forest" />
      <span className="font-display text-[1.35rem] leading-none tracking-tight text-ink">
        V Flowers
      </span>
    </span>
  );
}
