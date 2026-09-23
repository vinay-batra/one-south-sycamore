import type { Metadata } from "next";
import { GalleryGrid, type Plate } from "@/components/gallery-grid";
import {
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
  PHONE_DISPLAY,
  PHONE_TEL,
} from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/gallery" },
  title: "Gallery",
  description:
    "Arrangements, wedding work, sympathy pieces, plants, succulents and art from One South Sycamore in Newtown, PA.",
};

/**
 * Every photograph is the same 3:4 portrait, so they are shown at one
 * size. An earlier version varied the column spans to feel like a contact
 * sheet; with real photographs it just read as ragged rows and a
 * half-empty last row.
 */
const PLATES = [
  { slug: "storefront-wide", category: "The Shop" },
  { slug: "roses-green-trick", category: "Arrangements" },
  { slug: "cooler-doors", category: "The Cooler" },
  { slug: "succulent-patio", category: "Succulents" },
  { slug: "roses-hellebore", category: "Arrangements" },
  { slug: "storefront-front", category: "The Shop" },
  { slug: "studio-interior", category: "Art" },
  { slug: "art-panels", category: "Art" },
  { slug: "art-canvases", category: "Art" },
  { slug: "cooler-wide", category: "The Cooler" },
] as const satisfies readonly Plate[];

export default function GalleryPage() {
  return (
    <>
      <section className="mx-auto max-w-[1180px] px-6 pt-14 pb-12 sm:pt-20">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="text-[0.7rem] uppercase tracking-[0.16em] text-muted">
              Gallery
            </p>
            <h1 className="mt-5 font-display text-[3rem] leading-[0.94] tracking-[-0.03em] sm:text-[4.5rem]">
              What&rsquo;s come out
              <br />
              of the shop.
            </h1>
          </div>
          <p className="text-[1.0625rem] leading-relaxed text-ink-soft lg:col-span-4 lg:col-start-9 lg:pt-4">
            None of these are catalog items. They&rsquo;re what got built on a given
            morning, from what was in that day. Use them for ideas, then call and
            describe what you&rsquo;re after.
          </p>
        </div>

        {/* Index of what's actually in the sheet below, set like a masthead
            rule. Derived from the plates so it can never over-promise. */}
        <ul className="mt-12 flex flex-wrap items-baseline gap-x-6 gap-y-2 border-y hairline py-4">
          {[...new Set(PLATES.map((plate) => plate.category))].map((category) => (
            <li
              key={category}
              className="text-[0.7rem] uppercase tracking-[0.16em] text-muted"
            >
              {category}
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-[1180px] px-6 pb-20">
        <GalleryGrid plates={PLATES} />
      </section>

      <section className="border-t hairline bg-paper-warm">
        <div className="mx-auto grid max-w-[1180px] gap-8 px-6 py-16 lg:grid-cols-12">
          <h2 className="font-display text-[2.25rem] leading-[1.05] tracking-tight lg:col-span-6 sm:text-[2.75rem]">
            More on Instagram, most days.
          </h2>
          <div className="lg:col-span-5 lg:col-start-8">
            <p className="leading-relaxed text-ink-soft">
              Vince posts what&rsquo;s in as it comes in, the fastest way to see
              today&rsquo;s cooler without walking through the door.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-3">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noreferrer"
                className="border-b border-forest/40 pb-0.5 text-[0.7rem] uppercase tracking-[0.16em] text-forest hover:border-forest"
              >
                Follow {INSTAGRAM_HANDLE}
              </a>
              <a
                href={`tel:${PHONE_TEL}`}
                className="font-display text-[1.6rem] leading-none tracking-tight hover:text-forest"
              >
                {PHONE_DISPLAY}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
