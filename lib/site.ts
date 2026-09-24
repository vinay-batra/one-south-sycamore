/** Site-wide constants: the single source of truth for the shop's details. */

/**
 * The name on the building, on Instagram, and now on the domain. An early
 * draft of this site used "V Flowers", which appeared nowhere a customer
 * could actually see: the street blade over the door reads ONE SOUTH
 * SYCAMORE and the handle is @1southsycamore. Vince's Google listing still
 * reads "V flowers" and is the last place that disagrees.
 */
export const SITE_NAME = "One South Sycamore";


/** Primary slogan. Draft. Confirm with Vince at the in-person review. */
export const SITE_TAGLINE = "No set menu. Just what's beautiful today.";

/**
 * Used as the fallback meta description and on every share card. Kept
 * inside 160 characters so search results do not truncate it, and it leads
 * with the town because that is what people search for.
 */
export const SHARE_DESCRIPTION =
  "Hand-arranged flowers in Newtown, PA, on the corner of Washington and Sycamore. No set menu: tell Vince the occasion and he builds it in front of you.";

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
export const HOURS_NOTE =
  "Hours vary. Call or text if you are planning to come by, to check availability.";
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

const RAW_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://onesouthsycamore.com";

/**
 * Every canonical, og:url, sitemap entry and JSON-LD url is built from this.
 * A production build that picked up a localhost origin would tell search
 * engines the real address of every page is a host nobody can reach, so it
 * fails the build instead.
 */
if (process.env.NODE_ENV === "production" && !RAW_SITE_URL.startsWith("https://")) {
  throw new Error(
    `NEXT_PUBLIC_SITE_URL must be an https origin in production, got "${RAW_SITE_URL}".`,
  );
}

export const SITE_URL = RAW_SITE_URL;

/** The one account allowed into /admin. */
export const OWNER_EMAIL = process.env.OWNER_EMAIL ?? "";
