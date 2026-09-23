/**
 * The mark is the street blade over the shop door.
 *
 * Drawn solid rather than stroked. The first version outlined the blade in
 * thin strokes, which disappeared at the size it actually gets used, and
 * put the numeral at 1.7px of stroke where it read as a smudge. A filled
 * sign with the number knocked out holds up from a favicon to a poster,
 * which is the same reason real street blades are made that way.
 *
 * The knocked-out parts are painted in the paper colour rather than masked,
 * so there is no SVG id to collide when the mark appears more than once.
 */
export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" aria-hidden="true" className={className}>
      {/* The blade */}
      <rect x="1" y="10" width="38" height="20" rx="2.5" fill="currentColor" />
      {/* Inset keyline, the way a real sign is bordered */}
      <rect
        x="3.4"
        y="12.4"
        width="33.2"
        height="15.2"
        rx="1.4"
        stroke="var(--color-paper, #fcfbf9)"
        strokeWidth="1.1"
        opacity="0.55"
      />
      {/* The number */}
      <path
        d="M14.6 16.1h2.9v9"
        stroke="var(--color-paper, #fcfbf9)"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.1 25.1h6.6"
        stroke="var(--color-paper, #fcfbf9)"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      {/* A stem, because it is still a flower shop */}
      <path
        d="M26.4 25.4V15.1"
        stroke="var(--color-paper, #fcfbf9)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M26.4 19c2.6-.1 4.2-1.5 4.5-4-2.6.1-4.2 1.5-4.5 4z"
        fill="var(--color-paper, #fcfbf9)"
      />
    </svg>
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <LogoMark className="h-7 w-7 shrink-0 text-forest" />
      <span className="font-display text-[1.35rem] leading-none tracking-tight text-ink">
        One South Sycamore
      </span>
    </span>
  );
}
