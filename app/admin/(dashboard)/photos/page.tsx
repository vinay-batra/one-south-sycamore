import { GALLERY_CATEGORIES } from "@/lib/content";
import { supabaseConfigured } from "@/lib/supabase";

/**
 * Draft state: the uploader's layout, without the Supabase Storage wiring.
 * Vince's flow is "take a photo, pick a section, done" — no cropping, no
 * file management, no naming.
 */
export default function AdminPhotosPage() {
  return (
    <>
      <h1 className="font-display text-3xl leading-tight">Photos</h1>
      <p className="mt-3 max-w-2xl leading-relaxed text-ink-soft">
        Take a picture on your phone, pick where it goes, and it&rsquo;s on the site.
      </p>

      {!supabaseConfigured && (
        <div className="mt-8 rounded-sm border border-blush bg-blush/40 p-5 text-sm leading-relaxed text-ink-soft">
          Uploading turns on once the photo storage is connected.
        </div>
      )}

      <div className="mt-10 rounded-sm border border-dashed border-moss/40 bg-paper p-10 text-center">
        <p className="font-display text-2xl">Add photos</p>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-ink-soft">
          Choose one or more pictures. They&rsquo;ll show up in the gallery in the
          section you pick.
        </p>

        <div className="mx-auto mt-6 grid max-w-xs gap-3 text-left">
          <label htmlFor="category" className="eyebrow">
            Section
          </label>
          <select
            id="category"
            disabled
            defaultValue={GALLERY_CATEGORIES[0]}
            className="rounded-sm border hairline bg-paper-warm px-4 py-3 text-sm text-muted"
          >
            {GALLERY_CATEGORIES.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>

          <button
            type="button"
            disabled
            className="mt-2 rounded-full bg-forest px-6 py-3 text-sm text-paper opacity-50"
          >
            Choose photos
          </button>
        </div>
      </div>

      <h2 className="mt-14 font-display text-2xl">On the site now</h2>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft">
        Nothing uploaded yet — the site is showing placeholders until the first
        real photos go up.
      </p>
    </>
  );
}
