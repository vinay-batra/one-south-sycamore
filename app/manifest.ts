import type { MetadataRoute } from "next";
import { SITE_NAME } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME}, florist in Newtown, PA`,
    short_name: SITE_NAME,
    description:
      "Hand-arranged flowers on the corner of Washington and Sycamore in Newtown, Pennsylvania.",
    start_url: "/",
    display: "standalone",
    background_color: "#fcfbf9",
    theme_color: "#273b2e",
    icons: [{ src: "/icon", sizes: "32x32", type: "image/png" }],
  };
}
