import type { Metadata } from "next";
import Link from "next/link";
import { LogoMark } from "@/components/logo";
import { PHONE_DISPLAY, PHONE_TEL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-[1180px] flex-col justify-center px-6 py-20">
      <LogoMark className="h-10 w-10 text-forest" />
      <p className="mt-8 text-[0.7rem] uppercase tracking-[0.16em] text-muted">
        Page not found
      </p>
      <h1 className="mt-5 font-display text-[3rem] leading-[0.94] tracking-[-0.03em] sm:text-[4.5rem]">
        That one&rsquo;s not
        <br />
        in the cooler.
      </h1>
      <p className="mt-6 max-w-md leading-relaxed text-ink-soft">
        The page you were after doesn&rsquo;t exist. The flowers still do. Call the
        shop, or start again from the front.
      </p>
      <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
        <Link
          href="/"
          className="border-b border-forest/40 pb-0.5 text-[0.7rem] uppercase tracking-[0.16em] text-forest hover:border-forest"
        >
          Back to the shop
        </Link>
        <a
          href={`tel:${PHONE_TEL}`}
          className="font-display text-[1.75rem] leading-none tracking-tight hover:text-forest"
        >
          {PHONE_DISPLAY}
        </a>
      </div>
    </main>
  );
}
