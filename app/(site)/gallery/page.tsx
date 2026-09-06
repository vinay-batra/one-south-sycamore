import type { Metadata } from "next";
import { PhotoSlot } from "@/components/photo-slot";
import { GALLERY_CATEGORIES } from "@/lib/content";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL, PHONE_DISPLAY, PHONE_TEL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Arrangements, wedding work, sympathy pieces, plants and succulents from V Flowers in Newtown, PA.",
};

/**
 * Placeholder grid until Vinay uploads Vince's photos. Each slot is a real
 * position in the layout, so swapping in images doesn't move anything.
 * Once /admin/gallery is wired to Supabase this reads from the database.
 */
const PLACEHOLDER_SHOTS = [
  { label: "Wrapped bouquet", category: "Arrangements", tall: true },
  { label: "Vase arrangement", category: "Arrangements", tall: false },
  { label: "Bridal bouquet", category: "Weddings", tall: false },
  { label: "Ceremony piece", category: "Weddings", tall: true },
  { label: "Standing spray", category: "Sympathy", tall: false },
  { label: "Blooming plant", category: "Plants", tall: false },
  { label: "Succulent dish garden", category: "Succulents", tall: true },
  { label: "Potted succulents", category: "Succulents", tall: false },
  { label: "Gift basket", category: "Gift Baskets", tall: false },
  { label: "Storefront on Sycamore", category: "The Shop", tall: true },
  { label: "Inside the cooler", category: "The Shop", tall: false },
  { label: "Bench in progress", category: "The Shop", tall: false },
];

export default function GalleryPage() {
  return (
    <div className="mx-auto max-w-[1120px] px-6 pt-16 pb-8 sm:pt-24">
      <header className="max-w-2xl">
        <p className="eyebrow">Gallery</p>
        <h1 className="mt-5 font-display text-[2.5rem] leading-[1.08] tracking-tight sm:text-5xl">
          What&rsquo;s come out of the shop.
        </h1>
        <p className="mt-6 text-[1.0625rem] leading-relaxed text-ink-soft">
          None of these are catalog items — they&rsquo;re what got built on a given
          morning, from what was in that day. Use them for ideas, then call and
          describe what you&rsquo;re after.
        </p>
      </header>

      <ul className="mt-10 flex flex-wrap gap-2">
        {GALLERY_CATEGORIES.map((category) => (
          <li
            key={category}
            className="rounded-full border border-forest/15 bg-paper-warm px-3.5 py-1.5 text-xs tracking-wide text-forest"
          >
            {category}
          </li>
        ))}
      </ul>

      <div className="mt-10 columns-2 gap-4 lg:columns-3 [&>*]:mb-4">
        {PLACEHOLDER_SHOTS.map((shot) => (
          <figure key={shot.label} className="break-inside-avoid">
            <PhotoSlot
              label={shot.label}
              className={`w-full rounded-sm ${shot.tall ? "aspect-[3/4]" : "aspect-square"}`}
            />
            <figcaption className="mt-2 text-xs text-muted">{shot.category}</figcaption>
          </figure>
        ))}
      </div>

      <div className="mt-14 rounded-sm bg-sage p-8 sm:p-10">
        <h2 className="font-display text-2xl leading-tight">
          More on Instagram, updated most days.
        </h2>
        <p className="mt-3 max-w-2xl leading-relaxed text-ink-soft">
          Vince posts what&rsquo;s in as it comes in. Follow{" "}
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noreferrer"
            className="text-forest underline underline-offset-2"
          >
            {INSTAGRAM_HANDLE}
          </a>{" "}
          — or just call{" "}
          <a href={`tel:${PHONE_TEL}`} className="text-forest underline underline-offset-2">
            {PHONE_DISPLAY}
          </a>{" "}
          and ask what&rsquo;s good today.
        </p>
      </div>
    </div>
  );
}
