import { BLOOM_SOURCES } from "@/lib/bloom-sources";
import { photo, type PhotoSlug } from "@/lib/photos";

/**
 * The photographs the hero figure is built from, in order.
 *
 * Sizes, paths and blur data are generated into lib/bloom-sources.ts by
 * scripts/generate-bloom-frames.mjs; the captions are written by hand
 * because they are copy. photo() throws on an unknown slug, so a rename in
 * the photo pipeline surfaces here rather than as a blank canvas.
 */
const CAPTIONS: Record<string, string> = {
  "roses-green-trick": "Roses and green trick",
  "roses-hellebore": "Coral roses and hellebore",
  "cooler-doors": "Anemones and hydrangea",
};

export const BLOOM_FRAMES = BLOOM_SOURCES.map((source) => {
  const caption = CAPTIONS[source.slug];
  if (!caption) throw new Error(`No caption written for bloom frame: ${source.slug}`);
  return {
    ...source,
    caption,
    alt: photo(source.slug as PhotoSlug).alt,
  };
});
