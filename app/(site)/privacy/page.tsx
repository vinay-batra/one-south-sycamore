import type { Metadata } from "next";
import Link from "next/link";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL, PHONE_DISPLAY, PHONE_TEL, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy",
  alternates: { canonical: "/privacy" },
  openGraph: { url: "/privacy" },
  description: `What ${SITE_NAME} does with your details. Short version: this website collects nothing, because there is nothing on it to fill in.`,
};

/**
 * Written against what this site actually does, rather than from a
 * template. It claims no cookie banner, no analytics and no third-party
 * sharing because there genuinely are none; if any of that changes, this
 * page has to change with it.
 */
const SECTIONS = [
  {
    heading: "This site collects nothing",
    body: [
      "There is no form here, no sign-up, no account, and no email address to give. The only way to reach the shop is to call or text Vince, and that is an ordinary phone call on his own phone. Nothing about it passes through this website.",
      "So there is no database of customers, nothing stored, and nothing to sell or share even if anyone wanted to.",
    ],
  },
  {
    heading: "There is no tracking on this site",
    body: [
      "No analytics, no advertising pixels, no third-party scripts watching what you do here. That is why you were not asked to accept cookies: there are none to accept.",
      "The one cookie this site can set belongs to the shop's own login, and only Vince ever sees it.",
    ],
  },
  {
    heading: "Photographs",
    body: [
      "The pictures here were taken at the shop. Following the Instagram link takes you to Instagram, which does its own tracking once you are there, the same as any link off this site.",
    ],
  },
  {
    heading: "Changing your mind",
    body: [
      "There is nothing to undo. No account to close, no list to come off, nothing on file. If you called or texted, that conversation lives on Vince's phone and nowhere else.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-[1180px] px-6 pt-14 pb-20 sm:pt-20">
      <header className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="text-[0.7rem] uppercase tracking-[0.16em] text-muted">Privacy</p>
          <h1 className="mt-5 font-display text-[2.75rem] leading-[0.96] tracking-[-0.03em] sm:text-[4rem]">
            Almost nothing
            <br />
            happens here.
          </h1>
        </div>
        <p className="text-[1.0625rem] leading-relaxed text-ink-soft lg:col-span-4 lg:col-start-9 lg:pt-4">
          This is a small shop&rsquo;s website. It collects what it needs to call you
          back and nothing else.
        </p>
      </header>

      <div className="mt-16 grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          {SECTIONS.map((section) => (
            <section key={section.heading} className="border-t hairline py-8 first:border-t-0 first:pt-0">
              <h2 className="font-display text-[1.6rem] leading-tight sm:text-[1.9rem]">
                {section.heading}
              </h2>
              {section.body.map((para) => (
                <p key={para} className="mt-4 max-w-2xl leading-relaxed text-ink-soft">
                  {para}
                </p>
              ))}
            </section>
          ))}
        </div>

        <aside className="lg:col-span-4 lg:col-start-9">
          <div className="border-t-[3px] border-ink bg-paper-warm p-7">
            <p className="text-[0.7rem] uppercase tracking-[0.16em] text-muted">
              Questions
            </p>
            <p className="mt-4 leading-relaxed text-ink-soft">
              Ask Vince. He is the only person who sees any of this.
            </p>
            <a
              href={`tel:${PHONE_TEL}`}
              className="mt-5 inline-block font-display text-[1.75rem] leading-none tracking-tight transition-colors hover:text-forest"
            >
              {PHONE_DISPLAY}
            </a>
            <div className="mt-5 flex flex-col gap-2">
              <Link
                href="/visit"
                className="text-[0.7rem] uppercase tracking-[0.16em] text-forest"
              >
                Hours and directions
              </Link>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noreferrer"
                className="text-[0.7rem] uppercase tracking-[0.16em] text-forest"
              >
                {INSTAGRAM_HANDLE}
              </a>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
