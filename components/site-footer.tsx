import Link from "next/link";
import { LogoMark } from "@/components/logo";
import {
  ADDRESS_CITY,
  ADDRESS_STREET,
  HOURS,
  HOURS_NOTE,
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
  MAP_URL,
  PAYMENT_METHODS,
  PHONE_DISPLAY,
  PHONE_TEL,
  SITE_NAME,
} from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t hairline bg-paper-warm">
      <div className="mx-auto grid max-w-[1120px] gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <LogoMark className="h-6 w-6 text-forest" />
          <p className="mt-3 font-display text-lg">{SITE_NAME}</p>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            Fresh flowers, arranged by hand, in the center of Newtown.
          </p>
        </div>

        <div>
          <p className="eyebrow">Visit</p>
          <a
            href={MAP_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-3 block text-sm leading-relaxed text-ink-soft transition-colors hover:text-ink"
          >
            {ADDRESS_STREET}
            <br />
            {ADDRESS_CITY}
          </a>
          <a
            href={`tel:${PHONE_TEL}`}
            className="mt-3 block text-sm text-ink-soft transition-colors hover:text-ink"
          >
            {PHONE_DISPLAY}
          </a>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-1 block text-sm text-ink-soft transition-colors hover:text-ink"
          >
            {INSTAGRAM_HANDLE}
          </a>
        </div>

        <div>
          <p className="eyebrow">Hours</p>
          <ul className="mt-3 space-y-1">
            {HOURS.map((row) => (
              <li key={row.days} className="text-sm text-ink-soft">
                <span className="block">{row.days}</span>
                <span className="block text-muted">{row.time}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs leading-relaxed text-muted">{HOURS_NOTE}</p>
        </div>

        <div>
          <p className="eyebrow">Payment</p>
          <p className="mt-3 text-sm text-ink-soft">{PAYMENT_METHODS.join(" · ")}</p>
          <nav className="mt-6 flex flex-col gap-1">
            <Link href="/board" className="text-sm text-ink-soft hover:text-ink">
              The Board
            </Link>
            <Link href="/gallery" className="text-sm text-ink-soft hover:text-ink">
              Gallery
            </Link>
            <Link href="/about" className="text-sm text-ink-soft hover:text-ink">
              About
            </Link>
            <Link href="/visit" className="text-sm text-ink-soft hover:text-ink">
              Visit & Delivery
            </Link>
          </nav>
        </div>
      </div>

      <div className="border-t hairline">
        <div className="mx-auto flex max-w-[1120px] flex-col gap-2 px-6 py-5 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
          </p>
          <Link href="/admin" className="transition-colors hover:text-ink-soft">
            Shop login
          </Link>
        </div>
      </div>
    </footer>
  );
}
