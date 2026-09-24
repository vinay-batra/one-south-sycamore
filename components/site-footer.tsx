import Link from "next/link";
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
  SITE_NAME,
} from "@/lib/site";

const PAGES = [
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
  { href: "/visit", label: "Visit & Delivery" },
  { href: "/contact", label: "Write to the shop" },
];

/**
 * Four columns of the same weight, and nothing the masthead already says.
 *
 * There used to be a sign-off row above these carrying the shop name, the
 * logo and the phone at display size. All three are at the top of every
 * page, so it read as a repeat rather than a close.
 */
export function SiteFooter() {
  return (
    /* pb on mobile clears the fixed call strip. */
    <footer className="border-t-[3px] border-ink bg-paper-warm pb-14 sm:pb-0">
      <div className="mx-auto max-w-[1180px] px-6">
        <div className="grid gap-x-8 gap-y-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
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
              Instagram
              <span className="block text-xs text-muted">{INSTAGRAM_HANDLE}</span>
            </a>
          </div>

          <div>
            <p className="text-[0.7rem] uppercase tracking-[0.16em] text-muted">
              Hours
            </p>
            {/* A fixed column for the days rather than justify-between, which
                stretched this block to the full grid track and made the four
                columns look unevenly filled. */}
            <ul className="mt-4 space-y-2">
              {HOURS.map((row) => (
                <li key={row.days} className="flex gap-3 text-sm text-ink-soft">
                  <span className="w-[7.25rem] shrink-0 whitespace-nowrap">{row.days}</span>
                  <span className="text-muted">{row.time}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 max-w-[15rem] text-xs leading-relaxed text-muted">
              {HOURS_NOTE}
            </p>
          </div>

          <div>
            <p className="text-[0.7rem] uppercase tracking-[0.16em] text-muted">
              Delivery &amp; payment
            </p>
            <p className="mt-4 max-w-[15rem] text-sm leading-relaxed text-ink-soft">
              Local delivery to {DELIVERY.area}.
              <br />${DELIVERY.orderMinimum} minimum, delivery from $
              {DELIVERY.deliveryFrom}.
            </p>
            <p className="mt-3 max-w-[15rem] text-sm leading-relaxed text-ink-soft">
              {PAYMENT_METHODS.join(" · ")}
            </p>
          </div>

          <div>
            <p className="text-[0.7rem] uppercase tracking-[0.16em] text-muted">
              Pages
            </p>
            <nav aria-label="Footer" className="mt-4 flex flex-col gap-2">
              {PAGES.map((page) => (
                <Link
                  key={page.href}
                  href={page.href}
                  className="text-sm text-ink-soft transition-colors hover:text-ink"
                >
                  {page.label}
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
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <p>
              Designed by{" "}
              <a
                href="https://vinaybatra.org"
                target="_blank"
                rel="noreferrer"
                className="text-ink-soft underline underline-offset-2 transition-colors hover:text-ink"
              >
                Vinay Batra
              </a>
            </p>
            <Link href="/privacy" className="transition-colors hover:text-ink-soft">
              Privacy
            </Link>
            <Link href="/admin" rel="nofollow" className="transition-colors hover:text-ink-soft">
              Shop login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
