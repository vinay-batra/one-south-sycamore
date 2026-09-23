import { MAP_URL } from "@/lib/site";

/**
 * A sketch of the crossing, not a map.
 *
 * It draws only what Vince actually told us: the shop stands on the corner
 * of Washington and Sycamore with the Lukoil directly across the street.
 * It deliberately does not claim a compass orientation or which corner of
 * the junction, because nobody has said, and a diagram that looks like a
 * map while being wrong is worse than no diagram. The real map is one tap
 * away underneath.
 */
export function CornerDiagram({ className = "" }: { className?: string }) {
  return (
    <figure className={className}>
      <div className="relative overflow-hidden border-t-[3px] border-ink bg-paper-warm">
        <svg
          viewBox="0 0 400 300"
          className="block w-full"
          role="img"
          aria-label="Sketch of the junction: the shop sits on the corner of Washington Avenue and Sycamore Street, directly across from the Lukoil station."
        >
          {/* Roadway */}
          <g fill="var(--color-sage)">
            <rect x="150" y="0" width="86" height="300" />
            <rect x="0" y="96" width="400" height="74" />
          </g>

          {/* Centre lines */}
          <g
            stroke="var(--color-paper)"
            strokeWidth="2"
            strokeDasharray="12 10"
            strokeLinecap="round"
          >
            <path d="M193 0V96" />
            <path d="M193 170V300" />
            <path d="M0 133H150" />
            <path d="M236 133H400" />
          </g>

          {/* Kerb lines */}
          <g stroke="var(--color-moss)" strokeWidth="1" opacity="0.5">
            <path d="M150 0V96M150 170V300M236 0V96M236 170V300" />
            <path d="M0 96H150M236 96H400M0 170H150M236 170H400" />
          </g>

          {/* The shop */}
          <g>
            <rect
              x="46"
              y="186"
              width="92"
              height="66"
              fill="var(--color-forest)"
              rx="2"
            />
            <text
              x="92"
              y="214"
              textAnchor="middle"
              className="fill-[var(--color-paper)] font-sans"
              style={{ fontSize: 11, letterSpacing: "0.12em" }}
            >
              ONE SOUTH
            </text>
            <text
              x="92"
              y="230"
              textAnchor="middle"
              className="fill-[var(--color-paper)] font-sans"
              style={{ fontSize: 11, letterSpacing: "0.12em" }}
            >
              SYCAMORE
            </text>
          </g>

          {/* The landmark across the street */}
          <g>
            <rect
              x="252"
              y="192"
              width="74"
              height="54"
              fill="none"
              stroke="var(--color-moss)"
              strokeWidth="1.4"
              strokeDasharray="4 4"
              rx="2"
            />
            <text
              x="289"
              y="224"
              textAnchor="middle"
              className="fill-[var(--color-ink-soft)] font-sans"
              style={{ fontSize: 10, letterSpacing: "0.12em" }}
            >
              LUKOIL
            </text>
          </g>

          {/* Street names, set along their own roads */}
          <text
            x="20"
            y="127"
            className="fill-[var(--color-ink-soft)] font-sans"
            style={{ fontSize: 10, letterSpacing: "0.18em" }}
          >
            WASHINGTON
          </text>
          {/* Anchored at the start and rotated about its own origin, so the
              label runs down the road instead of being clipped at the top. */}
          <text
            x="170"
            y="18"
            transform="rotate(90 170 18)"
            className="fill-[var(--color-ink-soft)] font-sans"
            style={{ fontSize: 10, letterSpacing: "0.18em" }}
          >
            SYCAMORE
          </text>
        </svg>
      </div>

      <figcaption className="mt-3 flex flex-wrap items-baseline justify-between gap-3">
        <span className="text-[0.7rem] uppercase tracking-[0.16em] text-muted">
          A sketch, not to scale
        </span>
        <a
          href={MAP_URL}
          target="_blank"
          rel="noreferrer"
          className="border-b border-forest/40 pb-0.5 text-[0.7rem] uppercase tracking-[0.16em] text-forest transition-colors hover:border-forest"
        >
          Open in maps
        </a>
      </figcaption>
    </figure>
  );
}
