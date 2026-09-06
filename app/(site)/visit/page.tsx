import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { PhotoSlot } from "@/components/photo-slot";
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
  title: "Visit & Delivery",
  description: `V Flowers is at ${ADDRESS_FULL} — hours, local delivery, payment, and directions.`,
};

export default function VisitPage() {
  return (
    <div className="mx-auto max-w-[1120px] px-6 pt-16 pb-8 sm:pt-24">
      <header className="max-w-2xl">
        <p className="eyebrow">Visit</p>
        <h1 className="mt-5 font-display text-[2.5rem] leading-[1.08] tracking-tight sm:text-5xl">
          On the corner of Washington and Sycamore.
        </h1>
        <p className="mt-6 text-[1.0625rem] leading-relaxed text-ink-soft">
          {DIRECTIONS_NOTE}
        </p>
      </header>

      <div className="mt-14 grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-start">
        <div>
          <dl className="grid gap-8 sm:grid-cols-2">
            <div className="border-t hairline pt-4">
              <dt className="eyebrow">Address</dt>
              <dd className="mt-2 text-sm leading-relaxed text-ink-soft">
                <a href={MAP_URL} target="_blank" rel="noreferrer" className="hover:text-ink">
                  {ADDRESS_STREET}
                  <br />
                  {ADDRESS_CITY}
                </a>
              </dd>
            </div>

            <div className="border-t hairline pt-4">
              <dt className="eyebrow">Phone</dt>
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

            <div className="border-t hairline pt-4 sm:col-span-2">
              <dt className="eyebrow">Hours</dt>
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

            <div className="border-t hairline pt-4">
              <dt className="eyebrow">Delivery</dt>
              <dd className="mt-2 text-sm leading-relaxed text-ink-soft">
                Local delivery to {DELIVERY.area}.
                <br />${DELIVERY.orderMinimum} order minimum.
                <br />
                Delivery from ${DELIVERY.deliveryFrom}, based on distance.
              </dd>
            </div>

            <div className="border-t hairline pt-4">
              <dt className="eyebrow">Payment</dt>
              <dd className="mt-2 text-sm leading-relaxed text-ink-soft">
                {PAYMENT_METHODS.join(", ")}.
                <br />
                Paid at the shop or on delivery — there&rsquo;s no checkout online.
              </dd>
            </div>
          </dl>

          <PhotoSlot
            label="Storefront — corner of Washington & Sycamore"
            className="mt-10 aspect-[4/3] w-full rounded-sm"
          />
        </div>

        <div className="rounded-sm bg-paper-warm p-8 sm:p-10">
          <h2 className="font-display text-3xl leading-tight">Send the shop a note</h2>
          <p className="mt-3 mb-8 leading-relaxed text-ink-soft">
            For weddings, corporate accounts, or anything you&rsquo;d rather write out
            than explain on the phone.
          </p>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
