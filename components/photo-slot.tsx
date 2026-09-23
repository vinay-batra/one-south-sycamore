import Image from "next/image";
import { PHOTOS, type PhotoSlug } from "@/lib/photos";

/**
 * One component for both states of a picture on this site.
 *
 * Given a `slug` it renders Vince's photograph, sized by next/image and
 * faded up from a 16px inline preview. Without one it draws the labelled
 * placeholder, so a slot that has no photograph yet still holds its exact
 * place in the layout.
 */
type Props = {
  /** A photo from lib/photos.ts. Omit for a not-yet-shot placeholder. */
  slug?: PhotoSlug;
  /** Placeholder caption, and the fallback alt text. */
  label: string;
  /**
   * Overrides the manifest's alt text. Pass "" when the surrounding control
   * already carries the description, so it is not announced twice.
   */
  alt?: string;
  className?: string;
  /** Layout hint for next/image; defaults to a sensible responsive guess. */
  sizes?: string;
  priority?: boolean;
};

const BY_SLUG = new Map(PHOTOS.map((p) => [p.slug, p]));

export function PhotoSlot({
  slug,
  label,
  alt,
  className = "",
  sizes = "(min-width: 1024px) 50vw, 100vw",
  priority,
}: Props) {
  const photo = slug ? BY_SLUG.get(slug) : undefined;

  if (photo) {
    return (
      <div className={`group relative overflow-hidden bg-sage ${className}`}>
        <Image
          src={`/photos/${photo.slug}.webp`}
          alt={alt ?? photo.alt}
          fill
          sizes={sizes}
          priority={priority}
          placeholder="blur"
          blurDataURL={photo.blurDataURL}
          className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.045] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
      </div>
    );
  }

  return (
    /* No role="img": there is no image here yet, and announcing one would
       be a lie. The visible label reads as ordinary text instead. */
    <div
      className={`relative flex items-center justify-center overflow-hidden bg-sage ${className}`}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, transparent 0 14px, rgba(46,70,54,0.055) 14px 15px)",
        }}
      />
      <span className="relative z-10 px-4 text-center text-[0.7rem] uppercase tracking-[0.16em] text-forest/70">
        {label}
      </span>
    </div>
  );
}
