/**
 * Where Vince's flowers are cut, and where they land. Vince named four
 * regions; the coordinates sit on each region's actual growing area, and
 * every distance below is computed great-circle, not estimated.
 */
export type Origin = {
  id: string;
  name: string;
  note: string;
  lat: number;
  lng: number;
};

export const DESTINATION = {
  id: "newtown",
  name: "1 South Sycamore",
  lat: 40.229,
  lng: -74.9366,
};

export const ORIGINS: Origin[] = [
  {
    id: "kenya",
    name: "Kenya",
    note: "Cut on the equator, at altitude, where the light is even all year.",
    lat: -0.72,
    lng: 36.43,
  },
  {
    id: "south-america",
    name: "South America",
    note: "The high-country farms that supply most of the roses in the country.",
    lat: -2.0,
    lng: -78.5,
  },
  {
    id: "new-zealand",
    name: "New Zealand",
    note: "Opposite season to ours — it's their summer when it's our winter.",
    lat: -41.0,
    lng: 174.0,
  },
  {
    id: "japan",
    name: "Japan",
    note: "Smaller lots, grown to a standard you can see in the stem.",
    lat: 35.68,
    lng: 139.69,
  },
];

/** Great-circle distance in statute miles. */
export function milesFrom(lat: number, lng: number) {
  const R = 3958.8;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(DESTINATION.lat - lat);
  const dLng = toRad(DESTINATION.lng - lng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat)) * Math.cos(toRad(DESTINATION.lat)) * Math.sin(dLng / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.sqrt(a)));
}

/** Lat/lng to a point on the unit sphere, matching the land-point cloud. */
export function toVector(lat: number, lng: number, radius = 1): [number, number, number] {
  const phi = (lat * Math.PI) / 180;
  const theta = (lng * Math.PI) / 180;
  return [
    radius * Math.cos(phi) * Math.cos(theta),
    radius * Math.sin(phi),
    radius * Math.cos(phi) * Math.sin(theta),
  ];
}
