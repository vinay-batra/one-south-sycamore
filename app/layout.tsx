import type { Metadata } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import { SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const display = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Florist in Newtown, PA`,
    template: `%s · ${SITE_NAME}`,
  },
  description:
    "V Flowers is a hand-arranged flower shop on South Sycamore Street in Newtown, PA. Fresh cut flowers sourced worldwide, custom arrangements, weddings, sympathy, plants and succulents.",
  openGraph: {
    title: `${SITE_NAME} — Florist in Newtown, PA`,
    description: SITE_TAGLINE,
    url: SITE_URL,
    siteName: SITE_NAME,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // The font variables go on <html> so the @theme tokens, which resolve
    // against :root, can see them.
    <html lang="en" className={`${inter.variable} ${display.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
