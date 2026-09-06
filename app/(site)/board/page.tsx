import type { Metadata } from "next";
import { DEFAULT_BOARD } from "@/lib/content";
import { PHONE_DISPLAY, PHONE_TEL } from "@/lib/site";

export const metadata: Metadata = {
  title: "The Board",
  description:
    "Order by number at V Flowers in Newtown, PA — or describe the person and let Vince build it from what came in that morning.",
};

export default function BoardPage() {
  return (
    <div className="mx-auto max-w-[1120px] px-6 pt-16 pb-8 sm:pt-24">
      <header className="max-w-2xl">
        <p className="eyebrow">The board</p>
        <h1 className="mt-5 font-display text-[2.5rem] leading-[1.08] tracking-tight sm:text-5xl">
          Order by number.
        </h1>
        <p className="mt-6 text-[1.0625rem] leading-relaxed text-ink-soft">
          The board is a starting point, not a menu. What actually goes into each
          one depends on what came in that morning — which is the whole point.
          Call with a number, or call with an occasion and Vince will take it
          from there.
        </p>
      </header>

      <ol className="mt-14 border-t hairline">
        {DEFAULT_BOARD.map((item) => (
          <li
            key={item.number}
            className="grid gap-2 border-b hairline py-7 sm:grid-cols-[5rem_1fr] sm:gap-8"
          >
            <span className="font-display text-3xl leading-none text-moss">
              #{item.number}
            </span>
            <div>
              <h2 className="font-display text-2xl leading-tight">{item.name}</h2>
              <p className="mt-2 max-w-2xl leading-relaxed text-ink-soft">
                {item.description}
              </p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-12 rounded-sm bg-sage p-8 sm:p-10">
        <h2 className="font-display text-2xl leading-tight">
          Pricing is a conversation.
        </h2>
        <p className="mt-3 max-w-2xl leading-relaxed text-ink-soft">
          Stems change price with the season and the shipment, so nothing here
          carries a fixed number. Tell Vince what you want to spend and what it&rsquo;s
          for, and he&rsquo;ll build to it.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={`tel:${PHONE_TEL}`}
            className="rounded-full bg-forest px-6 py-3 text-sm text-paper transition-opacity hover:opacity-90"
          >
            Call {PHONE_DISPLAY}
          </a>
          <a
            href={`sms:${PHONE_TEL}`}
            className="rounded-full border border-forest/25 bg-paper px-6 py-3 text-sm text-forest transition-colors hover:bg-paper-warm"
          >
            Text the shop
          </a>
        </div>
      </div>
    </div>
  );
}
