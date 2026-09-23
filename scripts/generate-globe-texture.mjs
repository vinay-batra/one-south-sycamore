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

const rings = [];
for (const feature of land.features ?? [land]) {
  const { type, coordinates } = feature.geometry;
  const polys = type === "Polygon" ? [coordinates] : coordinates;
  for (const poly of polys) rings.push(...poly);
}

const paths = rings
  .map((ring) => {
    let d = "";
    for (let i = 0; i < ring.length; i++) {
      const [x, y] = px(ring[i][0], ring[i][1]);
      d += (i === 0 ? "M" : "L") + x.toFixed(1) + " " + y.toFixed(1);
    }
    return d + "Z";
  })
  .join("");

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <rect width="${W}" height="${H}" fill="${OCEAN}"/>
  <path d="${paths}" fill="${LAND}" stroke="${COAST}" stroke-width="1.4"
        stroke-linejoin="round" fill-rule="evenodd"/>
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
