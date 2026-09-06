import type { Metadata } from "next";
import { PhotoSlot } from "@/components/photo-slot";
import { SOURCING_PARAGRAPHS, STORY_PARAGRAPHS } from "@/lib/content";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL, PHONE_DISPLAY, PHONE_TEL } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Twenty-five years in flowers — Brooklyn street stands to a corner shop in Newtown, PA. The story behind V Flowers.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-[1120px] px-6 pt-16 pb-8 sm:pt-24">
      <header className="max-w-2xl">
        <p className="eyebrow">About</p>
        <h1 className="mt-5 font-display text-[2.5rem] leading-[1.08] tracking-tight sm:text-5xl">
          Twenty-five years of new mornings.
        </h1>
      </header>

      <div className="mt-14 grid gap-12 lg:grid-cols-[1.05fr_1fr] lg:items-start">
        <div className="max-w-2xl">
          {STORY_PARAGRAPHS.map((para) => (
            <p key={para} className="mb-5 text-[1.0625rem] leading-relaxed text-ink-soft">
              {para}
            </p>
          ))}

          <figure className="my-10 border-l-2 border-moss/40 pl-6">
            <blockquote className="font-display text-2xl leading-snug text-ink">
              Every day is a new day, and a new inventory.
            </blockquote>
            <figcaption className="mt-3 text-sm text-muted">Vince</figcaption>
          </figure>

          <h2 className="mt-12 font-display text-3xl leading-tight">
            How an order actually goes
          </h2>
          <p className="mt-4 text-[1.0625rem] leading-relaxed text-ink-soft">
            Someone comes in and says it&rsquo;s their wife&rsquo;s anniversary. Vince takes
            them to the back, shows them what&rsquo;s in the cooler, and starts making
            suggestions — this with that, more of these, skip those. By the time
            they&rsquo;ve talked it through, the arrangement exists and the price is
            settled. No set options, no catalog to pick from. That&rsquo;s the part
            people come back for.
          </p>

          <h2 className="mt-12 font-display text-3xl leading-tight">
            The flowers themselves
          </h2>
          {SOURCING_PARAGRAPHS.map((para) => (
            <p key={para} className="mt-4 text-[1.0625rem] leading-relaxed text-ink-soft">
              {para}
            </p>
          ))}
        </div>

        <div className="grid gap-4">
          <PhotoSlot label="Vince at work in the shop" className="aspect-[4/5] w-full rounded-sm" />
          <div className="grid grid-cols-2 gap-4">
            <PhotoSlot label="The cooler" className="aspect-square w-full rounded-sm" />
            <PhotoSlot label="Stems on the bench" className="aspect-square w-full rounded-sm" />
          </div>
          <div className="rounded-sm bg-sage p-6">
            <p className="eyebrow">Stop in</p>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              The shop is on the corner of Washington and Sycamore, across from the
              Lukoil. Call{" "}
              <a href={`tel:${PHONE_TEL}`} className="text-forest underline underline-offset-2">
                {PHONE_DISPLAY}
              </a>{" "}
              or follow{" "}
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noreferrer"
                className="text-forest underline underline-offset-2"
              >
                {INSTAGRAM_HANDLE}
              </a>{" "}
              to see what came in.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
