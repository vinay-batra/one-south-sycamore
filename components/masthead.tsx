"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LogoMark } from "@/components/logo";
import {
  ADDRESS_CITY,
  ADDRESS_STREET,
  PHONE_DISPLAY,
  PHONE_TEL,
} from "@/lib/site";

const LINKS = [
  { href: "/board", label: "The Board" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
  { href: "/visit", label: "Visit" },
];

/**
 * A printed masthead, not a sticky app bar, and deliberately different from the
 * translucent top bar pattern. It sits at the top of the page and scrolls
 * away; the phone stays reachable through the fixed strip on small screens.
 *
 * Front page gets the full masthead, interior pages a compressed folio, the
 * way a paper does it.
 */
export function Masthead() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isHome = pathname === "/";

  return (
    <header className="masthead-in border-t-[3px] border-ink bg-paper">
      <div className="mx-auto max-w-[1180px] px-6">
        <div
          className={`flex items-start justify-between gap-6 ${
            isHome ? "pt-7 pb-6 sm:pt-9" : "pt-5 pb-4"
          }`}
        >
          <Link href="/" aria-label="One South Sycamore, home" className="group block">
            <span className="flex items-center gap-3">
              <LogoMark
                className={`shrink-0 text-forest transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-rotate-6 ${
                  isHome ? "h-8 w-8 sm:h-10 sm:w-10" : "h-6 w-6 sm:h-7 sm:w-7"
                }`}
              />
              <span
                className={`font-display leading-[0.92] tracking-[-0.02em] ${
                  isHome
                    ? "text-[2rem] sm:text-[2.9rem] lg:text-[3.4rem]"
                    : "text-[1.4rem] sm:text-[1.8rem]"
                }`}
              >
                One South Sycamore
              </span>
            </span>
            {isHome && (
              <span className="mt-2.5 block text-[0.7rem] uppercase tracking-[0.2em] text-muted">
                Cut fresh · Arranged by hand · Twenty-five years
              </span>
            )}
          </Link>

          {/* Address block, set like a dateline. */}
          <div className="hidden shrink-0 pt-1 text-right text-[0.78rem] leading-relaxed text-ink-soft sm:block">
            <p>{ADDRESS_STREET}</p>
            <p>{ADDRESS_CITY}</p>
            <a
              href={`tel:${PHONE_TEL}`}
              className="mt-1 inline-block font-display text-[1.35rem] tracking-tight text-ink hover:text-forest"
            >
              {PHONE_DISPLAY}
            </a>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label="Toggle menu"
            className="-mr-1 shrink-0 self-center p-1 sm:hidden"
          >
            <span className="relative block h-3.5 w-6">
              <span
                className={`absolute left-0 block h-[1.5px] w-6 bg-ink transition-transform ${
                  open ? "top-[7px] rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 block h-[1.5px] w-6 bg-ink transition-transform ${
                  open ? "top-[7px] -rotate-45" : "top-[13px]"
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Double rule, the masthead's signature. It draws itself across on
          first paint, the way a press sheet is ruled. */}
      <div className="rule-in border-t border-ink/25" />
      <div className="rule-in border-t border-ink/25 pt-[3px]">
        <div className="mx-auto max-w-[1180px] px-6">
          <nav className="hidden items-center justify-between py-2.5 sm:flex">
            <ul className="flex items-center gap-9">
              {LINKS.map((link) => {
                const active = pathname === link.href;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`group/nav block text-[0.7rem] uppercase tracking-[0.16em] transition-colors hover:text-ink ${
                        active ? "text-ink" : "text-ink-soft"
                      }`}
                    >
                      {link.label}
                      <span
                        className={`mt-1 block h-px origin-left bg-forest transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/nav:scale-x-100 ${
                          active ? "scale-x-100" : "scale-x-0"
                        }`}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
            <p className="text-[0.7rem] uppercase tracking-[0.16em] text-muted">
              The inventory changes daily. Call ahead.
            </p>
          </nav>
        </div>
      </div>

      {open && (
        <nav className="border-t border-ink/15 bg-paper-warm sm:hidden">
          <ul className="mx-auto max-w-[1180px] divide-y divide-ink/10 px-6">
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block py-3.5 font-display text-2xl"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="py-3.5 text-[0.78rem] leading-relaxed text-ink-soft">
              {ADDRESS_STREET}, {ADDRESS_CITY}
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}

/**
 * Phone-order shop: the number has to stay within reach on mobile, where
 * the masthead has scrolled off. Bottom edge, so it isn't the top-bar
 * pattern in disguise.
 */
export function CallStrip() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-2 border-t border-ink/15 bg-paper/95 backdrop-blur-sm sm:hidden">
      <a
        href={`tel:${PHONE_TEL}`}
        className="border-r border-ink/10 py-3.5 text-center text-[0.7rem] uppercase tracking-[0.16em] text-ink"
      >
        Call the shop
      </a>
      <a
        href={`sms:${PHONE_TEL}`}
        className="py-3.5 text-center text-[0.7rem] uppercase tracking-[0.16em] text-ink"
      >
        Text
      </a>
    </div>
  );
}
