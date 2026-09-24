import { MAP_URL } from "@/lib/site";

/**
 * A sketch of the junction, drawn to the real geography.
 *
 * North is up. Sycamore runs north to south; Washington Avenue crosses it
 * and continues west as Swamp Road. The shop is on the south east corner
 * and the Lukoil is directly opposite across Sycamore, which is exactly how
 * Vince describes it. Still a sketch and still not to scale, with the real
 * map a tap underneath.
 *
 * Both building labels are set along Sycamore rather than across it, the
 * way a street name runs on a map: they read in the direction of the road
 * they front.
 */
export function CornerDiagram({ className = "" }: { className?: string }) {
  return (
    <figure className={className}>
      <div className="relative overflow-hidden border-t-[3px] border-ink bg-paper-warm">
        <svg
          viewBox="0 0 400 300"
          className="block w-full"
          role="img"
          aria-label="Sketch of the junction, north at the top. Sycamore Street runs north to south and Washington Avenue crosses it, continuing west as Swamp Road. The shop is on the south east corner, with the Lukoil station directly opposite across Sycamore Street."
        >
          <g fill="var(--color-sage)">
            <rect x="158" y="0" width="76" height="300" />
            <rect x="0" y="104" width="400" height="62" />
          </g>

          <g
            stroke="var(--color-paper)"
            strokeWidth="2"
            strokeDasharray="12 10"
            strokeLinecap="round"
          >
            <path d="M196 0V104" />
            <path d="M196 166V300" />
            <path d="M0 135H158" />
            <path d="M234 135H400" />
          </g>

          <g stroke="var(--color-moss)" strokeWidth="1" opacity="0.45">
            <path d="M158 0V104M158 166V300M234 0V104M234 166V300" />
            <path d="M0 104H158M234 104H400M0 166H158M234 166H400" />
          </g>

          {/* The shop: south east corner, fronting Sycamore. */}
          <g>
            <rect x="244" y="180" width="62" height="106" fill="var(--color-forest)" rx="2" />
            {/* Turned the opposite way to the Lukoil's label: this building is east
                of Sycamore and that one is west, so setting both the same way
                pointed one of them away from the street. They face each other
                across the road now, which is how Vince describes the corner. */}
            <g transform="rotate(-90 275 233)">
              <text
                x="275"
                y="229"
                textAnchor="middle"
                className="fill-[var(--color-paper)] font-sans"
                style={{ fontSize: 10.5, letterSpacing: "0.1em" }}
              >
                ONE SOUTH
              </text>
              <text
                x="275"
                y="244"
                textAnchor="middle"
                className="fill-[var(--color-paper)] font-sans"
                style={{ fontSize: 10.5, letterSpacing: "0.1em" }}
              >
                SYCAMORE
              </text>
            </g>
          </g>

          {/* Lukoil: directly opposite, west of Sycamore. */}
          <g>
            <rect
              x="74"
              y="182"
              width="76"
              height="80"
              fill="none"
              stroke="var(--color-moss)"
              strokeWidth="1.4"
              strokeDasharray="4 4"
              rx="2"
            />
            <text
              x="112"
              y="226"
              transform="rotate(90 112 222)"
              textAnchor="middle"
              className="fill-[var(--color-ink-soft)] font-sans"
              style={{ fontSize: 10, letterSpacing: "0.1em" }}
            >
              LUKOIL
            </text>
          </g>

          {/* Street names */}
          <text
            x="250"
            y="129"
            className="fill-[var(--color-ink-soft)] font-sans"
            style={{ fontSize: 9.5, letterSpacing: "0.16em" }}
          >
            W WASHINGTON AVE
          </text>
          <text
            x="16"
            y="129"
            className="fill-[var(--color-ink-soft)] font-sans"
            style={{ fontSize: 9.5, letterSpacing: "0.16em" }}
          >
            SWAMP RD
          </text>
          <text
            x="178"
            y="18"
            transform="rotate(90 178 18)"
            className="fill-[var(--color-ink-soft)] font-sans"
            style={{ fontSize: 9.5, letterSpacing: "0.16em" }}
          >
            N SYCAMORE ST
          </text>
          <text
            x="178"
            y="182"
            transform="rotate(90 178 182)"
            className="fill-[var(--color-ink-soft)] font-sans"
            style={{ fontSize: 9.5, letterSpacing: "0.16em" }}
          >
            S SYCAMORE ST
          </text>

          {/* Compass. North is up, so east is right and west is left. */}
          <g transform="translate(356 50)" aria-hidden="true">
            <circle
              r="14"
              fill="var(--color-paper-warm)"
              stroke="var(--color-moss)"
              strokeWidth="1"
              opacity="0.9"
            />
            <path
              d="M0 0V-9M0 0V9M0 0H-9M0 0H9"
              stroke="var(--color-moss)"
              strokeWidth="1"
              strokeLinecap="round"
              opacity="0.7"
            />
            <path d="M0 -12.5 3.1 -5 -3.1 -5Z" fill="var(--color-forest)" />
            <g
              className="fill-[var(--color-ink-soft)] font-sans"
              style={{ fontSize: 8.5, letterSpacing: "0.1em" }}
              textAnchor="middle"
            >
              <text x="0" y="-18">N</text>
              <text x="0" y="25">S</text>
              <text x="21" y="3">E</text>
              <text x="-21" y="3">W</text>
            </g>
          </g>
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
