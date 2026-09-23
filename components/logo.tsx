/**
 * The mark is the street blade over the shop door.
 *
 * An earlier draft drew a V from two cut stems, which stopped meaning
 * anything once the shop took its real name. The green sign reading ONE
 * SOUTH SYCAMORE is the identity Vince already has on the building, so the
 * mark echoes that: a street blade carrying the number, with a stem
 * growing through it. It survives being shrunk to a favicon, where a
 * wordmark would not.
 */
export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className={className}>
      {/* The blade */}
      <rect
        x="2.5"
        y="8.5"
        width="27"
        height="15"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      {/* Inset rule, the way a real street sign is bordered */}
      <rect
        x="5"
        y="11"
        width="22"
        height="10"
        rx="1.2"
        stroke="currentColor"
        strokeWidth="0.9"
        opacity="0.45"
      />
      {/* The number */}
      <path
        d="M13.4 13.2h2.1v5.6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M12.6 18.8h4.4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      {/* A stem growing up through the blade */}
      <path
        d="M21.6 21.6V12.6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M21.6 15.6c2-.1 3.2-1.1 3.4-2.9-2 .1-3.2 1.1-3.4 2.9z"
        fill="currentColor"
        opacity="0.9"
      />
    </svg>
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-baseline gap-2.5 ${className}`}>
      <LogoMark className="h-5 w-5 shrink-0 translate-y-[3px] text-forest" />
      <span className="font-display text-[1.3rem] leading-none tracking-tight text-ink">
        One South Sycamore
      </span>
    </span>
  );
}
