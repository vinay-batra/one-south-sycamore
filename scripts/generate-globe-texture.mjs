/**
 * Rasterises Natural Earth land polygons into an equirectangular texture
 * for the globe. A texture gives true coastlines — a point cloud can only
 * approximate them, and at any readable density it reads as noise.
 *
 *   node scripts/generate-globe-texture.mjs
 */
import { writeFileSync, mkdirSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import * as topojson from "topojson-client";
import sharp from "sharp";

const require = createRequire(import.meta.url);

const W = 4096;
const H = 2048;
const OCEAN = "#0d1712";
const LAND = "#8fae95";
const COAST = "#c2d4c4";

// 50m resolution: 110m loses too much of the coastline to read as a map.
const topo = JSON.parse(
  readFileSync(require.resolve("world-atlas/land-50m.json"), "utf8"),
);
const land = topojson.feature(topo, topo.objects.land);

/** Standard equirectangular: lng -180 at x=0, lat +90 at y=0. */
const px = (lng, lat) => [
  ((lng + 180) / 360) * W,
  ((90 - lat) / 180) * H,
];

/**
 * One <path> per polygon, each carrying its own holes, filled with the
 * nonzero rule.
 *
 * Merging every ring into a single evenodd path looks equivalent and is
 * not: Antarctica's outline wraps the full width of the projection and
 * overlaps itself near the pole, so evenodd cancelled the overlap and
 * punched a hole straight through the South Pole. Nonzero respects ring
 * winding — GeoJSON winds holes opposite to their outer ring — so lakes
 * still read as holes and Antarctica stays solid.
 */
const polygons = [];
for (const feature of land.features ?? [land]) {
  const { type, coordinates } = feature.geometry;
  const polys = type === "Polygon" ? [coordinates] : coordinates;
  polygons.push(...polys);
}

const ringPath = (ring) => {
  let d = "";
  for (let i = 0; i < ring.length; i++) {
    const [x, y] = px(ring[i][0], ring[i][1]);
    d += (i === 0 ? "M" : "L") + x.toFixed(1) + " " + y.toFixed(1);
  }
  return d + "Z";
};

const paths = polygons
  .map(
    (poly) =>
      `<path d="${poly.map(ringPath).join("")}" fill="${LAND}" stroke="${COAST}" ` +
      `stroke-width="1.4" stroke-linejoin="round" fill-rule="nonzero"/>`,
  )
  .join("");

/**
 * Antarctica's outline in this dataset runs to the pole and back along the
 * projection's bottom edge, which leaves the innermost cap unfilled however
 * it is wound. Painting the cap solid is simply correct: there is no open
 * ocean anywhere south of -84°, it is continuous ice sheet to the pole.
 */
const CAP_LAT = -84;
const capTop = ((90 - CAP_LAT) / 180) * H;
const polarCap = `<rect x="0" y="${capTop.toFixed(1)}" width="${W}" height="${(H - capTop).toFixed(1)}" fill="${LAND}"/>`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <rect width="${W}" height="${H}" fill="${OCEAN}"/>
  ${paths}
  ${polarCap}
</svg>`;

mkdirSync("public/globe", { recursive: true });
const out = "public/globe/land.png";
await sharp(Buffer.from(svg), { limitInputPixels: false })
  .png({ compressionLevel: 9, palette: true })
  .toFile(out);

const { size } = await sharp(out).metadata().then(async (m) => ({
  size: (await import("node:fs")).statSync(out).size,
  m,
}));
console.log(`wrote ${out} — ${W}x${H}, ${(size / 1024).toFixed(0)} KB`);
