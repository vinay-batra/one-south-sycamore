import { MAP_URL } from "@/lib/site";

/**
 * A sketch of the junction, drawn to the real geography.
 *
 * North is up. Sycamore runs north to south; Washington Avenue crosses it
 * and continues west as Swamp Road. The shop is on the south east corner
 * and the Lukoil is directly opposite across Sycamore, which is exactly how
 * Vince describes it. Still a sketch and still not to scale, with the real
 * map a tap underneath.
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

          {/* The shop: south east corner, east of Sycamore. */}
          <g>
            <rect x="248" y="182" width="104" height="62" fill="var(--color-forest)" rx="2" />
            <text
              x="300"
              y="208"
              textAnchor="middle"
              className="fill-[var(--color-paper)] font-sans"
              style={{ fontSize: 10.5, letterSpacing: "0.1em" }}
            >
              ONE SOUTH
            </text>
            <text
              x="300"
              y="224"
              textAnchor="middle"
              className="fill-[var(--color-paper)] font-sans"
              style={{ fontSize: 10.5, letterSpacing: "0.1em" }}
            >
              SYCAMORE
            </text>
          </g>

          {/* Lukoil: directly opposite, west of Sycamore. */}
          <g>
            <rect
              x="58"
              y="186"
              width="78"
              height="54"
              fill="none"
              stroke="var(--color-moss)"
              strokeWidth="1.4"
              strokeDasharray="4 4"
              rx="2"
            />
            <text
              x="97"
              y="218"
              textAnchor="middle"
              className="fill-[var(--color-ink-soft)] font-sans"
              style={{ fontSize: 10, letterSpacing: "0.1em" }}
            >
              LUKOIL
            </text>
          </g>

          {/* Street names */}
          <text
            x="286"
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

          {/* North */}
          <g transform="translate(366 30)">
            <path
              d="M0 14V-6M0 -6l-4.5 5M0 -6l4.5 5"
              stroke="var(--color-ink-soft)"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <text
              x="0"
              y="26"
              textAnchor="middle"
              className="fill-[var(--color-ink-soft)] font-sans"
              style={{ fontSize: 9, letterSpacing: "0.12em" }}
            >
              N
            </text>
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
