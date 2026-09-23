import Link from "next/link";
import { JourneySection } from "@/components/journey-section";
import { PhotoSlot } from "@/components/photo-slot";
import { DEFAULT_BOARD, SERVICES } from "@/lib/content";
import {
  ADDRESS_CITY,
  ADDRESS_STREET,
  DIRECTIONS_NOTE,
  HOURS_NOTE,
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
  PHONE_DISPLAY,
  PHONE_TEL,
} from "@/lib/site";

/** How Vince actually sells — observed at the shop, not invented. */
const HOW_IT_GOES = [
  {
    step: "First",
    text: "You tell him who it's for and what the occasion is. That's the whole brief.",
  },
  {
    step: "Then",
    text: "He walks you back to the cooler and shows you what came in — what's open, what's tight, what's going to last.",
  },
  {
    step: "After that",
    text: "He builds it in front of you and tells you what it runs. Nothing is priced before it exists.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* ── Lede ─────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1180px] px-6">
        <div className="grid gap-10 pt-14 pb-12 lg:grid-cols-12 lg:gap-8 lg:pt-20">
          <h1 className="font-display text-[3.5rem] leading-[0.92] tracking-[-0.03em] sm:text-[5.5rem] lg:col-span-7 lg:text-[6.25rem]">
            No set menu.
            <br />
            Just what&rsquo;s
            <br />
            <span className="text-forest">beautiful today.</span>
          </h1>

          <div className="lg:col-span-4 lg:col-start-9 lg:pt-3">
            <p className="text-[1.0625rem] leading-relaxed text-ink-soft">
              V Flowers is one man, one cooler, and whatever was cut this week on
              the other side of the world. There&rsquo;s no catalog to scroll —
              you tell Vince the occasion and he builds it in front of you.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
              <a
                href={`tel:${PHONE_TEL}`}
                className="font-display text-[1.75rem] leading-none tracking-tight hover:text-forest"
              >
                {PHONE_DISPLAY}
              </a>
              <a
                href={`sms:${PHONE_TEL}`}
                className="border-b border-forest/40 pb-0.5 text-[0.7rem] uppercase tracking-[0.16em] text-forest hover:border-forest"
              >
                or text
              </a>
            </div>
            <p className="mt-3 text-[0.8rem] leading-relaxed text-muted">
              {HOURS_NOTE}
            </p>
          </div>
        </div>

        {/* Three portraits: the photographs are all 3:4, so the page is
            built around that rather than cropping them into wide bands. */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          <PhotoSlot
            slug="storefront-wide"
            label="The shop from across Sycamore Street"
            className="aspect-[3/4] w-full"
            sizes="(min-width: 1024px) 33vw, 50vw"
            priority
          />
          <PhotoSlot
            slug="roses-green-trick"
            label="Roses and green trick in the cooler"
            className="aspect-[3/4] w-full"
            sizes="(min-width: 1024px) 33vw, 50vw"
            priority
          />
          <PhotoSlot
            slug="succulent-patio"
            label="The succulent tables out back"
            className="col-span-2 aspect-[3/4] w-full lg:col-span-1"
            sizes="(min-width: 1024px) 33vw, 100vw"
          />
        </div>
      </section>

      <JourneySection />

      {/* ── The board ────────────────────────────────────────── */}
      {/* Light on purpose: the globe section above it is already a dark
          field, and two in a row read as one undifferentiated slab. The
          dedicated /board page is where the dark menu board lives. */}
      <section className="mx-auto max-w-[1180px] px-6 py-20 sm:py-24">
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-ink/15 pb-8">
          <div>
            <p className="text-[0.7rem] uppercase tracking-[0.16em] text-muted">
              The board
            </p>
            <h2 className="mt-4 font-display text-[2.5rem] leading-[1.0] tracking-[-0.02em] sm:text-[3.25rem]">
              Six places to start.
            </h2>
          </div>
          <Link
            href="/board"
            className="border-b border-forest/40 pb-0.5 text-[0.7rem] uppercase tracking-[0.16em] text-forest transition-colors hover:border-forest"
          >
            The whole board
          </Link>
        </div>

        {/* Numeral hangs in the margin; the description sits directly under
            its own name instead of in a far-off third column. */}
        <ol className="grid sm:grid-cols-2 sm:gap-x-12">
          {DEFAULT_BOARD.slice(0, 6).map((item) => (
            <li
              key={item.number}
              className="grid grid-cols-[2.75rem_1fr] items-baseline gap-x-4 border-b border-ink/10 py-7 sm:grid-cols-[3.5rem_1fr] sm:gap-x-5"
            >
              <span className="numeral text-[2rem] text-moss sm:text-[2.5rem]">
                {item.number}
              </span>
              <div>
                <h3 className="font-display text-[1.5rem] leading-tight sm:text-[1.75rem]">
                  {item.name}
                </h3>
                <p className="mt-1.5 max-w-md text-[0.95rem] leading-relaxed text-ink-soft">
                  {item.description}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <p className="mt-8 max-w-xl text-[0.9rem] leading-relaxed text-muted">
          Prices depend on the day, the stems, and the size. Call and Vince will
          tell you exactly what it runs.
        </p>
      </section>

      {/* ── How it goes ──────────────────────────────────────── */}
      <section className="mx-auto max-w-[1180px] px-6 py-20 sm:py-24">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="text-[0.7rem] uppercase tracking-[0.16em] text-muted">
              Walking in
            </p>
            <h2 className="mt-4 font-display text-[2.25rem] leading-[1.05] tracking-tight sm:text-[2.75rem]">
              It works like a conversation, not a checkout.
            </h2>
          </div>

          <dl className="lg:col-span-7 lg:col-start-6">
            {HOW_IT_GOES.map((row) => (
              <div
                key={row.step}
                className="grid gap-2 border-t hairline py-6 sm:grid-cols-[8rem_1fr] sm:gap-8"
              >
                <dt className="text-[0.7rem] uppercase tracking-[0.16em] text-moss">
                  {row.step}
                </dt>
                <dd className="text-[1.0625rem] leading-relaxed text-ink-soft">
                  {row.text}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── What he does ─────────────────────────────────────── */}
      <section className="mx-auto max-w-[1180px] px-6 py-20 sm:py-24">
        <p className="text-[0.7rem] uppercase tracking-[0.16em] text-muted">
          What he does
        </p>
        <ul className="mt-10">
          {SERVICES.map((service) => (
            <li
              key={service.slug}
              className="grid gap-2 border-t hairline py-6 sm:grid-cols-[minmax(0,16rem)_1fr] sm:gap-10"
            >
              <h3 className="font-display text-[1.6rem] leading-tight">
                {service.name}
              </h3>
              <p className="max-w-2xl leading-relaxed text-ink-soft">
                {service.blurb}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Recent work ──────────────────────────────────────── */}
      <section className="border-t hairline bg-paper-warm">
        <div className="mx-auto max-w-[1180px] px-6 py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display text-[2.25rem] leading-[1.05] tracking-tight sm:text-[2.75rem]">
              A different shop every morning.
            </h2>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noreferrer"
              className="border-b border-forest/40 pb-0.5 text-[0.7rem] uppercase tracking-[0.16em] text-forest hover:border-forest"
            >
              Follow {INSTAGRAM_HANDLE}
            </a>
          </div>

          {/* Uneven plates — a contact sheet, not a grid of equal squares. */}
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            <PhotoSlot
              slug="roses-hellebore"
              label="Coral roses and hellebore"
              className="aspect-[3/4] w-full"
              sizes="(min-width: 640px) 25vw, 50vw"
            />
            <PhotoSlot
              slug="cooler-doors"
              label="The cooler"
              className="mt-8 aspect-[3/4] w-full"
              sizes="(min-width: 640px) 25vw, 50vw"
            />
            <PhotoSlot
              slug="storefront-front"
              label="The front of the shop"
              className="aspect-[3/4] w-full"
              sizes="(min-width: 640px) 25vw, 50vw"
            />
            <PhotoSlot
              slug="studio-interior"
              label="Inside the shop"
              className="mt-8 aspect-[3/4] w-full"
              sizes="(min-width: 640px) 25vw, 50vw"
            />
          </div>

          <Link
            href="/gallery"
            className="mt-10 inline-block border-b border-forest/40 pb-0.5 text-[0.7rem] uppercase tracking-[0.16em] text-forest hover:border-forest"
          >
            See the gallery
          </Link>
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
            <Link
              href="/visit"
              className="mt-6 inline-block border-b border-forest/40 pb-0.5 text-[0.7rem] uppercase tracking-[0.16em] text-forest hover:border-forest"
            >
              Hours, delivery &amp; directions
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
