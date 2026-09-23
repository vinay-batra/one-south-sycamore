/** Site-wide constants: the single source of truth for the shop's details. */

/**
 * The name on the building and on Instagram. An earlier draft of this site
 * used "V Flowers", which appeared nowhere a customer could actually see:
 * the street blade over the door reads ONE SOUTH SYCAMORE and the handle
 * is @1southsycamore. The domain stays vjsflowers.com, which is fine and
 * better for search, since people look for flowers rather than an address.
 */
export const SITE_NAME = "One South Sycamore";

/** For places too tight for the full name, like a mobile masthead. */
export const SITE_NAME_SHORT = "One South Sycamore";

/** Primary slogan. Draft. Confirm with Vince at the in-person review. */
export const SITE_TAGLINE = "No set menu. Just what's beautiful today.";

export const PHONE_DISPLAY = "(609) 649-1992";
export const PHONE_TEL = "+16096491992";

export const ADDRESS_STREET = "1 South Sycamore Street";
export const ADDRESS_CITY = "Newtown, PA 18940";
export const ADDRESS_FULL = `${ADDRESS_STREET}, ${ADDRESS_CITY}`;

/** How people actually find him, in his own words at the intake. */
export const DIRECTIONS_NOTE =
  "Directly across from the Lukoil, on the corner of Washington and Sycamore in the center of town.";

export const MAP_URL =
  "https://www.google.com/maps/search/?api=1&query=" +
  encodeURIComponent(ADDRESS_FULL);

export const INSTAGRAM_URL = "https://www.instagram.com/1southsycamore/";
export const INSTAGRAM_HANDLE = "@1southsycamore";

/**
 * Hours change constantly with the inventory, so the site leads with
 * "call for availability" and treats these as typical, not promised.
 */
export const HOURS_NOTE = "Hours move with the flowers. Call or text before you come.";
export const HOURS: { days: string; time: string }[] = [
  { days: "Monday – Friday", time: "9:00 AM – 6:00 PM" },
  { days: "Saturday", time: "9:00 AM – 5:00 PM" },
  { days: "Sunday", time: "By appointment" },
];

export const DELIVERY = {
  area: "Newtown and the surrounding towns",
  orderMinimum: 100,
  deliveryFrom: 20,
};

export const PAYMENT_METHODS = ["Cash", "Card", "Apple Pay", "Venmo"];

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://vjsflowers.com";

/** The one account allowed into /admin. */
export const OWNER_EMAIL = process.env.OWNER_EMAIL ?? "";
