import {
  ADDRESS_STREET,
  INSTAGRAM_URL,
  PAYMENT_METHODS,
  PHONE_TEL,
  SITE_NAME,
  SITE_URL,
} from "@/lib/site";

/**
 * Local search is the thing most likely to actually bring someone through
 * the door. Vince has no Google Business Profile yet, so this is what a
 * search engine has to go on.
 *
 * Deliberately omits two things.
 *
 * openingHours: the hours on the site are placeholders Vince approved for
 * display, and publishing them as machine-readable fact would send people
 * to a closed door. Add them once they are confirmed.
 *
 * geo: the only coordinates in this repo were authored to place a dot on
 * the decorative globe, and are the town centroid rather than a surveyed
 * rooftop pin. The postal address is enough, and is certainly true. Add
 * geo once someone has actually checked it against the storefront.
 */
export function StructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Florist",
    name: SITE_NAME,
    url: SITE_URL,
    // E.164, so it matches the business listing reliably.
    telephone: PHONE_TEL,
    // A photograph of the place, not the generated text poster.
    image: [
      `${SITE_URL}/photos/storefront-front.webp`,
      `${SITE_URL}/photos/storefront-wide.webp`,
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: ADDRESS_STREET,
      addressLocality: "Newtown",
      addressRegion: "PA",
      postalCode: "18940",
      addressCountry: "US",
    },
    sameAs: [INSTAGRAM_URL],
    paymentAccepted: PAYMENT_METHODS.join(", "),
    currenciesAccepted: "USD",
    areaServed: "Newtown, PA and the surrounding towns",
    description:
      "Hand-arranged flowers on the corner of Washington and Sycamore in Newtown, PA. Custom arrangements, weddings, sympathy work, plants and succulents, from flowers cut worldwide.",
  };

  return (
    <script
      type="application/ld+json"
      // Serialized object, not user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
