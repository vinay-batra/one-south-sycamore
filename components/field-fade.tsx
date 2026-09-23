/**
 * Bridges the warm paper background into one of the dark fields.
 *
 * Butting the two colours straight against each other put a hard line
 * across the page, which was especially harsh under the photographs. This
 * ramps between them over a comfortable band so the change reads as the
 * page settling rather than as a seam.
 */
export function FieldFade({
  to = "dark",
  from = "paper",
}: {
  /** "dark" ramps paper into the board colour; "paper" does the reverse. */
  to?: "dark" | "paper";
  /** Which light tone sits on the paper side of the ramp. */
  from?: "paper" | "warm";
}) {
  const light = from === "warm" ? "var(--color-paper-warm)" : "var(--color-paper)";

  /**
   * Ramped through sage and moss rather than straight to the board colour.
   * Interpolating warm white to near-black green in sRGB passes through a
   * dead grey, which looked like dirt on the page; stepping down through
   * the palette's own greens keeps the whole band in the same family.
   */
  const stops = [
    `${light} 0%`,
    "var(--color-sage) 28%",
    "var(--color-moss) 66%",
    "var(--color-board) 100%",
  ];

  return (
    <div
      aria-hidden="true"
      className="h-28 w-full sm:h-40"
      style={{
        backgroundImage: `linear-gradient(to bottom, ${(to === "dark"
          ? stops
          : [...stops].reverse().map((stop, i, all) => {
              // Reversing the list keeps the colours but not the positions,
              // so mirror the percentages back on.
              const colour = stop.replace(/ \d+%$/, "");
              const pct = [0, 34, 72, 100][i];
              void all;
              return `${colour} ${pct}%`;
            })
        ).join(", ")})`,
      }}
    />
  );
}
