import Link from "next/link";
import { LogoMark } from "@/components/logo";
import {
  ADDRESS_CITY,
  ADDRESS_STREET,
  DELIVERY,
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

const COLUMNS = [
  { href: "/board", label: "The Board" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
  { href: "/visit", label: "Visit & Delivery" },
];

export function SiteFooter() {
  return (
    /* pb on mobile clears the fixed call strip. */
    <footer className="border-t-[3px] border-ink bg-paper-warm pb-14 sm:pb-0">
      <div className="mx-auto max-w-[1180px] px-6">
        {/* Sign-off line: the shop's name at size, the way it sits on the window. */}
        <div className="flex flex-wrap items-end justify-between gap-6 py-12">
          <div className="flex items-center gap-4">
            <LogoMark className="h-10 w-10 shrink-0 text-forest" />
            <span className="font-display text-[2.75rem] leading-none tracking-[-0.02em] sm:text-[3.5rem]">
              {SITE_NAME}
            </span>
          </div>
          <a
            href={`tel:${PHONE_TEL}`}
            className="font-display text-[2rem] leading-none tracking-tight transition-colors hover:text-forest sm:text-[2.5rem]"
          >
            {PHONE_DISPLAY}
          </a>
        </div>

        <div className="grid gap-10 border-t border-ink/15 py-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-[0.7rem] uppercase tracking-[0.16em] text-muted">
              The shop
            </p>
            <a
              href={MAP_URL}
              target="_blank"
              rel="noreferrer"
              className="mt-4 block text-sm leading-relaxed text-ink-soft transition-colors hover:text-ink"
            >
              {ADDRESS_STREET}
              <br />
              {ADDRESS_CITY}
            </a>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-block text-sm text-ink-soft transition-colors hover:text-ink"
            >
              {INSTAGRAM_HANDLE}
            </a>
          </div>

          <div>
            <p className="text-[0.7rem] uppercase tracking-[0.16em] text-muted">
              Hours
            </p>
            <ul className="mt-4 space-y-2">
              {HOURS.map((row) => (
                <li
                  key={row.days}
                  className="flex justify-between gap-4 text-sm text-ink-soft"
                >
                  <span>{row.days}</span>
                  <span className="text-muted">{row.time}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs leading-relaxed text-muted">{HOURS_NOTE}</p>
          </div>

          <div>
            <p className="text-[0.7rem] uppercase tracking-[0.16em] text-muted">
              Delivery &amp; payment
            </p>
            <p className="mt-4 text-sm leading-relaxed text-ink-soft">
              Local delivery to {DELIVERY.area}.
              <br />${DELIVERY.orderMinimum} minimum, delivery from $
              {DELIVERY.deliveryFrom}.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              {PAYMENT_METHODS.join(" · ")}
            </p>
          </div>

          <div>
            <p className="text-[0.7rem] uppercase tracking-[0.16em] text-muted">
              Pages
            </p>
            <nav className="mt-4 flex flex-col gap-2">
              {COLUMNS.map((column) => (
                <Link
                  key={column.href}
                  href={column.href}
                  className="text-sm text-ink-soft transition-colors hover:text-ink"
                >
                  {column.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      <div className="border-t border-ink/15">
        <div className="mx-auto flex max-w-[1180px] flex-col gap-2 px-6 py-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {SITE_NAME} · {ADDRESS_STREET},{" "}
            {ADDRESS_CITY}
          </p>
          <Link href="/admin" className="transition-colors hover:text-ink-soft">
            Shop login
          </Link>
        </div>
      </div>
    </footer>
  );
}
