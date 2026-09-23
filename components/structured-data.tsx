import {
  ADDRESS_STREET,
  INSTAGRAM_URL,
  PAYMENT_METHODS,
  PHONE_DISPLAY,
  SITE_NAME,
  SITE_URL,
} from "@/lib/site";
import { DESTINATION } from "@/lib/globe/origins";

/**
 * Local search is the thing most likely to actually bring someone through
 * the door — Vince has no Google Business Profile yet, so this is what a
 * search engine has to go on.
 *
 * Deliberately omits openingHours: the hours on the site are placeholders
 * Vince approved for display, and publishing them as machine-readable fact
 * would send people to a closed door. Add them once they are confirmed.
 */
export function StructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Florist",
    name: SITE_NAME,
    url: SITE_URL,
    telephone: PHONE_DISPLAY,
    image: `${SITE_URL}/opengraph-image`,
    address: {
      "@type": "PostalAddress",
      streetAddress: ADDRESS_STREET,
      addressLocality: "Newtown",
      addressRegion: "PA",
      postalCode: "18940",
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: DESTINATION.lat,
      longitude: DESTINATION.lng,
    },
    sameAs: [INSTAGRAM_URL],
    paymentAccepted: PAYMENT_METHODS.join(", "),
    currenciesAccepted: "USD",
    areaServed: {
      "@type": "GeoCircle",
      geoMidpoint: {
        "@type": "GeoCoordinates",
        latitude: DESTINATION.lat,
        longitude: DESTINATION.lng,
      },
      description: "Newtown, PA and surrounding towns",
    },
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
