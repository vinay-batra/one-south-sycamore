import Link from "next/link";
import { PhotoSlot } from "@/components/photo-slot";
import { DEFAULT_BOARD, SERVICES, SOURCING_PARAGRAPHS } from "@/lib/content";
import {
  ADDRESS_CITY,
  ADDRESS_STREET,
  DELIVERY,
  DIRECTIONS_NOTE,
  HOURS_NOTE,
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
  PHONE_DISPLAY,
  PHONE_TEL,
  SITE_TAGLINE,
} from "@/lib/site";

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-[1120px] px-6 pt-16 pb-20 sm:pt-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr]">
          <div>
            <p className="eyebrow">Newtown, Pennsylvania</p>
            <h1 className="mt-5 font-display text-[2.75rem] leading-[1.05] tracking-tight sm:text-6xl">
              {SITE_TAGLINE}
            </h1>
            <p className="mt-6 max-w-xl text-[1.0625rem] leading-relaxed text-ink-soft">
              V Flowers is a hand-arranged flower shop on the corner of Washington
              and Sycamore. There&rsquo;s no catalog to scroll — you tell Vince the
              occasion, he walks you through what came in that morning, and builds
              it in front of you.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href={`tel:${PHONE_TEL}`}
                className="rounded-full bg-forest px-6 py-3 text-sm text-paper transition-opacity hover:opacity-90"
              >
                Call {PHONE_DISPLAY}
              </a>
              <a
                href={`sms:${PHONE_TEL}`}
                className="rounded-full border border-forest/25 px-6 py-3 text-sm text-forest transition-colors hover:bg-sage"
              >
                Text for availability
              </a>
            </div>
            <p className="mt-4 text-sm text-muted">{HOURS_NOTE}</p>
          </div>

          <PhotoSlot
            label="Hero — the shop front or a wrapped arrangement"
            className="aspect-[4/5] w-full rounded-sm"
            priority
          />
        </div>
      </section>

      {/* Sourcing */}
      <section className="border-y hairline bg-paper-warm">
        <div className="mx-auto grid max-w-[1120px] gap-12 px-6 py-20 lg:grid-cols-[1fr_1.05fr] lg:items-center">
          <PhotoSlot
            label="Buckets of fresh stems in the cooler"
            className="aspect-[5/4] w-full rounded-sm"
          />
          <div>
            <p className="eyebrow">Where the flowers come from</p>
            <h2 className="mt-4 font-display text-3xl leading-tight sm:text-4xl">
              Field-cut a world away. On Sycamore Street this week.
            </h2>
            {SOURCING_PARAGRAPHS.map((para) => (
              <p key={para} className="mt-4 leading-relaxed text-ink-soft">
                {para}
              </p>
            ))}
            <ul className="mt-7 flex flex-wrap gap-2">
              {["New Zealand", "Japan", "South America", "Kenya"].map((origin) => (
                <li
                  key={origin}
                  className="rounded-full border border-forest/15 bg-paper px-3.5 py-1.5 text-xs tracking-wide text-forest"
                >
                  {origin}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Board preview */}
      <section className="mx-auto max-w-[1120px] px-6 py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">The board</p>
            <h2 className="mt-4 font-display text-3xl leading-tight sm:text-4xl">
              Order by number, or just describe the person.
            </h2>
          </div>
          <Link
            href="/board"
            className="text-sm text-forest underline underline-offset-4 hover:text-ink"
          >
            See the whole board
          </Link>
        </div>

        <ol className="mt-10 grid gap-px overflow-hidden rounded-sm bg-line sm:grid-cols-2 lg:grid-cols-3">
          {DEFAULT_BOARD.slice(0, 6).map((item) => (
            <li key={item.number} className="bg-paper p-6">
              <span className="font-display text-2xl text-moss">
                #{item.number}
              </span>
              <h3 className="mt-2 text-base font-medium">{item.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                {item.description}
              </p>
            </li>
          ))}
        </ol>

        <p className="mt-6 text-sm text-muted">
          Prices depend on the day, the stems, and the size — call and Vince will
          tell you exactly what it runs.
        </p>
      </section>

      {/* Services */}
      <section className="border-t hairline">
        <div className="mx-auto max-w-[1120px] px-6 py-20">
          <p className="eyebrow">What he does</p>
          <div className="mt-8 grid gap-x-12 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map((service) => (
              <div key={service.slug}>
                <h3 className="font-display text-xl">{service.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {service.blurb}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery teaser */}
      <section className="border-t hairline bg-paper-warm">
        <div className="mx-auto max-w-[1120px] px-6 py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Recent work</p>
              <h2 className="mt-4 font-display text-3xl leading-tight sm:text-4xl">
                A different shop every morning.
              </h2>
            </div>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-forest underline underline-offset-4 hover:text-ink"
            >
              Follow {INSTAGRAM_HANDLE}
            </a>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {["Arrangement", "Wedding work", "Succulents", "Inside the shop"].map(
              (label) => (
                <PhotoSlot
                  key={label}
                  label={label}
                  className="aspect-square w-full rounded-sm"
                />
              ),
            )}
          </div>

          <Link
            href="/gallery"
            className="mt-8 inline-block text-sm text-forest underline underline-offset-4 hover:text-ink"
          >
            See the gallery
          </Link>
        </div>
      </section>

      {/* Visit */}
      <section className="mx-auto max-w-[1120px] px-6 py-20">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr]">
          <div>
            <p className="eyebrow">Come by</p>
            <h2 className="mt-4 font-display text-3xl leading-tight sm:text-4xl">
              {ADDRESS_STREET}
              <br />
              {ADDRESS_CITY}
            </h2>
            <p className="mt-5 leading-relaxed text-ink-soft">{DIRECTIONS_NOTE}</p>
            <Link
              href="/visit"
              className="mt-6 inline-block rounded-full border border-forest/25 px-6 py-3 text-sm text-forest transition-colors hover:bg-sage"
            >
              Hours, delivery & directions
            </Link>
          </div>

          <dl className="grid gap-6 sm:grid-cols-2">
            <div className="border-t hairline pt-4">
              <dt className="eyebrow">Delivery</dt>
              <dd className="mt-2 text-sm leading-relaxed text-ink-soft">
                Local delivery to {DELIVERY.area}. ${DELIVERY.orderMinimum} order
                minimum, delivery from ${DELIVERY.deliveryFrom}.
              </dd>
            </div>
            <div className="border-t hairline pt-4">
              <dt className="eyebrow">Payment</dt>
              <dd className="mt-2 text-sm leading-relaxed text-ink-soft">
                Cash, card, Apple Pay, and Venmo.
              </dd>
            </div>
            <div className="border-t hairline pt-4">
              <dt className="eyebrow">Custom orders</dt>
              <dd className="mt-2 text-sm leading-relaxed text-ink-soft">
                Weddings, sympathy, and corporate standing orders — call or text to
                talk it through.
              </dd>
            </div>
            <div className="border-t hairline pt-4">
              <dt className="eyebrow">Availability</dt>
              <dd className="mt-2 text-sm leading-relaxed text-ink-soft">
                Inventory turns over daily. Text{" "}
                <a href={`sms:${PHONE_TEL}`} className="text-forest underline underline-offset-2">
                  {PHONE_DISPLAY}
                </a>{" "}
                to check what&rsquo;s in.
              </dd>
            </div>
          </dl>
        </div>
      </section>
    </>
  );
}
