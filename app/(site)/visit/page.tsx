import type { Metadata } from "next";
import Link from "next/link";
import { CornerDiagram } from "@/components/corner-diagram";
import {
  ADDRESS_CITY,
  ADDRESS_FULL,
  ADDRESS_STREET,
  DELIVERY,
  DIRECTIONS_NOTE,
  HOURS,
  HOURS_NOTE,
  MAP_URL,
  PAYMENT_METHODS,
  PHONE_DISPLAY,
  PHONE_TEL,
} from "@/lib/site";

export const metadata: Metadata = {
  title: "Visit & Delivery in Newtown, PA",
  alternates: { canonical: "/visit" },
  openGraph: { url: "/visit" },
  description: `One South Sycamore is the florist at ${ADDRESS_FULL}. Opening hours, local delivery, payment, and directions to the corner.`,
};

export default function VisitPage() {
  return (
    <div className="mx-auto max-w-[1180px] px-6 pt-14 pb-20 sm:pt-20">
      <header className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="text-[0.7rem] uppercase tracking-[0.16em] text-muted">
            Visit
          </p>
          <h1 className="mt-5 font-display text-[3rem] leading-[0.94] tracking-[-0.03em] sm:text-[4.5rem]">
            Corner of Washington
            <br />
            and Sycamore, Newtown.
          </h1>
        </div>
        <div className="lg:col-span-4 lg:col-start-9 lg:pt-4">
          <p className="text-[1.0625rem] leading-relaxed text-ink-soft">
            {DIRECTIONS_NOTE}
          </p>
          <a
            href={`tel:${PHONE_TEL}`}
            aria-label={`Call the shop, ${PHONE_DISPLAY}`}
            className="mt-5 inline-block font-display text-[1.9rem] leading-none tracking-tight transition-colors hover:text-forest"
          >
            {PHONE_DISPLAY}
          </a>
        </div>
      </header>

      <div className="mt-16 grid gap-12 lg:grid-cols-12 lg:items-start">
        <div className="lg:col-span-6">
          <dl className="grid gap-8 sm:grid-cols-2">
            <div className="border-t border-ink/15 pt-4">
              <dt className="text-[0.7rem] uppercase tracking-[0.16em] text-muted">
                Address
              </dt>
              <dd className="mt-2 text-sm leading-relaxed text-ink-soft">
                <a href={MAP_URL} target="_blank" rel="noreferrer" className="hover:text-ink">
                  {ADDRESS_STREET}
                  <br />
                  {ADDRESS_CITY}
                </a>
              </dd>
            </div>

            <div className="border-t border-ink/15 pt-4">
              <dt className="text-[0.7rem] uppercase tracking-[0.16em] text-muted">
                Phone
              </dt>
              <dd className="mt-2 text-sm leading-relaxed text-ink-soft">
                <a href={`tel:${PHONE_TEL}`} className="hover:text-ink">
                  {PHONE_DISPLAY}
                </a>
                <br />
                <a href={`sms:${PHONE_TEL}`} className="text-forest underline underline-offset-2">
                  Text for availability
                </a>
              </dd>
            </div>

            <div className="border-t border-ink/15 pt-4 sm:col-span-2">
              <dt className="text-[0.7rem] uppercase tracking-[0.16em] text-muted">
                Hours
              </dt>
              <dd className="mt-3">
                <ul className="grid gap-1.5">
                  {HOURS.map((row) => (
                    <li
                      key={row.days}
                      className="flex justify-between gap-6 text-sm text-ink-soft sm:max-w-sm"
                    >
                      <span>{row.days}</span>
                      <span className="text-muted">{row.time}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-xs leading-relaxed text-muted">{HOURS_NOTE}</p>
              </dd>
            </div>

            <div className="border-t border-ink/15 pt-4">
              <dt className="text-[0.7rem] uppercase tracking-[0.16em] text-muted">
                Delivery
              </dt>
              <dd className="mt-2 text-sm leading-relaxed text-ink-soft">
                Local delivery to {DELIVERY.area}.
                <br />${DELIVERY.orderMinimum} order minimum.
                <br />
                Delivery from ${DELIVERY.deliveryFrom}, based on distance.
              </dd>
            </div>

            <div className="border-t border-ink/15 pt-4">
              <dt className="text-[0.7rem] uppercase tracking-[0.16em] text-muted">
                Payment
              </dt>
              <dd className="mt-2 text-sm leading-relaxed text-ink-soft">
                {PAYMENT_METHODS.join(", ")}.
                <br />
                Paid at the shop or on delivery. There&rsquo;s no checkout online.
              </dd>
            </div>
          </dl>

          <div className="mt-10 border-t hairline pt-8">
            <p className="leading-relaxed text-ink-soft">
              For a wedding, a corporate account, or anything with a lot of
              detail, it is easier to write it down.
            </p>
            <Link
              href="/contact"
              className="mt-4 inline-block border-b border-forest/40 pb-0.5 text-[0.7rem] uppercase tracking-[0.16em] text-forest transition-colors hover:border-forest"
            >
              Write to the shop
            </Link>
          </div>
        </div>

        <CornerDiagram className="lg:col-span-5 lg:col-start-8" />
      </div>
    </div>
  );
}
