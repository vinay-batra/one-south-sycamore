import type { Metadata } from "next";
import Link from "next/link";
import { FieldFade } from "@/components/field-fade";
import { PhotoSlot } from "@/components/photo-slot";
import { Reveal } from "@/components/reveal";
import { STORY_CHAPTERS } from "@/lib/content";
import {
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
  PHONE_DISPLAY,
  PHONE_TEL,
} from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/about" },
  title: "About",
  description:
    "Twenty-five years in flowers, from Brooklyn street stands to a corner shop in Newtown, PA. The story behind One South Sycamore.",
};

export default function AboutPage() {
  return (
    <>
      {/* ── Opening ──────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1180px] px-6 pt-14 pb-16 sm:pt-20">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <p className="text-[0.7rem] uppercase tracking-[0.16em] text-muted">
              About
            </p>
            <h1 className="mt-5 font-display text-[3rem] leading-[0.94] tracking-[-0.03em] sm:text-[4.75rem]">
              Twenty-five years
              <br />
              of new mornings.
            </h1>
          </div>

          {/* The one number he gave, set like a figure in a report. */}
          <div className="flex items-end gap-4 lg:col-span-3 lg:col-start-10 lg:justify-end">
            <span className="numeral text-[6rem] text-moss/80 sm:text-[8rem]">25</span>
            <span className="pb-3 text-[0.7rem] uppercase leading-relaxed tracking-[0.16em] text-muted">
              years
              <br />
              in flowers
            </span>
          </div>
        </div>
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

      {/* ── Pull quote ───────────────────────────────────────── */}
      <FieldFade to="dark" />
      <section className="bg-board text-chalk">
        <div className="mx-auto max-w-[1180px] px-6 py-24 sm:py-32">
          <Reveal>
            <figure className="mx-auto max-w-4xl text-center">
              <blockquote className="font-display text-[2.25rem] leading-[1.08] tracking-[-0.01em] sm:text-[3.5rem]">
                &ldquo;Every day is a new day,
                <br className="hidden sm:block" /> and a new inventory.&rdquo;
              </blockquote>
              <figcaption className="mt-8 text-[0.7rem] uppercase tracking-[0.2em] text-chalk/60">
                Vince
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </section>
      <FieldFade to="paper" />

      {/* ── How an order goes ────────────────────────────────── */}
      <section className="mx-auto max-w-[1180px] px-6 py-20 sm:py-28">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="text-[0.7rem] uppercase tracking-[0.16em] text-muted">
              Watch an order happen
            </p>
            <h2 className="mt-5 font-display text-[2.25rem] leading-[1.05] tracking-tight sm:text-[2.75rem]">
              The arrangement doesn&rsquo;t exist until you&rsquo;re standing there.
            </h2>
            <div className="mt-8 grid grid-cols-2 gap-4">
              <PhotoSlot
                slug="cooler-doors"
                label="The cooler"
                className="aspect-[3/4] w-full"
                sizes="(min-width: 1024px) 20vw, 50vw"
              />
              <PhotoSlot
                slug="roses-green-trick"
                label="Roses and green trick"
                className="mt-6 aspect-[3/4] w-full"
                sizes="(min-width: 1024px) 20vw, 50vw"
              />
            </div>
          </div>

          <div className="lg:col-span-6 lg:col-start-7 lg:pt-10">
            <p className="text-[1.0625rem] leading-relaxed text-ink-soft">
              Someone came in and said it was their wife&rsquo;s anniversary. Vince
              took them to the back, showed them what was in the cooler, and
              started making suggestions: this with that, more of these, skip
              those.
            </p>
            <p className="mt-5 text-[1.0625rem] leading-relaxed text-ink-soft">
              By the time they&rsquo;d talked it through, the arrangement existed and
              the price was settled. No set options. No catalog to pick from. He
              priced it on the spot, the way he does every time.
            </p>
            <p className="mt-5 text-[1.0625rem] leading-relaxed text-ink-soft">
              That&rsquo;s the part people come back for, and it&rsquo;s the reason this
              site has a phone number where another shop would have a checkout.
            </p>

            <div className="mt-10 border-t hairline pt-8">
              <p className="text-[0.7rem] uppercase tracking-[0.16em] text-muted">
                Stop in
              </p>
              <p className="mt-4 leading-relaxed text-ink-soft">
                Corner of Washington and Sycamore, across from the Lukoil.
              </p>
              <a
                href={`tel:${PHONE_TEL}`}
                className="mt-4 inline-block font-display text-[2rem] leading-none tracking-tight hover:text-forest"
              >
                {PHONE_DISPLAY}
              </a>
              <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
                <Link
                  href="/visit"
                  className="border-b border-forest/40 pb-0.5 text-[0.7rem] uppercase tracking-[0.16em] text-forest hover:border-forest"
                >
                  Hours &amp; directions
                </Link>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="border-b border-forest/40 pb-0.5 text-[0.7rem] uppercase tracking-[0.16em] text-forest hover:border-forest"
                >
                  {INSTAGRAM_HANDLE}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
