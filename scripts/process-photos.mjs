/**
 * Turns the originals in photo-originals/ into web masters and regenerates
 * lib/photos.ts. Kept so the pipeline is reproducible when Vince sends more.
 *
 *   node scripts/process-photos.mjs
 */
import { writeFileSync, mkdirSync, statSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

/** [original basename, slug, alt text] */
const MAP = [
  ["IMG_9275", "storefront-wide", "One South Sycamore seen from across the street, the shop front under a blue sky in Newtown, Pennsylvania"],
  ["IMG_9280", "storefront-front", "The front of One South Sycamore on Sycamore Street in Newtown, burlap shade over tables of plants"],
  ["IMG_9286", "studio-interior", "Inside the shop, painted canvases along the counter"],
  ["IMG_9287", "art-panels", "Tall painted panels hanging in the shop"],
  ["IMG_9288", "art-canvases", "Painted canvases leaning along the wood wall"],
  ["IMG_9291", "cooler-doors", "The cooler, anemones and hydrangea behind glass"],
  ["IMG_9292", "cooler-wide", "The cooler, roses and banksia on the shelves"],
  ["IMG_9294", "roses-green-trick", "Peach and magenta roses beside green trick dianthus"],
  ["IMG_9296", "roses-hellebore", "Coral roses, hellebore and bells of Ireland in the cooler"],
  ["IMG_9301", "succulent-patio", "The succulent tables out back, under shade cloth"],
];

mkdirSync("public/photos", { recursive: true });
const manifest = [];

for (const [src, slug, alt] of MAP) {
  const from = join("photo-originals", src + ".jpeg");
  const out = join("public/photos", slug + ".webp");

  const info = await sharp(from)
    .rotate()
    .resize(2400, 2400, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(out);

  const blur = await sharp(from).rotate().resize(16).webp({ quality: 40 }).toBuffer();

  manifest.push({
    slug,
    alt,
    width: info.width,
    height: info.height,
    blurDataURL: "data:image/webp;base64," + blur.toString("base64"),
  });

  console.log(slug, `${info.width}x${info.height}`, (statSync(out).size / 1024).toFixed(0) + " KB");
}

writeFileSync(
  "lib/photos.ts",
  `/**
 * Vince's photographs. Originals live in photo-originals/ (gitignored);
 * these are 2400px webp masters that next/image resizes per breakpoint.
 * Regenerate with scripts/process-photos.mjs.
 */
export type Photo = {
  slug: string;
  alt: string;
  width: number;
  height: number;
  blurDataURL: string;
};

export const PHOTOS = ${JSON.stringify(manifest, null, 2)} as const satisfies readonly Photo[];

export type PhotoSlug = (typeof PHOTOS)[number]["slug"];

const BY_SLUG = new Map(PHOTOS.map((p) => [p.slug, p]));

export function photo(slug: PhotoSlug): Photo {
  const found = BY_SLUG.get(slug);
  if (!found) throw new Error(\`Unknown photo: \${slug}\`);
  return found;
}

export function photoSrc(slug: PhotoSlug) {
  return \`/photos/\${slug}.webp\`;
}
`,
);
console.log("\nwrote lib/photos.ts,", manifest.length, "photos");
