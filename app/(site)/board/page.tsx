import type { Metadata } from "next";
import Link from "next/link";
import { FieldFade } from "@/components/field-fade";
import { PhotoSlot } from "@/components/photo-slot";
import { DEFAULT_BOARD } from "@/lib/content";
import { PHONE_DISPLAY, PHONE_TEL } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/board" },
  openGraph: { url: "/board" },
  title: "The Board",
  description:
    "The numbered board at One South Sycamore in Newtown, PA. Order by number or just describe the person. Prices depend on the day.",
};

export default function BoardPage() {
  return (
    <>
      <FieldFade to="dark" />
      <div className="bg-board text-chalk">
      <div className="mx-auto max-w-[1180px] px-6 pt-16 pb-24 sm:pt-20">
        <header className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="text-[0.7rem] uppercase tracking-[0.2em] text-chalk/60">
              The board
            </p>
            <h1 className="mt-5 font-display text-[3rem] leading-[0.95] tracking-[-0.02em] sm:text-[4.5rem]">
              Order by number.
            </h1>
          </div>
          <p className="text-[1.0625rem] leading-relaxed text-chalk/65 lg:col-span-4 lg:col-start-9 lg:pt-4">
            A starting point, not a menu. What goes into each one depends on what
            came in that morning, which is the whole point. Call with a number,
            or call with an occasion and Vince takes it from there.
          </p>
        </header>

        <ol className="mt-16">
          {DEFAULT_BOARD.map((item) => (
            <li
              key={item.number}
              className="group grid grid-cols-[3.5rem_1fr] items-baseline gap-x-5 border-t border-chalk/15 py-8 transition-colors hover:bg-chalk/[0.03] sm:grid-cols-[7rem_minmax(0,20rem)_1fr] sm:gap-x-8"
            >
              <span className="numeral text-[3rem] text-chalk/45 transition-colors group-hover:text-chalk/60 sm:text-[4.5rem]">
                {item.number}
              </span>
              <h2 className="font-display text-[1.75rem] leading-tight sm:text-[2.25rem]">
                {item.name}
              </h2>
              <p className="col-start-2 mt-2 max-w-xl leading-relaxed text-chalk/60 sm:col-start-3 sm:mt-0">
                {item.description}
              </p>
            </li>
          ))}
        </ol>

        <div className="mt-16 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          <PhotoSlot
            slug="roses-green-trick"
            label="Roses and green trick in the cooler"
            className="aspect-[3/4] w-full"
            sizes="(min-width: 1024px) 25vw, 50vw"
          />
          <PhotoSlot
            slug="cooler-doors"
            label="The cooler"
            className="mt-8 aspect-[3/4] w-full"
            sizes="(min-width: 1024px) 25vw, 50vw"
          />
          <PhotoSlot
            slug="roses-hellebore"
            label="Coral roses and hellebore"
            className="aspect-[3/4] w-full"
            sizes="(min-width: 1024px) 25vw, 50vw"
          />
          <PhotoSlot
            slug="cooler-wide"
            label="The cooler, roses and banksia"
            className="mt-8 aspect-[3/4] w-full"
            sizes="(min-width: 1024px) 25vw, 50vw"
          />
        </div>

        <div className="mt-20 grid gap-10 border-t border-chalk/15 pt-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 className="font-display text-[1.75rem] leading-tight">
              Why there are no prices here
            </h2>
            <p className="mt-4 leading-relaxed text-chalk/60">
              Because the flowers change. What a bunch costs depends on the day,
              the stems, and how big you want it, so Vince prices it once he
              knows what he&rsquo;s building. Tell him a number you want to stay
              under and he&rsquo;ll work to it.
            </p>
          </div>

          <div className="lg:col-span-5 lg:col-start-8">
            <h2 className="font-display text-[1.75rem] leading-tight">
              Ordering
            </h2>
            <p className="mt-4 leading-relaxed text-chalk/60">
              Call or text the shop. For weddings, funerals, or anything with a
              deadline, the earlier the better. Some stems have to be brought in.
            </p>
            <a
              href={`tel:${PHONE_TEL}`}
              className="mt-6 inline-block font-display text-[2rem] leading-none tracking-tight transition-colors hover:text-moss"
            >
              {PHONE_DISPLAY}
            </a>
            <div className="mt-4">
              <Link
                href="/visit"
                className="border-b border-chalk/30 pb-1 text-[0.7rem] uppercase tracking-[0.16em] text-chalk/70 transition-colors hover:border-chalk hover:text-chalk"
              >
                Hours, delivery &amp; directions
              </Link>
            </div>
          </div>
        </div>
      </div>
      </div>
      <FieldFade to="paper" />
    </>
  );
}
