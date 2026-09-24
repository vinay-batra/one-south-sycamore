import type { Metadata } from "next";
import { PhotoSlot } from "@/components/photo-slot";
import { Reveal } from "@/components/reveal";
import { STORY_CHAPTERS } from "@/lib/content";

export const metadata: Metadata = {
  alternates: { canonical: "/about" },
  openGraph: { url: "/about" },
  title: "About",
  description:
    "Twenty-five years in flowers, from Brooklyn street stands to a corner shop in Newtown, PA. The story behind One South Sycamore.",
};

export default function AboutPage() {
  return (
    <>
      {/* ── Opening ──────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1180px] px-6 pt-14 pb-16 sm:pt-20">
        <p className="text-[0.7rem] uppercase tracking-[0.16em] text-muted">
          About
        </p>
        <h1 className="mt-5 max-w-[14ch] font-display text-[3rem] leading-[0.94] tracking-[-0.03em] sm:text-[4.75rem]">
          Twenty-five years
          <br />
          in flowers.
        </h1>
      </section>

      <div className="mx-auto grid max-w-[1180px] grid-cols-2 gap-3 px-6 sm:gap-4 lg:grid-cols-3">
        {/* Held for a portrait of Vince at the bench. Until that photograph
            exists this draws the labelled placeholder, so the layout is
            already the right shape when it arrives. */}
        <PhotoSlot
          label="Vince at the bench"
          className="aspect-[3/4] w-full"
          sizes="(min-width: 1024px) 33vw, 50vw"
        />
        <PhotoSlot
          slug="storefront-front"
          label="The front of the shop"
          className="aspect-[3/4] w-full"
          sizes="(min-width: 1024px) 33vw, 50vw"
          priority
        />
        <PhotoSlot
          slug="cooler-wide"
          label="The cooler"
          className="col-span-2 aspect-[3/4] w-full lg:col-span-1"
          sizes="(min-width: 1024px) 33vw, 100vw"
        />
      </div>

      {/* ── Chapters ─────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1180px] px-6 py-20 sm:py-28">
        {STORY_CHAPTERS.map((chapter, index) => (
          <Reveal key={chapter.label}>
            <article
              className={`grid gap-6 border-t hairline py-12 lg:grid-cols-12 lg:gap-8 ${
                index === 0 ? "border-t-0 pt-0" : ""
              }`}
            >
              <div className="flex items-baseline gap-4 lg:col-span-3">
                <span className="numeral text-[1.6rem] text-moss/70">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="text-[0.7rem] uppercase tracking-[0.16em] text-moss">
                  {chapter.label}
                </p>
              </div>
              <div className="lg:col-span-8 lg:col-start-5">
                <h2 className="font-display text-[2rem] leading-[1.08] tracking-tight sm:text-[2.6rem]">
                  {chapter.heading}
                </h2>
                {chapter.body.map((para) => (
                  <p
                    key={para}
                    className="mt-5 max-w-2xl text-[1.0625rem] leading-relaxed text-ink-soft"
                  >
                    {para}
                  </p>
                ))}
              </div>
            </article>
          </Reveal>
        ))}
      </section>
    </>
  );
}
