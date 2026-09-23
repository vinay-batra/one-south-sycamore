"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { PhotoSlot } from "@/components/photo-slot";
import { Reveal } from "@/components/reveal";
import { PHOTOS, type PhotoSlug } from "@/lib/photos";

export type Plate = { slug: PhotoSlug; category: string };

const BY_SLUG = new Map(PHOTOS.map((p) => [p.slug, p]));

/**
 * The contact sheet, with a lightbox.
 *
 * Each plate is a real button rather than a clickable div, so the sheet is
 * walkable by keyboard on its own. The overlay traps focus while it is
 * open, restores it to the plate you came from on close, and answers to
 * Escape and the arrow keys.
 */
export function GalleryGrid({ plates }: { plates: readonly Plate[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const triggers = useRef<(HTMLButtonElement | null)[]>([]);
  const dialog = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    setOpenIndex((current) => {
      // Send focus back to the plate that opened the overlay.
      if (current !== null) triggers.current[current]?.focus();
      return null;
    });
  }, []);

  const step = useCallback(
    (delta: number) =>
      setOpenIndex((current) =>
        current === null ? current : (current + delta + plates.length) % plates.length,
      ),
    [plates.length],
  );

  useEffect(() => {
    if (openIndex === null) return;

    closeButton.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        step(1);
        return;
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        step(-1);
        return;
      }
      if (event.key !== "Tab") return;

      // Keep Tab inside the overlay while it is open.
      const focusable = dialog.current?.querySelectorAll<HTMLElement>("button");
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [openIndex, close, step]);

  const open = openIndex === null ? null : plates[openIndex];
  const photo = open ? BY_SLUG.get(open.slug) : undefined;

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
        {plates.map((plate, index) => (
          <Reveal key={plate.slug} delay={(index % 3) * 60}>
            <figure>
              <button
                type="button"
                ref={(node) => {
                  triggers.current[index] = node;
                }}
                onClick={() => setOpenIndex(index)}
                className="block w-full cursor-zoom-in"
              >
                <PhotoSlot
                  slug={plate.slug}
                  label={plate.category}
                  className="aspect-[3/4] w-full"
                  sizes="(min-width: 1024px) 33vw, 50vw"
                  priority={index < 2}
                />
                <span className="sr-only">
                  Open {BY_SLUG.get(plate.slug)?.alt ?? plate.category} larger
                </span>
              </button>
              <figcaption className="mt-2.5 flex items-baseline justify-between gap-4 border-t hairline pt-2">
                <span className="text-[0.7rem] uppercase tracking-[0.16em] text-ink-soft">
                  {plate.category}
                </span>
                <span className="numeral text-xs text-muted">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>

      {open && photo && (
        <div
          ref={dialog}
          role="dialog"
          aria-modal="true"
          aria-label={photo.alt}
          className="fixed inset-0 z-[60] flex flex-col bg-board/97 p-4 backdrop-blur-sm sm:p-8"
        >
          <div className="flex items-center justify-between gap-6">
            <p className="text-[0.7rem] uppercase tracking-[0.16em] text-chalk/60">
              {open.category}
              <span className="ml-3 text-chalk/45">
                {openIndex! + 1} of {plates.length}
              </span>
            </p>
            <button
              ref={closeButton}
              type="button"
              onClick={close}
              className="text-[0.7rem] uppercase tracking-[0.16em] text-chalk/70 transition-colors hover:text-chalk"
            >
              Close
            </button>
          </div>

          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="relative my-4 min-h-0 flex-1 cursor-zoom-out"
          >
            <Image
              src={`/photos/${photo.slug}.webp`}
              alt={photo.alt}
              fill
              sizes="100vw"
              placeholder="blur"
              blurDataURL={photo.blurDataURL}
              className="object-contain"
            />
          </button>

          <div className="flex items-center justify-between gap-6">
            <button
              type="button"
              onClick={() => step(-1)}
              className="text-[0.7rem] uppercase tracking-[0.16em] text-chalk/70 transition-colors hover:text-chalk"
            >
              Previous
            </button>
            <p className="hidden text-[0.7rem] uppercase tracking-[0.16em] text-chalk/45 sm:block">
              Arrow keys to move, Escape to close
            </p>
            <button
              type="button"
              onClick={() => step(1)}
              className="text-[0.7rem] uppercase tracking-[0.16em] text-chalk/70 transition-colors hover:text-chalk"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </>
  );
}
