/**
 * Rasterises Natural Earth land polygons into an equirectangular texture
 * for the globe. A texture gives true coastlines. A point cloud can only
 * approximate them, and at any readable density it reads as noise.
 *
 *   node scripts/generate-globe-texture.mjs
 */
import { writeFileSync, mkdirSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import * as topojson from "topojson-client";
import { geoArea, geoEquirectangular, geoPath } from "d3-geo";
import sharp from "sharp";

const require = createRequire(import.meta.url);

const W = 4096;
const H = 2048;
const OCEAN = "#15241b";
const LAND = "#8fae95";
const COAST = "#c2d4c4";

// 50m resolution: 110m loses too much of the coastline to read as a map.
const topo = JSON.parse(
  readFileSync(require.resolve("world-atlas/land-50m.json"), "utf8"),
);
const land = topojson.feature(topo, topo.objects.land);

/**
 * Drop the specks.
 *
 * The dataset carries 1,419 separate landmasses, and roughly 1,100 of them
 * are Pacific atolls of a few square kilometres. At the size this globe is
 * drawn they cannot render as islands, only as scattered dots, which read
 * as dirt on the lens. Cutting below 1,000 km2 removes them while keeping
 * 99.8% of the world's land area and every island anyone would look for,
 * Hawaii's main chain included.
 */
const MIN_ISLAND_KM2 = 1000;
const EARTH_R2 = 6371 * 6371;

const keptPolygons = [];
for (const feature of land.features ?? [land]) {
  const { type, coordinates } = feature.geometry;
  const polys = type === "Polygon" ? [coordinates] : coordinates;
  for (const poly of polys) {
    const km2 = geoArea({ type: "Polygon", coordinates: poly }) * EARTH_R2;
    if (km2 >= MIN_ISLAND_KM2) keptPolygons.push(poly);
  }
}

const trimmedLand = { type: "MultiPolygon", coordinates: keptPolygons };
console.log(
  `kept ${keptPolygons.length} landmasses of ${
    (land.features ?? [land]).reduce(
      (n, f) =>
        n + (f.geometry.type === "Polygon" ? 1 : f.geometry.coordinates.length),
      0,
    )
  } (>= ${MIN_ISLAND_KM2} km2)`,
);

/**
 * d3 builds the path, not a hand-rolled projection.
 *
 * Projecting lng/lat straight to x/y looks fine until a polygon crosses the
 * antimeridian: its coordinates jump from +179 to -179 and a naive path
 * draws a straight line across the entire map. At high latitude that line
 * wraps into a complete ring around the pole, which is exactly what
 * Russia's Chukotka coast and Wrangel Island were drawing around the North
 * Pole. d3 cuts polygons at the antimeridian and walks the polar boundary
 * properly, so the rings disappear and Antarctica closes over the pole.
 */
const projection = geoEquirectangular()
  .scale(W / (2 * Math.PI))
  .translate([W / 2, H / 2]);

const render = geoPath(projection);
const landPath = render(trimmedLand);

const paths =
  `<path d="${landPath}" fill="${LAND}" stroke="${COAST}" stroke-width="1.4" ` +
  `stroke-linejoin="round" fill-rule="evenodd"/>`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <rect width="${W}" height="${H}" fill="${OCEAN}"/>
  ${paths}
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
console.log(`wrote ${out}: ${W}x${H}, ${(size / 1024).toFixed(0)} KB`);
