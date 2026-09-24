import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { PhotoSlot } from "@/components/photo-slot";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Send the shop a note",
  alternates: { canonical: "/contact" },
  openGraph: { url: "/contact" },
  description: `Write to ${SITE_NAME} in Newtown, PA about a wedding, a corporate account, or anything easier to put in writing than to explain on the phone.`,
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-[1180px] px-6 pt-14 pb-20 sm:pt-20">
      <header>
        <p className="text-[0.7rem] uppercase tracking-[0.16em] text-muted">
          Write to the shop
        </p>
        <h1 className="mt-5 font-display text-[2.75rem] leading-[0.96] tracking-[-0.03em] sm:text-[4rem]">
          Some things are
          <br />
          easier written down.
        </h1>
      </header>

      <div className="mt-16 grid gap-12 lg:grid-cols-12 lg:items-start">
        <div className="border-t-[3px] border-ink bg-paper-warm p-8 sm:p-10 lg:col-span-7">
          <ContactForm />
        </div>

        <aside className="lg:col-span-4 lg:col-start-9">
          <PhotoSlot
            slug="cooler-doors"
            label="The cooler"
            className="aspect-[3/4] w-full"
            sizes="(min-width: 1024px) 30vw, 100vw"
          />
          <p className="mt-5 text-[0.9rem] leading-relaxed text-muted">
            Anything with a date on it, a wedding or a funeral, is worth sending
            early. Some stems have to be brought in.
          </p>
        </aside>
      </div>
    </div>
  );
}
