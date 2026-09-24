import Link from "next/link";

import type { Metadata } from "next";

export const metadata: Metadata = { title: "Overview" };

export default function AdminOverviewPage() {
  return (
    <>
      <h1 className="font-display text-3xl leading-tight">Hi Vince.</h1>
      <p className="mt-3 max-w-2xl leading-relaxed text-ink-soft">
        The photographs on the site live here. Change them whenever you want
        and the site updates right away.
      </p>

      <div className="mt-8 border border-blush bg-blush/40 p-5">
        <p className="text-sm font-medium">Not switched on yet</p>
        <p className="mt-1 text-sm leading-relaxed text-ink-soft">
          Uploading isn&rsquo;t hooked up, so nothing here saves yet. This is the
          draft version. Vinay finishes this part before launch.
        </p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <Card
          href="/admin/photos"
          title="Photos"
          body="Add pictures from your phone and pick which part of the site they show up in."
        />
        <Card
          href="/"
          title="View the site"
          body="See exactly what a customer sees."
        />
      </div>
    </>
  );
}

function Card({ href, title, body }: { href: string; title: string; body: string }) {
  return (
    <Link
      href={href}
      className="block border border-ink/15 bg-paper p-6 transition-colors hover:border-moss"
    >
      <h2 className="font-display text-xl">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft">{body}</p>
    </Link>
  );
}
