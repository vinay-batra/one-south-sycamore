import { HERO_SOURCES } from "@/lib/hero-sources";
import { photo, type PhotoSlug } from "@/lib/photos";

/**
 * The photographs the hero figure cycles through, in order.
 *
 * Sizes, paths and blur data are generated into lib/hero-sources.ts by
 * scripts/generate-hero-frames.mjs; the captions are written by hand
 * because they are copy. photo() throws on an unknown slug, so a rename in
 * the photo pipeline surfaces here rather than as a blank canvas.
 */
const CAPTIONS: Record<string, string> = {
  "roses-green-trick": "Roses and green trick",
  "roses-hellebore": "Coral roses and hellebore",
  "cooler-doors": "Anemones and hydrangea",
};

export const HERO_FRAMES = HERO_SOURCES.map((source) => {
  const caption = CAPTIONS[source.slug];
  if (!caption) throw new Error(`No caption written for hero frame: ${source.slug}`);
  return { ...source, caption, alt: photo(source.slug as PhotoSlug).alt };
});
