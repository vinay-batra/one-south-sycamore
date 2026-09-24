import type { Metadata } from "next";
import Link from "next/link";
import { HeroBloom } from "@/components/bloom/hero-bloom";
import { PhotoSlot } from "@/components/photo-slot";
import { Reveal } from "@/components/reveal";
import { SourcingGlobe } from "@/components/sourcing-globe";
import { ART_PARAGRAPHS, ORDER_STEPS, SERVICES } from "@/lib/content";
import {
  ADDRESS_CITY,
  ADDRESS_STREET,
  DIRECTIONS_NOTE,
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
  PHONE_TEL,
} from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: { url: "/" },
};

/* Matched buttons: the outline carries a transparent border on the solid
   one too, so the two sit at exactly the same height. */
const BUTTON =
  "inline-flex items-center justify-center border px-7 py-3.5 text-[0.7rem] uppercase tracking-[0.16em] transition-colors";

export default function HomePage() {
  return (
    <>
      {/* ── Lede, with the flowers themselves beside it ────────── */}
      <section className="mx-auto max-w-[1180px] px-6 pt-12 sm:pt-16">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-14">
          <div className="lg:col-span-7">
            <h1 className="font-display text-[2.75rem] leading-[0.94] tracking-[-0.03em] sm:text-[4rem] lg:text-[4.5rem]">
              <span className="block animate-[fade-up_900ms_cubic-bezier(0.16,1,0.3,1)_both] motion-reduce:animate-none">
                No set menu.
              </span>
              <span className="block animate-[fade-up_900ms_cubic-bezier(0.16,1,0.3,1)_120ms_both] text-forest motion-reduce:animate-none">
                Just what&rsquo;s beautiful today.
              </span>
            </h1>

            <div className="animate-[fade-up_900ms_cubic-bezier(0.16,1,0.3,1)_300ms_both] motion-reduce:animate-none">
              <p className="mt-8 max-w-xl text-[1.0625rem] leading-relaxed text-ink-soft">
                A flower shop on the corner of Washington and Sycamore, in the
                middle of Newtown. Nothing here is made in advance. Tell Vince
                the occasion and he builds it from whatever came in that
                morning.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className={`${BUTTON} border-transparent bg-forest text-paper hover:bg-ink`}
                >
                  Fill out a request
                </Link>
                <a
                  href={`tel:${PHONE_TEL}`}
                  className={`${BUTTON} border-forest/35 text-forest hover:border-forest hover:bg-sage/60`}
                >
                  Call or text the shop
                </a>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <HeroBloom />
          </div>
        </div>
      </section>

      <SourcingGlobe />

      {/* ── How to order ─────────────────────────────────────── */}
      <section className="mx-auto max-w-[1180px] px-6 pb-20 sm:pb-24">
        <div className="grid gap-10 border-b border-ink/15 pb-10 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <p className="text-[0.7rem] uppercase tracking-[0.16em] text-muted">
              Ordering
            </p>
            <h2 className="mt-4 font-display text-[2.5rem] leading-[1.0] tracking-[-0.02em] sm:text-[3.25rem]">
              There is nothing
              <br />
              to choose from.
            </h2>
          </div>
          <p className="text-[1.0625rem] leading-relaxed text-ink-soft lg:col-span-5 lg:col-start-8 lg:pt-4">
            No list of arrangements, no set prices, no checkout. Just a
            conversation and a cooler. Here is how it goes.
          </p>
        </div>

        <ol className="grid sm:grid-cols-2 sm:gap-x-14">
          {ORDER_STEPS.map((step, index) => (
            <li key={step.label}>
              <Reveal delay={index * 80} duration={800}>
                <div className="grid grid-cols-[2.75rem_1fr] items-baseline gap-x-4 border-b border-ink/10 py-8 sm:grid-cols-[3.5rem_1fr] sm:gap-x-5">
                  <span className="numeral text-[2rem] text-moss sm:text-[2.5rem]">
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-[0.7rem] uppercase tracking-[0.16em] text-moss">
                      {step.label}
                    </p>
                    <h3 className="mt-2 font-display text-[1.5rem] leading-tight sm:text-[1.75rem]">
                      {step.heading}
                    </h3>
                    <p className="mt-2 max-w-md text-[0.95rem] leading-relaxed text-ink-soft">
                      {step.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      {/* ── The shop, in photographs ─────────────────────────── */}
      <section className="mx-auto max-w-[1180px] px-6 pb-4">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          <Reveal motion="scale" delay={0} duration={1100}>
            <PhotoSlot
              slug="storefront-wide"
              label="The shop from across Sycamore Street"
              className="aspect-[3/4] w-full"
              sizes="(min-width: 1024px) 33vw, 50vw"
            />
          </Reveal>
          <Reveal motion="scale" delay={120} duration={1100}>
            <PhotoSlot
              slug="roses-green-trick"
              label="Roses and green trick in the cooler"
              className="aspect-[3/4] w-full"
              sizes="(min-width: 1024px) 33vw, 50vw"
            />
          </Reveal>
          <Reveal
            motion="scale"
            delay={240}
            duration={1100}
            className="col-span-2 lg:col-span-1"
          >
            <PhotoSlot
              slug="succulent-patio"
              label="The succulent tables out back"
              className="aspect-[3/4] w-full"
              sizes="(min-width: 1024px) 33vw, 100vw"
            />
          </Reveal>
        </div>
      </section>

      {/* ── Services ─────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1180px] px-6 py-20 sm:py-24">
        <h2 className="max-w-3xl font-display text-[2.25rem] leading-[1.05] tracking-tight sm:text-[2.75rem]">
          Weddings, sympathy work and everyday flowers in Newtown.
        </h2>
        <ul className="mt-10">
          {SERVICES.map((service, index) => (
            <li key={service.slug}>
              <Reveal delay={index * 70} duration={800}>
                <div className="grid gap-2 border-t hairline py-6 sm:grid-cols-[minmax(0,16rem)_1fr] sm:gap-10">
                  <h3 className="font-display text-[1.6rem] leading-tight">
                    {service.name}
                  </h3>
                  <p className="max-w-2xl leading-relaxed text-ink-soft">
                    {service.blurb}
                  </p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      {/* ── The art ──────────────────────────────────────────── */}
      <section className="border-t hairline bg-paper-warm">
        <div className="mx-auto max-w-[1180px] px-6 py-20 sm:py-24">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p className="text-[0.7rem] uppercase tracking-[0.16em] text-muted">
                Also in the shop
              </p>
              <h2 className="mt-5 font-display text-[2.5rem] leading-[1.0] tracking-[-0.02em] sm:text-[3.25rem]">
                The canvases
                <br />
                are his too.
              </h2>
            </div>
            <div className="lg:col-span-6 lg:col-start-7 lg:pt-4">
              {ART_PARAGRAPHS.map((para) => (
                <p
                  key={para}
                  className="mt-5 max-w-xl text-[1.0625rem] leading-relaxed text-ink-soft first:mt-0"
                >
                  {para}
                </p>
              ))}
              <Link
                href="/about"
                className="mt-6 inline-block border-b border-forest/40 pb-0.5 text-[0.7rem] uppercase tracking-[0.16em] text-forest transition-colors hover:border-forest"
              >
                The whole story
              </Link>
            </div>
          </div>

          <div className="mt-14 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
            <Reveal motion="scale" delay={0} duration={1000}>
              <PhotoSlot
                slug="art-panels"
                label="Painted panels hanging in the shop"
                className="aspect-[3/4] w-full"
                sizes="(min-width: 1024px) 33vw, 50vw"
              />
            </Reveal>
            <Reveal motion="scale" delay={120} duration={1000}>
              <PhotoSlot
                slug="art-canvases"
                label="Canvases along the wood wall"
                className="aspect-[3/4] w-full"
                sizes="(min-width: 1024px) 33vw, 50vw"
              />
            </Reveal>
            <Reveal
              motion="scale"
              delay={240}
              duration={1000}
              className="col-span-2 lg:col-span-1"
            >
              <PhotoSlot
                slug="studio-interior"
                label="Inside the shop, canvases along the counter"
                className="aspect-[3/4] w-full"
                sizes="(min-width: 1024px) 33vw, 100vw"
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Come by ──────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1180px] px-6 py-20 sm:py-24">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="text-[0.7rem] uppercase tracking-[0.16em] text-muted">
              Come by
            </p>
            <h2 className="mt-4 font-display text-[2.75rem] leading-[0.98] tracking-[-0.02em] sm:text-[4rem]">
              {ADDRESS_STREET}
              <br />
              {ADDRESS_CITY}
            </h2>
          </div>
          <div className="lg:col-span-4 lg:col-start-9 lg:pt-12">
            <p className="leading-relaxed text-ink-soft">{DIRECTIONS_NOTE}</p>
            <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
              <Link
                href="/visit"
                className="border-b border-forest/40 pb-0.5 text-[0.7rem] uppercase tracking-[0.16em] text-forest transition-colors hover:border-forest"
              >
                Hours &amp; directions
              </Link>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noreferrer"
                className="border-b border-forest/40 pb-0.5 text-[0.7rem] uppercase tracking-[0.16em] text-forest transition-colors hover:border-forest"
              >
                Instagram
              </a>
            </div>
            <p className="mt-3 text-[0.8rem] text-muted">{INSTAGRAM_HANDLE}</p>
          </div>
        </div>
      </section>
    </>
  );
}
